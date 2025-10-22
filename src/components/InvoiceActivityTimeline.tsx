import { useState } from "react";
import { ActivityEvent } from "@/hooks/useInvoiceActivity";
import { Clock, Activity, CreditCard, Users, Mail, Calculator } from "lucide-react";

interface Props {
  events: ActivityEvent[];
}

const typeLabel: Record<ActivityEvent["type"], string> = {
  created: "Invoice created",
  edited: "Invoice edited",
  downloaded: "Invoice downloaded",
  payment: "Payment received",
  client: "Client updated",
  email: "Email sent",
  estimate: "Estimate generated",
};

const typeColor: Record<ActivityEvent["type"], string> = {
  created: "text-blue-600",
  edited: "text-orange-600",
  downloaded: "text-green-600",
  payment: "text-green-600",
  client: "text-purple-600",
  email: "text-orange-600",
  estimate: "text-teal-600",
};

const iconByType: Record<ActivityEvent["type"], React.ReactNode> = {
  created: <Activity className="w-5 h-5 text-blue-600" />,
  edited: <Activity className="w-5 h-5 text-orange-600" />,
  downloaded: <Activity className="w-5 h-5 text-green-600" />,
  payment: <CreditCard className="w-5 h-5 text-green-600" />,
  client: <Users className="w-5 h-5 text-purple-600" />,
  email: <Mail className="w-5 h-5 text-orange-600" />,
  estimate: <Calculator className="w-5 h-5 text-teal-600" />,
};

function formatTimestamp(ts: string) {
  const dt = new Date(ts);
  return dt.toLocaleString([], {
    dateStyle: "medium",
    timeStyle: "short",
  });
}

export default function InvoiceActivityTimeline({ events }: Props) {
  const [showAll, setShowAll] = useState(false);

  if (!events.length) {
    return (
      <div className="text-gray-400 flex items-center gap-2 text-sm pl-2 pb-2">
        <Clock className="w-4 h-4" /> No invoice activity yet.
      </div>
    );
  }

  // Only show the most recent event unless expanded
  const eventsToShow = showAll ? events : events.slice(0, 1);

  return (
    <div className="rounded-xl bg-white dark:bg-gray-800 p-4 mt-2 shadow-sm border border-gray-200 dark:border-gray-700">
      <h2 className="text-base font-semibold text-gray-700 dark:text-gray-200 mb-3 flex items-center gap-2">
        <Activity className="w-5 h-5" /> Invoice Activity Timeline
      </h2>
      <ol className="space-y-3">
        {eventsToShow.map((ev, idx) => (
          <li key={idx} className="flex gap-3 items-center">
            <span>{iconByType[ev.type]}</span>
            <div>
              <div className={`font-medium ${typeColor[ev.type]}`}>{typeLabel[ev.type]}</div>
              <div className="text-xs text-gray-500">{formatTimestamp(ev.timestamp)}</div>
              <div className="text-xs text-gray-600 dark:text-gray-400">{ev.description}</div>
            </div>
          </li>
        ))}
      </ol>
      {/* Button to show/hide previous events, only show if there's more than one event */}
      {events.length > 1 && (
        <button
          className="mt-3 text-sm px-3 py-1 rounded bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 transition"
          onClick={() => setShowAll(v => !v)}
        >
          {showAll ? "Hide Previous" : `See Previous (${events.length - 1})`}
        </button>
      )}
    </div>
  );
}
