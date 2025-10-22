import React, { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export type EmailJsConfig = {
  serviceId: string;
  templateId: string;
  userId: string;
};

const DEFAULT_CONFIG = {
  serviceId: "service_ynqkkbg",
  templateId: "template_7gj4flh",
  userId: "atsHmWT3DU5BeCBQW",
};

const LOCAL_KEY = "invoiceease-emailjs-config";

export function getEmailJsConfig(): EmailJsConfig | null {
  try {
    const raw = localStorage.getItem(LOCAL_KEY);
    if (!raw) return null;
    return JSON.parse(raw);
  } catch {
    return null;
  }
}

export function setEmailJsConfig(cfg: EmailJsConfig) {
  localStorage.setItem(LOCAL_KEY, JSON.stringify(cfg));
}

const EmailJsSettingsDialog: React.FC<{
  open: boolean;
  setOpen: (o: boolean) => void;
}> = ({ open, setOpen }) => {
  const [serviceId, setServiceId] = useState("");
  const [templateId, setTemplateId] = useState("");
  const [userId, setUserId] = useState("");

  useEffect(() => {
    // If not set in localStorage, set initial (your) credentials once
    if (!getEmailJsConfig()) {
      setEmailJsConfig(DEFAULT_CONFIG);
    }
    if (open) {
      const cfg = getEmailJsConfig();
      setServiceId(cfg?.serviceId || "");
      setTemplateId(cfg?.templateId || "");
      setUserId(cfg?.userId || "");
    }
  }, [open]);

  const handleSave = () => {
    setEmailJsConfig({ serviceId, templateId, userId });
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>EmailJS Integration Settings</DialogTitle>
          <p className="text-xs text-gray-500">
            Enter your <b>Service ID</b>, <b>Template ID</b>, and <b>Public Key</b>.<br />
            These will be saved securely in your browser (localStorage).
          </p>
        </DialogHeader>
        <form className="space-y-4" onSubmit={e => { e.preventDefault(); handleSave(); }}>
          <div>
            <label className="block text-sm font-semibold mb-1">Service ID</label>
            <Input value={serviceId} onChange={e => setServiceId(e.target.value)} required autoFocus />
          </div>
          <div>
            <label className="block text-sm font-semibold mb-1">Template ID</label>
            <Input value={templateId} onChange={e => setTemplateId(e.target.value)} required />
          </div>
          <div>
            <label className="block text-sm font-semibold mb-1">Public Key</label>
            <Input value={userId} onChange={e => setUserId(e.target.value)} required />
          </div>
          <DialogFooter>
            <Button variant="outline" type="button" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button type="submit">Save</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default EmailJsSettingsDialog;
