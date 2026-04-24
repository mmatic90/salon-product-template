import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import {
  canAccessReports,
  canAccessScheduleManagement,
  canAccessSettings,
  getCurrentUserPermissions,
} from "@/lib/permissions";

export async function requireDashboardUser() {
  const supabase = await createClient();

  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();

  if (error || !user) {
    await supabase.auth.signOut();
    redirect("/login");
  }

  const permissions = await getCurrentUserPermissions();

  if (!permissions) {
    redirect("/setup");
  }

  return permissions;
}

export async function requireAdminForSettings() {
  const permissions = await requireDashboardUser();

  if (!canAccessSettings(permissions.role)) {
    redirect("/dashboard");
  }

  return permissions;
}

export async function requireAdminForReports() {
  const permissions = await requireDashboardUser();

  if (!canAccessReports(permissions.role)) {
    redirect("/dashboard");
  }

  return permissions;
}

export async function requireAdminForScheduleManagement() {
  const permissions = await requireDashboardUser();

  if (!canAccessScheduleManagement(permissions.role)) {
    redirect("/dashboard");
  }

  return permissions;
}
