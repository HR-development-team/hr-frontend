import { Card } from "primereact/card";
import { ProgressBar } from "primereact/progressbar";
import { ReactNode } from "react";
import StatsCardSkeleton from "./StatsCardSkeleton";

interface StatsCardProps {
  title: string;
  value: number | null;
  description: string;
  icon: ReactNode;
  isLoading: boolean;
  iconClassName: string;
  borderRightClassName: string;
  showProgress: boolean;
  progressValue?: number;
  progressTemplate?: (value: number | string | undefined) => ReactNode;
  progressColor?: string;
}

export default function StatsCard({
  title,
  value,
  description,
  icon,
  isLoading,
  iconClassName,
  borderRightClassName,
  showProgress,
  progressValue = 0,
  progressTemplate,
  progressColor,
}: StatsCardProps) {
  if (isLoading) {
    return <StatsCardSkeleton borderRightClassName={borderRightClassName} />;
  }

  return (
    <Card
      pt={{
        root: {
          className: `min-h-full shadow-2 hover:shadow-6 hover:-translate-y-1 transition-duration-300 border-left-3 ${borderRightClassName}`,
        },
      }}
    >
      <div className="flex align-items-center justify-content-between mb-4">
        <div className={`p-3 ${iconClassName} border-round-lg`}>
          <span>{icon}</span>
        </div>
      </div>
      <h3 className="text-lg font-semibold text-gray-700 mb-2">{title}</h3>
      <div className="flex align-items-center gap-2">
        <p className="text-2xl font-bold text-900 mb-1">{value || 0}</p>
        <p className="text-sm text-gray-500">{description}</p>
      </div>

      {showProgress && (
        <ProgressBar
          value={progressValue}
          displayValueTemplate={progressTemplate}
          color={progressColor || "#10b981"}
          style={{ height: "1.2rem" }}
        />
      )}
    </Card>
  );
}
