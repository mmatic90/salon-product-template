"use client";

import { useMemo, useState, useTransition } from "react";
import { RotateCcw } from "lucide-react";
import { bulkUpdateServiceEquipmentAction } from "@/features/settings/actions";
import type { ServiceEquipmentMappingRow } from "@/features/settings/queries";
import { toast } from "sonner";

type ServiceItem = {
  id: string;
  name: string;
  is_active: boolean;
};

type EquipmentItem = {
  id: string;
  name: string;
  is_active: boolean;
};

type Props = {
  services: ServiceItem[];
  equipment: EquipmentItem[];
  mappings: ServiceEquipmentMappingRow[];
  labels: {
    editHint: string;
    saveChangesText: string;
    reset: string;
    saving: string;
    saveChanges: string;
    service: string;
  };
};

type EditableMapping = {
  service_id: string;
  equipment_ids: string[];
};

export default function ServiceEquipmentTable({
  services,
  equipment,
  mappings,
  labels,
}: Props) {
  const activeServices = useMemo(
    () => services.filter((service) => service.is_active),
    [services],
  );

  const activeEquipment = useMemo(
    () => equipment.filter((item) => item.is_active),
    [equipment],
  );

  const initialItems = useMemo<EditableMapping[]>(
    () =>
      activeServices.map((service) => ({
        service_id: service.id,
        equipment_ids: mappings
          .filter((mapping) => mapping.service_id === service.id)
          .map((mapping) => mapping.equipment_id),
      })),
    [activeServices, mappings],
  );

  const [items, setItems] = useState<EditableMapping[]>(initialItems);
  const [pending, startTransition] = useTransition();

  const hasChanges = JSON.stringify(items) !== JSON.stringify(initialItems);

  function toggleEquipment(serviceId: string, equipmentId: string) {
    setItems((prev) =>
      prev.map((item) => {
        if (item.service_id !== serviceId) return item;

        const exists = item.equipment_ids.includes(equipmentId);

        return {
          ...item,
          equipment_ids: exists
            ? item.equipment_ids.filter((id) => id !== equipmentId)
            : [...item.equipment_ids, equipmentId],
        };
      }),
    );
  }

  function resetChanges() {
    setItems(initialItems);
  }

  function saveChanges() {
    startTransition(async () => {
      const result = await bulkUpdateServiceEquipmentAction(items);

      if (result.ok) {
        toast.success(result.message);
      } else {
        toast.error(result.message);
      }
    });
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="text-sm text-app-muted">
          {labels.editHint}{" "}
          <span className="font-medium text-app-text">
            {labels.saveChangesText}
          </span>
          .
        </div>

        <div className="flex gap-2">
          <button
            type="button"
            onClick={resetChanges}
            disabled={pending || !hasChanges}
            className="inline-flex items-center gap-2 rounded-xl border border-app-soft bg-white px-4 py-2 text-sm font-medium text-app-text transition hover:bg-app-bg disabled:opacity-50"
          >
            <RotateCcw className="h-4 w-4" />
            {labels.reset}
          </button>

          <button
            type="button"
            onClick={saveChanges}
            disabled={pending || !hasChanges}
            className="rounded-xl bg-app-accent px-4 py-2 text-sm font-medium text-white transition hover:opacity-90 disabled:opacity-50"
          >
            {pending ? labels.saving : labels.saveChanges}
          </button>
        </div>
      </div>

      <div className="hidden overflow-x-auto rounded-2xl border border-app-soft lg:block">
        <table className="min-w-full border-collapse">
          <thead className="bg-app-table-head">
            <tr className="text-left text-sm text-app-muted">
              <th className="px-4 py-3 font-semibold">{labels.service}</th>
              {activeEquipment.map((item) => (
                <th
                  key={item.id}
                  className="px-4 py-3 text-center font-semibold"
                >
                  {item.name}
                </th>
              ))}
            </tr>
          </thead>

          <tbody className="bg-app-card">
            {activeServices.map((service) => {
              const item = items.find((row) => row.service_id === service.id);

              return (
                <tr
                  key={service.id}
                  className="border-t border-app-soft text-sm transition hover:bg-app-card-alt"
                >
                  <td className="px-4 py-4 font-medium text-app-text">
                    {service.name}
                  </td>

                  {activeEquipment.map((equip) => {
                    const checked =
                      item?.equipment_ids.includes(equip.id) ?? false;

                    return (
                      <td key={equip.id} className="px-4 py-4 text-center">
                        <input
                          type="checkbox"
                          checked={checked}
                          onChange={() => toggleEquipment(service.id, equip.id)}
                          className="h-4 w-4 accent-[var(--color-app-accent)]"
                        />
                      </td>
                    );
                  })}
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      <div className="space-y-4 lg:hidden">
        {activeServices.map((service) => {
          const item = items.find((row) => row.service_id === service.id);

          return (
            <div
              key={service.id}
              className="rounded-2xl border border-app-soft bg-app-card-alt p-4"
            >
              <div className="font-medium text-app-text">{service.name}</div>

              <div className="mt-3 grid gap-2">
                {activeEquipment.map((equip) => {
                  const checked =
                    item?.equipment_ids.includes(equip.id) ?? false;

                  return (
                    <label
                      key={equip.id}
                      className="flex items-center justify-between rounded-xl border border-app-soft bg-white px-3 py-2 transition hover:bg-app-bg"
                    >
                      <span className="text-sm text-app-text">
                        {equip.name}
                      </span>
                      <input
                        type="checkbox"
                        checked={checked}
                        onChange={() => toggleEquipment(service.id, equip.id)}
                        className="h-4 w-4 accent-[var(--color-app-accent)]"
                      />
                    </label>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
