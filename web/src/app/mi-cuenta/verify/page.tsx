"use client";

import { Suspense, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { insforge } from "@/lib/insforge";

function VerifyInner() {
  const router = useRouter();
  const sp = useSearchParams();
  const email = sp.get("email") ?? "";
  const [otp, setOtp] = useState("");
  const [err, setErr] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErr(null);
    setLoading(true);
    try {
      const { data, error } = await insforge.auth.verifyEmail({ email, otp });
      if (error) throw new Error(error.message || "Código inválido");
      if (data?.accessToken) router.push("/mi-cuenta/vault");
    } catch (e: unknown) {
      setErr(e instanceof Error ? e.message : "Error");
    } finally {
      setLoading(false);
    }
  };

  const resend = async () => {
    setErr(null);
    await insforge.auth.resendVerificationEmail({ email });
  };

  return (
    <div className="mx-auto flex min-h-[70vh] max-w-md flex-col justify-center px-4 py-10">
      <div className="card p-8">
        <h1 className="font-headline text-2xl font-bold">Verifica tu email</h1>
        <p className="mt-2 text-sm text-muted-fg">
          Enviamos un código de 6 dígitos a <strong>{email || "tu email"}</strong>.
        </p>
        <form onSubmit={onSubmit} className="mt-6 space-y-3">
          <input
            type="text"
            inputMode="numeric"
            pattern="[0-9]{6}"
            maxLength={6}
            value={otp}
            onChange={(e) => setOtp(e.target.value.replace(/\D/g, ""))}
            placeholder="123456"
            className="w-full rounded-xl border border-outline-variant/40 bg-surface px-4 py-3 text-center font-headline text-2xl tracking-[0.5em] focus:border-primary focus:outline-none"
          />
          {err && (
            <p className="rounded-xl border border-danger/40 bg-danger-container/30 px-3 py-2 text-sm text-danger">
              {err}
            </p>
          )}
          <button disabled={loading || otp.length !== 6} type="submit" className="btn-primary w-full">
            Verificar
          </button>
        </form>
        <button onClick={resend} className="mt-3 text-center text-xs text-muted-fg underline w-full">
          Reenviar código
        </button>
      </div>
    </div>
  );
}

export default function Page() {
  return (
    <Suspense fallback={null}>
      <VerifyInner />
    </Suspense>
  );
}
