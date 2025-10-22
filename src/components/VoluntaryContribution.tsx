
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { HeartHandshake, Banknote } from "lucide-react";

const VoluntaryContribution = () => {
  return (
    <section className="py-16 flex justify-center">
      <Card className="w-full max-w-2xl shadow-xl border-blue-200 border bg-blue-50 dark:bg-gray-900/70 bg-opacity-90">
        <CardContent className="p-8 flex flex-col items-center text-center">
          <div className="mb-4 flex items-center justify-center gap-3">
            <HeartHandshake className="w-8 h-8 text-pink-600" />
            <Badge className="bg-pink-600/90 text-white ml-2 text-base px-4 py-2 shadow-md">
              Voluntary Contribution
            </Badge>
          </div>
          <h3 className="text-2xl font-bold mb-2 text-gray-900 dark:text-white">Support InvoiceEase!</h3>
          <p className="mb-4 text-gray-600 dark:text-gray-300 text-base">
            We love providing this app for free. If this tool has helped you, please consider making a voluntary contribution to support future development.
          </p>
          <div className="mb-5 flex flex-col items-center">
            <div className="flex items-center gap-2 p-3 rounded bg-white/80 dark:bg-gray-800/60 border border-pink-200 dark:border-gray-700 shadow-inner">
              <Banknote className="w-6 h-6 text-green-600" />
              <span className="font-semibold text-lg text-gray-800 dark:text-gray-100">
                Account Number:
              </span>
              <span className="font-mono bg-gray-100 dark:bg-gray-800 px-3 py-1 rounded text-blue-900 dark:text-pink-300 tracking-wider text-lg select-all">
                dimi data
              </span>
            </div>
            <span className="text-xs text-gray-400 mt-2">*Copy above account number to make a contribution</span>
          </div>
          <p className="italic text-sm text-gray-500 dark:text-gray-400">
            Every contribution, no matter how small, is deeply appreciated and goes directly towards maintaining this platform.
          </p>
        </CardContent>
      </Card>
    </section>
  );
};

export default VoluntaryContribution;
