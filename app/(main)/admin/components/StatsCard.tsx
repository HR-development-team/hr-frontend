import { Card } from "primereact/card";
import { ReactNode } from "react";

interface StatsCardProps {
	title: string;
	value: string;
	description: string;
	trend?: {
		value: string;
		isPositive: boolean;
	};
	icon: ReactNode;
}

export default function StatsCard({
	title,
	value,
	description,
	trend,
	icon,
}: StatsCardProps) {
	return (
		<Card
			pt={{
				root: {
					className: "min-h-full",
				},
			}}
		>
			<div className="flex align-items-center justify-content-between mb-4">
				<div className="p-3 bg-blue-50 border-round-lg">
          <span>{icon}</span>
				</div>
				{trend && (
					<span
						className={`text-sm font-medium px-2 py-1 border-round ${
							trend.isPositive
								? "bg-green-100 text-green-600"
								: "bg-red-100 text-red-600"
						}`}
					>
						{trend.isPositive ? "↑" : "↓"} {trend.value}
					</span>
				)}
			</div>
			<h3 className="text-lg font-semibold text-gray-700 mb-2">{title}</h3>
			<p className="text-2xl font-bold text-gray-900 mb-1">{value}</p>
			<p className="text-sm text-gray-500">{description}</p>
		</Card>
	);
}
