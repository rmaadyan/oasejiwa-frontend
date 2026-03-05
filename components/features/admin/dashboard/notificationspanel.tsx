import Link from "next/link";
import { AlertCircle, Clock, CheckCircle, LucideIcon } from "lucide-react";

interface Alert {
  id: number;
  type: "urgent" | "info" | "success";
  title: string;
  description: string;
  action: string;
  link: string;
}

interface NotificationsPanelProps {
  alerts: Alert[];
}

const iconMap: Record<Alert["type"], LucideIcon> = {
  urgent: AlertCircle,
  info: Clock,
  success: CheckCircle
};

const styleMap = {
  urgent: {
    bg: "bg-red-50 border-red-100",
    icon: "text-red-600",
    text: "text-red-900"
  },
  info: {
    bg: "bg-blue-50 border-blue-100",
    icon: "text-blue-600",
    text: "text-blue-900"
  },
  success: {
    bg: "bg-green-50 border-green-100",
    icon: "text-green-600",
    text: "text-green-900"
  }
};

export default function NotificationsPanel({ alerts }: NotificationsPanelProps) {
  return (
    <div className="bg-white rounded-xl border border-gray-200 p-6">
      <h2 className="text-xl font-semibold text-gray-900 mb-4">Notifications</h2>
      <div className="space-y-3">
        {alerts.map((alert) => {
          const Icon = iconMap[alert.type];
          const styles = styleMap[alert.type];

          return (
            <div key={alert.id} className={`border rounded-lg p-4 ${styles.bg}`}>
              <div className="flex items-start gap-3">
                <Icon className={`h-5 w-5 mt-0.5 shrink-0 ${styles.icon}`} />
                <div className="flex-1 min-w-0">
                  <p className={`text-sm font-semibold ${styles.text}`}>{alert.title}</p>
                  <p className={`text-xs mt-1 ${styles.text} opacity-80`}>{alert.description}</p>
                  <Link 
                    href={alert.link}
                    className={`text-xs font-medium mt-2 inline-block hover:underline ${styles.icon}`}
                  >
                    {alert.action} →
                  </Link>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
