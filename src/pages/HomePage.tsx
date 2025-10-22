
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import LandingPage from "@/components/LandingPage";
import { useAuthLocal } from "@/hooks/useAuthLocal";

const HomePage = () => {
  const navigate = useNavigate();
  const { user } = useAuthLocal();

  const handleGetStarted = () => {
    navigate('/dashboard');
  };

  const handleSignUp = () => {
    navigate('/signup');
  };

  const handleSignIn = () => {
    navigate('/signin');
  };

  // Sample invoice data for the preview - always show this regardless of user status
  const sampleInvoiceData = {
    businessName: "Comprehensive Invoice Procedure",
    businessLogo: "",
    invoiceNumber: "INV-2024-12-001",
    clientName: "Acme Corporation",
    total: "$2,500.00",
    status: 'paid' as const,
    currency: "USD"
  };

  return (
    <div className="min-h-screen">
      <LandingPage
        businessName={sampleInvoiceData.businessName}
        businessLogo={sampleInvoiceData.businessLogo}
        invoiceNumber={sampleInvoiceData.invoiceNumber}
        clientName={sampleInvoiceData.clientName}
        total={sampleInvoiceData.total}
        status={sampleInvoiceData.status}
        currency={sampleInvoiceData.currency}
        onGetStarted={handleGetStarted}
      />
      
      {/* Authentication buttons for new users */}
      {!user && (
        <div className="fixed top-4 right-4 flex gap-2 z-50">
          <Button 
            variant="outline" 
            onClick={handleSignIn}
            className="bg-white/90 hover:bg-white"
          >
            Sign In
          </Button>
          <Button 
            onClick={handleSignUp}
            className="bg-blue-600 hover:bg-blue-700"
          >
            Sign Up
          </Button>
        </div>
      )}
    </div>
  );
};

export default HomePage;
