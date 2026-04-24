import { createClient } from "@/lib/supabase/server";

export type SetupChecklistStatus = {
  servicesCount: number;
  roomsCount: number;
  employeesCount: number;
  salonHoursCount: number;
};

async function getTableCount(tableName: string) {
  const supabase = await createClient();

  const { count, error } = await supabase
    .from(tableName)
    .select("*", { count: "exact", head: true });

  if (error) {
    console.warn(`Could not count ${tableName}:`, error.message);
    return 0;
  }

  return count ?? 0;
}

export async function getSetupChecklistStatus(): Promise<SetupChecklistStatus> {
  const [servicesCount, roomsCount, employeesCount, salonHoursCount] =
    await Promise.all([
      getTableCount("services"),
      getTableCount("rooms"),
      getTableCount("employees"),
      getTableCount("salon_working_hours"),
    ]);

  return {
    servicesCount,
    roomsCount,
    employeesCount,
    salonHoursCount,
  };
}
