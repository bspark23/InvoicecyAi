
import React from "react";

const SectionCard: React.FC<{ title?: string; children: React.ReactNode; className?: string }> = ({
  title, children, className = ""
}) => (
  <div className={`mb-4 bg-white dark:bg-gray-900 rounded-2xl shadow-md p-5 ${className}`}>
    {title && <h2 className="text-lg font-bold text-blue-900 mb-3 dark:text-blue-300">{title}</h2>}
    {children}
  </div>
);
export default SectionCard;
