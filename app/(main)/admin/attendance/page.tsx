export default function Attendance() {
  const attendanceData = [
    { id: 1, name: 'Budi Santoso', position: 'Software Engineer', checkIn: '07:55', checkOut: '16:58', status: 'Hadir', location: 'Kantor Pusat' },
    { id: 2, name: 'Siti Rahayu', position: 'HR Manager', checkIn: '08:02', checkOut: '17:15', status: 'Hadir', location: 'Kantor Pusat' },
    { id: 3, name: 'Ahmad Fauzi', position: 'Marketing Specialist', checkIn: '09:15', checkOut: '17:05', status: 'Terlambat', location: 'Kantor Cabang' },
    { id: 4, name: 'Dewi Lestari', position: 'Finance Manager', checkIn: '08:10', checkOut: '17:20', status: 'Hadir', location: 'Kantor Pusat' },
    { id: 5, name: 'Rina Wijaya', position: 'UX Designer', checkIn: '-', checkOut: '-', status: 'Cuti', location: '-' },
    { id: 6, name: 'Joko Prasetyo', position: 'Backend Developer', checkIn: '08:05', checkOut: '17:00', status: 'Hadir', location: 'Remote' },
    { id: 7, name: 'Maya Sari', position: 'Frontend Developer', checkIn: '08:45', checkOut: '17:10', status: 'Terlambat', location: 'Kantor Pusat' },
    { id: 8, name: 'Hendra Gunawan', position: 'Data Analyst', checkIn: '07:50', checkOut: '16:55', status: 'Hadir', location: 'Kantor Pusat' }
  ]

  const stats = {
    totalEmployees: 156,
    presentToday: 142,
    late: 8,
    onLeave: 6,
    absent: 0
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Hadir': return 'bg-green-100 text-green-800 border-green-200'
      case 'Terlambat': return 'bg-yellow-100 text-yellow-800 border-yellow-200'
      case 'Cuti': return 'bg-blue-100 text-blue-800 border-blue-200'
      case 'Absen': return 'bg-red-100 text-red-800 border-red-200'
      default: return 'bg-gray-100 text-gray-800 border-gray-200'
    }
  }

  const getLocationColor = (location: string) => {
    switch (location) {
      case 'Kantor Pusat': return 'text-purple-600 bg-purple-50'
      case 'Kantor Cabang': return 'text-orange-600 bg-orange-50'
      case 'Remote': return 'text-cyan-600 bg-cyan-50'
      default: return 'text-gray-600 bg-gray-50'
    }
  }

  return (
    <div>
      {/* Header Section */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Monitoring Absensi</h1>
        <p className="text-gray-600">Pantau kehadiran dan waktu kerja karyawan - {new Date().toLocaleDateString('id-ID', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</p>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 mb-6">
        <div className="bg-white p-4 rounded-lg shadow-sm border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Karyawan</p>
              <p className="text-2xl font-bold text-gray-900">{stats.totalEmployees}</p>
            </div>
            <div className="p-3 bg-blue-100 rounded-lg">
              <span className="text-blue-600 text-xl">👥</span>
            </div>
          </div>
        </div>

        <div className="bg-white p-4 rounded-lg shadow-sm border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Hadir Hari Ini</p>
              <p className="text-2xl font-bold text-green-600">{stats.presentToday}</p>
              <p className="text-xs text-gray-500">{((stats.presentToday / stats.totalEmployees) * 100).toFixed(1)}% kehadiran</p>
            </div>
            <div className="p-3 bg-green-100 rounded-lg">
              <span className="text-green-600 text-xl">✅</span>
            </div>
          </div>
        </div>

        <div className="bg-white p-4 rounded-lg shadow-sm border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Terlambat</p>
              <p className="text-2xl font-bold text-yellow-600">{stats.late}</p>
              <p className="text-xs text-gray-500">perlu perhatian</p>
            </div>
            <div className="p-3 bg-yellow-100 rounded-lg">
              <span className="text-yellow-600 text-xl">⏰</span>
            </div>
          </div>
        </div>

        <div className="bg-white p-4 rounded-lg shadow-sm border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Cuti</p>
              <p className="text-2xl font-bold text-blue-600">{stats.onLeave}</p>
              <p className="text-xs text-gray-500">sedang cuti</p>
            </div>
            <div className="p-3 bg-blue-100 rounded-lg">
              <span className="text-blue-600 text-xl">🏖️</span>
            </div>
          </div>
        </div>

        <div className="bg-white p-4 rounded-lg shadow-sm border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Tidak Hadir</p>
              <p className="text-2xl font-bold text-red-600">{stats.absent}</p>
              <p className="text-xs text-gray-500">tanpa keterangan</p>
            </div>
            <div className="p-3 bg-red-100 rounded-lg">
              <span className="text-red-600 text-xl">❌</span>
            </div>
          </div>
        </div>
      </div>

      {/* Attendance Table */}
      <div className="bg-white rounded-lg shadow-sm border">
        <div className="p-6 border-b">
          <div className="flex justify-between items-center">
            <h2 className="text-lg font-semibold text-gray-900">Rekap Absensi Hari Ini</h2>
            <div className="flex space-x-2">
              <button className="px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 transition">
                Export Excel
              </button>
              <button className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition">
                Filter Data
              </button>
            </div>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Karyawan</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Posisi</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Check In</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Check Out</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Lokasi</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Aksi</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {attendanceData.map((employee) => (
                <tr key={employee.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center text-white text-sm font-semibold mr-3">
                        {employee.name.charAt(0)}
                      </div>
                      <div>
                        <div className="text-sm font-medium text-gray-900">{employee.name}</div>
                        <div className="text-xs text-gray-500">ID: EMP{employee.id.toString().padStart(3, '0')}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{employee.position}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className={`text-sm font-medium ${employee.checkIn === '-' ? 'text-gray-400' : 'text-gray-900'}`}>
                      {employee.checkIn}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className={`text-sm font-medium ${employee.checkOut === '-' ? 'text-gray-400' : 'text-gray-900'}`}>
                      {employee.checkOut}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {employee.location !== '-' && (
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getLocationColor(employee.location)}`}>
                        {employee.location}
                      </span>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium border ${getStatusColor(employee.status)}`}>
                      {employee.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <button className="text-blue-600 hover:text-blue-900 mr-3">Detail</button>
                    <button className="text-gray-600 hover:text-gray-900">Edit</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Table Footer */}
        <div className="px-6 py-4 border-t bg-gray-50">
          <div className="flex justify-between items-center">
            <div className="text-sm text-gray-700">
              Menampilkan <span className="font-medium">8</span> dari <span className="font-medium">156</span> karyawan
            </div>
            <div className="flex space-x-2">
              <button className="px-3 py-1 border border-gray-300 rounded text-sm text-gray-700 hover:bg-gray-50">
                Sebelumnya
              </button>
              <button className="px-3 py-1 bg-blue-600 text-white rounded text-sm hover:bg-blue-700">
                Selanjutnya
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="mt-6 grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Ringkasan Kehadiran</h3>
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Rata-rata Jam Masuk</span>
              <span className="font-semibold">08:12</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Rata-rata Jam Pulang</span>
              <span className="font-semibold">17:08</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Tingkat Kehadiran</span>
              <span className="font-semibold text-green-600">91.0%</span>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Keterlambatan Terbanyak</h3>
          <div className="space-y-2">
            {attendanceData.filter(e => e.status === 'Terlambat').map(employee => (
              <div key={employee.id} className="flex justify-between items-center py-2 border-b border-gray-100 last:border-0">
                <span className="text-sm text-gray-700">{employee.name}</span>
                <span className="text-sm font-medium text-yellow-600">{employee.checkIn}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Aksi Cepat</h3>
          <div className="space-y-3">
            <button className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition text-sm font-medium">
              Input Absensi Manual
            </button>
            <button className="w-full bg-green-600 text-white py-2 px-4 rounded-lg hover:bg-green-700 transition text-sm font-medium">
              Generate Laporan Bulanan
            </button>
            <button className="w-full bg-purple-600 text-white py-2 px-4 rounded-lg hover:bg-purple-700 transition text-sm font-medium">
              Atur Jam Kerja
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}