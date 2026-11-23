"""Backend lưu trữ: JSONL, CSV, SQLite. Tất cả đều thread-safe và hỗ trợ ghi nối (append)."""
from __future__ import annotations

import csv
import json
import sqlite3
import threading
from abc import ABC, abstractmethod
from pathlib import Path
from typing import Iterable

from .models import Record


class Storage(ABC):
    def __init__(self, output_dir: Path):
        self.output_dir = Path(output_dir)
        self.output_dir.mkdir(parents=True, exist_ok=True)
        self._lock = threading.Lock()

    @abstractmethod
    def save(self, records: Iterable[Record]) -> int: ...

    def close(self) -> None:
        pass

    def __enter__(self):
        return self

    def __exit__(self, *exc):
        self.close()


class JsonlStorage(Storage):
    def save(self, records: Iterable[Record]) -> int:
        n = 0
        with self._lock:
            files: dict[str, object] = {}
            try:
                for r in records:
                    f = files.get(r.TABLE)
                    if f is None:
                        f = files[r.TABLE] = open(self.output_dir / f"{r.TABLE}.jsonl", "a", encoding="utf-8")
                    f.write(json.dumps(r.to_dict(), ensure_ascii=False) + "\n")  # type: ignore[attr-defined]
                    n += 1
            finally:
                for f in files.values():
                    f.close()  # type: ignore[attr-defined]
        return n


class CsvStorage(Storage):
    def save(self, records: Iterable[Record]) -> int:
        n = 0
        with self._lock:
            for r in records:
                path = self.output_dir / f"{r.TABLE}.csv"
                row = r.to_flat()
                new = not path.exists()
                with open(path, "a", newline="", encoding="utf-8-sig") as f:
                    w = csv.DictWriter(f, fieldnames=list(row.keys()))
                    if new:
                        w.writeheader()
                    w.writerow(row)
                n += 1
        return n


class SqliteStorage(Storage):
    """Upsert theo khoá chính `id` → chạy lại không bị trùng dữ liệu."""

    def __init__(self, output_dir: Path, filename: str = "tiki.db"):
        super().__init__(output_dir)
        self.conn = sqlite3.connect(self.output_dir / filename, check_same_thread=False)
        self.conn.execute("PRAGMA journal_mode=WAL")
        self._tables: set[str] = set()

    def _ensure_table(self, r: Record, cols: list[str]) -> None:
        if r.TABLE in self._tables:
            return
        col_defs = ", ".join(f'"{c}"' + (" PRIMARY KEY" if c == r.KEY else "") for c in cols)
        self.conn.execute(f'CREATE TABLE IF NOT EXISTS "{r.TABLE}" ({col_defs})')
        existing = {row[1] for row in self.conn.execute(f'PRAGMA table_info("{r.TABLE}")')}
        for c in cols:
            if c not in existing:
                self.conn.execute(f'ALTER TABLE "{r.TABLE}" ADD COLUMN "{c}"')
        self._tables.add(r.TABLE)

    def save(self, records: Iterable[Record]) -> int:
        n = 0
        with self._lock:
            for r in records:
                row = r.to_flat()
                cols = list(row.keys())
                self._ensure_table(r, cols)
                placeholders = ", ".join("?" for _ in cols)
                col_sql = ", ".join(f'"{c}"' for c in cols)
                self.conn.execute(
                    f'INSERT OR REPLACE INTO "{r.TABLE}" ({col_sql}) VALUES ({placeholders})',
                    [row[c] for c in cols],
                )
                n += 1
            self.conn.commit()
        return n

    def close(self) -> None:
        self.conn.close()


def make_storage(kind: str, output_dir: Path) -> Storage:
    kinds = {"jsonl": JsonlStorage, "csv": CsvStorage, "sqlite": SqliteStorage}
    if kind not in kinds:
        raise ValueError(f"storage không hợp lệ: {kind}. Chọn một trong {list(kinds)}")
    return kinds[kind](output_dir)
