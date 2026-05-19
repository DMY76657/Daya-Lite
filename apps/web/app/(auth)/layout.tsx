export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen items-center justify-center px-4">
      <div className="w-full max-w-sm rounded-2xl bg-white p-8 shadow-sm ring-1 ring-slate-200">
        <h1 className="mb-6 text-center text-2xl font-semibold text-emerald-700">Daya Lite</h1>
        {children}
      </div>
    </div>
  );
}
