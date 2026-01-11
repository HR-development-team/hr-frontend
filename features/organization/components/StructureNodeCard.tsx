import { Layers, Network, UserCircle2 } from "lucide-react";
import { StructuredNodeCardProps } from "../schemas/organizationSchema";

export default function StructuredNodeCard({
  type,
  name,
  code,
  description,
  leader_name,
  leader_position,
}: StructuredNodeCardProps) {
  const isDept = type === "department";

  // Dynamic colors based on type
  const bgSoft = isDept ? "bg-red-50" : "bg-green-50";
  const textColor = isDept ? "text-red-500" : "text-green-500";
  const borderSoft = isDept ? "border-red-100" : "border-green-100";
  const textTitle = isDept ? "text-red-700" : "text-green-700";

  // Handle Nullable Values
  const displayLeaderName =
    leader_name && leader_name !== "-" ? leader_name : "Nama Tidak Tersedia";
  const displayPosition = leader_position || "Jabatan Belum Diisi";
  const isLeaderSet = leader_name && leader_name !== "-";

  return (
    <div
      style={{ width: "260px" }}
      className="flex flex-column align-items-center p-3 surface-card border-2 border-300 border-round-xl relative overflow-hidden shadow-2 hover:shadow-6"
    >
      {/* Top Bar Decoration */}
      <div
        className="absolute top-0 left-0 w-full"
        style={{
          height: "4px",
          background: `linear-gradient(90deg, ${
            isDept ? "#de1d30ff 0%, #e71f62ff" : "#27de1dff 0%, #1fe73aff"
          } 100%)`,
        }}
      />

      {/* Header: Icon & Code */}
      <div className="w-full flex justify-content-between align-items-center mb-3">
        <div
          className={`flex align-items-center justify-content-center ${bgSoft} ${textColor} border-round p-2`}
        >
          {isDept ? <Network size={20} /> : <Layers size={20} />}
        </div>
        <span className="px-2 py-1 text-xs font-medium text-500 surface-100 border-round">
          {code}
        </span>
      </div>

      {/* Body: Name & Description */}
      <div className="mb-4 text-center w-full">
        <div className="font-bold text-800 text-sm mb-1">
          {isDept ? "Departemen" : "Divisi"} {name}
        </div>
        <div className="text-xs text-600 text-center font-italic white-space-normal">
          {description}
        </div>
      </div>

      {/* NEW SECTION: Leader Info */}
      <div
        className={`w-full ${bgSoft} border-1 ${borderSoft} border-round p-2 flex align-items-center gap-2 text-left`}
      >
        <div className={`${isLeaderSet ? textTitle : "text-gray-400"}`}>
          <UserCircle2 size={24} />
        </div>
        <div className="flex flex-column overflow-hidden">
          <span
            className={`text-xs font-bold text-overflow-ellipsis white-space-nowrap overflow-hidden ${
              isLeaderSet ? "text-gray-800" : "text-gray-400 font-normal italic"
            }`}
          >
            {displayLeaderName}
          </span>
          <span
            className={`text-xs text-overflow-ellipsis white-space-nowrap overflow-hidden ${
              displayPosition !== "Jabatan Belum Diisi"
                ? textTitle
                : "text-gray-400 italic"
            }`}
          >
            {displayPosition}
          </span>
        </div>
      </div>
    </div>
  );
}
