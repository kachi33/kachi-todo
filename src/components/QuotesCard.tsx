"use client";

import { useState } from "react";
import { Quote } from "lucide-react";
import { toast } from "sonner";

const MOTIVATIONAL_QUOTES = [
  {
    text: "Discipline beats motivation.",
    author: "Unknown"
  },
  {
    text: "The secret of getting ahead is getting started.",
    author: "Mark Twain"
  },
  {
    text: "Don't watch the clock; do what it does. Keep going.",
    author: "Sam Levenson"
  },
  {
    text: "The only way to do great work is to love what you do.",
    author: "Steve Jobs"
  },
  {
    text: "Success is the sum of small efforts repeated day in and day out.",
    author: "Robert Collier"
  },
  {
    text: "You don't have to be great to start, but you have to start to be great.",
    author: "Zig Ziglar"
  },
  {
    text: "Focus on being productive instead of busy.",
    author: "Tim Ferriss"
  },
  {
    text: "The future depends on what you do today.",
    author: "Mahatma Gandhi"
  }
];

const QuotesCard = () => {
  const [currentQuoteIndex, setCurrentQuoteIndex] = useState(0);
  const [isSaved, setIsSaved] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const currentQuote = MOTIVATIONAL_QUOTES[currentQuoteIndex];

  const handleSaveQuote = () => {
    setIsSaved(!isSaved);
    toast.success(isSaved ? "Quote unsaved" : "Quote saved!");
  };

  const handleNewQuote = () => {
    setIsRefreshing(true);
    // Get a random quote different from current
    let newIndex;
    do {
      newIndex = Math.floor(Math.random() * MOTIVATIONAL_QUOTES.length);
    } while (newIndex === currentQuoteIndex && MOTIVATIONAL_QUOTES.length > 1);

    setTimeout(() => {
      setCurrentQuoteIndex(newIndex);
      setIsSaved(false);
      setIsRefreshing(false);
    }, 300);
  };

  return (
    <div className="flex flex-col items-center justify-between p-8 bg-linear-to-br from-card to-card/80 rounded-2xl border border-border h-full min-h-[300px]">
      {/* Quote Content */}
      <div className="flex-1 flex flex-col items-center justify-center text-center px-4">
        <div className="mb-4">
          <Quote className="h-12 w-12 text-muted-foreground/30 mb-4" />
        </div>

        <p className={`text-2xl font-serif font-medium text-foreground mb-4 transition-opacity duration-300 ${
          isRefreshing ? 'opacity-0' : 'opacity-100'
        }`}>
          {currentQuote.text}
        </p>

        <p className={`text-sm text-muted-foreground transition-opacity duration-300 ${
          isRefreshing ? 'opacity-0' : 'opacity-100'
        }`}>
          — {currentQuote.author}
        </p>
      </div>

      {/* Action Buttons
      <div className="flex items-center gap-4 mt-6">
        <Button
          variant="outline"
          size="lg"
          className="flex items-center gap-4"
          onClick={handleNewQuote}
          disabled={isRefreshing}
        >
          <RefreshCw className={`h-5 w-5 ${isRefreshing ? 'animate-spin' : ''}`} />
          Refresh
        </Button>
      </div> */}
    </div>
  );
};

export default QuotesCard;
