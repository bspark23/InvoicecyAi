
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { InvoiceData, currencies, colorThemes } from "@/types/invoice";
import InvoiceTemplateClassic from "./invoice-templates/InvoiceTemplateClassic";
import InvoiceTemplateModern from "./invoice-templates/InvoiceTemplateModern";
import InvoiceTemplateBold from "./invoice-templates/InvoiceTemplateBold";
import InvoiceTemplateElegant from "./invoice-templates/InvoiceTemplateElegant";
import InvoiceTemplateHorizontal from "./invoice-templates/InvoiceTemplateHorizontal";
import InvoiceTemplateCustom from "./invoice-templates/InvoiceTemplateCustom";
import InvoiceTemplateCorporate from "./invoice-templates/InvoiceTemplateCorporate";
import InvoiceTemplateMinimalist from "./invoice-templates/InvoiceTemplateMinimalist";

interface InvoicePreviewProps {
  invoiceData: InvoiceData;
  formatCurrency: (amount: number, currencyCode?: string) => string;
  calculateSubtotal: () => number;
  calculateTax: () => number;
  calculateTotal: () => number;
  customTemplateContent?: string | null;
}

const TEMPLATE_STYLES = {
  minimalist: "shadow-none border border-gray-200 dark:border-gray-700",
  bordered: "border-4 border-blue-400 dark:border-blue-600",
  modern: "ring-4 ring-purple-200 dark:ring-green-700"
};

const getTheme = (key: string) => colorThemes.find(ct => ct.value === key) || colorThemes[0];

const COLOR_CLASSES = {
  blue: { header: "text-blue-600", badge: "bg-blue-100 text-blue-800", bg: "bg-blue-50" },
  green: { header: "text-green-600", badge: "bg-green-100 text-green-800", bg: "bg-green-50" },
  gray: { header: "text-gray-800", badge: "bg-gray-200 text-gray-800", bg: "bg-gray-50" },
  purple: { header: "text-purple-600", badge: "bg-purple-100 text-purple-800", bg: "bg-purple-50" },
  red: { header: "text-red-600", badge: "bg-red-100 text-red-800", bg: "bg-red-50" },
  orange: { header: "text-orange-600", badge: "bg-orange-100 text-orange-800", bg: "bg-orange-50" },
  teal: { header: "text-teal-600", badge: "bg-teal-100 text-teal-800", bg: "bg-teal-50" },
  "gradient-blue": { header: "text-blue-700", badge: "bg-blue-100 text-blue-800", bg: "" },
  "gradient-purple": { header: "text-purple-800", badge: "bg-purple-100 text-purple-900", bg: "" },
};

const InvoicePreview = ({
  invoiceData,
  formatCurrency,
  calculateSubtotal,
  calculateTax,
  calculateTotal,
  customTemplateContent
}: InvoicePreviewProps) => {
  // Support all template options
  const template = invoiceData.template || "minimalist";
  const colorTheme = invoiceData.colorTheme || "blue";
  const color = COLOR_CLASSES[colorTheme as keyof typeof COLOR_CLASSES] || COLOR_CLASSES.blue;
  const themeObj = getTheme(colorTheme);

  switch (template) {
    case "corporate":
      return (
        <InvoiceTemplateCorporate
          invoiceData={invoiceData}
          formatCurrency={formatCurrency}
          calculateSubtotal={calculateSubtotal}
          calculateTax={calculateTax}
          calculateTotal={calculateTotal}
        />
      );
    case "classic":
      return (
        <InvoiceTemplateClassic
          invoiceData={invoiceData}
          formatCurrency={formatCurrency}
          calculateSubtotal={calculateSubtotal}
          calculateTax={calculateTax}
          calculateTotal={calculateTotal}
        />
      );
    case "modern":
      return (
        <InvoiceTemplateModern
          invoiceData={invoiceData}
          formatCurrency={formatCurrency}
          calculateSubtotal={calculateSubtotal}
          calculateTax={calculateTax}
          calculateTotal={calculateTotal}
        />
      );
    case "bold":
      return (
        <InvoiceTemplateBold
          invoiceData={invoiceData}
          formatCurrency={formatCurrency}
          calculateSubtotal={calculateSubtotal}
          calculateTax={calculateTax}
          calculateTotal={calculateTotal}
        />
      );
    case "elegant":
      return (
        <InvoiceTemplateElegant
          invoiceData={invoiceData}
          formatCurrency={formatCurrency}
          calculateSubtotal={calculateSubtotal}
          calculateTax={calculateTax}
          calculateTotal={calculateTotal}
        />
      );
    case "horizontal":
      return (
        <InvoiceTemplateHorizontal
          invoiceData={invoiceData}
          formatCurrency={formatCurrency}
          calculateSubtotal={calculateSubtotal}
          calculateTax={calculateTax}
          calculateTotal={calculateTotal}
        />
      );
    case "custom":
      return (
        <InvoiceTemplateCustom
          content={customTemplateContent || ""}
          invoiceData={invoiceData}
        />
      );
    case "minimalist":
    default:
      return (
        <InvoiceTemplateMinimalist
          invoiceData={invoiceData}
          formatCurrency={formatCurrency}
          calculateSubtotal={calculateSubtotal}
          calculateTax={calculateTax}
          calculateTotal={calculateTotal}
        />
      );
  }
};

export default InvoicePreview;
