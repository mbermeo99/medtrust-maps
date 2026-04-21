"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { insforge } from "@/lib/insforge";

export default function LoginPage() {
  const router = useRouter();
  const [mode, setMode] = useState<"login" | "signup">("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [err, setErr] = useState<string | null>(null);
  const [info, setInfo] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErr(null);
    setInfo(null);
    setLoading(true);
    try {
      if (mode === "signup") {
        const { data, error } = await insforge.auth.signUp({
          email,
          password,
          name: name || undefined,
        });
        if (error) throw new Error(error.message || "Error");
        if (data?.requireEmailVerification) {
          router.push(
            `/mi-cuenta/verify?email=${encodeURIComponent(email)}`
          );
          return;
        }
        router.push("/mi-cuenta/vault");
      } else {
        const { data, error } = await insforge.auth.signInWithPassword({
          email,
          password,
        });
        if (error) throw new Error(error.message || "Credenciales inválidas");
        if (!data?.user?.emailVerified) {
          router.push(
            `/mi-cuenta/verify?email=${encodeURIComponent(email)}`
          );
          return;
        }
        router.push("/mi-cuenta/vault");
      }
    } catch (e: unknown) {
      setErr(e instanceof Error ? e.message : "Error desconocido");
    } finally {
      setLoading(false);
    }
  };

  const onGoogle = async () => {
    setErr(null);
    await insforge.auth.signInWithOAuth({
      provider: "google",
      redirectTo:
        typeof window !== "undefined"
          ? `${window.location.origin}/mi-cuenta/vault`
          : undefined,
    });
  };

  return (
    <div className="mx-auto flex min-h-[70vh] max-w-md flex-col justify-center px-4 py-10 sm:px-6">
      <div className="card p-8">
        <h1 className="font-headline text-3xl font-bold">
          {mode === "login" ? "Bienvenido de vuelta" : "Crea tu cuenta"}
        </h1>
        <p className="mt-2 text-sm text-muted-fg">
          {mode === "login"
            ? "Accede al Vault y a tus cotizaciones."
            : "Tu canal seguro para compartir estudios médicos con clínicas verificadas."}
        </p>

        <form onSubmit={onSubmit} className="mt-6 space-y-3">
          {mode === "signup" && (
            <Field
              label="Nombre"
              value={name}
              onChange={setName}
              type="text"
              placeholder="Tu nombre"
            />
          )}
          <Field
            label="Email"
            value={email}
            onChange={setEmail}
            type="email"
            required
            placeholder="tu@email.com"
          />
          <Field
            label="Contraseña"
            value={password}
            onChange={setPassword}
            type="password"
            required
            placeholder="••••••••"
            minLength={6}
          />
          {err && (
            <p className="rounded-xl border border-danger/40 bg-danger-container/30 px-3 py-2 text-sm text-danger">
              {err}
            </p>
          )}
          {info && (
            <p className="rounded-xl border border-primary/40 bg-primary/10 px-3 py-2 text-sm text-primary">
              {info}
            </p>
          )}
          <button disabled={loading} type="submit" className="btn-primary w-full">
            {loading ? "..." : mode === "login" ? "Iniciar sesión" : "Crear cuenta"}
          </button>
        </form>

        <div className="my-6 flex items-center gap-3 text-xs uppercase text-muted-fg">
          <div className="h-px flex-1 bg-outline-variant/30" />
          o
          <div className="h-px flex-1 bg-outline-variant/30" />
        </div>

        <button onClick={onGoogle} className="btn-ghost w-full">
          Continuar con Google
        </button>

        <p className="mt-6 text-center text-sm text-muted-fg">
          {mode === "login" ? (
            <>
              ¿No tienes cuenta?{" "}
              <button
                onClick={() => setMode("signup")}
                className="font-semibold text-primary hover:underline"
              >
                Regístrate
              </button>
            </>
          ) : (
            <>
              ¿Ya tienes cuenta?{" "}
              <button
                onClick={() => setMode("login")}
                className="font-semibold text-primary hover:underline"
              >
                Inicia sesión
              </button>
            </>
          )}
        </p>

        <p className="mt-6 text-center text-[11px] text-muted-fg">
          Al continuar aceptas nuestros{" "}
          <Link href="/legal/terms" className="underline">
            Términos
          </Link>{" "}
          y{" "}
          <Link href="/legal/privacy" className="underline">
            Privacidad
          </Link>
          .
        </p>
      </div>
    </div>
  );
}

function Field({
  label,
  value,
  onChange,
  type,
  placeholder,
  required,
  minLength,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  type: string;
  placeholder?: string;
  required?: boolean;
  minLength?: number;
}) {
  return (
    <label className="block">
      <span className="text-[10px] font-semibold uppercase tracking-widest text-muted-fg">
        {label}
      </span>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        required={required}
        minLength={minLength}
        className="mt-1 w-full rounded-xl border border-outline-variant/40 bg-surface px-3 py-2.5 text-sm focus:border-primary focus:outline-none"
      />
    </label>
  );
}
