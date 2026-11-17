import { isRouteErrorResponse, Links, Meta, Outlet, Scripts, ScrollRestoration } from "react-router";
import { MotionConfig } from "motion/react";
import { Toaster } from "sonner";
import "@fontsource-variable/geist/wght.css";
import "@fontsource-variable/geist-mono/wght.css";
import type { Route } from "./+types/root";
import { INTRO_INIT_SCRIPT } from "@/components/layout/MonogramIntro";
import { buttonVariants } from "@/components/ui/Button";
import { THEME_INIT_SCRIPT, ThemeProvider } from "@/contexts/ThemeContext";
import "./app.css";

interface LayoutProps {
  children: React.ReactNode;
}

export function Layout({ children }: LayoutProps) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <script dangerouslySetInnerHTML={{ __html: THEME_INIT_SCRIPT + ";" + INTRO_INIT_SCRIPT }} />
        <link rel="icon" href="/favicon.svg" type="image/svg+xml" />
        <Meta />
        <Links />
      </head>
      <body>
        {children}
        <ScrollRestoration />
        <Scripts />
      </body>
    </html>
  );
}

export default function App() {
  return (
    <ThemeProvider>
      {/* "user": people who ask for reduced motion get opacity changes only, no movement. */}
      <MotionConfig reducedMotion="user">
        <Outlet />
      </MotionConfig>
      <Toaster position="bottom-center" />
    </ThemeProvider>
  );
}

export function ErrorBoundary({ error }: Route.ErrorBoundaryProps) {
  const notFound = isRouteErrorResponse(error) && error.status === 404;

  return (
    <main className="mx-auto flex min-h-svh max-w-page flex-col items-start justify-center px-5 sm:px-8">
      <p className="font-mono text-sm text-primary">{notFound ? "404" : "Error"}</p>
      <h1 className="mt-3 text-title font-semibold">
        {notFound ? "This page doesn't exist" : "Something went wrong on this page"}
      </h1>
      <p className="mt-3 text-lg text-muted-foreground">
        {notFound ? "The link may be old or mistyped." : "Reloading usually fixes it."}
      </p>
      <a href="/" className={buttonVariants({ className: "mt-8" })}>
        Go to the home page
      </a>
    </main>
  );
}
