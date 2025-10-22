
import React from "react";
import { InvoiceData } from "@/types/invoice";

const InvoiceTemplateCustom = ({ content, invoiceData }: { content: string; invoiceData: InvoiceData }) => {
  // If content is an image src, render; if HTML, dangerouslySetInnerHTML (caution!)
  if (content?.startsWith("data:image")) {
    return <img src={content} alt="Custom Invoice Template" style={{ width: "100%", maxWidth: 900, margin: "auto" }} />;
  }
  if (content?.startsWith("<")) {
    return <div dangerouslySetInnerHTML={{ __html: content }} />;
  }
  return <div className="text-red-500 p-4">Custom template format not supported.</div>;
};
export default InvoiceTemplateCustom;
