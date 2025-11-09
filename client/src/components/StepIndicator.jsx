/* eslint-disable react/prop-types */
import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";
import { Check } from "lucide-react";

export function StepIndicator({ steps, currentStep }) {
  const progress = (currentStep / (steps.length - 1)) * 100;

  return (
    <div className="w-full">
      <Progress value={progress} className="h-2 bg-gray-200" />
      <div className="mt-6 grid grid-cols-3 md:grid-cols-9 gap-2">
        {steps.map((step, index) => {
          const isActive = currentStep === index;
          const isCompleted = currentStep > index;

          return (
            <div
              key={step.id}
              className={cn(
                "flex flex-col items-center text-center transition-colors",
                isActive && "text-orange-500",
                isCompleted && "text-orange-500",
                !isActive && !isCompleted && "text-gray-400"
              )}
            >
              <div
                className={cn(
                  "flex h-8 w-8 items-center justify-center rounded-full border-2 text-xs font-semibold transition-all",
                  isActive && "border-orange-500 bg-orange-50 text-orange-600",
                  isCompleted && "border-orange-500 bg-orange-500 text-white",
                  !isActive && !isCompleted && "border-gray-300 text-gray-500"
                )}
              >
                {isCompleted ? <Check className="h-4 w-4" /> : index + 1}
              </div>
              <span className="mt-2 text-xs font-medium hidden md:block">
                {step.title}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}