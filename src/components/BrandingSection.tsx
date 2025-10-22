
import React, { useRef, useState } from "react";
import { Smile } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

const defaultBranding = {
  name: "",
  phone: "",
  email: "",
  address: "",
  logo: ""
};

const BrandingSection: React.FC = () => {
  const [branding, setBranding] = useState(defaultBranding);
  const fileInput = useRef<HTMLInputElement | null>(null);

  const handleLogoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => setBranding(b => ({ ...b, logo: reader.result as string }));
    reader.readAsDataURL(file);
  };

  return (
    <div className="mb-4 rounded-2xl shadow-lg flex flex-col md:flex-row bg-gradient-to-r from-blue-100 via-blue-200 to-blue-50 overflow-hidden">
      {/* Branding Gradient Area */}
      <aside className="flex flex-col items-center justify-center p-8 gap-3 w-full md:w-64 bg-gradient-to-br from-blue-400/50 to-purple-300/40">
        <div className="relative h-24 w-24 rounded-full bg-white border-2 border-blue-200 flex items-center justify-center overflow-hidden shadow-lg">
          {branding.logo
            ? <img src={branding.logo} alt="Logo" className="object-cover h-full w-full"/>
            : (
              <span className="text-blue-400 font-bold text-xl">Add Logo</span>
            )}
        </div>
        <Button
          type="button"
          size="sm"
          onClick={() => fileInput.current?.click()}
          className="w-full mt-2"
        >
          {branding.logo ? "Change Logo" : "Upload Logo"}
        </Button>
        <input
          type="file"
          accept="image/*"
          ref={fileInput}
          className="hidden"
          onChange={handleLogoChange}
        />
        <div className="mt-6 w-full text-center">
          <div className="flex gap-1 items-center justify-center mb-1">
            <Smile className="inline-block text-yellow-400" size={20} />
            <span className="text-blue-700 font-bold text-base">Welcome to InvoiceEase!</span>
          </div>
          <div className="text-xs text-blue-700 font-medium">
            Personalize your business for professional invoices. 🧾
          </div>
        </div>
      </aside>
      {/* Business Details Form */}
      <div className="flex-grow grid grid-cols-1 sm:grid-cols-2 gap-6 p-8 bg-white">
        <div>
          <label className="text-xs font-medium text-gray-500">Business Name</label>
          <Input
            value={branding.name}
            onChange={e => setBranding(b => ({ ...b, name: e.target.value }))}
            placeholder="e.g. Acme Corp"
            maxLength={48}
          />
        </div>
        <div>
          <label className="text-xs font-medium text-gray-500">Phone</label>
          <Input
            value={branding.phone}
            onChange={e => setBranding(b => ({ ...b, phone: e.target.value }))}
            placeholder="+1 555 1234"
            maxLength={28}
          />
        </div>
        <div>
          <label className="text-xs font-medium text-gray-500">Email</label>
          <Input
            value={branding.email}
            onChange={e => setBranding(b => ({ ...b, email: e.target.value }))}
            type="email"
            placeholder="info@acme.com"
            maxLength={40}
          />
        </div>
        <div>
          <label className="text-xs font-medium text-gray-500">Address</label>
          <Input
            value={branding.address}
            onChange={e => setBranding(b => ({ ...b, address: e.target.value }))}
            placeholder="123 Main St, City"
            maxLength={78}
          />
        </div>
      </div>
    </div>
  );
};

export default BrandingSection;
