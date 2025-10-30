export default function Employees() {
  const employees = [
    { id: 'EMP001', name: 'Budi Santoso', position: 'Software Engineer', department: 'IT', status: 'Aktif' },
    { id: 'EMP002', name: 'Siti Rahayu', position: 'HR Manager', department: 'HR', status: 'Aktif' },
    { id: 'EMP003', name: 'Ahmad Fauzi', position: 'Marketing Specialist', department: 'Marketing', status: 'Aktif' },
    { id: 'EMP004', name: 'Dewi Lestari', position: 'Finance Manager', department: 'Finance', status: 'Aktif' }
  ]

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Data Karyawan</h1>
        <p className="text-gray-600">Kelola data diri dan informasi karyawan</p>
      </div>

      <div className="bg-white rounded-lg shadow-sm border">
        <div className="p-6 border-b">
          <div className="flex justify-between items-center">
            <h2 className="text-lg font-semibold">Daftar Karyawan</h2>
            <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition">
              + Tambah Karyawan
            </button>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nama</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Posisi</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Departemen</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Aksi</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {employees.map((employee) => (
                <tr key={employee.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{employee.id}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{employee.name}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{employee.position}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{employee.department}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                      {employee.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <button className="text-blue-600 hover:text-blue-900 mr-3">Edit</button>
                    <button className="text-red-600 hover:text-red-900">Hapus</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}