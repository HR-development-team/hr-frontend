"use client";

import { ReactNode } from "react";
import { Button } from "primereact/button";
import InputTextComponent from "./InputTextComponent";

interface TableToolbarProps {
  filterContent?: ReactNode;
  searchPlaceholder?: string;
  searchValue?: string;
  onSearchChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onAdd?: () => void;
  addLabel?: string;
}

export default function TableToolbar({
  filterContent,
  searchPlaceholder = "Cari...",
  searchValue,
  onSearchChange,
  onAdd,
  addLabel = "Tambah",
}: TableToolbarProps) {
  return (
    <>
      <style jsx global>{`
        .custom-toolbar-breakpoint {
          display: flex;
          flex-direction: column; /* Default: Stacked (Mobile to 1399px) */
          gap: 1.5rem; /* gap-4 */
          margin-bottom: 1.5rem; /* mb-4 */
        }

        /* ONLY at 1400px and up, switch to Row */
        @media screen and (min-width: 1400px) {
          .custom-toolbar-breakpoint {
            flex-direction: row;
            justify-content: space-between;
            align-items: flex-end;
          }
        }
      `}</style>

      <div className="custom-toolbar-breakpoint">
        {/* Left Side */}
        <div className="">{filterContent}</div>

        {/* Right Side */}
        <div className="flex flex-row align-items-center gap-3 w-full md:w-auto flex-grow-1 md:flex-grow-0">
          {onSearchChange && (
            <div className="flex-grow-1 md:flex-grow-0 w-full md:w-20rem">
              <InputTextComponent
                icon="pi pi-search"
                placeholder={searchPlaceholder}
                className="w-full px-5"
                value={searchValue}
                onChange={onSearchChange}
              />
            </div>
          )}

          {onAdd && (
            <Button
              icon="pi pi-plus"
              label={addLabel}
              severity="info"
              className="flex-shrink-0"
              pt={{ icon: { className: "mr-2" } }}
              onClick={onAdd}
            />
          )}
        </div>
      </div>
    </>
  );
}
