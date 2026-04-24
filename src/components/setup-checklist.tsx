import Link from "next/link";

type SetupChecklistProps = {
  servicesCount: number;
  roomsCount: number;
  employeesCount: number;
  salonHoursCount: number;
};

function ChecklistItem({
  done,
  title,
  description,
  href,
}: {
  done: boolean;
  title: string;
  description: string;
  href: string;
}) {
  return (
    <Link
      href={href}
      className="flex items-start gap-4 rounded-xl border border-app-soft bg-app-card-alt p-4 transition hover:bg-app-card"
    >
      <div
        className={`mt-1 flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-sm font-bold ${
          done ? "bg-green-100 text-green-700" : "bg-yellow-100 text-yellow-700"
        }`}
      >
        {done ? "✓" : "!"}
      </div>

      <div>
        <h3 className="font-semibold text-app-text">{title}</h3>
        <p className="mt-1 text-sm text-app-muted">{description}</p>
      </div>
    </Link>
  );
}

export default function SetupChecklist({
  servicesCount,
  roomsCount,
  employeesCount,
  salonHoursCount,
}: SetupChecklistProps) {
  const allDone =
    servicesCount > 0 &&
    roomsCount > 0 &&
    employeesCount > 0 &&
    salonHoursCount >= 7;

  if (allDone) {
    return null;
  }

  return (
    <div className="rounded-2xl border border-yellow-200 bg-yellow-50 p-6 shadow-sm">
      <h2 className="text-xl font-bold text-yellow-900">
        Dovrši postavljanje salona
      </h2>

      <p className="mt-2 text-sm text-yellow-800">
        Prije korištenja sustava podesi osnovne podatke. Ovo se radi samo jednom
        za svaki novi salon.
      </p>

      <div className="mt-5 grid gap-3 md:grid-cols-2">
        <ChecklistItem
          done={servicesCount > 0}
          title="Dodaj usluge"
          description="Dodaj tretmane/usluge koje salon nudi."
          href="/dashboard/settings/services"
        />

        <ChecklistItem
          done={roomsCount > 0}
          title="Dodaj sobe"
          description="Dodaj prostorije u kojima se usluge izvode."
          href="/dashboard/settings/rooms"
        />

        <ChecklistItem
          done={employeesCount > 0}
          title="Provjeri djelatnike"
          description="Admin je kreiran automatski, ali možeš dodati još djelatnika."
          href="/dashboard/settings/employees"
        />

        <ChecklistItem
          done={salonHoursCount >= 7}
          title="Postavi radno vrijeme"
          description="Definiraj radno vrijeme salona po danima."
          href="/dashboard/settings/salon-hours"
        />
      </div>
    </div>
  );
}
