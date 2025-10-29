interface StatsCardProps {
  title: string;
  value: string;
  description: string;
  trend?: {
    value: string;
    isPositive: boolean;
  };
  icon: string;
}

export default function StatsCard({ title, value, description, trend, icon }: StatsCardProps) {
  return (
    <div className="bg-white p-6 rounded-lg shadow-sm border hover:shadow-md transition-shadow">
      <div className="flex items-center justify-between mb-4">
        <div className="p-3 bg-blue-50 rounded-lg">
          <span className="text-2xl">{icon}</span>
        </div>
        {trend && (
          <span className={`text-sm font-medium px-2 py-1 rounded ${
            trend.isPositive ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'
          }`}>
            {trend.isPositive ? '↑' : '↓'} {trend.value}
          </span>
        )}
      </div>
      <h3 className="text-lg font-semibold text-gray-700 mb-2">{title}</h3>
      <p className="text-2xl font-bold text-gray-900 mb-1">{value}</p>
      <p className="text-sm text-gray-500">{description}</p>
    </div>
  )
}