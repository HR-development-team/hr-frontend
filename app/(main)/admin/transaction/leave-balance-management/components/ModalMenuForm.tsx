import { Users } from "lucide-react";

export default function ModalMenuForm() {
  return (
    <div>
      <div>
        <div>
          <Users className="h-2rem w-2rem" />
        </div>

        <div>
          <h2>Bulk Add Saldo</h2>
          <p>
            Tambahkan saldo untuk semua karyawan berstatus Aktif sekaligus
            berdasarkan tipe cuti.
          </p>
        </div>
      </div>
    </div>
  );
}
