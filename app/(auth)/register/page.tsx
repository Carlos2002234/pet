"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";

export default function RegisterPage() {
  const router = useRouter();
  const supabase = createClient();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [pending, setPending] = useState(false);
  const [confirmationSent, setConfirmationSent] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setPending(true);

    const { data, error } = await supabase.auth.signUp({
      email,
      password,
    });

    setPending(false);

    if (error) {
      setError(error.message);
      return;
    }

    if (!data.session) {
      setConfirmationSent(true);
      return;
    }

    router.push("/");
    router.refresh();
  }

  if (confirmationSent) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-neutral-950 px-4">
        <div className="w-full max-w-sm space-y-3 text-center">
          <h1 className="text-2xl font-semibold text-neutral-50">
            Revisa tu correo
          </h1>
          <p className="text-sm text-neutral-400">
            Te enviamos un enlace de confirmación a {email}. Confírmalo para
            activar tu cuenta.
          </p>
        </div>
      </main>
    );
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-neutral-950 px-4">
      <div className="w-full max-w-sm space-y-6">
        <div className="text-center">
          <h1 className="text-2xl font-semibold text-neutral-50">
            Crear cuenta
          </h1>
          <p className="mt-1 text-sm text-neutral-400">
            Empieza a evolucionar tus mascotas
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1">
            <label htmlFor="email" className="text-sm text-neutral-300">
              Email
            </label>
            <input
              id="email"
              name="email"
              type="email"
              required
              autoComplete="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full rounded-md border border-neutral-800 bg-neutral-900 px-3 py-2 text-neutral-50 outline-none focus:border-neutral-500"
            />
          </div>

          <div className="space-y-1">
            <label htmlFor="password" className="text-sm text-neutral-300">
              Contraseña
            </label>
            <input
              id="password"
              name="password"
              type="password"
              required
              minLength={8}
              autoComplete="new-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full rounded-md border border-neutral-800 bg-neutral-900 px-3 py-2 text-neutral-50 outline-none focus:border-neutral-500"
            />
          </div>

          {error && <p className="text-sm text-red-400">{error}</p>}

          <button
            type="submit"
            disabled={pending}
            className="w-full rounded-md bg-neutral-50 px-3 py-2 font-medium text-neutral-900 transition disabled:opacity-50"
          >
            {pending ? "Creando cuenta..." : "Crear cuenta"}
          </button>
        </form>

        <div className="flex items-center gap-3 text-xs text-neutral-500">
          <div className="h-px flex-1 bg-neutral-800" />
          o
          <div className="h-px flex-1 bg-neutral-800" />
        </div>

        <button
          type="button"
          disabled
          title="Google OAuth se conecta en una sesión futura (requiere credenciales de Google Cloud Console)"
          className="w-full cursor-not-allowed rounded-md border border-neutral-800 px-3 py-2 font-medium text-neutral-500"
        >
          Continuar con Google (próximamente)
        </button>

        <p className="text-center text-sm text-neutral-400">
          ¿Ya tienes cuenta?{" "}
          <Link href="/login" className="text-neutral-50 underline">
            Inicia sesión
          </Link>
        </p>
      </div>
    </main>
  );
}
