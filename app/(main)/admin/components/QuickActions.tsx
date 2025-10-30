export default function QuickActions() {
  const actions = [
    { icon: '➕', label: 'Tambah Karyawan', description: 'Input data karyawan baru' },
    { icon: '✅', label: 'Persetujuan Cuti', description: '8 permintaan pending' },
    { icon: '📊', label: 'Laporan Absensi', description: 'Generate laporan bulanan' },
    { icon: '🏢', label: 'Update Struktur', description: 'Edit organisasi' }
  ]

  return (
    <div className="bg-white p-6 rounded-lg shadow-sm border">
      <h3 className="text-lg font-semibold text-gray-700 mb-4">Quick Actions</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {actions.map((action, index) => (
          <button
            key={index}
            className="p-4 border border-gray-200 rounded-lg hover:border-blue-300 hover:bg-blue-50 transition-colors text-left"
          >
            <div className="flex items-center space-x-3">
              <span className="text-2xl">{action.icon}</span>
              <div>
                <p className="font-semibold text-gray-800">{action.label}</p>
                <p className="text-sm text-gray-500">{action.description}</p>
              </div>
            </div>
          </button>
        ))}
      </div>
    </div>
  )
}