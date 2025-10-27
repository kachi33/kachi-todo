"use client";

import { useState } from "react";
import { Quote } from "lucide-react";
import { toast } from "sonner";

import { Button } from "./ui/button";
import { RefreshCw } from "lucide-react";

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
    <div className="flex max-h-80 flex-col py-8 px-2 items-center space-y-2 md:space-y-4">
        {/* Quote Content */}
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
        {/* Action Buttons */}
        <div className="flex items-center gap-4 ">
          <button
            onClick={handleNewQuote}
            disabled={isRefreshing}
            className="flex items-center gap-2 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <RefreshCw className={`h-5 w-5 ${isRefreshing ? 'animate-spin' : ''}`} />
            <span>Refresh</span>
          </button>
        </div>
      </div>

);
};

export default QuotesCard;
