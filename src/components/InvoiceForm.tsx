
import React from "react";
import { useInvoiceForm } from "@/hooks/useInvoiceForm";

const Input = (props: React.InputHTMLAttributes<HTMLInputElement>) => (
  <input {...props} className={"border rounded px-3 py-2 w-full text-gray-800 focus:ring-2 focus:ring-blue-300 outline-none bg-white " + (props.className ?? "")} />
);

const Textarea = (props: React.TextareaHTMLAttributes<HTMLTextAreaElement>) => (
  <textarea {...props} className={"border rounded px-3 py-2 w-full text-gray-800 focus:ring-2 focus:ring-blue-300 outline-none bg-white " + (props.className ?? "")} />
);

const InvoiceForm: React.FC = () => {
  const {
    form,
    setField,
    addItem,
    updateItem,
    removeItem,
    subtotal,
    tax,
    total
  } = useInvoiceForm();

  return (
    <form
      className="w-full max-w-2xl mx-auto bg-white dark:bg-gray-900 p-6 rounded-xl shadow flex flex-col gap-6"
      onSubmit={e => { e.preventDefault(); alert("Invoice saved (demo only)"); }}
    >
      {/* Client Info */}
      <section>
        <h2 className="text-lg font-semibold mb-2 text-gray-700">Client details</h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <Input
            placeholder="Client Name"
            value={form.clientName}
            onChange={e => setField("clientName", e.target.value)}
            required
          />
          <Input
            placeholder="Client Email"
            value={form.clientEmail}
            type="email"
            onChange={e => setField("clientEmail", e.target.value)}
            required
          />
          <Input
            placeholder="Client Address"
            value={form.clientAddress}
            onChange={e => setField("clientAddress", e.target.value)}
            required
          />
        </div>
      </section>
      {/* Invoice Meta */}
      <section>
        <h2 className="text-lg font-semibold mb-2 text-gray-700">Invoice info</h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <Input
            placeholder="Invoice Number"
            value={form.invoiceNumber}
            onChange={e => setField("invoiceNumber", e.target.value)}
          />
          <Input
            type="date"
            placeholder="Invoice Date"
            value={form.invoiceDate}
            onChange={e => setField("invoiceDate", e.target.value)}
          />
          <Input
            type="date"
            placeholder="Due Date"
            value={form.dueDate}
            onChange={e => setField("dueDate", e.target.value)}
          />
        </div>
      </section>
      {/* Line Items */}
      <section>
        <h2 className="text-lg font-semibold mb-2 text-gray-700">Services / Items</h2>
        <div className="flex flex-col gap-2">
          {form.items.map((item, idx) => (
            <div
              className="grid grid-cols-12 gap-2 items-center"
              key={item.id}
            >
              <div className="col-span-4">
                <Input
                  placeholder="Description"
                  value={item.description}
                  onChange={e =>
                    updateItem(item.id, { description: e.target.value })
                  }
                  required
                />
              </div>
              <div className="col-span-2 sm:col-span-2">
                <Input
                  type="number"
                  min={1}
                  placeholder="Qty"
                  value={item.quantity}
                  onChange={e =>
                    updateItem(item.id, { quantity: +e.target.value })
                  }
                  required
                />
              </div>
              <div className="col-span-3 sm:col-span-3">
                <Input
                  type="number"
                  min={0}
                  step={0.01}
                  placeholder="Rate"
                  value={item.rate}
                  onChange={e =>
                    updateItem(item.id, { rate: +e.target.value })
                  }
                  required
                />
              </div>
              <div className="col-span-2 flex items-center justify-between">
                <span className="font-semibold text-gray-800">${item.amount.toFixed(2)}</span>
                <button
                  type="button"
                  className="ml-2 text-red-500 underline text-xs"
                  onClick={() => removeItem(item.id)}
                  disabled={form.items.length === 1}
                  aria-label="Remove item"
                >
                  Remove
                </button>
              </div>
            </div>
          ))}
        </div>
        <button
          type="button"
          className="mt-3 px-4 py-1 rounded bg-blue-100 text-blue-700 text-sm font-medium hover:bg-blue-200"
          onClick={addItem}
        >+ Add item</button>
      </section>
      {/* Totals */}
      <section>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div>
            <label className="text-gray-600 text-sm mb-1 block">Tax rate (%)</label>
            <Input
              type="number"
              min={0}
              step={0.01}
              value={form.taxRate}
              onChange={e => setField("taxRate", +e.target.value)}
            />
          </div>
          <div>
            <label className="text-gray-600 text-sm mb-1 block">Discount</label>
            <Input
              type="number"
              min={0}
              step={0.01}
              value={form.discount}
              onChange={e => setField("discount", +e.target.value)}
            />
          </div>
        </div>
      </section>
    </form>
  );
};

export default InvoiceForm;
