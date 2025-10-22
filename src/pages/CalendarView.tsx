
import { useEffect, useState } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { useInvoiceData } from "@/hooks/useInvoiceData";
import { Calendar } from "@/components/ui/calendar";
import clsx from "clsx";
import { useNavigate } from "react-router-dom";
import { useLanguage } from "@/context/LanguageContext";
import { Button } from "@/components/ui/button";

type CalendarEvent = {
  id: string;
  name: string;
  dueDate: string;
  paid: boolean;
};

export default function CalendarView() {
  const { savedInvoices } = useInvoiceData();
  const { t } = useLanguage();
  const navigate = useNavigate();

  const [monthData, setMonthData] = useState<{ [date: string]: CalendarEvent[] }>({});

  useEffect(() => {
    const map: { [date: string]: CalendarEvent[] } = {};
    savedInvoices.forEach(inv => {
      if (!inv.dueDate) return;
      if (!map[inv.dueDate]) map[inv.dueDate] = [];
      map[inv.dueDate].push({
        id: inv.id || '',
        name: inv.invoiceNumber,
        dueDate: inv.dueDate,
        paid: inv.status === "paid",
      });
    });
    setMonthData(map);
  }, [savedInvoices]);

  const datesWithInvoices = Object.keys(monthData).map(ds => new Date(ds));

  const calendarClassNames = {
    months: "flex flex-col sm:flex-row space-y-4 sm:space-x-4 sm:space-y-0",
    month: "space-y-4",
    caption: "flex justify-center pt-1 relative items-center",
    caption_label: "text-sm font-medium",
    nav: "space-x-1 flex items-center",
    nav_button:
      "h-7 w-7 bg-transparent p-0 opacity-50 hover:opacity-100 border border-input rounded-md",
    nav_button_previous: "absolute left-1",
    nav_button_next: "absolute right-1",
    table: "w-full border-collapse space-y-1",
    head_row: "flex",
    head_cell:
      "text-muted-foreground rounded-md w-9 font-normal text-[0.8rem]",
    row: "flex w-full mt-2",
    cell: "h-9 w-9 text-center text-sm p-0 relative",
    day: clsx(
      "h-9 w-9 p-0 font-normal focus:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 aria-selected:opacity-100 transition-all relative"
    ),
    day_range_end: "day-range-end",
    day_selected:
      "bg-primary text-primary-foreground hover:bg-primary hover:text-primary-foreground focus:bg-primary focus:text-primary-foreground",
    day_today: "bg-accent text-accent-foreground",
    day_outside:
      "day-outside text-muted-foreground opacity-50 aria-selected:bg-accent/50 aria-selected:text-muted-foreground aria-selected:opacity-30",
    day_disabled: "text-muted-foreground opacity-50",
    day_range_middle:
      "aria-selected:bg-accent aria-selected:text-accent-foreground",
    day_hidden: "invisible",
    day_withInvoices: "day-with-invoices relative"
  };

  useEffect(() => {
    setTimeout(() => {
      document.querySelectorAll(".day-with-invoices").forEach(day => {
        if (day && !day.querySelector('.invoice-dot')) {
          const dot = document.createElement("span");
          dot.className = "invoice-dot";
          const dstr = day.getAttribute("aria-label")?.split("T")[0] || "";
          const events = monthData[dstr] || [];
          let c = "#22d3ee";
          if (events.some(e => !e.paid)) c = "#f59e42";
          dot.style.background = c;
          day.appendChild(dot);
        }
      });
    }, 1);
  }, [monthData]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:bg-gradient-to-br dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 flex flex-col items-center py-8">
      <style>
        {`
          .invoice-dot {
            position: absolute;
            top: 3px;
            right: 3px;
            width: 0.45rem;
            height: 0.45rem;
            border-radius: 9999px;
            box-shadow: 0 0 3px #4447;
            z-index: 1;
          }
          .day-with-invoices {
            position: relative;
          }
        `}
      </style>
      <Card className="w-full max-w-3xl shadow-2xl border-0 bg-white/95 dark:bg-gray-800/95 backdrop-blur mb-8">
        <CardHeader>
          <CardTitle className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            {t("invoiceCalendarTitle")}
          </CardTitle>
          <p className="text-gray-600 dark:text-gray-300">
            {t("invoiceCalendarSubtitle")}
          </p>
        </CardHeader>
        <CardContent className="flex flex-col items-center py-4">
          <Button
            variant="outline"
            className="mb-4"
            onClick={() => navigate("/dashboard")}
          >
            ← {t("goBackDashboard")}
          </Button>
          <Calendar
            mode="single"
            selected={undefined}
            modifiers={{
              withInvoices: (date: Date) =>
                datesWithInvoices.some(
                  d =>
                    d.getFullYear() === date.getFullYear() &&
                    d.getMonth() === date.getMonth() &&
                    d.getDate() === date.getDate()
                ),
            }}
            showOutsideDays
            className="pointer-events-auto"
            classNames={calendarClassNames}
            onDayClick={() => { }}
          />
          <div className="mt-6 w-full">
            <h3 className="font-semibold text-blue-700 dark:text-blue-300 mb-2">
              {t("dueInvoices")}
            </h3>
            <ul>
              {Object.entries(monthData)
                .sort(([a], [b]) => a.localeCompare(b))
                .map(([date, events]) =>
                  events.map(e => (
                    <li key={e.id} className="flex items-center gap-3 mb-1">
                      <span
                        className={`px-2 rounded text-xs ${e.paid
                          ? "bg-green-200 text-green-800"
                          : "bg-yellow-200 text-yellow-800"
                          }`}
                      >
                        {e.paid ? t("paid") : t("due")}
                      </span>
                      <span className="font-bold">{e.name}</span>
                      <span className="text-gray-500">{date}</span>
                    </li>
                  ))
                )}
            </ul>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
