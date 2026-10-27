// Frontend/lib/data/trips.ts
import { apiFetch } from "@/lib/api";
import { FlightOffer, TripInput } from "@/lib/api-types";

export type TripResponse = {
  tripId: string;
  offers: FlightOffer[];
};

export type TripDetails = {
  trip: TripInput;
  offers: FlightOffer[];
  savings?: any;
  aiPlan?: any;
};

export async function createTrip(input: TripInput): Promise<TripResponse> {
  return apiFetch<TripResponse>("/api/trips", {
    method: "POST",
    body: JSON.stringify(input),
  });
}

export async function getTrip(tripId: string): Promise<TripDetails> {
  return apiFetch<TripDetails>(`/api/trips/${tripId}`);
}

