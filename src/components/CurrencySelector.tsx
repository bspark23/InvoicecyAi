
import React, { useEffect, useState } from "react";
import { currencies } from "@/types/invoice";

const STORAGE_KEY = "invoicer-pro-currency";

interface CurrencySelectorProps {
  value: string;
  onChange: (currencyCode: string) => void;
}

const CurrencySelector: React.FC<CurrencySelectorProps> = ({ value, onChange }) => {
  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved && value !== saved) {
      onChange(saved);
    }
    // eslint-disable-next-line
  }, []);

  return (
    <select
      className="border rounded px-2 py-1 bg-white dark:bg-gray-800 text-sm"
      value={value}
      onChange={e => {
        const newValue = e.target.value;
        localStorage.setItem(STORAGE_KEY, newValue);
        onChange(newValue);
      }}
      aria-label="Select currency"
    >
      {currencies.map(c => (
        <option value={c.code} key={c.code}>
          {c.symbol} {c.code}
        </option>
      ))}
    </select>
  );
};

export default CurrencySelector;
