import { api } from "./http";
import { toAddress } from "./mappers";
import type { AddressDto } from "./dto";
import type { Address, AddressInput } from "../bin/types/addressType";

const toBody = (input: Partial<AddressInput>): Record<string, unknown> => {
  const body: Record<string, unknown> = {};
  if (input.label !== undefined) body.label = input.label;
  if (input.fullName !== undefined) body.fullName = input.fullName;
  if (input.phone !== undefined) body.phone = input.phone;
  if (input.email !== undefined) body.email = input.email;
  if (input.address !== undefined) body.address = input.address;
  if (input.city !== undefined) body.city = input.city;
  if (input.region !== undefined) body.region = input.region;
  if (input.notes !== undefined && input.notes !== "") body.notes = input.notes;
  if (input.isDefault !== undefined) body.isDefault = input.isDefault;
  return body;
};

export const addressesApi = {
  async list(signal?: AbortSignal): Promise<Address[]> {
    const data = await api.get<{ addresses: AddressDto[] }>("/addresses", { signal });
    return (data?.addresses ?? []).map(toAddress);
  },

  async create(input: AddressInput): Promise<Address> {
    const data = await api.post<{ address: AddressDto }>("/addresses", toBody(input));
    return toAddress(data.address);
  },

  async update(id: string, input: Partial<AddressInput>): Promise<Address> {
    const data = await api.patch<{ address: AddressDto }>(
      `/addresses/${encodeURIComponent(id)}`,
      toBody(input)
    );
    return toAddress(data.address);
  },

  remove(id: string): Promise<void> {
    return api.delete<void>(`/addresses/${encodeURIComponent(id)}`);
  },

  async setDefault(id: string): Promise<Address> {
    const data = await api.post<{ address: AddressDto }>(
      `/addresses/${encodeURIComponent(id)}/default`
    );
    return toAddress(data.address);
  },
};
