/* eslint-disable react/prop-types */
import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";
import { Check } from "lucide-react";

export function StepIndicator({ steps, currentStep }) {
  const progress = (currentStep / (steps.length - 1)) * 100;

  return (
    <div className="w-full">
      <Progress value={progress} className="h-2" />
      <div className="mt-4 grid grid-cols-3 md:grid-cols-9 gap-2">
        {steps.map((step, index) => {
          const isActive = currentStep === index;
          const isCompleted = currentStep > index;

          return (
            <div
              key={step.id}
              className={cn(
                "flex flex-col items-center text-center",
                isActive && "text-primary",
                isCompleted && "text-primary",
                !isActive && !isCompleted && "text-muted-foreground"
              )}
            >
              <div
                className={cn(
                  "flex h-8 w-8 items-center justify-center rounded-full border-2 text-xs font-medium",
                  isActive && "border-primary",
                  isCompleted && "border-primary bg-primary text-primary-foreground",
                  !isActive && !isCompleted && "border-muted"
                )}
              >
                {isCompleted ? <Check className="h-4 w-4" /> : index + 1}
              </div>
              <span className="mt-1 text-xs font-medium hidden md:block">
                {step.title}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}