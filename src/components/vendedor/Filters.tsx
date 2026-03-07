import { Filter } from "lucide-react";

interface FiltersProps {
    options: { label: string; value: string }[];
    value: string;
    onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
}

export const Filters = ({ options, value, onChange }: FiltersProps) => {
    return (
        <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Filter className="h-4 w-4 text-gray-400" />
            </div>
            <select
                value={value}
                onChange={onChange}
                className="pl-10 pr-8 py-2 border border-border rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary appearance-none cursor-pointer text-sm font-medium"
            >
                <option value="">Filtros ▼</option>
                {options.map((opt) => (
                    <option key={opt.value} value={opt.value}>
                        {opt.label}
                    </option>
                ))}
            </select>
        </div>
    );
};
