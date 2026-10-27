// Frontend/lib/data/trips.ts
import { apiFetch } from "@/lib/api";
import { AiPlan, FlightOffer, SavingsResult, TripInput } from "@/lib/api-types";

export type TripResponse = {
  tripId: string;
  offers: FlightOffer[];
};

export type TripDetails = {
  trip: TripInput;
  offers: FlightOffer[];
  savings?: SavingsResult;
  aiPlan?: AiPlan;
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

export async function getTripSavings(
  tripId: string,
  offerId?: string
): Promise<SavingsResult> {
  return apiFetch<SavingsResult>(`/api/trips/${tripId}/savings`, {
    method: "POST",
    body: JSON.stringify({ offerId }),
  });
}

export async function getTripPlan(
  tripId: string,
  offerId?: string
): Promise<AiPlan> {
  return apiFetch<AiPlan>(`/api/trips/${tripId}/plan`, {
    method: "POST",
    body: JSON.stringify({ offerId }),
  });
}
