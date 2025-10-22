
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { HeartHandshake, Banknote, ChevronLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";

const VoluntaryContributionPage = () => {
  const navigate = useNavigate();

  return (
    <section className="flex justify-center items-center min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      <Card className="w-full max-w-2xl shadow-2xl border-blue-200 border bg-blue-50 dark:bg-gray-900/70 bg-opacity-90">
        <CardContent className="p-8 flex flex-col items-center text-center">
          <div className="mb-4 flex items-center justify-center gap-3">
            <HeartHandshake className="w-8 h-8 text-pink-600" />
            <Badge className="bg-pink-600/90 text-white ml-2 text-base px-4 py-2 shadow-md">
              Voluntary Contribution
            </Badge>
          </div>
          <h1 className="text-2xl font-bold mb-3 text-gray-900 dark:text-white">Support InvoiceEase!</h1>
          <p className="mb-6 text-gray-700 dark:text-gray-200">
            If you love what we do, consider supporting our free invoice app! 🧡 Your contribution helps us improve and maintain the platform.
          </p>
          <div className="mb-5 w-full flex flex-col items-center">
            <div className="flex flex-col gap-4 p-5 rounded bg-white/90 dark:bg-gray-800/60 border border-pink-200 dark:border-gray-700 shadow-inner w-full max-w-md">
              <div className="flex gap-2 items-center">
                <Banknote className="w-6 h-6 text-green-700" />
                <span className="font-semibold text-md text-gray-900 dark:text-gray-100">Account Name:</span>
                <span className="font-mono px-2">{`dimi data`}</span>
              </div>
              <div className="flex gap-2 items-center">
                <Banknote className="w-6 h-6 text-green-700" />
                <span className="font-semibold text-md text-gray-900 dark:text-gray-100">Account Number:</span>
                <span className="font-mono bg-gray-100 dark:bg-gray-800 px-3 py-1 rounded text-blue-900 dark:text-pink-300 tracking-wider text-lg select-all">
                  dimi data
                </span>
              </div>
              <div className="flex gap-2 items-center">
                <Banknote className="w-6 h-6 text-green-700" />
                <span className="font-semibold text-md text-gray-900 dark:text-gray-100">Bank Name:</span>
                <span className="font-mono px-2">{`dimi data`}</span>
              </div>
            </div>
            <span className="text-xs text-gray-400 mt-3">Copy the account details above to make a contribution.</span>
          </div>
          <p className="italic text-sm text-gray-500 dark:text-gray-400 mb-4">
            Every contribution, no matter how small, is deeply appreciated and goes directly towards supporting this free platform.
          </p>
          <Button onClick={() => navigate("/")} variant="outline" className="mt-6">
            <ChevronLeft className="w-4 h-4 mr-1" />
            Back to Home
          </Button>
        </CardContent>
      </Card>
    </section>
  );
};

export default VoluntaryContributionPage;
