import Link from "next/link";

export function Header() {
  return (
    <header className="sticky top-0 z-40 w-full border-b border-outline-variant/20 bg-background/80 backdrop-blur-lg">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
        <Link href="/" className="flex items-center gap-2">
          <LogoMark />
          <span className="font-headline text-lg font-bold tracking-tight">
            MedTrust <span className="text-primary">Maps</span>
          </span>
        </Link>

        <nav className="hidden items-center gap-6 text-sm font-medium text-muted-fg md:flex">
          <Link href="/buscar" className="hover:text-foreground">
            Clínicas
          </Link>
          <Link href="/buscar?especialidad=dental_implant" className="hover:text-foreground">
            Procedimientos
          </Link>
          <Link href="/destinos" className="hover:text-foreground">
            Destinos
          </Link>
          <Link href="/mi-cuenta/vault" className="hover:text-foreground">
            The Vault
          </Link>
        </nav>

        <div className="flex items-center gap-3">
          <Link href="/mi-cuenta/vault" className="btn-primary text-sm">
            Acceder al Vault
          </Link>
        </div>
      </div>
    </header>
  );
}

function LogoMark() {
  return (
    <svg
      width="28"
      height="28"
      viewBox="0 0 32 32"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden
    >
      <path
        d="M16 3l11 6v8c0 7-5 11-11 12-6-1-11-5-11-12V9l11-6z"
        stroke="#6bfb9a"
        strokeWidth="2"
        strokeLinejoin="round"
        fill="rgba(107,251,154,0.10)"
      />
      <path
        d="M12 16l3 3 5-6"
        stroke="#6bfb9a"
        strokeWidth="2.2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
