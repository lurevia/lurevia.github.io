import { Input } from "../ui/Input";
import { Select } from "../ui/Select";
import {
  PROVINCE_LABELS,
  REGION_LABELS,
  REGIONS_BY_PROVINCE,
  type ProvinceCode,
  type RegionCode,
} from "../../bin/config/geography";

type GeographicAddressFieldsProps = {
  province: ProvinceCode;
  region: RegionCode;
  city: string;
  neighborhood?: string;
  errors?: Partial<Record<"province" | "region" | "city" | "neighborhood", string>>;
  onProvinceChange: (province: ProvinceCode) => void;
  onRegionChange: (region: RegionCode) => void;
  onCityChange: (city: string) => void;
  onNeighborhoodChange: (neighborhood: string) => void;
};

export const GeographicAddressFields = ({
  province,
  region,
  city,
  neighborhood = "",
  errors = {},
  onProvinceChange,
  onRegionChange,
  onCityChange,
  onNeighborhoodChange,
}: GeographicAddressFieldsProps) => (
  <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
    <Select
      label="Province"
      value={province}
      error={errors.province}
      onChange={(event) => onProvinceChange(event.target.value as ProvinceCode)}
    >
      {Object.entries(PROVINCE_LABELS).map(([code, label]) => (
        <option key={code} value={code}>{label}</option>
      ))}
    </Select>
    <Select
      label="Région"
      value={region}
      error={errors.region}
      onChange={(event) => onRegionChange(event.target.value as RegionCode)}
    >
      {REGIONS_BY_PROVINCE[province].map((code) => (
        <option key={code} value={code}>{REGION_LABELS[code]}</option>
      ))}
    </Select>
    <Input
      label="Ville / commune"
      value={city}
      error={errors.city}
      onChange={(event) => onCityChange(event.target.value)}
      placeholder="Antananarivo"
      autoComplete="address-level2"
    />
    <Input
      label="Quartier / fokontany"
      value={neighborhood}
      error={errors.neighborhood}
      onChange={(event) => onNeighborhoodChange(event.target.value)}
      placeholder="Ankadifotsy"
      autoComplete="address-level3"
    />
  </div>
);