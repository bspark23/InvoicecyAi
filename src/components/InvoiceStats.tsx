
import React from "react";
import { InvoiceData } from "@/types/invoice";

interface InvoiceStatsProps {
  invoices: InvoiceData[];
}

const InvoiceStats: React.FC<InvoiceStatsProps> = ({ invoices }) => (
  <div className="mb-6">
    <h2 className="text-xl font-semibold mb-2">Invoice Stats</h2>
    <div>{invoices.length} invoice(s) found.</div>
  </div>
);

export default InvoiceStats;
