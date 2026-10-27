// Frontend/lib/data/wallet.ts
import { apiFetch } from "@/lib/api";
import { UserCard } from "@/lib/api-types";

export async function getWallet(): Promise<UserCard[]> {
  return apiFetch<UserCard[]>("/api/wallet");
}

export async function saveWalletCard(
  cardId: string,
  data: { pointsBalance: number; monthlySpendMinor: Partial<Record<string, number>> }
): Promise<UserCard> {
  return apiFetch<UserCard>(`/api/wallet/${cardId}`, {
    method: "PUT",
    body: JSON.stringify(data),
  });
}

export async function removeWalletCard(cardId: string): Promise<{ ok: boolean }> {
  return apiFetch<{ ok: boolean }>(`/api/wallet/${cardId}`, {
    method: "DELETE",
  });
}

