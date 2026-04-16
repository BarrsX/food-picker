import type { Restaurant } from "./restaurant";

export interface PickHistoryEntry {
  id: string;
  pickedAt: string;
  restaurant: Restaurant;
}
