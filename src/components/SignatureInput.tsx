
import React, { useRef } from 'react';

interface SignatureInputProps {
  value?: string;
  onChange: (dataUrl: string) => void;
}

const SignatureInput: React.FC<SignatureInputProps> = ({ value, onChange }) => {
  const inputRef = useRef<HTMLInputElement>(null);

  // Handler for uploaded image
  const handleUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (e2) => {
      onChange(e2.target?.result as string);
    };
    reader.readAsDataURL(file);
  };

  // Handler for clear signature
  const handleClear = () => onChange("");

  return (
    <div>
      <label className="block text-sm font-semibold mb-1">Signature <span className="font-normal text-xs text-gray-400">(optional)</span></label>
      <div className="flex items-center gap-4">
        <input
          type="file"
          accept="image/*"
          className="block text-sm"
          onChange={handleUpload}
          ref={inputRef}
        />
        {value && (
          <>
            <img src={value} alt="Signature" className="w-32 h-16 object-contain border rounded bg-white" />
            <button type="button" onClick={handleClear} className="text-xs text-red-600 underline">Remove</button>
          </>
        )}
      </div>
    </div>
  );
};

export default SignatureInput;
