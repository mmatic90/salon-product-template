export function formatTime(value: string) {
  return value.slice(0, 5);
}

export function getLocaleFromLanguage(language: string | null | undefined) {
  if (language === "en") return "en-US";
  if (language === "it") return "it-IT";
  return "hr-HR";
}

export function formatDateLabel(value: string, locale = "hr-HR") {
  const date = new Date(`${value}T00:00:00`);

  return new Intl.DateTimeFormat(locale, {
    weekday: "long",
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  }).format(date);
}

export function getTodayLocalDate() {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, "0");
  const day = String(now.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
}

export function statusLabel(
  status: string,
  language: string | null | undefined = "hr",
) {
  const labels = {
    hr: {
      scheduled: "Zakazan",
      completed: "Odrađen",
      cancelled: "Otkazan",
      no_show: "Nije došao",
    },
    en: {
      scheduled: "Scheduled",
      completed: "Completed",
      cancelled: "Cancelled",
      no_show: "No-show",
    },
    it: {
      scheduled: "Prenotato",
      completed: "Completato",
      cancelled: "Annullato",
      no_show: "Non presentato",
    },
  };

  const lang =
    language === "en" || language === "it" || language === "hr"
      ? language
      : "hr";

  return labels[lang][status as keyof typeof labels.hr] ?? status;
}
