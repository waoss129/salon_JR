import { createAdminAuthClient } from "@/lib/supabase/server";

export type StatsSummary = {
  totalRevenue: number;
  totalBillsCreated: number;
  avgPerPaidBill: number;
  completedAppointments: number;
};

export type TopServiceRow = {
  serviceName: string;
  categoryName: string;
  quantitySold: number;
  revenue: number;
};

type BillServiceRow = {
  quantity: number;
  subtotal: number;
  services: { name: string; categories: { name: string } | null } | null;
};

function toRangeIso(from: string, to: string) {
  return {
    start: `${from}T00:00:00`,
    end: `${to}T23:59:59`,
  };
}

export async function getStatisticsSummary(
  from: string,
  to: string,
): Promise<StatsSummary> {
  const supabase = await createAdminAuthClient();
  const { start, end } = toRangeIso(from, to);

  const { data: paidBills } = await supabase
    .from("bills")
    .select("total_price")
    .eq("status", "paid")
    .gte("updated_at", start)
    .lte("updated_at", end);

  const totalRevenue = (paidBills ?? []).reduce(
    (sum, b) => sum + (b.total_price ?? 0),
    0,
  );
  const paidCount = (paidBills ?? []).length;

  const { count: totalBillsCreated } = await supabase
    .from("bills")
    .select("id", { count: "exact", head: true })
    .gte("created_at", start)
    .lte("created_at", end);

  const { count: completedAppointments } = await supabase
    .from("appointments")
    .select("id", { count: "exact", head: true })
    .eq("status", "completed")
    .gte("appointment_date", start)
    .lte("appointment_date", end);

  return {
    totalRevenue,
    totalBillsCreated: totalBillsCreated ?? 0,
    avgPerPaidBill: paidCount > 0 ? Math.round(totalRevenue / paidCount) : 0,
    completedAppointments: completedAppointments ?? 0,
  };
}

export async function getTopServices(
  from: string,
  to: string,
  limit = 5,
): Promise<TopServiceRow[]> {
  const supabase = await createAdminAuthClient();
  const { start, end } = toRangeIso(from, to);

  const { data, error } = await supabase
    .from("bill_services")
    .select(
      `
      quantity,
      subtotal,
      services ( name, categories ( name ) ),
      bills!inner ( status, updated_at )
    `,
    )
    .eq("bills.status", "paid")
    .gte("bills.updated_at", start)
    .lte("bills.updated_at", end);

  if (error) {
    console.error("getTopServices error:", error);
    return [];
  }
  type ServiceTotal = {
  serviceName: string;
  categoryName: string;
  quantitySold: number;
  revenue: number;
};

const totals = new Map<string, ServiceTotal>();

  // const totals = new Map
  //   string,
  //   {
  //     serviceName: string;
  //     categoryName: string;
  //     quantitySold: number;
  //     revenue: number;
  //   }
  // >();

  for (const row of (data ?? []) as unknown as BillServiceRow[]) {
    const serviceName = row.services?.name ?? "—";
    const categoryName = row.services?.categories?.name ?? "Khác";
    const key = `${serviceName}::${categoryName}`;
    const current = totals.get(key) ?? {
      serviceName,
      categoryName,
      quantitySold: 0,
      revenue: 0,
    };
    current.quantitySold += row.quantity ?? 0;
    current.revenue += row.subtotal ?? 0;
    totals.set(key, current);
  }

  return Array.from(totals.values())
    .sort((a, b) => b.revenue - a.revenue)
    .slice(0, limit);
}