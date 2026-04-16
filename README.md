# Orlando Food Picker

This React + TypeScript app turns a curated Orlando restaurant list into a more polished decision tool. You can search and filter the shortlist, pick a random spot, save favorites, and keep recent picks around for the next round.

## Features

- Product-style responsive UI with a custom theme and stronger mobile hierarchy
- Random restaurant selection with cuisine filters and URL-persisted search state
- Google Places enrichment for address, phone, website, rating, hours, photos, and travel time
- Saved favorites and recent-pick history stored locally
- Optional Supabase sync for favorites and pick history
- Graceful fallback when Google Maps or geolocation are unavailable

## Tech

- React 18, TypeScript
- MUI (Material UI)
- @vis.gl/react-google-maps (single Google Maps wrapper)
- Optional Supabase REST sync through `fetch`

## Data source

- Restaurants are now sourced from a typed module at `src/data/restaurants.ts` (type `RestaurantList`). The legacy `public/restaurants.json` is no longer used and remains an empty `[]` only for backward compatibility.

## Getting Started

1. Install dependencies
   - npm install
2. Configure environment variables (create `.env`)
   - REACT_APP_GOOGLE_MAPS_API_KEY=your_api_key_here
   - REACT_APP_GOOGLE_MAP_ID=your_map_id_here (optional but recommended for styled maps)
   - REACT_APP_SUPABASE_URL=your_supabase_project_url_here (optional)
   - REACT_APP_SUPABASE_ANON_KEY=your_supabase_anon_key_here (optional)
3. Run the app
   - npm start
4. Build
   - npm run build

## Supabase schema

If you want cloud sync for saved restaurants and pick history, create the following tables in Supabase and allow the app's anon key to insert/select rows through your preferred RLS policy.

```sql
create table if not exists favorite_restaurants (
  id uuid primary key default gen_random_uuid(),
  restaurant_name text not null unique,
  restaurant_type text not null,
  address text,
  website text,
  rating numeric,
  price_level integer,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

create table if not exists picker_events (
  id uuid primary key default gen_random_uuid(),
  event_id text not null unique,
  restaurant_name text not null,
  restaurant_type text not null,
  picked_at timestamptz not null,
  rating numeric,
  price_level integer,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

create index if not exists picker_events_picked_at_idx
  on picker_events (picked_at desc);
```

## Deployment

- Vercel is the recommended path for preview deploys
- Add the same `REACT_APP_*` variables in Vercel Project Settings before deploying if you want live maps or Supabase sync in preview
- GitHub Pages still works for the static build if you prefer the existing `gh-pages` flow

## Development Notes

- The restaurant list still ships from `src/data/restaurants.ts`, which keeps the app fast and type-safe.
- React state is split into focused hooks for filters, picker behavior, persistence, and geolocation.
- Components: `FiltersPanel`, `RestaurantDetails`, `RestaurantMap`, `PhotoModal`, `ActivityPanel`.

## Contributing

PRs are welcome.

## License

MIT
