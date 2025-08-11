export interface Restaurant {
  name: string;
  type: string;
  lat?: number;
  lng?: number;
  placeId?: string;
  address?: string;
  phoneNumber?: string;
  website?: string;
  rating?: number;
  priceLevel?: number;
  openingHours?: string[];
  photos?: string[];
  editorialSummary?: string;
  businessStatus?: string;
  isOpen?: boolean;
}

export type RestaurantList = Restaurant[];
