
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus, Sparkles, TrendingUp } from "lucide-react";

interface DashboardWelcomeProps {
  businessName: string;
  onCreateNew: () => void;
}

const DashboardWelcome = ({ businessName, onCreateNew }: DashboardWelcomeProps) => {
  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "Good morning";
    if (hour < 18) return "Good afternoon";
    return "Good evening";
  };

  return (
    <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-blue-600 via-purple-600 to-blue-800 p-8 mb-8 text-white shadow-2xl">
      {/* Background decorative elements */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -mr-32 -mt-32 animate-pulse"></div>
      <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/5 rounded-full -ml-24 -mb-24"></div>
      
      <div className="relative z-10">
        <div className="flex items-center justify-between">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <Sparkles className="w-6 h-6 text-yellow-300" />
              <span className="text-lg font-medium opacity-90">{getGreeting()}!</span>
            </div>
            <h1 className="text-4xl font-bold mb-2">
              Welcome back{businessName ? `, ${businessName}` : ''}
            </h1>
            <p className="text-xl opacity-90 mb-6">
              Ready to create professional invoices and grow your business?
            </p>
            <div className="flex flex-wrap gap-4">
              <Button 
                onClick={onCreateNew}
                size="lg"
                className="bg-white text-blue-600 hover:bg-gray-100 font-semibold shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300"
              >
                <Plus className="w-5 h-5 mr-2" />
                Create New Invoice
              </Button>
              <div className="flex items-center gap-2 text-white/80">
                <TrendingUp className="w-5 h-5" />
                <span>Your business is growing!</span>
              </div>
            </div>
          </div>
          <div className="hidden lg:block">
            <div className="w-32 h-32 bg-white/10 rounded-full flex items-center justify-center backdrop-blur-sm">
              <div className="w-20 h-20 bg-white/20 rounded-full flex items-center justify-center">
                <Plus className="w-12 h-12 text-white" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardWelcome;
