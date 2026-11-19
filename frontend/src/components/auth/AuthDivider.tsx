// Gạch ngang "hoặc" giữa form email/mật khẩu và nút Google
export default function AuthDivider() {
  return (
    <div className="my-6 flex items-center gap-3 text-sm text-neutral-500" role="separator">
      <span className="h-px flex-1 bg-neutral-200" />
      hoặc
      <span className="h-px flex-1 bg-neutral-200" />
    </div>
  )
}
