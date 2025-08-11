# Orlando Random Restaurant Picker

This React + TypeScript app randomly picks an Orlando restaurant from a curated, typed list and enriches details with the Google Places API.

## Features

- Random restaurant selection with category filters
- Google Places enrichment (address, phone, website, rating, hours, photos)
- Distance and ETA from current location
- Map preview with Google Maps
- Responsive UI (MUI)

## Tech

- React 18, TypeScript
- MUI (Material UI)
- @vis.gl/react-google-maps (single Google Maps wrapper)

## Data source

- Restaurants are now sourced from a typed module at `src/data/restaurants.ts` (type `RestaurantList`). The legacy `public/restaurants.json` is no longer used and remains an empty `[]` only for backward compatibility.

## Getting Started

1. Install dependencies
   - npm install
2. Configure environment variables (create `.env`)
   - REACT_APP_GOOGLE_MAPS_API_KEY=your_api_key_here
   - REACT_APP_GOOGLE_MAP_ID=your_map_id_here (optional but recommended for styled maps)
3. Run the app
   - npm start
4. Build
   - npm run build

## Deployment

- GitHub Pages via `gh-pages`
  - Ensure `homepage` in `package.json` is set
  - npm run deploy

## Development Notes

- Single maps library: `@vis.gl/react-google-maps` handles script loading and the Places library via `useMapsLibrary('places')`.
- The app no longer fetches restaurant data at runtime; it imports the list from `src/data/restaurants.ts`, enabling type-safety and removing a network request.
- Components: `FiltersPanel`, `RestaurantDetails`, `RestaurantMap`, `PhotoModal`.

## Contributing

PRs are welcome.

## License

MIT
