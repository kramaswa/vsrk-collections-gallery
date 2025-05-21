
export const JEWELRY_CATEGORIES = [
  "necklace",
  "bracelet",
  "bangles",
  "earrings",
  "rings",
  "pendants",
  "sets",
  "other",
  "uncategorized"
] as const;

export type JewelryCategory = typeof JEWELRY_CATEGORIES[number];
