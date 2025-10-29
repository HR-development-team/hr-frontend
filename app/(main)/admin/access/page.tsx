export default function Access() {
  const userRoles = [
    { role: 'Admin', users: 3, permissions: 'Full Access', color: 'bg-red-100 text-red-800' },
    { role: 'HR Manager', users: 5, permissions: 'HR Management', color: 'bg-blue-100 text-blue-800' },
    { role: 'Department Head', users: 8, permissions: 'Team Management', color: 'bg-green-100 text-green-800' },
    { role: 'Employee', users: 140, permissions: 'Basic Access', color: 'bg-gray-100 text-gray-800' }
  ]

  const permissions = [
    { module: 'Data Karyawan', admin: true, hr: true, deptHead: true, employee: false },
    { module: 'Absensi', admin: true, hr: true, deptHead: true, employee: true },
    { module: 'Cuti', admin: true, hr: true, deptHead: true, employee: true },
    { module: 'Struktur Organisasi', admin: true, hr: true, deptHead: false, employee: false },
    { module: 'Hak Akses', admin: true, hr: false, deptHead: false, employee: false }
  ]

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Hak Akses</h1>
        <p className="text-gray-600">Kelola role dan permissions pengguna sistem</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {userRoles.map((role, index) => (
          <div key={index} className="bg-white rounded-lg shadow-sm border p-6">
            <span className={`inline-block px-3 py-1 text-xs font-semibold rounded-full ${role.color} mb-4`}>
              {role.role}
            </span>
            <h3 className="text-2xl font-bold text-gray-900 mb-2">{role.users}</h3>
            <p className="text-sm text-gray-600">Pengguna</p>
            <p className="text-xs text-gray-500 mt-2">{role.permissions}</p>
          </div>
        ))}
      </div>

      <div className="bg-white rounded-lg shadow-sm border">
        <div className="p-6 border-b">
          <h2 className="text-lg font-semibold">Matrix Permissions</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Module</th>
                <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Admin</th>
                <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">HR Manager</th>
                <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Dept Head</th>
                <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Employee</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {permissions.map((perm, index) => (
                <tr key={index} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{perm.module}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-center">
                    <span className={`inline-block w-3 h-3 rounded-full ${perm.admin ? 'bg-green-500' : 'bg-red-500'}`}></span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-center">
                    <span className={`inline-block w-3 h-3 rounded-full ${perm.hr ? 'bg-green-500' : 'bg-red-500'}`}></span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-center">
                    <span className={`inline-block w-3 h-3 rounded-full ${perm.deptHead ? 'bg-green-500' : 'bg-red-500'}`}></span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-center">
                    <span className={`inline-block w-3 h-3 rounded-full ${perm.employee ? 'bg-green-500' : 'bg-red-500'}`}></span>
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