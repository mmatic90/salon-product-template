import type { SalonSettings } from "@/features/salon-settings/queries";

function fallback(value: string | null | undefined, defaultValue: string) {
  return value?.trim() || defaultValue;
}

export default function ThemeStyle({
  settings,
}: {
  settings: SalonSettings | null;
}) {
  const css = `
    :root {
      --color-app-bg: ${fallback(settings?.background_color, "#F3EEEA")};
      --color-app-text: ${fallback(settings?.text_color, "#2B2A28")};
      --color-app-soft: ${fallback(settings?.border_color, "#B0A695")};
      --color-app-accent: ${fallback(settings?.accent_color, "#776B5D")};
      --color-app-card: ${fallback(settings?.card_color, "#EBE3D5")};
      --color-app-card-alt: ${fallback(settings?.card_alt_color, "#F7F2EC")};
      --color-app-border: ${fallback(settings?.border_color, "#B0A695")};
      --color-app-muted: ${fallback(settings?.muted_color, "#5A5753")};
      --color-app-dark: ${fallback(settings?.primary_color, "#4B4844")};
      --color-app-dark-2: ${fallback(settings?.secondary_color, "#5A5753")};
      --color-app-table-head: ${fallback(settings?.secondary_color, "#E7DED0")};
    }
  `;

  return <style dangerouslySetInnerHTML={{ __html: css }} />;
}
