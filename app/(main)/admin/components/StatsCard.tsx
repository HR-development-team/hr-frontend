import { Card } from "primereact/card";
import { ReactNode } from "react";

interface StatsCardProps {
  title: string;
  value: number | null;
  description: string;
  icon: ReactNode;
  isLoading: boolean;
}

export default function StatsCard({
  title,
  value,
  description,
  icon,
  isLoading,
}: StatsCardProps) {
  return (
    <Card
      pt={{
        root: {
          className: "min-h-full",
        },
      }}
    >
      <div className="flex align-items-center justify-content-between mb-4">
        <div className="p-3 bg-blue-50 border-round-lg">
          <span>{icon}</span>
        </div>
      </div>
      <h3 className="text-lg font-semibold text-gray-700 mb-2">{title}</h3>
      {isLoading ? (
        <i className="pi pi-spin pi-spinner text-800 text-xl"></i>
      ) : (
        <p className="text-2xl font-bold text-gray-900 mb-1">{value}</p>
      )}
      <p className="text-sm text-gray-500">{description}</p>
    </Card>
  );
}
