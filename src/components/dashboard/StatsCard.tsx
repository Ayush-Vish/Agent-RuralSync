import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { LucideIcon } from "lucide-react";

interface StatsCardProps {
  title: string;
  value: number | string;
  subtitle?: string;
  icon: LucideIcon;
  gradient: "blue" | "yellow" | "purple" | "green" | "red";
}

const gradientClasses = {
  blue: "bg-gradient-to-br from-blue-500 to-blue-600",
  yellow: "bg-gradient-to-br from-yellow-500 to-orange-500",
  purple: "bg-gradient-to-br from-purple-500 to-purple-600",
  green: "bg-gradient-to-br from-green-500 to-emerald-600",
  red: "bg-gradient-to-br from-red-500 to-red-600",
};

const textClasses = {
  blue: { title: "text-blue-50", icon: "text-blue-100", subtitle: "text-blue-100" },
  yellow: { title: "text-yellow-50", icon: "text-yellow-100", subtitle: "text-yellow-100" },
  purple: { title: "text-purple-50", icon: "text-purple-100", subtitle: "text-purple-100" },
  green: { title: "text-green-50", icon: "text-green-100", subtitle: "text-green-100" },
  red: { title: "text-red-50", icon: "text-red-100", subtitle: "text-red-100" },
};

export function StatsCard({ title, value, subtitle, icon: Icon, gradient }: StatsCardProps) {
  return (
    <Card className={`${gradientClasses[gradient]} text-white border-0 shadow-lg hover:shadow-xl transition-shadow`}>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className={`text-sm font-medium ${textClasses[gradient].title}`}>
          {title}
        </CardTitle>
        <Icon className={`h-5 w-5 ${textClasses[gradient].icon}`} />
      </CardHeader>
      <CardContent>
        <div className="text-3xl font-bold">{value}</div>
        {subtitle && (
          <p className={`text-xs mt-1 ${textClasses[gradient].subtitle}`}>{subtitle}</p>
        )}
      </CardContent>
    </Card>
  );
}
