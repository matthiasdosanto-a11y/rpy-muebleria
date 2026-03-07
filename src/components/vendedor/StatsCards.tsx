import { DivideIcon as LucideIcon } from "lucide-react";

interface StatCardProps {
    title: string;
    value: string | number;
    subtitle: string;
    icon: typeof LucideIcon;
    trend?: "up" | "down" | "neutral";
}

export const StatsCards = ({ stats }: { stats: StatCardProps[] }) => {
    return (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {stats.map((stat, index) => (
                <div key={index} className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 flex items-center gap-4">
                    <div className="p-3 bg-primary/10 text-primary rounded-lg">
                        <stat.icon size={24} />
                    </div>
                    <div>
                        <p className="text-sm font-medium text-gray-500">{stat.title}</p>
                        <h3 className="text-2xl font-bold text-gray-900 mt-1">{stat.value}</h3>
                        <p className="text-xs text-gray-400 mt-1">{stat.subtitle}</p>
                    </div>
                </div>
            ))}
        </div>
    );
};
