import Link from "next/link";

export function Footer() {
  return (
    <footer className="mt-20 border-t border-outline-variant/20 bg-surface/60">
      <div className="mx-auto grid max-w-7xl gap-10 px-4 py-12 sm:px-6 lg:grid-cols-4 lg:px-8">
        <div className="lg:col-span-1">
          <p className="font-headline text-lg font-bold">
            MedTrust <span className="text-primary">Maps</span>
          </p>
          <p className="mt-3 max-w-xs text-sm text-muted-fg">
            El estándar global de confianza para turismo médico. Data verificable,
            costo total real, Vault seguro.
          </p>
        </div>
        <FooterCol
          title="Plataforma"
          links={[
            ["Cómo funciona", "/como-funciona"],
            ["Trust Score", "/trust-score"],
            ["The Vault", "/mi-cuenta/vault"],
          ]}
        />
        <FooterCol
          title="Legal"
          links={[
            ["Privacy Policy", "/legal/privacy"],
            ["HIPAA", "/legal/hipaa"],
            ["Términos", "/legal/terms"],
          ]}
        />
        <FooterCol
          title="Descubre"
          links={[
            ["Blog", "/blog"],
            ["Destinos", "/destinos"],
            ["Contáctanos", "/contacto"],
          ]}
        />
      </div>
      <div className="border-t border-outline-variant/10 py-4 text-center text-xs text-muted-fg">
        © {new Date().getFullYear()} MedTrust Maps. Todos los derechos reservados.
      </div>
    </footer>
  );
}

function FooterCol({
  title,
  links,
}: {
  title: string;
  links: Array<[string, string]>;
}) {
  return (
    <div>
      <h4 className="text-xs font-semibold uppercase tracking-widest text-muted-fg">
        {title}
      </h4>
      <ul className="mt-4 space-y-2 text-sm">
        {links.map(([label, href]) => (
          <li key={href}>
            <Link href={href} className="text-foreground/80 hover:text-primary">
              {label}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
