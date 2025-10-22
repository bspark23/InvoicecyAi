
import React, { useRef } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Upload, X } from "lucide-react";

interface LogoSignatureUploadProps {
  isOpen: boolean;
  onClose: () => void;
  businessLogo?: string;
  signatureImage?: string;
  onLogoUpload: (dataUrl: string) => void;
  onSignatureUpload: (dataUrl: string) => void;
  currentLogo?: string;
  currentSignature?: string;
}

const LogoSignatureUpload: React.FC<LogoSignatureUploadProps> = ({
  isOpen,
  onClose,
  businessLogo,
  signatureImage,
  onLogoUpload,
  onSignatureUpload,
  currentLogo,
  currentSignature
}) => {
  const logoInputRef = useRef<HTMLInputElement>(null);
  const signatureInputRef = useRef<HTMLInputElement>(null);

  const handleFileUpload = (
    file: File | null,
    onChange: (dataUrl: string) => void
  ) => {
    if (!file) return;
    
    const reader = new FileReader();
    reader.onload = (e) => {
      onChange(e.target?.result as string);
    };
    reader.readAsDataURL(file);
  };

  const logoUrl = currentLogo || businessLogo;
  const signatureUrl = currentSignature || signatureImage;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Logo & Signature</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-6">
          {/* Business Logo */}
          <div>
            <Label htmlFor="businessLogo">Business Logo</Label>
            <div className="mt-2 space-y-3">
              <input
                ref={logoInputRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={(e) => handleFileUpload(e.target.files?.[0] || null, onLogoUpload)}
              />
              <Button
                variant="outline"
                onClick={() => logoInputRef.current?.click()}
                className="w-full"
              >
                <Upload className="w-4 h-4 mr-2" />
                Upload Business Logo
              </Button>
              {logoUrl && (
                <div className="relative inline-block">
                  <img 
                    src={logoUrl} 
                    alt="Business Logo" 
                    className="max-w-32 max-h-20 object-contain border rounded bg-white"
                  />
                  <Button
                    variant="destructive"
                    size="sm"
                    className="absolute -top-2 -right-2 h-6 w-6 rounded-full p-0"
                    onClick={() => onLogoUpload('')}
                  >
                    <X className="w-3 h-3" />
                  </Button>
                </div>
              )}
            </div>
          </div>

          {/* Signature */}
          <div>
            <Label htmlFor="signature">Digital Signature</Label>
            <div className="mt-2 space-y-3">
              <input
                ref={signatureInputRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={(e) => handleFileUpload(e.target.files?.[0] || null, onSignatureUpload)}
              />
              <Button
                variant="outline"
                onClick={() => signatureInputRef.current?.click()}
                className="w-full"
              >
                <Upload className="w-4 h-4 mr-2" />
                Upload Signature
              </Button>
              {signatureUrl && (
                <div className="relative inline-block">
                  <img 
                    src={signatureUrl} 
                    alt="Signature" 
                    className="max-w-40 max-h-16 object-contain border rounded bg-white"
                  />
                  <Button
                    variant="destructive"
                    size="sm"
                    className="absolute -top-2 -right-2 h-6 w-6 rounded-full p-0"
                    onClick={() => onSignatureUpload('')}
                  >
                    <X className="w-3 h-3" />
                  </Button>
                </div>
              )}
            </div>
          </div>
          
          <div className="flex justify-end gap-2 pt-4">
            <Button variant="outline" onClick={onClose}>
              Close
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default LogoSignatureUpload;
