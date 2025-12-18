import { Skeleton } from "primereact/skeleton";

export default function PositionViewDialogSkeleton() {
  return (
    <div className="flex flex-column">
      {/* --- 1. Hero / Header Section Skeleton --- */}
      <div className="bg-blue-50 p-4 pt-5 pb-5">
        <div className="flex flex-column md:flex-row gap-4 align-items-center md:align-items-start text-center md:text-left">
          {/* Icon Container */}
          <Skeleton size="5rem" className="border-round-2xl flex-shrink-0" />

          {/* Text Content */}
          <div className="flex-1 w-full flex flex-column align-items-center md:align-items-start gap-2">
            {/* Label Badge */}
            <Skeleton width="8rem" height="1.2rem" borderRadius="6px" />

            {/* Title */}
            <Skeleton width="70%" height="2rem" className="my-1" />

            {/* Code Badge */}
            <Skeleton width="6rem" height="1.5rem" borderRadius="16px" />
          </div>
        </div>
      </div>

      <div className="p-4 flex flex-column gap-5">
        {/* --- 2. Key Details Grid Skeleton --- */}
        <div className="grid">
          {/* Salary Card */}
          <div className="col-12 md:col-6">
            <div className="h-full p-3 border-1 border-gray-200 border-round-xl bg-white flex flex-column gap-3">
              <div className="flex align-items-center gap-2">
                <Skeleton size="2rem" shape="circle" />
                <Skeleton width="5rem" />
              </div>
              <Skeleton width="60%" height="2rem" />
            </div>
          </div>

          {/* Description Card */}
          <div className="col-12 md:col-6">
            <div className="h-full p-3 border-1 border-gray-200 border-round-xl bg-white flex flex-column gap-3">
              <div className="flex align-items-center gap-2">
                <Skeleton size="2rem" shape="circle" />
                <Skeleton width="5rem" />
              </div>
              <div className="flex flex-column gap-2 w-full">
                <Skeleton width="90%" />
                <Skeleton width="70%" />
              </div>
            </div>
          </div>
        </div>

        {/* --- 3. Organization Structure Skeleton --- */}
        <div>
          {/* Section Header */}
          <div className="flex align-items-center gap-2 mb-4">
            <Skeleton width="2rem" height="2rem" />
            <Skeleton width="12rem" height="1.5rem" />
          </div>

          {/* Visual Tree */}
          <div className="flex flex-column gap-4 pl-3 md:pl-0">
            {/* Loop for 4 Levels (Office, Dept, Div, Parent) */}
            {[1, 2, 3, 4].map((i) => (
              <div
                key={i}
                className="flex flex-column md:flex-row align-items-start md:align-items-center gap-3"
              >
                {/* Label (Left side on desktop) */}
                <div className="hidden md:flex justify-content-end w-6 pr-5">
                  <Skeleton width="6rem" height="1rem" />
                </div>
                {/* Mobile Label */}
                <Skeleton
                  width="6rem"
                  height="1rem"
                  className="md:hidden mb-1"
                />

                {/* Content Card (Right side) */}
                <div className="flex-1 w-full md:w-auto p-3 border-1 border-gray-200 border-round-xl flex align-items-center gap-3">
                  <Skeleton size="2rem" className="border-round" />
                  <div className="flex flex-column gap-2 w-full">
                    <Skeleton width="50%" height="1rem" />
                    <Skeleton width="30%" height="0.8rem" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* --- 4. Footer Timestamps --- */}
        <div className="flex flex-column sm:flex-row justify-content-between gap-2 pt-4 mt-2 border-top-1 border-gray-100">
          <Skeleton width="10rem" height="1rem" />
          <Skeleton width="10rem" height="1rem" />
        </div>
      </div>
    </div>
  );
}
