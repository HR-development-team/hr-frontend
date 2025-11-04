export default function Leave() {
  const pendingRequests = [
    { id: 'CUT001', name: 'Budi Santoso', type: 'Cuti Tahunan', startDate: '2024-12-01', endDate: '2024-12-05', days: 5, status: 'Pending' },
    { id: 'CUT002', name: 'Siti Rahayu', type: 'Cuti Sakit', startDate: '2024-11-28', endDate: '2024-11-29', days: 2, status: 'Pending' }
  ]

  const leaveBalances = [
    { type: 'Cuti Tahunan', total: 12, used: 5, remaining: 7 },
    { type: 'Cuti Sakit', total: 10, used: 2, remaining: 8 },
    { type: 'Cuti Melahirkan', total: 90, used: 0, remaining: 90 }
  ]

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Manajemen Cuti</h1>
        <p className="text-gray-600">Kelola pengajuan cuti dan saldo cuti karyawan</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Pending Requests */}
        <div className="bg-white rounded-lg shadow-sm border">
          <div className="p-6 border-b">
            <h2 className="text-lg font-semibold">Permintaan Cuti Pending</h2>
          </div>
          <div className="p-6">
            {pendingRequests.map((request) => (
              <div key={request.id} className="border border-gray-200 rounded-lg p-4 mb-4 last:mb-0">
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <h3 className="font-semibold text-gray-900">{request.name}</h3>
                    <p className="text-sm text-gray-500">{request.type}</p>
                  </div>
                  <span className="px-2 py-1 text-xs bg-yellow-100 text-yellow-800 rounded-full">
                    {request.status}
                  </span>
                </div>
                <div className="text-sm text-gray-600 mb-3">
                  {request.startDate} hingga {request.endDate} ({request.days} hari)
                </div>
                <div className="flex space-x-2">
                  <button className="flex-1 bg-green-600 text-white py-2 rounded hover:bg-green-700 transition">
                    Setujui
                  </button>
                  <button className="flex-1 bg-red-600 text-white py-2 rounded hover:bg-red-700 transition">
                    Tolak
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Leave Balances */}
        <div className="bg-white rounded-lg shadow-sm border">
          <div className="p-6 border-b">
            <h2 className="text-lg font-semibold">Saldo Cuti Perusahaan</h2>
          </div>
          <div className="p-6">
            {leaveBalances.map((balance, index) => (
              <div key={index} className="border border-gray-200 rounded-lg p-4 mb-4 last:mb-0">
                <h3 className="font-semibold text-gray-900 mb-2">{balance.type}</h3>
                <div className="grid grid-cols-3 gap-4 text-center">
                  <div>
                    <div className="text-2xl font-bold text-blue-600">{balance.total}</div>
                    <div className="text-xs text-gray-500">Total</div>
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-green-600">{balance.used}</div>
                    <div className="text-xs text-gray-500">Digunakan</div>
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-gray-600">{balance.remaining}</div>
                    <div className="text-xs text-gray-500">Sisa</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}