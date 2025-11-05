"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  X,
  ChevronRight,
  ChevronLeft,
  WifiOff,
  ListTodo,
  TrendingUp,
  Sparkles,
} from "lucide-react";
import { useTheme } from "@/contexts/ThemeContext";

const WelcomeTrack = "/welcome-track.svg";
const WelcomeRates = "/welcome-rates.svg";
const welcomeExhibit = "/welcome-exhibit.svg";

const CURRENT_VERSION = "1.0.0";

export function WelcomeModal() {
  const { theme } = useTheme();
  const [isOpen, setIsOpen] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);

  useEffect(() => {
    // Check if user has seen welcome for this version
    const welcomed = localStorage.getItem("tasq-welcomed");
    const version = localStorage.getItem("tasq-version");

    if (!welcomed || version !== CURRENT_VERSION) {
      // Show welcome modal after a brief delay
      const timer = setTimeout(() => setIsOpen(true), 500);
      return () => clearTimeout(timer);
    }
  }, []);

  // Developer helper: expose function to manually trigger welcome modal
  useEffect(() => {
    if (
      typeof window !== "undefined" &&
      process.env.NODE_ENV === "development"
    ) {
      (window as any).showWelcomeModal = () => {
        localStorage.removeItem("tasq-welcomed");
        localStorage.removeItem("tasq-version");
        setIsOpen(true);
        console.log(
          "✨ Welcome modal triggered! Refresh the page to see it from the beginning."
        );
      };

      return () => {
        delete (window as any).showWelcomeModal;
      };
    }
  }, []);

  const handleComplete = () => {
    localStorage.setItem("tasq-welcomed", "true");
    localStorage.setItem("tasq-version", CURRENT_VERSION);
    setIsOpen(false);
  };

  if (!isOpen) return null;

  const steps = [
    {
      title: "Welcome to Tasq! 👋",
      description: "Your new favorite task manager",
      content: (
        <div className="text-center py-8">
          <div className="mb-4 h-48 w-48 mx-auto">
              <img
                src={WelcomeTrack}
                alt="Welcome to Tasq"
                className={`w-full h-full object-contain ${
                  theme === 'dark' ? 'invert brightness-90' : ''
                }`}
              />
          </div>
          <h2 className="text-2xl font-bold mb-3">
            Welcome to{" "}
            <span className="bg-linear-to-r from-amber-600 to-amber-500 bg-clip-text text-transparent">
              Tasq
            </span>
          </h2>
          <p className="text-muted-foreground max-w-md mx-auto">
            Organize smarter, move faster, and stay focused — Tasq turns your
            to-dos into effortless progress.
          </p>
        </div>
      ),
    },
    {
      title: "Amazing Features",
      description: "Everything you need to stay organized",
      content: (
        <div className="py-6 flex flex-row items-center justify-center ">
          <div className="flex flex-col p-4">
            <div>
              <img src={WelcomeTrack}  alt="Offline First" className="w-24 h-24 mx-auto mb-2" />
            </div>
              <h3 className="font-semibold text-center mb-1">Works Offline </h3>
              <p className="text-sm text-center text-muted-foreground">
                Create and manage tasks anywhere, even without internet.
                Everything syncs automatically when you're back online.
              </p>
          </div>

          <div className="flex flex-col p-4">
                        <div>
              <img src={welcomeExhibit}  alt="smart lists" className="w-24 h-24 mx-auto mb-2" />
            </div>

              <h3 className="font-semibold text-center mb-1">Smart Lists </h3>
              <p className="text-sm text-center text-muted-foreground">
                Organize tasks with custom lists, priorities, and due dates.
                Color-code everything to match your workflow.
              </p>
          </div>

          <div className="flex flex-col p-4">
                        <div>
              <img src={WelcomeRates}  alt="Progress Tracking" className="w-24 h-24 mx-auto mb-2" />
            </div>

              <h3 className="font-semibold text-center mb-1">Track Progress </h3>
              <p className="text-sm text-center text-muted-foreground">
                See your productivity trends, completion rates, and build
                streaks. Stay motivated with real-time insights.
              </p>
          </div>
        </div>
      ),
    },
    {
      title: "You're all set!",
      description: "Start managing your tasks",
      content: (
        <div className="text-center py-8">
          <div className="text-5xl mb-4">
            <Sparkles className="w-16 h-16 mx-auto text-amber-500 animate-pulse" />
          </div>
          <h2 className="text-2xl font-bold mb-3">You're all set!</h2>
          <p className="text-muted-foreground max-w-md mx-auto mb-6">
            Ready to start organizing your tasks and boosting your productivity?
          </p>
          <div className="flex justify-center">
            <Button
              variant="default"
              size="lg"
              onClick={handleComplete}
              className="min-w-[200px]"
            >
              Get Started
            </Button>
          </div>
        </div>
      ),
    },
  ];

  const currentStepData = steps[currentStep];
  const isFirstStep = currentStep === 0;
  const isLastStep = currentStep === steps.length - 1;

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-100 flex items-center justify-center p-4 animate-in fade-in duration-300">
      <Card className="w-full max-w-2xl max-h-[90vh] overflow-hidden flex flex-col shadow-2xl">
        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6 sm:p-8">
          <div className="min-h-[400px] items-center justify-center flex flex-col">
            {currentStepData.content}
          </div>
        </div>

        {/* Footer with navigation */}
        <div className="border-t p-4 sm:p-6 bg-muted/30">
          <div className="flex items-center justify-between">
            {/* Progress dots */}
            <div className="flex gap-2">
              {steps.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentStep(index)}
                  className={`h-2 rounded-full transition-all ${
                    index === currentStep
                      ? "w-8 bg-primary"
                      : "w-2 bg-muted-foreground/30 hover:bg-muted-foreground/50"
                  }`}
                  aria-label={`Go to step ${index + 1}`}
                />
              ))}
            </div>

            {/* Navigation buttons */}
            <div className="flex gap-2">
              {!isFirstStep && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setCurrentStep(currentStep - 1)}
                  className=""
                >
                  <ChevronLeft className="w-4 h-4 mr-1" />
                  Back
                </Button>
              )}

              {!isLastStep ? (
                <Button
                  variant="default"
                  size="sm"
                  onClick={() => setCurrentStep(currentStep + 1)}
                  className=""
                >
                  Next
                  <ChevronRight className="w-4 h-4 ml-1" />
                </Button>
              ) : null}
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
}
