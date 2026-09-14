import { loginAction } from "../actions";

export default async function AdminLoginPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  const { error } = await searchParams;

  return (
    <div className="mx-auto flex min-h-screen max-w-sm flex-col justify-center px-4">
      <h1 className="text-xl font-bold">Admin</h1>
      <form action={loginAction} className="mt-6 flex flex-col gap-4">
        <label className="block">
          <span className="mb-1 block text-sm font-medium">Lösenord</span>
          <input
            type="password"
            name="password"
            required
            className="input"
            autoFocus
          />
        </label>
        {error && (
          <p className="rounded-md bg-red-50 border border-red-200 px-3 py-2 text-sm text-red-700 dark:bg-red-950/40 dark:border-red-900 dark:text-red-400">
            Fel lösenord.
          </p>
        )}
        <button
          type="submit"
          className="rounded-md bg-accent px-4 py-2.5 font-semibold text-accent-foreground hover:brightness-110 transition"
        >
          Logga in
        </button>
      </form>
    </div>
  );
}
