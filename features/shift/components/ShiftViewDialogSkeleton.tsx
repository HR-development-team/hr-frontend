import { Skeleton } from "primereact/skeleton";

export default function ShiftViewDialogSkeleton() {
  return (
    <div className="flex flex-column">
      {/* --- 1. Header Section Skeleton --- */}
      <div className="bg-blue-50 p-5">
        <div className="flex flex-column gap-3">
          <div className="flex justify-content-between align-items-start">
            <div className="flex align-items-center gap-3 w-full">
              {/* Icon Container */}
              <Skeleton size="4rem" className="border-round-xl flex-shrink-0" />

              <div className="flex flex-column gap-2 w-full">
                {/* Badge (Shift Type) */}
                <Skeleton width="6rem" height="1.5rem" borderRadius="4px" />
                {/* Title */}
                <Skeleton width="50%" height="2rem" />
              </div>
            </div>
          </div>

          {/* Office Location Chip */}
          <Skeleton width="10rem" height="2.5rem" borderRadius="8px" />
        </div>
      </div>

      <div className="p-4 flex flex-column gap-5">
        {/* --- 2. Time Card Skeleton (The "Hero") --- */}
        <div>
          {/* Section Header */}
          <div className="bg-gray-50 px-3 py-2 border-round-top-xl border-1 border-bottom-none border-gray-200 flex align-items-center gap-2">
            <Skeleton size="1rem" shape="circle" />
            <Skeleton width="8rem" height="0.8rem" />
          </div>

          <div className="border-1 border-gray-200 border-round-bottom-xl p-4 flex align-items-center justify-content-between">
            {/* Start Time */}
            <div className="flex flex-column align-items-center gap-2">
              <Skeleton width="4rem" height="1rem" />
              <Skeleton width="5rem" height="2.5rem" />
            </div>

            {/* Visual Connector / Arrow */}
            <div className="flex-1 px-4 flex align-items-center justify-content-center">
              <Skeleton width="100%" height="4px" borderRadius="2px" />
            </div>

            {/* End Time */}
            <div className="flex flex-column align-items-center gap-2">
              <Skeleton width="4rem" height="1rem" />
              <Skeleton width="5rem" height="2.5rem" />
            </div>
          </div>
        </div>

        {/* --- 3. Work Days Visualizer Skeleton --- */}
        <div>
          <div className="flex align-items-center gap-2 mb-2">
            <Skeleton size="1rem" />
            <Skeleton width="8rem" height="1rem" />
          </div>
          {/* The Strip */}
          <div className="flex justify-content-between align-items-center bg-gray-50 p-3 border-round-xl border-1 border-gray-200">
            {[1, 2, 3, 4, 5, 6, 7].map((i) => (
              <div
                key={i}
                className="flex flex-column align-items-center gap-2"
              >
                <Skeleton shape="circle" size="2rem" />
                <Skeleton
                  width="2rem"
                  height="0.6rem"
                  className="hidden sm:block"
                />
              </div>
            ))}
          </div>
        </div>

        {/* --- 4. Rules & Limits Grid Skeleton --- */}
        <div>
          <div className="flex align-items-center gap-2 mb-3">
            <Skeleton size="1rem" />
            <Skeleton width="10rem" height="1rem" />
          </div>

          <div className="grid">
            {[1, 2, 3].map((i) => (
              <div key={i} className="col-12 md:col-4">
                <div className="h-full p-3 border-1 border-gray-200 border-round-xl flex flex-column gap-3 bg-white">
                  <div className="flex justify-content-between">
                    <Skeleton width="5rem" height="0.8rem" />
                    <Skeleton size="1rem" shape="circle" />
                  </div>
                  <div>
                    <Skeleton width="3rem" height="2rem" className="mb-1" />
                    <Skeleton width="2rem" height="0.8rem" />
                  </div>
                  <Skeleton width="80%" height="0.6rem" />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* --- 5. Footer Metadata Skeleton --- */}
        <div className="flex flex-column sm:flex-row justify-content-between gap-2 pt-4 mt-2 border-top-1 border-gray-100">
          <Skeleton width="8rem" height="1rem" />
          <Skeleton width="8rem" height="1rem" />
        </div>
      </div>
    </div>
  );
}
