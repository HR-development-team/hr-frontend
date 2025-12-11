"use client";

import React from "react";
import { TabView, TabPanel } from "primereact/tabview";
import { Dropdown } from "primereact/dropdown";
import { FileUpload, FileUploadSelectEvent } from "primereact/fileupload";
// IMPORT DIPERBARUI
import { UserProfile, OfficeInfo } from "@/lib/types/profil";
import TabBasicInfo from "./TabBasicInfo";
import TabJobInfo from "./TabJobInfo";
import TabPersonalInfo from "./TabPersonalInfo";
import TabFinancialInfo from "./TabFinancialInfo";

interface ProfileTabsProps {
  profile: UserProfile;
  officeInfo: OfficeInfo;
  activeIndex: number;
  setActiveIndex: (index: number) => void;
  isEditMode: boolean;
  isSubmitting: boolean;
  handleEdit: () => void;
  handleCancel: () => void;
  handleSave: () => void;
  formData: { contact_phone: string; address: string };
  setFormData: (data: { contact_phone: string; address: string }) => void;
  fileUploadRef: React.RefObject<FileUpload>;
  handleFileSelect: (e: FileUploadSelectEvent) => void;
}

export default function ProfileTabs({
  profile,
  officeInfo,
  activeIndex,
  setActiveIndex,
  isEditMode,
  isSubmitting,
  handleEdit,
  handleCancel,
  handleSave,
  formData,
  setFormData,
  fileUploadRef,
  handleFileSelect,
}: ProfileTabsProps) {
  const tabOptions = [
    { label: "Detail Profil", value: 0, icon: "pi pi-user mr-2" },
    { label: "Informasi Pekerjaan", value: 1, icon: "pi pi-briefcase mr-2" },
    { label: "Data Pribadi", value: 2, icon: "pi pi-shield mr-2" },
    { label: "Data Finansial", value: 3, icon: "pi pi-wallet mr-2" },
  ];

  // Logic rendering berdasarkan Active Index
  const renderTabContent = () => {
    switch (activeIndex) {
      case 0:
        return (
          <TabBasicInfo
            profile={profile}
            isEditMode={isEditMode}
            isSubmitting={isSubmitting}
            handleEdit={handleEdit}
            handleCancel={handleCancel}
            handleSave={handleSave}
            formData={formData}
            setFormData={setFormData}
            fileUploadRef={fileUploadRef}
            handleFileSelect={handleFileSelect}
          />
        );
      case 1:
        return <TabJobInfo profile={profile} officeInfo={officeInfo} />;
      case 2:
        return <TabPersonalInfo profile={profile} />;
      case 3:
        return <TabFinancialInfo profile={profile} />;
      default:
        return null;
    }
  };

  return (
    <>
      {/* Desktop View: TabView */}
      <div className="hidden lg:block">
        <TabView
          activeIndex={activeIndex}
          onTabChange={(e) => setActiveIndex(e.index)}
          className="shadow-2 h-full"
        >
          {tabOptions.map((tab) => (
            <TabPanel
              key={tab.value}
              header={tab.label}
              leftIcon={tab.icon}
            />
          ))}
        </TabView>
      </div>

      {/* Mobile View: Dropdown */}
      <div className="block lg:hidden mb-3">
        <label htmlFor="tab-dropdown" className="font-semibold block mb-2">
          Pilih Halaman
        </label>
        <Dropdown
          id="tab-dropdown"
          value={activeIndex}
          options={tabOptions}
          onChange={(e) => setActiveIndex(e.value)}
          className="w-full"
        />
      </div>

      {/* Container Konten Tab */}
      <div className="card shadow-2 p-0 lg:p-0 border-none">
        {renderTabContent()}
      </div>
    </>
  );
}