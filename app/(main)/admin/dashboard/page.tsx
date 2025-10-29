import DashboardStats from '../components/DashboardStats'
import QuickActions from '../components/QuickActions'

export default function Dashboard() {
  return (
    <>
      {/* Welcome Section */}
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Selamat Datang, Admin!</h2>
        <p className="text-gray-600">Berikut adalah ringkasan aktivitas HR hari ini.</p>
      </div>

      {/* Statistics */}
      <DashboardStats />

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column */}
        <div className="lg:col-span-2 space-y-6">
          <QuickActions />

          {/* Recent Activities */}
          <div className="bg-white p-6 rounded-lg shadow-sm border">
            <h3 className="text-lg font-semibold text-gray-700 mb-4">Aktivitas Terbaru</h3>
            <div className="space-y-4">
              {[
                { action: 'Pengajuan cuti', user: 'Budi Santoso', time: '2 jam lalu', status: 'pending' },
                { action: 'Update data karyawan', user: 'Siti Rahayu', time: '4 jam lalu', status: 'completed' },
                { action: 'Absensi terlambat', user: 'Ahmad Fauzi', time: '5 jam lalu', status: 'warning' }
              ].map((activity, index) => (
                <div key={index} className="flex items-center justify-between p-3 border border-gray-100 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <div className={`w-3 h-3 rounded-full ${
                      activity.status === 'pending' ? 'bg-yellow-400' : 
                      activity.status === 'completed' ? 'bg-green-400' : 'bg-red-400'
                    }`}></div>
                    <div>
                      <p className="font-medium text-gray-800">{activity.action}</p>
                      <p className="text-sm text-gray-500">{activity.user} • {activity.time}</p>
                    </div>
                  </div>
                  <button className="text-blue-600 hover:text-blue-800 text-sm font-medium">
                    Lihat
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column */}
        <div className="space-y-6">
          {/* Calendar Widget */}
          <div className="bg-white p-6 rounded-lg shadow-sm border">
            <h3 className="text-lg font-semibold text-gray-700 mb-4">Kalender</h3>
            <div className="text-center p-4 bg-blue-50 rounded-lg">
              <p className="text-2xl font-bold text-gray-900">Senin, 27 Nov 2024</p>
              <p className="text-gray-500">Tidak ada hari libur</p>
            </div>
          </div>

          {/* Upcoming Events */}
          <div className="bg-white p-6 rounded-lg shadow-sm border">
            <h3 className="text-lg font-semibold text-gray-700 mb-4">Event Mendatang</h3>
            <div className="space-y-3">
              {[
                { event: 'Review Kinerja Q4', date: '30 Nov 2024', type: 'meeting' },
                { event: 'Libur Nasional', date: '25 Dec 2024', type: 'holiday' },
                { event: 'Training HR', date: '15 Dec 2024', type: 'training' }
              ].map((event, index) => (
                <div key={index} className="flex items-center space-x-3 p-2 hover:bg-gray-50 rounded">
                  <div className={`w-2 h-2 rounded-full ${
                    event.type === 'meeting' ? 'bg-blue-400' : 
                    event.type === 'holiday' ? 'bg-green-400' : 'bg-purple-400'
                  }`}></div>
                  <div className="flex-1">
                    <p className="font-medium text-gray-800">{event.event}</p>
                    <p className="text-sm text-gray-500">{event.date}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </>
  )
}