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
          flex-direction: column;
          gap: 1rem;
          margin-bottom: 1.5rem;
        }

        /* CHANGED: Lowered from 1400px to 1200px (Standard Large Screen) */
        /* This ensures it stacks sooner on smaller laptops, preventing overflow */
        @media screen and (min-width: 1200px) {
          .custom-toolbar-breakpoint {
            flex-direction: row;
            justify-content: space-between;
            align-items: flex-end; /* Align bottom to match inputs */
          }
        }
      `}</style>

      <div className="custom-toolbar-breakpoint">
        {/* Left Side (Date Filter) */}
        <div className="w-full xl:w-auto">{filterContent}</div>

        {/* Right Side (Actions) */}
        {/* ADDED: flex-wrap to allow items to flow to next line if space is tight */}
        <div className="flex flex-wrap align-items-center gap-2 w-full xl:w-auto justify-content-end">
          {onSearchChange && (
            <div className="w-full md:w-20rem">
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
              className="flex-shrink-0 w-full md:w-auto"
              pt={{ icon: { className: "mr-2" } }}
              onClick={onAdd}
            />
          )}

          {actionContent && (
            <div className="w-full md:w-auto">{actionContent}</div>
          )}
        </div>
      </div>
    </>
  );
}
