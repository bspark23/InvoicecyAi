
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Sparkles, FileText, BrainCog, ArrowDown } from "lucide-react";

type StudyAIResponse = {
  explanation: string;
  bulletPoints: string[];
  terms: { term: string; explanation: string; }[];
  mcqs: { question: string; options: string[]; answer: number; }[];
  suggestions: string;
};

function mockAIProcess(input: string): StudyAIResponse {
  // Placeholder/mock for actual AI processing—replace with API call as needed
  return {
    explanation:
      "This is a clear and student-friendly explanation of the provided material. AI will break down the input in an easy-to-understand way.",
    bulletPoints: [
      "Main concept or idea described in the content.",
      "Any definitions, formulas, or key steps.",
      "Summary facts or major points."
    ],
    terms: [
      { term: "ComplexTerm", explanation: "This is a simple explanation of a complex term." }
    ],
    mcqs: [
      {
        question: "What is this Study Assistant designed to do?",
        options: [
          "Generate invoices",
          "Help students learn faster and smarter",
          "Play music"
        ],
        answer: 1
      },
      {
        question: "Which input can you use?",
        options: [
          "Class notes",
          "YouTube video transcript",
          "Both above"
        ],
        answer: 2
      },
      {
        question: "What will the Assistant NOT do?",
        options: [
          "Explain complex terms",
          "Summarize key points",
          "Assume things not in the input"
        ],
        answer: 2
      }
    ],
    suggestions:
      "Review definitions and formulas again if they seem unclear. Re-read the summary to ensure you grasp the main points. If any MCQs were challenging, focus on those sections."
  };
}

export default function StudyAssistant() {
  const [input, setInput] = useState("");
  const [result, setResult] = useState<StudyAIResponse | null>(null);
  const [loading, setLoading] = useState(false);

  const handleProcess = () => {
    setLoading(true);
    setTimeout(() => {
      // Replace with your AI API call here instead of mock
      setResult(mockAIProcess(input));
      setLoading(false);
    }, 900); // Artificial delay for UX
  };

  return (
    <Card className="shadow-lg border-0 bg-gradient-to-br from-white/95 to-blue-50/90 dark:from-gray-900/90 dark:to-blue-950/80 backdrop-blur-md rounded-3xl overflow-hidden animate-fade-in">
      <CardHeader className="flex flex-row items-center gap-4 p-6 pb-2">
        <div className="p-2 bg-blue-100 dark:bg-purple-900/40 rounded-lg">
          <BrainCog className="w-7 h-7 text-blue-700 dark:text-purple-300" />
        </div>
        <div>
          <CardTitle className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-1">Intelligent Study Assistant</CardTitle>
          <p className="text-sm text-gray-600 dark:text-gray-200">Paste class notes, exam questions, or YouTube transcripts to get a friendly breakdown.</p>
        </div>
        <Badge className="ml-auto bg-gradient-to-r from-violet-300 to-blue-300 text-blue-900 dark:text-white">
          <Sparkles className="w-3 h-3 mr-1" /> AI Powered
        </Badge>
      </CardHeader>
      <CardContent className="space-y-6 pt-4">
        <form
          className="space-y-3"
          onSubmit={e => {
            e.preventDefault();
            handleProcess();
          }}
        >
          <Textarea
            rows={4}
            placeholder="Paste text, transcript, or question here..."
            value={input}
            onChange={e => setInput(e.target.value)}
            className="border-2 border-blue-200 dark:border-blue-500 focus:border-blue-400 focus:shadow-lg transition min-h-[96px] bg-white/80 dark:bg-gray-800/80"
            required
          />
          <div className="flex gap-3">
            <Button
              type="submit"
              className="bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold px-6 py-2 rounded-full shadow hover:scale-105 transition-all"
              disabled={loading || !input.trim()}
            >
              <Sparkles className="w-4 h-4 mr-2" />
              Analyze Now
            </Button>
            {loading && (
              <span className="text-blue-600 dark:text-blue-300 flex items-center">
                <ArrowDown className="animate-bounce w-5 h-5 mr-1" /> Thinking...
              </span>
            )}
          </div>
        </form>
        {result && (
          <div className="divide-y divide-blue-100 dark:divide-blue-800 mt-6 rounded-lg bg-white/80 dark:bg-gray-900/70 shadow p-5 space-y-5">
            <div>
              <h3 className="font-semibold text-blue-700 dark:text-blue-300 mb-1">1. Easy Explanation</h3>
              <p className="text-gray-800 dark:text-gray-100 mb-2">{result.explanation}</p>
            </div>
            <div className="pt-4">
              <h3 className="font-semibold text-purple-700 dark:text-purple-300 mb-1">2. Key Points</h3>
              <ul className="list-disc ml-5 text-gray-900 dark:text-gray-100">
                {result.bulletPoints.map((bp, i) => (
                  <li key={i} className="mb-1">{bp}</li>
                ))}
              </ul>
            </div>
            <div className="pt-4">
              <h3 className="font-semibold text-blue-700 dark:text-blue-300 mb-1">3. Tricky Terms</h3>
              <ul className="list-inside text-gray-700 dark:text-gray-200">
                {result.terms.map((t, i) => (
                  <li key={i}><strong>{t.term}:</strong> {t.explanation}</li>
                ))}
              </ul>
            </div>
            <div className="pt-4">
              <h3 className="font-semibold text-purple-700 dark:text-purple-300 mb-1">4. Quick Practice</h3>
              {result.mcqs.map((q, i) => (
                <div key={i} className="mb-4">
                  <span className="font-medium">{i + 1}. {q.question}</span>
                  <ul className="ml-5 mt-1">
                    {q.options.map((opt, idx) => (
                      <li key={idx} className={idx === q.answer ? "text-green-600 font-semibold dark:text-green-400" : ""}>
                        <span className="mr-2">{String.fromCharCode(65 + idx)}.</span>
                        {opt}
                      </li>
                    ))}
                  </ul>
                  <div className="mt-1 text-xs text-gray-600 dark:text-gray-300">
                    <span className="font-semibold">Answer:</span> {String.fromCharCode(65 + q.answer)}
                  </div>
                </div>
              ))}
            </div>
            <div className="pt-4">
              <h3 className="font-semibold text-blue-700 dark:text-blue-300 mb-1">5. Review Suggestions</h3>
              <p className="text-gray-800 dark:text-gray-100">{result.suggestions}</p>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
