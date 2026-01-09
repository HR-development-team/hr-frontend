"use client";

import { ReactNode } from "react";
import { Button } from "primereact/button";
import { SplitButton } from "primereact/splitbutton";
import { MenuItem } from "primereact/menuitem";
import InputTextComponent from "./InputTextComponent";

interface TableToolbarProps {
  filterContent?: ReactNode;
  actionContent?: ReactNode;
  searchPlaceholder?: string;
  searchValue?: string;
  onSearchChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onAdd?: () => void;
  addLabel?: string;
  addMenuItems?: MenuItem[];
}

export default function TableToolbar({
  filterContent,
  actionContent,
  searchPlaceholder = "Cari...",
  searchValue,
  onSearchChange,
  onAdd,
  addLabel = "Tambah",
  addMenuItems,
}: TableToolbarProps) {
  return (
    <div className="flex flex-column lg:flex-row align-items-start lg:align-items-center gap-3 mb-4">
      {/* Filter Section */}
      {filterContent && (
        <div className="w-full lg:mr-3 flex-1">{filterContent}</div>
      )}
      <div className="flex flex-column sm:flex-row align-items-stretch sm:align-items-center gap-3 w-full lg:w-auto lg:ml-auto">
        {/* Search Input */}
        {onSearchChange && (
          <div className="w-full">
            <InputTextComponent
              icon={<i className="pi pi-search" />}
              placeholder={searchPlaceholder}
              className="w-full"
              value={searchValue}
              onChange={onSearchChange}
            />
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex flex-column sm:flex-row gap-2 w-full sm:w-auto">
          {onAdd &&
            (addMenuItems ? (
              <SplitButton
                label={addLabel}
                icon="pi pi-plus"
                model={addMenuItems}
                onClick={onAdd}
                severity="info"
                className="w-full sm:w-auto"
                buttonClassName="gap-1"
                pt={{
                  menu: {
                    icon: { className: "mr-2" },
                  },
                }}
              />
            ) : (
              <Button
                icon="pi pi-plus"
                label={addLabel}
                severity="info"
                className="w-full sm:w-auto"
                pt={{ icon: { className: "mr-2" } }}
                onClick={onAdd}
              />
            ))}

          {actionContent && <div className="w-full">{actionContent}</div>}
        </div>
      </div>
    </div>
  );
}
