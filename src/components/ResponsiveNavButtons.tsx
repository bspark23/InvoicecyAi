
import React from "react";
import { Button } from "@/components/ui/button";
import { HelpCircle, MessageCircle } from "lucide-react";

interface ResponsiveNavButtonsProps {
  onHelpClick: () => void;
  onChatClick: () => void;
}

const ResponsiveNavButtons: React.FC<ResponsiveNavButtonsProps> = ({
  onHelpClick,
  onChatClick
}) => {
  return (
    <div className="flex items-center gap-2">
      <Button 
        variant="outline" 
        size="sm" 
        onClick={onHelpClick}
        className="hidden sm:flex"
      >
        <HelpCircle className="w-4 h-4 mr-2" />
        FAQ
      </Button>
      <Button 
        variant="outline" 
        size="sm" 
        onClick={onChatClick}
        className="hidden sm:flex"
      >
        <MessageCircle className="w-4 h-4 mr-2" />
        Chat
      </Button>
      
      {/* Mobile version */}
      <div className="flex sm:hidden gap-1">
        <Button 
          variant="outline" 
          size="sm" 
          onClick={onHelpClick}
          className="p-2"
        >
          <HelpCircle className="w-4 h-4" />
        </Button>
        <Button 
          variant="outline" 
          size="sm" 
          onClick={onChatClick}
          className="p-2"
        >
          <MessageCircle className="w-4 h-4" />
        </Button>
      </div>
    </div>
  );
};

export default ResponsiveNavButtons;
