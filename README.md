# Orlando Random Restaurant Picker

This React application helps users discover new restaurants in Orlando by randomly selecting a restaurant based on user preferences.

## Features

- Random restaurant selection from a curated list of Orlando eateries
- Filter restaurants by food type
- Display restaurant information, including name, type, and distance from user
- Show restaurant location on Google Maps
- Responsive design for both desktop and mobile use

## Technologies Used

- React
- TypeScript
- Material-UI (MUI) for styling
- Google Maps API for location services and mapping

## Getting Started

1. Clone the repository
2. Install dependencies with `npm install`
3. Create a `.env` file in the root directory and add your Google Maps API key:
   ```
   REACT_APP_GOOGLE_MAPS_API_KEY=your_api_key_here
   ```
4. For local development:
   - Run the app in development mode with `npm start`
   - Open [http://localhost:3000](http://localhost:3000) to view it in the browser
5. For deployment:
   - Update the "homepage" field in `package.json` with your GitHub Pages URL
   - Run `npm run deploy` to deploy to GitHub Pages

## Available Scripts

- `npm start`: Runs the app in development mode
- `npm test`: Launches the test runner
- `npm run build`: Builds the app for production

## Deployment

This app is deployed using GitHub Pages. To deploy your own version:

1. Ensure you have the `gh-pages` package installed (it's already in the devDependencies).
2. In the `package.json` file, make sure the "homepage" field is set to your GitHub Pages URL.
3. Run `npm run deploy` to build and deploy the app to GitHub Pages.

## Live Demo

The live version of this app is hosted at [https://xavionbarrs.com/food-picker](https://xavionbarrs.com/food-picker).

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is open source and available under the [MIT License](LICENSE).
