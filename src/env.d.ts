/// <reference types="react-scripts" />

declare namespace NodeJS {
  interface ProcessEnv {
    readonly REACT_APP_GOOGLE_MAPS_API_KEY: string;
    readonly REACT_APP_GOOGLE_MAP_ID: string;
  }
}
