"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { AuthControl } from "@/components/auth/auth-control";
import { useSessionUser } from "@/components/auth/use-session-user";

const links = [
  { href: "/plan", label: "Plan" },
  { href: "/wallet", label: "Wallet" },
  { href: "/bookings", label: "Bookings" },
];

function isActive(pathname: string | null, href: string) {
  if (!pathname) return false;
  return pathname === href || pathname.startsWith(`${href}/`);
}

function AppNav({ pathname, className }: { pathname: string | null; className: string }) {
  return (
    <nav className={className}>
      {links.map((link) => {
        const active = isActive(pathname, link.href);
        return (
          <Link
            key={link.href}
            href={link.href}
            className={`shrink-0 rounded-full px-3 py-1.5 text-sm ${
              active ? "bg-sand text-foreground" : "text-foreground/70 hover:bg-background hover:text-foreground"
            }`}
          >
            {link.label}
          </Link>
        );
      })}
    </nav>
  );
}

function Header({
  pathname,
  showAppNav,
  user,
}: {
  pathname: string | null;
  showAppNav: boolean;
  user: ReturnType<typeof useSessionUser>;
}) {
  return (
    <header className="sticky top-0 z-20 border-b border-line bg-card/95 backdrop-blur">
      <div className="mx-auto flex max-w-5xl items-center justify-between gap-3 px-4 py-3">
        <Link href="/" className="font-display text-lg font-semibold tracking-tight">
          Una Milla
        </Link>
        {showAppNav ? (
          <AppNav pathname={pathname} className="hidden items-center gap-1 sm:flex" />
        ) : (
          <span className="flex-1" />
        )}
        <AuthControl user={user} />
      </div>
      {showAppNav ? (
        <AppNav
          pathname={pathname}
          className="flex gap-2 overflow-x-auto px-4 pb-3 sm:hidden"
        />
      ) : null}
    </header>
  );
}

export function SiteHeader() {
  const user = useSessionUser();
  return <Header pathname={usePathname()} showAppNav={Boolean(user)} user={user} />;
}

export function HeaderFallback() {
  return <Header pathname={null} showAppNav={false} user={undefined} />;
}
