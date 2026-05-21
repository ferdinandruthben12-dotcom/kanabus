import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  Outlet,
  Link,
  createRootRouteWithContext,
  useRouter,
  HeadContent,
  Scripts,
} from "@tanstack/react-router";

import appCss from "../styles.css?url";
import { I18nProvider } from "@/lib/i18n";
import { Nav } from "@/components/Nav";
import { Footer } from "@/components/Footer";
import { AgeGate } from "@/components/AgeGate";

function NotFoundComponent() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <h1 className="font-display italic text-8xl text-foreground">404</h1>
        <p className="mt-4 text-sm font-mono uppercase tracking-widest text-foreground/60">
          Page introuvable
        </p>
        <div className="mt-8">
          <Link
            to="/"
            className="inline-flex items-center justify-center bg-foreground text-background px-6 py-3 text-[11px] font-mono uppercase tracking-widest hover:bg-accent transition-colors"
          >
            Retour à l'accueil
          </Link>
        </div>
      </div>
    </div>
  );
}

function ErrorComponent({ error, reset }: { error: Error; reset: () => void }) {
  console.error(error);
  const router = useRouter();
  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <h1 className="font-display italic text-4xl">Quelque chose a glissé.</h1>
        <p className="mt-3 text-sm text-foreground/60">Réessayez ou revenez à l'accueil.</p>
        <div className="mt-6 flex flex-wrap justify-center gap-3">
          <button
            onClick={() => { router.invalidate(); reset(); }}
            className="bg-foreground text-background px-5 py-3 text-[11px] font-mono uppercase tracking-widest hover:bg-accent"
          >
            Réessayer
          </button>
          <a href="/" className="border border-foreground/20 px-5 py-3 text-[11px] font-mono uppercase tracking-widest">
            Accueil
          </a>
        </div>
      </div>
    </div>
  );
}

export const Route = createRootRouteWithContext<{ queryClient: QueryClient }>()({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { title: "KanaBus — CBD Lifestyle premium à Cap-Haïtien" },
      {
        name: "description",
        content:
          "KanaBus, le CBD lifestyle premium d'Haïti. Fleurs Indoor, gummies, thé, miel et chocolat infusés. Livraison Cap-Haïtien.",
      },
      { name: "author", content: "KanaBus" },
      { property: "og:title", content: "KanaBus — CBD Lifestyle Premium" },
      {
        property: "og:description",
        content: "L'or vert du Cap. Fleurs CBD et produits infusés, qualité indoor premium.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
    links: [
      { rel: "stylesheet", href: appCss },
      { rel: "preconnect", href: "https://fonts.googleapis.com" },
      { rel: "preconnect", href: "https://fonts.gstatic.com", crossOrigin: "anonymous" },
      {
        rel: "stylesheet",
        href: "https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;1,400;1,700;1,800&family=Inter:wght@300;400;500;600&family=JetBrains+Mono:wght@400;500&display=swap",
      },
    ],
  }),
  shellComponent: RootShell,
  component: RootComponent,
  notFoundComponent: NotFoundComponent,
  errorComponent: ErrorComponent,
});

function RootShell({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fr">
      <head>
        <HeadContent />
      </head>
      <body>
        {children}
        <Scripts />
      </body>
    </html>
  );
}

function RootComponent() {
  const { queryClient } = Route.useRouteContext();
  return (
    <QueryClientProvider client={queryClient}>
      <I18nProvider>
        <LayoutShell />
      </I18nProvider>
    </QueryClientProvider>
  );
}

function LayoutShell() {
  return (
    <>
      <AgeGate />
      <NavWrapper />
      <main className="min-h-screen">
        <Outlet />
      </main>
      <Footer />
    </>
  );
}

function NavWrapper() {
  // Overlay nav (transparent over hero) only on home route
  const path = typeof window !== "undefined" ? window.location.pathname : "/";
  return <Nav overlay={path === "/"} />;
}
