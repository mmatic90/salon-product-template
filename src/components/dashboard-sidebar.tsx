"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  CalendarDays,
  Clock3,
  LayoutDashboard,
  ListChecks,
  PanelLeft,
  PanelLeftClose,
  Settings,
  Users,
  UserCircle2,
} from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import LogoutButton from "@/components/logout-button";

type AppRole = "admin" | "employee";

type Props = {
  role: AppRole;
  displayName: string;
  salonName: string;
  logoUrl: string | null;
  t: {
    dashboard: string;
    appointments: string;
    calendar: string;
    timeGrid: string;
    clients: string;
    account: string;
    schedule: string;
    reports: string;
    settings: string;
    adminPanel: string;
    mobileAdmin: string;
    loggedInAs: string;
  };
};

function getNavItems(t: Props["t"]) {
  return [
    {
      href: "/dashboard",
      label: t.dashboard,
      icon: LayoutDashboard,
      roles: ["admin", "employee"],
    },
    {
      href: "/dashboard/appointments",
      label: t.appointments,
      icon: ListChecks,
      roles: ["admin", "employee"],
    },
    {
      href: "/dashboard/calendar",
      label: t.calendar,
      icon: CalendarDays,
      roles: ["admin", "employee"],
    },
    {
      href: "/dashboard/calendar/time-grid",
      label: t.timeGrid,
      icon: Clock3,
      roles: ["admin", "employee"],
    },
    {
      href: "/dashboard/clients",
      label: t.clients,
      icon: Users,
      roles: ["admin", "employee"],
    },
    {
      href: "/dashboard/account",
      label: t.account,
      icon: UserCircle2,
      roles: ["admin", "employee"],
    },
    {
      href: "/dashboard/schedule",
      label: t.schedule,
      icon: Users,
      roles: ["admin"],
    },
    {
      href: "/dashboard/reports",
      label: t.reports,
      icon: LayoutDashboard,
      roles: ["admin"],
    },
    {
      href: "/dashboard/settings",
      label: t.settings,
      icon: Settings,
      roles: ["admin"],
    },
  ] satisfies Array<{
    href: string;
    label: string;
    icon: typeof LayoutDashboard;
    roles: AppRole[];
  }>;
}

function isActive(pathname: string, href: string) {
  if (href === "/dashboard") return pathname === "/dashboard";
  return pathname.startsWith(href);
}

function getInitials(name: string) {
  return name
    .split(" ")
    .filter(Boolean)
    .map((part) => part[0])
    .join("")
    .slice(0, 3)
    .toUpperCase();
}

