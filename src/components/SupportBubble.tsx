
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { HelpCircle, MessageCircle, Mail } from "lucide-react";

interface SupportBubbleProps {
  onHelpClick: () => void;
}

const SupportBubble: React.FC<SupportBubbleProps> = ({ onHelpClick }) => {
  const [showSupportOptions, setShowSupportOptions] = useState(false);

  const handleWhatsAppClick = () => {
    window.open("https://wa.me/2348036639578", "_blank");
  };

  const handleEmailClick = () => {
    window.open("mailto:adaoma2826@gmail.com", "_blank");
  };

  return (
    <>
      {/* Floating Help Button */}
      <div className="fixed bottom-6 right-6 z-50 flex flex-col gap-3">
        {/* Support Chat Options */}
        <Button
          onClick={() => setShowSupportOptions(true)}
          className="w-14 h-14 rounded-full bg-blue-600 hover:bg-blue-700 shadow-lg"
          title="Chat with Support"
        >
          <MessageCircle className="w-6 h-6" />
        </Button>

        {/* Help Center Button */}
        <Button
          onClick={onHelpClick}
          className="w-14 h-14 rounded-full bg-green-600 hover:bg-green-700 shadow-lg"
          title="Help Center"
        >
          <HelpCircle className="w-6 h-6" />
        </Button>
      </div>

      {/* Support Options Modal */}
      <Dialog open={showSupportOptions} onOpenChange={setShowSupportOptions}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <MessageCircle className="w-5 h-5" />
              Chat With Us
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-4">
            <Card className="cursor-pointer hover:shadow-md transition-shadow" onClick={handleWhatsAppClick}>
              <CardContent className="p-6">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                    <span className="text-2xl">📱</span>
                  </div>
                  <div>
                    <h3 className="font-semibold text-green-700">Chat with us on WhatsApp</h3>
                    <p className="text-sm text-gray-600">Get instant support via WhatsApp</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="cursor-pointer hover:shadow-md transition-shadow" onClick={handleEmailClick}>
              <CardContent className="p-6">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                    <Mail className="w-6 h-6 text-blue-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-blue-700">Send us an Email</h3>
                    <p className="text-sm text-gray-600">Email us for detailed support</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <div className="text-center pt-4">
              <Button variant="outline" onClick={() => setShowSupportOptions(false)}>
                Close
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default SupportBubble;
