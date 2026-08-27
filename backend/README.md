# dodobanhang backend

NestJS RESTful API for the dodobanhang e-commerce project. Target datastore is PostgreSQL via TypeORM; Postgres wiring is currently paused (see below) so the API can run standalone with in-memory sample data.

## Setup

```bash
yarn install
cp .env.example .env
yarn start:dev
```

API is served under the `/api` prefix, e.g. `GET /api/health`, `GET /api/addresses`.

Swagger docs: http://localhost:3000/docs

## Scripts

- `yarn start:dev` - run with hot reload
- `yarn build` - compile to `dist/`
- `yarn lint` - lint and autofix
- `yarn test` - unit tests
- `yarn test:e2e` - end-to-end tests

## Postgres (currently paused)

The `address` module currently serves hardcoded in-memory sample data instead of querying a database, so it runs without Postgres. To wire up real persistence:

1. `docker compose up -d` (starts local Postgres) or point `.env` at an existing instance.
2. Re-add `TypeOrmModule.forRootAsync` (config already in `src/config/database.config.ts`) to `src/app.module.ts`.
3. Re-add `TypeOrmModule.forFeature([Address])` to `src/module/address/address.module.ts` and switch `AddressService` back to `@InjectRepository(Address)`.
