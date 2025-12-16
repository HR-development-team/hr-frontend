"use client";

import { ReactNode } from "react";
import { Skeleton } from "primereact/skeleton";
import { ProgressBar } from "primereact/progressbar";
import { classNames } from "primereact/utils";

interface StatsCardProps {
  title: string;
  value: number | string;
  description: string;
  icon: ReactNode;
  isLoading: boolean;

  // Styling props
  iconClassName?: string;
  borderRightClassName?: string; // Note: In usage this contained "border-left-3", which adds a left accent

  // Progress Bar props
  showProgress?: boolean;
  progressValue?: number;
  progressTemplate?: () => ReactNode;
}

export default function StatsCard({
  title,
  value,
  description,
  icon,
  isLoading,
  iconClassName,
  borderRightClassName,
  showProgress = false,
  progressValue = 0,
  progressTemplate,
}: StatsCardProps) {
  // 1. Loading State (Skeleton)
  if (isLoading) {
    return (
      <div className="surface-card shadow-2 p-3 border-round border-left-3 border-gray-200 h-full">
        <div className="flex justify-content-between mb-3">
          <div>
            <Skeleton width="5rem" className="mb-2" />
            <Skeleton width="3rem" height="1.5rem" />
          </div>
          <Skeleton size="2.5rem" className="border-round" />
        </div>
        <Skeleton width="8rem" className="mb-1" />
      </div>
    );
  }

  // 2. Data State
  return (
    <div
      className={classNames(
        "surface-card shadow-2 p-3 border-round h-full flex flex-column justify-content-between",
        borderRightClassName // Applies the colored border accent (e.g., border-left-3 border-blue-500)
      )}
    >
      <div>
        {/* Header: Title & Icon */}
        <div className="flex justify-content-between align-items-start mb-3">
          <div>
            <span className="block text-500 font-medium mb-2 uppercase text-xs">
              {title}
            </span>
            <div className="text-900 font-bold text-2xl">{value}</div>
          </div>
          <div
            className={classNames(
              "flex align-items-center justify-content-center border-round",
              iconClassName
            )}
            style={{ width: "2.5rem", height: "2.5rem" }}
          >
            {icon}
          </div>
        </div>

        {/* Content: Description or Progress Bar */}
        {showProgress ? (
          <div className="mt-2">
            <ProgressBar
              value={progressValue}
              showValue={false}
              style={{ height: "6px" }}
              className="mt-2 mb-2"
              color={progressValue === 100 ? "#22C55E" : "#3B82F6"}
            />
            {progressTemplate && (
              <div className="text-xs text-500 flex gap-1">
                {progressTemplate()}
                <span>{description}</span>
              </div>
            )}
          </div>
        ) : (
          <span className="text-500 text-sm">{description}</span>
        )}
      </div>
    </div>
  );
}
