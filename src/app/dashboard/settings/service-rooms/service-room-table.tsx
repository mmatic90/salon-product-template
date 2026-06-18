"use client";

import { useMemo, useState, useTransition } from "react";
import { RotateCcw } from "lucide-react";
import { bulkUpdateServiceRoomsAction } from "@/features/settings/actions";
import type { ServiceRoomMappingRow } from "@/features/settings/queries";
import { toast } from "sonner";

type ServiceItem = {
  id: string;
  name: string;
  is_active: boolean;
};

type RoomItem = {
  id: string;
  name: string;
  is_active: boolean;
};

type Props = {
  services: ServiceItem[];
  rooms: RoomItem[];
  mappings: ServiceRoomMappingRow[];
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
  room_ids: string[];
};

export default function ServiceRoomTable({
  services,
  rooms,
  mappings,
  labels,
}: Props) {
  const activeServices = useMemo(
    () => services.filter((service) => service.is_active),
    [services],
  );

  const activeRooms = useMemo(
    () => rooms.filter((room) => room.is_active),
    [rooms],
  );

  const initialItems = useMemo<EditableMapping[]>(
    () =>
      activeServices.map((service) => ({
        service_id: service.id,
        room_ids: mappings
          .filter((mapping) => mapping.service_id === service.id)
          .map((mapping) => mapping.room_id),
      })),
    [activeServices, mappings],
  );

  const [items, setItems] = useState<EditableMapping[]>(initialItems);
  const [pending, startTransition] = useTransition();

  const hasChanges = JSON.stringify(items) !== JSON.stringify(initialItems);

  function toggleRoom(serviceId: string, roomId: string) {
    setItems((prev) =>
      prev.map((item) => {
        if (item.service_id !== serviceId) return item;

        const exists = item.room_ids.includes(roomId);

        return {
          ...item,
          room_ids: exists
            ? item.room_ids.filter((id) => id !== roomId)
            : [...item.room_ids, roomId],
        };
      }),
    );
  }

  function resetChanges() {
    setItems(initialItems);
  }

  function saveChanges() {
    startTransition(async () => {
      const result = await bulkUpdateServiceRoomsAction(items);

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
              {activeRooms.map((room) => (
                <th
                  key={room.id}
                  className="px-4 py-3 text-center font-semibold"
                >
                  {room.name}
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

                  {activeRooms.map((room) => {
                    const checked = item?.room_ids.includes(room.id) ?? false;

                    return (
                      <td key={room.id} className="px-4 py-4 text-center">
                        <input
                          type="checkbox"
                          checked={checked}
                          onChange={() => toggleRoom(service.id, room.id)}
                          className="h-4 w-4"
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
                {activeRooms.map((room) => {
                  const checked = item?.room_ids.includes(room.id) ?? false;

                  return (
                    <label
                      key={room.id}
                      className="flex items-center justify-between rounded-xl border border-app-soft bg-white px-3 py-2"
                    >
                      <span className="text-sm text-app-text">{room.name}</span>
                      <input
                        type="checkbox"
                        checked={checked}
                        onChange={() => toggleRoom(service.id, room.id)}
                        className="h-4 w-4"
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
