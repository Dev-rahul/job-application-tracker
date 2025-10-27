import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const JOB_STATUSES = ["Applied", "Interview", "Rejected", "Offer"] as const;

interface StatusDropdownProps {
  currentStatus: string;
  onStatusChange: (status: string) => void;
}

export function StatusDropdown({
  currentStatus,
  onStatusChange,
}: StatusDropdownProps) {
  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'applied':
        return 'text-blue-600';
      case 'interview':
        return 'text-amber-600';
      case 'offer':
        return 'text-green-600';
      case 'rejected':
        return 'text-red-600';
      default:
        return 'text-gray-600';
    }
  };

  return (
    <Select value={currentStatus} onValueChange={onStatusChange}>
      <SelectTrigger className="w-[130px] h-8 px-3 text-sm font-medium">
        <SelectValue className={getStatusColor(currentStatus)}>
          {currentStatus}
        </SelectValue>
      </SelectTrigger>
      <SelectContent>
        {JOB_STATUSES.map((status) => (
          <SelectItem 
            key={status} 
            value={status}
            className={`${getStatusColor(status)} cursor-pointer`}
          >
            {status}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}