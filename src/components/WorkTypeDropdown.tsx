import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface WorkTypeDropdownProps {
  currentType: string;
  onTypeChange: (value: string) => void;
}

export function WorkTypeDropdown({
  currentType,
  onTypeChange,
}: WorkTypeDropdownProps) {
  const workTypes = [
    { value: "onsite", label: "On-site" },
    { value: "hybrid", label: "Hybrid" },
    { value: "remote", label: "Remote" },
  ];

  return (
    <Select value={currentType} onValueChange={onTypeChange}>
      <SelectTrigger>
        <SelectValue placeholder="Select work type" />
      </SelectTrigger>
      <SelectContent>
        {workTypes.map((type) => (
          <SelectItem key={type.value} value={type.value}>
            {type.label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}