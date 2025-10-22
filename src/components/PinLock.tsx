import React, { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

const STORAGE_KEY = "invoicer-pro-pin";

type Mode = "setup" | "confirm" | "entry" | "changeEnterOld" | "changeNew" | "changeConfirm";

interface PinLockProps {
  onUnlock: () => void;
}

const PinLock: React.FC<PinLockProps> = ({ onUnlock }) => {
  const [step, setStep] = useState<Mode>(() => {
    return localStorage.getItem(STORAGE_KEY) ? "entry" : "setup";
  });
  const [pin, setPin] = useState("");
  const [pinConfirm, setPinConfirm] = useState("");
  const [pinEntry, setPinEntry] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  // For change PIN flow
  const [oldPin, setOldPin] = useState("");
  const [newPin, setNewPin] = useState("");
  const [newPinConfirm, setNewPinConfirm] = useState("");

  // Set up new PIN
  const handleSetup = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);
    if (!/^\d{4}$/.test(pin)) {
      setError("PIN must be exactly 4 digits.");
      return;
    }
    setStep("confirm");
    setPinConfirm("");
  };

  // Confirm PIN during setup
  const handleConfirm = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);
    if (pin !== pinConfirm) {
      setError("PIN codes do not match.");
      return;
    }
    localStorage.setItem(STORAGE_KEY, pin);
    onUnlock();
  };

  // Entry PIN
  const handleEntry = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);
    const storedPin = localStorage.getItem(STORAGE_KEY);
    // console.log("DEBUG: Input PIN:", pinEntry);
    // console.log("DEBUG: Stored PIN:", storedPin);
    if (pinEntry === storedPin) {
      setError(null);
      setSuccess(null);
      onUnlock();
    } else {
      setError("Incorrect PIN. Try again.");
      setPinEntry("");
    }
  };

  // Change PIN: verify current PIN
  const handleChangeEnterOld = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);
    const storedPin = localStorage.getItem(STORAGE_KEY);
    if (oldPin === storedPin) {
      setStep("changeNew");
      setNewPin("");
      setNewPinConfirm("");
    } else {
      setError("Incorrect current PIN.");
      setOldPin("");
    }
  };

  // Set new PIN in change PIN flow
  const handleChangeNew = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);
    if (!/^\d{4}$/.test(newPin)) {
      setError("PIN must be exactly 4 digits.");
      return;
    }
    setStep("changeConfirm");
    setNewPinConfirm("");
  };

  // Confirm and save new PIN in change PIN flow (FIXED: unlock after change)
  const handleChangeConfirm = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);
    if (newPin !== newPinConfirm) {
      setError("PIN codes do not match.");
      return;
    }
    localStorage.setItem(STORAGE_KEY, newPin);
    setOldPin("");
    setNewPin("");
    setNewPinConfirm("");
    setStep("entry");
    setPinEntry("");
    setSuccess(null); // Hide success msg, unlock immediately!
    onUnlock();
  };

  // Switch to change pin mode from PIN entry
  const startChangePin = () => {
    setStep("changeEnterOld");
    setOldPin("");
    setNewPin("");
    setNewPinConfirm("");
    setError(null);
    setSuccess(null);
  };

  // Clear error/success when step changes via cancel
  const handleCancel = () => {
    setStep("entry");
    setError(null);
    setSuccess(null);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-100 via-white to-blue-50 dark:from-gray-950 dark:via-gray-900 dark:to-gray-800">
      <div className="bg-white dark:bg-gray-900 rounded-xl shadow-lg max-w-sm w-full p-8 animate-fade-in">
        <h1 className="text-2xl font-bold mb-4 text-center text-blue-900">Invoicer Pro</h1>
        {step === "setup" && (
          <form onSubmit={handleSetup} className="space-y-4">
            <div>
              <label className="block text-gray-700 dark:text-gray-200 mb-1 text-sm">Set a new 4-digit PIN</label>
              <Input
                type="password"
                pattern="\d{4}"
                maxLength={4}
                inputMode="numeric"
                autoFocus
                value={pin}
                onChange={e => setPin(e.target.value.replace(/\D/g, ""))}
                className="text-center text-lg tracking-widest"
                required
              />
            </div>
            {error && <div className="text-red-500 text-sm">{error}</div>}
            {success && <div className="text-green-500 text-sm">{success}</div>}
            <Button type="submit" className="w-full">Next</Button>
          </form>
        )}
        {step === "confirm" && (
          <form onSubmit={handleConfirm} className="space-y-4">
            <div>
              <label className="block text-gray-700 dark:text-gray-200 mb-1 text-sm">Confirm your 4-digit PIN</label>
              <Input
                type="password"
                pattern="\d{4}"
                maxLength={4}
                inputMode="numeric"
                value={pinConfirm}
                onChange={e => setPinConfirm(e.target.value.replace(/\D/g, ""))}
                className="text-center text-lg tracking-widest"
                required
                autoFocus
              />
            </div>
            {error && <div className="text-red-500 text-sm">{error}</div>}
            {success && <div className="text-green-500 text-sm">{success}</div>}
            <Button type="submit" className="w-full">Save PIN</Button>
          </form>
        )}

        {/* PIN Entry with Change PIN option */}
        {step === "entry" && (
          <>
            <form onSubmit={handleEntry} className="space-y-4">
              <div>
                <label className="block text-gray-700 dark:text-gray-200 mb-1 text-sm">Enter your 4-digit PIN</label>
                <Input
                  type="password"
                  pattern="\d{4}"
                  maxLength={4}
                  inputMode="numeric"
                  value={pinEntry}
                  onChange={e => setPinEntry(e.target.value.replace(/\D/g, ""))}
                  className="text-center text-lg tracking-widest"
                  required
                  autoFocus
                />
              </div>
              {error && <div className="text-red-500 text-sm">{error}</div>}
              {success && <div className="text-green-500 text-sm">{success}</div>}
              <Button type="submit" className="w-full">Unlock</Button>
            </form>
            <div className="flex justify-center mt-4">
              <Button variant="outline" type="button" size="sm" onClick={startChangePin}>
                Change PIN
              </Button>
            </div>
          </>
        )}

        {/* Change PIN - step 1: Enter old PIN */}
        {step === "changeEnterOld" && (
          <form onSubmit={handleChangeEnterOld} className="space-y-4">
            <div>
              <label className="block text-gray-700 dark:text-gray-200 mb-1 text-sm">
                Enter your current 4-digit PIN
              </label>
              <Input
                type="password"
                pattern="\d{4}"
                maxLength={4}
                inputMode="numeric"
                autoFocus
                value={oldPin}
                onChange={e => setOldPin(e.target.value.replace(/\D/g, ""))}
                className="text-center text-lg tracking-widest"
                required
              />
            </div>
            {error && <div className="text-red-500 text-sm">{error}</div>}
            {success && <div className="text-green-500 text-sm">{success}</div>}
            <div className="flex gap-2">
              <Button type="submit" className="w-full">Next</Button>
              <Button type="button" className="w-full" variant="secondary" onClick={handleCancel}>Cancel</Button>
            </div>
          </form>
        )}
        {/* Change PIN - step 2: Enter new PIN */}
        {step === "changeNew" && (
          <form onSubmit={handleChangeNew} className="space-y-4">
            <div>
              <label className="block text-gray-700 dark:text-gray-200 mb-1 text-sm">
                Set your new 4-digit PIN
              </label>
              <Input
                type="password"
                pattern="\d{4}"
                maxLength={4}
                inputMode="numeric"
                autoFocus
                value={newPin}
                onChange={e => setNewPin(e.target.value.replace(/\D/g, ""))}
                className="text-center text-lg tracking-widest"
                required
              />
            </div>
            {error && <div className="text-red-500 text-sm">{error}</div>}
            {success && <div className="text-green-500 text-sm">{success}</div>}
            <div className="flex gap-2">
              <Button type="submit" className="w-full">Next</Button>
              <Button type="button" className="w-full" variant="secondary" onClick={handleCancel}>Cancel</Button>
            </div>
          </form>
        )}
        {/* Change PIN - step 3: Confirm new PIN */}
        {step === "changeConfirm" && (
          <form onSubmit={handleChangeConfirm} className="space-y-4">
            <div>
              <label className="block text-gray-700 dark:text-gray-200 mb-1 text-sm">
                Confirm your new 4-digit PIN
              </label>
              <Input
                type="password"
                pattern="\d{4}"
                maxLength={4}
                inputMode="numeric"
                autoFocus
                value={newPinConfirm}
                onChange={e => setNewPinConfirm(e.target.value.replace(/\D/g, ""))}
                className="text-center text-lg tracking-widest"
                required
              />
            </div>
            {error && <div className="text-red-500 text-sm">{error}</div>}
            {success && <div className="text-green-500 text-sm">{success}</div>}
            <div className="flex gap-2">
              <Button type="submit" className="w-full">Save New PIN</Button>
              <Button type="button" className="w-full" variant="secondary" onClick={handleCancel}>Cancel</Button>
            </div>
          </form>
        )}

        <div className="text-xs text-center mt-5 text-gray-400">
          Your PIN is stored only on this device, never sent online.
        </div>
      </div>
    </div>
  );
};

export default PinLock;
