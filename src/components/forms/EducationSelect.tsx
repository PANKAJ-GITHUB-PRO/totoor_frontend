import { Field } from "@/components/ui-kit/Field";
import { EDUCATION_OPTIONS } from "@/lib/education";
import { SearchableSelect } from "./SearchableSelect";

interface Props {
  label?: string;
  value: string;
  onChange: (value: string) => void;
}

export function EducationSelect({ label = "Current grade / course", value, onChange }: Props) {
  return (
    <Field label={label} hint="Search or type your own education/course.">
      <SearchableSelect
        value={value}
        options={EDUCATION_OPTIONS}
        placeholder="Search education or add custom"
        onChange={onChange}
      />
    </Field>
  );
}
