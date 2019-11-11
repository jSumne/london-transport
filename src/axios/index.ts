import axios from "axios";
import { setupCache } from "axios-cache-adapter";

// set cache to last for 15 minutes
const cache = setupCache({
  maxAge: 15 * 60 * 1000,
  exclude: { query: false }
});

export const lineApi = axios.create({
  baseURL: "https://api.tfl.gov.uk/Line/"
});

export const bikePointApi = axios.create({
  adapter: cache.adapter,
  baseURL: "https://api.tfl.gov.uk/BikePoint/"
});
