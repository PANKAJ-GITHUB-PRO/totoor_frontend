import { useEffect, useState } from "react";
import { Field } from "@/components/ui-kit/Field";
import { api } from "@/lib/api";
import { SearchableSelect } from "./SearchableSelect";

export interface LocationValue {
  state: string;
  district: string;
  city: string;
  pincode: string;
}

interface Props {
  value: LocationValue;
  onChange: (value: LocationValue) => void;
}

export function LocationFields({ value, onChange }: Props) {
  const [states, setStates] = useState<string[]>([]);
  const [cities, setCities] = useState<string[]>([]);
  const [pincodes, setPincodes] = useState<string[]>([]);
  const [loadingCities, setLoadingCities] = useState(false);
  const [loadingPincodes, setLoadingPincodes] = useState(false);

  useEffect(() => {
    api.locationStates().then(setStates).catch(() => setStates([]));
  }, []);

  useEffect(() => {
    if (!value.state) {
      setCities([]);
      return;
    }
    setLoadingCities(true);
    api.locationCities(value.state).then(setCities).catch(() => setCities([])).finally(() => setLoadingCities(false));
  }, [value.state]);

  useEffect(() => {
    if (!value.state || !value.city) {
      setPincodes([]);
      return;
    }
    setLoadingPincodes(true);
    api.locationPincodes(value.state, value.city).then(setPincodes).catch(() => setPincodes([])).finally(() => setLoadingPincodes(false));
  }, [value.state, value.city]);

  return (
    <>
      <Field label="State" hint={states.length ? `${states.length} states and union territories loaded.` : "Loading states..."}>
        <SearchableSelect
          value={value.state}
          options={states}
          placeholder="Search state"
          onChange={(state) => onChange({ state, district: "", city: "", pincode: "" })}
        />
      </Field>
      <Field label="District / City" hint={loadingCities ? "Loading districts..." : value.state && cities.length ? `${cities.length} districts loaded.` : undefined}>
        <SearchableSelect
          value={value.city}
          options={cities}
          placeholder={value.state ? "Search district or city" : "Select state first"}
          disabled={!value.state}
          onChange={(city) => onChange({ ...value, city, district: city, pincode: "" })}
        />
      </Field>
      <Field label="Pincode" hint={loadingPincodes ? "Loading pincodes..." : pincodes.length ? `${pincodes.length} pincodes loaded.` : "Search or type pincode if your area is missing."}>
        <SearchableSelect
          value={value.pincode}
          options={pincodes}
          placeholder={value.city ? "Search pincode" : "Select city first"}
          disabled={!value.city}
          onChange={(pincode) => onChange({ ...value, pincode })}
        />
      </Field>
    </>
  );
}
