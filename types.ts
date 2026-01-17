
export interface MenuItem {
  name: string;
  description?: string;
  price: string;
  variants?: { label: string; price: string }[];
  extras?: { label: string; price: string }[];
  note?: string;
  /** Admin-only reference code */
  code?: string;
  /** Toggle for delivery availability. Defaults to true if undefined. */
  availableForDelivery?: boolean;
  /** Keys for smart modifiers (e.g. "Temperature", "Egg Style") defined in global state */
  modifiers?: string[];
}

export interface SubSection {
  title?: string;
  description?: string;
  items: MenuItem[];
}

export interface MenuSection {
  id: string;
  title: string;
  subtitle?: string;
  note?: string;
  content: SubSection[];
}