export default function DashboardSidebar({
  role,
  displayName,
  salonName,
  logoUrl,
  t,
}: Props) {
  const pathname = usePathname();

  const [mobileOpen, setMobileOpen] = useState(false);
  const [desktopCollapsed, setDesktopCollapsed] = useState(false);

  const navItems = useMemo(
    () => getNavItems(t).filter((item) => item.roles.includes(role)),
    [role, t],
  );

  useEffect(() => {
    const saved = window.localStorage.getItem("dashboard-sidebar-collapsed");
    if (saved === "true") setDesktopCollapsed(true);
  }, []);

  function toggleDesktop() {
    setDesktopCollapsed((prev) => {
      const next = !prev;
      window.localStorage.setItem("dashboard-sidebar-collapsed", String(next));
      return next;
    });
  }

  return (
    <>
      <div className="sticky top-0 z-50 border-b border-app-soft bg-app-card px-4 py-3 shadow-sm lg:hidden">
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            {logoUrl ? (
              <img
                src={logoUrl}
                alt={salonName}
                className="h-10 w-10 rounded-xl object-cover"
              />
            ) : (
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-app-accent text-sm font-bold text-white">
                {getInitials(salonName)}
              </div>
            )}

            <div>
              <div className="text-lg font-semibold text-app-text">
                {salonName}
              </div>
              <div className="text-xs text-app-muted">{t.mobileAdmin}</div>
            </div>
          </div>

          <button
            type="button"
            onClick={() => setMobileOpen((prev) => !prev)}
            className="rounded-xl border border-app-soft bg-white p-2 text-app-text transition hover:bg-app-bg"
            aria-label="Otvori navigaciju"
          >
            {mobileOpen ? (
              <PanelLeftClose className="h-5 w-5" />
            ) : (
              <PanelLeft className="h-5 w-5" />
            )}
          </button>
        </div>

        <div className="mt-3 flex flex-col gap-2 rounded-2xl border border-app-soft bg-app-card-alt px-4 py-3">
          <div className="text-sm text-app-muted">
            Logiran kao:{" "}
            <span className="font-medium text-app-text">{displayName}</span>
          </div>
          <div className="flex items-center gap-2">
            <Link
              href="/dashboard/account"
              className="rounded-xl border border-app-soft bg-white px-3 py-2 text-sm font-medium text-app-text transition hover:bg-app-bg"
            >
              Moj račun
            </Link>
            <LogoutButton />
          </div>
        </div>

        {mobileOpen ? (
          <div className="mt-4 space-y-2">
            {navItems.map((item) => {
              const Icon = item.icon;
              const active = isActive(pathname, item.href);

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setMobileOpen(false)}
                  className={`flex items-center gap-3 rounded-2xl px-4 py-3 text-sm font-medium transition ${
                    active
                      ? "bg-app-accent text-white shadow-sm"
                      : "bg-app-card-alt text-app-text hover:bg-white"
                  }`}
                >
                  <Icon className="h-4 w-4" />
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </div>
        ) : null}
      </div>

      <aside
        className={`hidden lg:sticky lg:top-0 lg:flex lg:h-screen lg:flex-col lg:border-r lg:border-app-soft lg:bg-app-card lg:py-6 lg:shadow-sm transition-all duration-200 ${
          desktopCollapsed ? "lg:w-24" : "lg:w-72"
        }`}
      >
        <div className="flex items-start justify-between gap-2 px-4 pb-6">
          {!desktopCollapsed ? (
            <div className="flex items-center gap-3">
              {logoUrl ? (
                <img
                  src={logoUrl}
                  alt={salonName}
                  className="h-11 w-11 rounded-xl object-cover"
                />
              ) : (
                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-app-accent text-sm font-bold text-white">
                  {getInitials(salonName)}
                </div>
              )}

              <div>
                <div className="text-xl font-bold text-app-text">
                  {salonName}
                </div>
                <div className="mt-1 text-sm text-app-muted">
                  {t.adminPanel}
                </div>
              </div>
            </div>
          ) : (
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-app-accent text-xs font-bold text-white">
              {getInitials(salonName)}
            </div>
          )}

          <button
            type="button"
            onClick={toggleDesktop}
            className="rounded-xl border border-app-soft bg-white p-2 text-app-text transition hover:bg-app-bg"
            aria-label="Sakrij ili prikaži navigaciju"
          >
            {desktopCollapsed ? (
              <PanelLeft className="h-4 w-4" />
            ) : (
              <PanelLeftClose className="h-4 w-4" />
            )}
          </button>
        </div>

        <nav className="flex-1 space-y-2 overflow-y-auto px-3">
          {navItems.map((item) => {
            const Icon = item.icon;
            const active = isActive(pathname, item.href);

            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center rounded-2xl px-4 py-3 text-sm font-medium transition ${
                  desktopCollapsed ? "justify-center" : "gap-3"
                } ${
                  active
                    ? "bg-app-accent text-white shadow-sm"
                    : "text-app-text hover:bg-app-card-alt"
                }`}
                title={desktopCollapsed ? item.label : undefined}
              >
                <Icon className="h-4 w-4 shrink-0" />
                {!desktopCollapsed ? <span>{item.label}</span> : null}
              </Link>
            );
          })}
        </nav>

        <div className="mt-auto px-3 pt-6">
          <div className="rounded-2xl border border-app-soft bg-app-card-alt p-4">
            {!desktopCollapsed ? (
              <>
                <div className="text-sm text-app-muted">
                  {t.loggedInAs}:{" "}
                  <span className="font-medium text-app-text">
                    {displayName}
                  </span>
                </div>

                <div className="mt-3 flex flex-wrap gap-2">
                  <Link
                    href="/dashboard/account"
                    className="rounded-xl border border-app-soft bg-white px-3 py-2 text-sm font-medium text-app-text transition hover:bg-app-bg"
                  >
                    {t.account}
                  </Link>
                  <LogoutButton />
                </div>
              </>
            ) : (
              <div className="flex flex-col items-center gap-2">
                <Link
                  href="/dashboard/account"
                  title="Moj račun"
                  className="rounded-xl border border-app-soft bg-white p-2 text-app-text transition hover:bg-app-bg"
                >
                  <UserCircle2 className="h-4 w-4" />
                </Link>
                <LogoutButton />
              </div>
            )}
          </div>
        </div>
      </aside>
    </>
  );
}
