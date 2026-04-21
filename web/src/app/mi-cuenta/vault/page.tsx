"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { insforge, INSFORGE_FUNCTIONS_URL } from "@/lib/insforge";
import { useCurrentUser, getAccessToken } from "@/lib/auth-hooks";
import type { VaultFile, Clinic } from "@/lib/types";

async function invokeFn<T = any>(slug: string, body: any): Promise<T> {
  const token = await getAccessToken();
  const res = await fetch(`${INSFORGE_FUNCTIONS_URL}/${slug}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    body: JSON.stringify(body),
  });
  if (!res.ok) {
    const t = await res.text();
    throw new Error(`${slug}: ${res.status} ${t}`);
  }
  return res.json();
}

export default function VaultPage() {
  const { user, loading } = useCurrentUser();
  const router = useRouter();
  const [files, setFiles] = useState<VaultFile[]>([]);
  const [clinics, setClinics] = useState<Clinic[]>([]);
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    if (!loading && !user) router.replace("/mi-cuenta/login");
  }, [user, loading, router]);

  const refresh = useCallback(async () => {
    const { data } = await insforge.database
      .from("medical_vault_files")
      .select("*")
      .order("uploaded_at", { ascending: false });
    setFiles((data as VaultFile[]) ?? []);
    const { data: cData } = await insforge.database
      .from("clinics")
      .select("*")
      .eq("status", "active");
    setClinics((cData as Clinic[]) ?? []);
  }, []);

  useEffect(() => {
    if (user) refresh();
  }, [user, refresh]);

  const onUpload = async (file: File) => {
    setBusy(true);
    try {
      const fileType = detectFileType(file);
      const step1 = await invokeFn<{ file_id: string; upload_url: string }>(
        "get-upload-url",
        {
          filename: file.name,
          mime: file.type,
          size_bytes: file.size,
          file_type: fileType,
        }
      );
      const token = await getAccessToken();
      const up = await fetch(step1.upload_url, {
        method: "PUT",
        headers: { Authorization: `Bearer ${token}` },
        body: file,
      });
      if (!up.ok) throw new Error(`upload ${up.status}`);
      await invokeFn("validate-upload", { file_id: step1.file_id });
      await refresh();
    } catch (e: unknown) {
      alert(e instanceof Error ? e.message : "Upload error");
    } finally {
      setBusy(false);
    }
  };

  const onShare = async (fileId: string) => {
    const clinicId = prompt(
      `Pega el id de la clínica a autorizar (demo: ${clinics[0]?.id ?? ""})`
    );
    if (!clinicId) return;
    try {
      const res = await invokeFn<{ token: string; _dev_otp?: string }>(
        "create-share-token",
        { file_id: fileId, clinic_id: clinicId, ttl_days: 7 }
      );
      alert(
        `Token de acceso creado.\nToken: ${res.token.slice(0, 16)}…\nOTP (dev): ${res._dev_otp ?? "(enviado por email en prod)"}`
      );
      await refresh();
    } catch (e: unknown) {
      alert(e instanceof Error ? e.message : "Error");
    }
  };

  if (loading || !user) {
    return (
      <div className="mx-auto max-w-7xl px-4 py-20 text-center text-muted-fg">
        Cargando…
      </div>
    );
  }

  const storageGB = (
    files.reduce((a, f) => a + (f.size_bytes || 0), 0) /
    1024 /
    1024 /
    1024
  ).toFixed(2);

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="text-xs font-semibold uppercase tracking-widest text-primary">
            Secure Vault
          </p>
          <h1 className="mt-1 font-headline text-4xl font-bold">The Vault</h1>
          <p className="mt-2 max-w-xl text-sm text-muted-fg">
            Tu historial médico con acceso biométrico, signed URLs y auditoría
            completa de cada acceso por parte de las clínicas autorizadas.
          </p>
        </div>
        <div className="flex gap-3">
          <Metric label="Storage usado" value={`${storageGB} GB`} />
          <Metric label="Archivos" value={files.length.toString()} />
        </div>
      </div>

      {/* Upload zone */}
      <label
        htmlFor="vault-upload"
        className="mt-8 flex cursor-pointer flex-col items-center justify-center rounded-3xl border-2 border-dashed border-primary/40 bg-surface-low/50 p-10 text-center transition hover:border-primary hover:bg-surface-low"
      >
        <span className="font-headline text-xl font-bold text-primary">
          {busy ? "Subiendo…" : "Arrastra o selecciona archivos"}
        </span>
        <span className="mt-1 text-xs text-muted-fg">
          PDF · JPG · PNG · DICOM — máx. 50MB · validación MIME real + SHA-256
        </span>
        <input
          id="vault-upload"
          type="file"
          accept=".pdf,.jpg,.jpeg,.png,.dcm,application/dicom"
          className="hidden"
          disabled={busy}
          onChange={(e) => {
            const f = e.target.files?.[0];
            if (f) onUpload(f);
            e.currentTarget.value = "";
          }}
        />
      </label>

      {/* Files grid */}
      <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {files.length === 0 && (
          <p className="col-span-full text-center text-sm text-muted-fg">
            Aún no has subido archivos.
          </p>
        )}
        {files.map((f) => (
          <div key={f.id} className="card flex flex-col p-5">
            <div className="flex items-start gap-3">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary/15 text-primary">
                {fileTypeIcon(f.file_type)}
              </div>
              <div className="min-w-0 flex-1">
                <h3 className="truncate font-semibold" title={f.original_filename}>
                  {f.original_filename}
                </h3>
                <p className="mt-0.5 text-xs text-muted-fg">
                  {(f.size_bytes / 1024 / 1024).toFixed(2)} MB ·{" "}
                  {new Date(f.uploaded_at).toLocaleDateString()}
                </p>
              </div>
              <StatusBadge status={f.status} />
            </div>
            <div className="mt-3 flex flex-wrap gap-1.5">
              {f.shared_with_clinic_ids.length > 0 ? (
                f.shared_with_clinic_ids.map((cid) => (
                  <span key={cid} className="chip text-[10px]">
                    Compartido con {cid.slice(0, 8)}…
                  </span>
                ))
              ) : (
                <span className="chip text-[10px]">Sin compartir</span>
              )}
            </div>
            <div className="mt-auto flex gap-2 pt-4">
              <button
                onClick={() => onShare(f.id)}
                className="btn-ghost flex-1 text-xs"
                disabled={f.status !== "available"}
              >
                Compartir
              </button>
              <button
                onClick={async () => {
                  if (!confirm("¿Borrar este archivo?")) return;
                  await insforge.database
                    .from("medical_vault_files")
                    .delete()
                    .eq("id", f.id);
                  await refresh();
                }}
                className="btn-ghost flex-1 text-xs"
              >
                Borrar
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Clinics helper */}
      {clinics.length > 0 && (
        <div className="mt-10 card p-6">
          <h3 className="font-headline text-lg font-bold">Clínicas disponibles</h3>
          <p className="mt-1 text-xs text-muted-fg">
            Copia el ID y úsalo al compartir un archivo.
          </p>
          <ul className="mt-4 divide-y divide-outline-variant/20">
            {clinics.map((c) => (
              <li key={c.id} className="flex items-center justify-between gap-3 py-3">
                <div>
                  <p className="font-medium">{c.name}</p>
                  <p className="text-xs text-muted-fg">
                    {c.city}, {c.country}
                  </p>
                </div>
                <code className="rounded-lg bg-surface-high px-2 py-1 text-[10px]">
                  {c.id}
                </code>
              </li>
            ))}
          </ul>
        </div>
      )}

      <div className="mt-10">
        <button
          onClick={async () => {
            await insforge.auth.signOut();
            router.push("/mi-cuenta/login");
          }}
          className="text-sm text-muted-fg underline"
        >
          Cerrar sesión
        </button>
      </div>
    </div>
  );
}

function Metric({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl border border-outline-variant/40 bg-surface-low px-4 py-3 text-right">
      <p className="text-[10px] font-semibold uppercase tracking-widest text-muted-fg">
        {label}
      </p>
      <p className="font-headline text-xl font-bold text-primary">{value}</p>
    </div>
  );
}

function StatusBadge({ status }: { status: VaultFile["status"] }) {
  const colors: Record<VaultFile["status"], string> = {
    uploading: "bg-surface-high text-muted-fg",
    available: "bg-primary/15 text-primary",
    scanning: "bg-surface-high text-muted-fg",
    rejected: "bg-danger-container/40 text-danger",
  };
  return (
    <span
      className={`rounded-full px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider ${colors[status]}`}
    >
      {status}
    </span>
  );
}

function detectFileType(file: File): VaultFile["file_type"] {
  const mime = file.type;
  if (mime === "application/dicom" || file.name.endsWith(".dcm")) return "ct_scan";
  if (mime.startsWith("image/")) return "xray";
  if (mime === "application/pdf") return "lab_report";
  return "other";
}

function fileTypeIcon(t: VaultFile["file_type"]) {
  const map: Record<VaultFile["file_type"], string> = {
    xray: "🩻",
    ct_scan: "🧠",
    lab_report: "🧪",
    photo: "📷",
    other: "📄",
  };
  return <span aria-hidden>{map[t]}</span>;
}
