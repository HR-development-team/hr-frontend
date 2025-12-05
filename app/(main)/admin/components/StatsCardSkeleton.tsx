import { Card } from "primereact/card";
import { Skeleton } from "primereact/skeleton";
import { ReactNode } from "react";

interface StatsCardSkeletonProps {
  borderRightClassName: string;
}

export default function StatsCardSkeleton({
  borderRightClassName,
}: StatsCardSkeletonProps) {
  return (
    <Card
      pt={{
        root: {
          className: `min-h-full shadow-2 hover:shadow-6 hover:-translate-y-1 transition-duration-300 border-left-3 ${borderRightClassName}`,
        },
      }}
    >
      <div className="flex flex-column gap-4">
        <div>
          <Skeleton className="w-4rem h-4rem" />
        </div>
        <div className="flex flex-column gap-2">
          <Skeleton className="w-full" />

          <Skeleton className="w-8rem" />
        </div>
      </div>

      {/* {showProgress && (
        <ProgressBar
          value={progressValue}
          displayValueTemplate={progressTemplate}
          color={progressColor || "#10b981"}
          style={{ height: "1.2rem" }}
        />
      )} */}
    </Card>
  );
}
