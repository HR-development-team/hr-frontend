export default function Organization() {
  const departments = [
    { name: 'IT Department', head: 'Budi Santoso', employees: 15, color: 'bg-blue-500' },
    { name: 'HR Department', head: 'Siti Rahayu', employees: 8, color: 'bg-green-500' },
    { name: 'Marketing', head: 'Ahmad Fauzi', employees: 12, color: 'bg-purple-500' },
    { name: 'Finance', head: 'Dewi Lestari', employees: 10, color: 'bg-yellow-500' }
  ]

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Struktur Organisasi</h1>
        <p className="text-gray-600">Kelola struktur departemen dan hierarki perusahaan</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {departments.map((dept, index) => (
          <div key={index} className="bg-white rounded-lg shadow-sm border p-6">
            <div className={`w-12 h-12 ${dept.color} rounded-lg flex items-center justify-center text-white text-xl mb-4`}>
              {dept.name.charAt(0)}
            </div>
            <h3 className="font-semibold text-gray-900 mb-2">{dept.name}</h3>
            <p className="text-sm text-gray-600 mb-1">Kepala: {dept.head}</p>
            <p className="text-sm text-gray-600">Karyawan: {dept.employees}</p>
          </div>
        ))}
      </div>

      <div className="bg-white rounded-lg shadow-sm border">
        <div className="p-6 border-b">
          <div className="flex justify-between items-center">
            <h2 className="text-lg font-semibold">Diagram Struktur Organisasi</h2>
            <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition">
              Edit Struktur
            </button>
          </div>
        </div>
        <div className="p-6">
          <div className="flex justify-center items-center">
            <div className="text-center">
              {/* CEO Level */}
              <div className="bg-blue-600 text-white p-4 rounded-lg shadow-md w-48 mx-auto mb-8">
                <div className="font-bold">Direktur Utama</div>
                <div className="text-sm">John Doe</div>
              </div>

              {/* Manager Level */}
              <div className="flex justify-center space-x-8 mb-8">
                {departments.map((dept, index) => (
                  <div key={index} className="text-center">
                    <div className="bg-green-500 text-white p-3 rounded-lg shadow-md w-40">
                      <div className="font-bold text-sm">{dept.name}</div>
                      <div className="text-xs">{dept.head}</div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Employee Level */}
              <div className="text-center text-gray-500">
                <p>+156 Karyawan</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}