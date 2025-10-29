'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'

export default function Sidebar() {
  const pathname = usePathname()

  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: '📊', href: '/admin/dashboard' },
    { id: 'employees', label: 'Data Karyawan', icon: '👥', href: '/admin/employees' },
    { id: 'attendance', label: 'Monitoring Absensi', icon: '⏰', href: '/admin/attendance' },
    { id: 'leave', label: 'Manajemen Cuti', icon: '🏖️', href: '/admin/leave' },
    { id: 'organization', label: 'Struktur Organisasi', icon: '🏢', href: '/admin/organization' },
    { id: 'access', label: 'Hak Akses', icon: '🔐', href: '/admin/access' }
  ]

  return (
    <aside className="w-64 bg-white shadow-sm border-r h-screen">
      <div className="p-4">
        <h2 className="text-lg font-semibold text-gray-800 mb-4">HR Menu</h2>
        <nav>
          <ul className="space-y-2">
            {menuItems.map((item) => {
              const isActive = pathname === item.href
              return (
                <li key={item.id}>
                  <Link
                    href={item.href}
                    className={`w-full text-left px-4 py-3 rounded-lg transition-colors flex items-center space-x-3 ${
                      isActive
                        ? 'bg-blue-50 text-blue-600 border border-blue-200'
                        : 'text-gray-700 hover:bg-gray-100'
                    }`}
                  >
                    <span className="text-lg">{item.icon}</span>
                    <span className="font-medium">{item.label}</span>
                  </Link>
                </li>
              )
            })}
          </ul>
        </nav>
      </div>
    </aside>
  )
}