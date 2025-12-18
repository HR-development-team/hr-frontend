"use client";

import { ReactNode } from "react";
import { Button } from "primereact/button";
import InputTextComponent from "./InputTextComponent";

interface TableToolbarProps {
  filterContent?: ReactNode;
  actionContent?: ReactNode;
  searchPlaceholder?: string;
  searchValue?: string;
  onSearchChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onAdd?: () => void;
  addLabel?: string;
}

export default function TableToolbar({
  filterContent,
  actionContent,
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
          flex-direction: column; /* Default: Stack vertically (Mobile) */
          gap: 1rem;
          margin-bottom: 1.5rem;
        }

        /* Large Screen (Desktop): Switch to horizontal row */
        @media screen and (min-width: 1200px) {
          .custom-toolbar-breakpoint {
            flex-direction: row;
            justify-content: space-between;
            align-items: flex-end;
          }
        }
      `}</style>

      <div className="custom-toolbar-breakpoint">
        {/* --- Left Side (Date Filter) --- */}
        {/* On mobile: w-full. On Desktop: auto width */}
        <div className="w-full xl:w-auto">{filterContent}</div>

        {/* --- Right Side (Search + Actions) --- */}
        {/* Mobile: flex-column (Stack vertically) & w-full 
           Desktop: flex-row (Side by side) & w-auto
        */}
        <div className="flex flex-column xl:flex-row align-items-stretch xl:align-items-center gap-2 w-full xl:w-auto justify-content-end">
          {/* Search Input */}
          {onSearchChange && (
            <div className="w-full xl:w-10rem">
              <InputTextComponent
                icon="pi pi-search"
                placeholder={searchPlaceholder}
                className="w-full px-5"
                value={searchValue}
                onChange={onSearchChange}
              />
            </div>
          )}

          {/* Action Buttons Container (Add + Filter) */}
          {/* Mobile: Stack them or Grid them. Desktop: Flex row */}
          <div className="flex flex-column sm:flex-row gap-2 w-full xl:w-auto">
            {onAdd && (
              <Button
                icon="pi pi-plus"
                label={addLabel}
                severity="info"
                // Mobile: Full width. Desktop: Auto
                className="w-full sm:w-auto flex-shrink-0"
                pt={{ icon: { className: "mr-2" } }}
                onClick={onAdd}
              />
            )}

            {actionContent && (
              // Wrapper to ensure the button takes full width on mobile if needed
              <div className="w-full sm:w-auto">
                {/* You might need to add className="w-full" to the Button passed in actionContent inside the parent component if it doesn't stretch automatically */}
                {actionContent}
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
