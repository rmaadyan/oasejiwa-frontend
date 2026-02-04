"use client";

import { useEffect, useState } from "react";

interface Step {
  id: number;
  label: string;
  icon: React.ReactNode;
}

interface BookingStepperProps {
  currentStep: number;
  className?: string;
}

const steps: Step[] = [
  {
    id: 1,
    label: "Layanan",
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
      </svg>
    ),
  },
  {
    id: 2,
    label: "Psikolog",
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
      </svg>
    ),
  },
  {
    id: 3,
    label: "Jadwal",
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
      </svg>
    ),
  },
  {
    id: 4,
    label: "Formulir",
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
      </svg>
    ),
  },
  {
    id: 5,
    label: "Pembayaran",
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
      </svg>
    ),
  },
];

export default function BookingStepper({ currentStep, className = "" }: BookingStepperProps) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <div className={`w-full overflow-x-auto ${className}`}>
      <div className="flex items-center justify-between min-w-[500px] px-4 py-6">
        {steps.map((step, index) => (
          <div key={step.id} className="flex items-center flex-1">
            {/* Step Circle */}
            <div className="flex flex-col items-center">
              <div
                className={`
                  relative flex items-center justify-center w-12 h-12 rounded-full
                  transition-all duration-500 ease-out
                  ${
                    step.id < currentStep
                      ? "bg-[#2B5379] text-white"
                      : step.id === currentStep
                      ? "bg-white border-2 border-[#2B5379] text-[#2B5379]"
                      : "bg-gray-200 text-gray-400"
                  }
                  ${step.id === currentStep && mounted ? "animate-pulse-soft" : ""}
                `}
              >
                {step.id < currentStep ? (
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                ) : (
                  step.icon
                )}
                
                {/* Pulse ring for active step */}
                {step.id === currentStep && (
                  <span className="absolute inset-0 rounded-full border-2 border-[#2B5379] animate-ping opacity-30" />
                )}
              </div>
              
              {/* Label */}
              <span
                className={`
                  mt-2 text-xs md:text-sm font-medium transition-colors duration-300
                  ${
                    step.id <= currentStep
                      ? "text-[#234463]"
                      : "text-gray-400"
                  }
                `}
              >
                {step.label}
              </span>
            </div>

            {/* Connector Line */}
            {index < steps.length - 1 && (
              <div className="flex-1 mx-4">
                <div className="relative h-1 bg-gray-200 rounded-full overflow-hidden">
                  <div
                    className={`
                      absolute inset-y-0 left-0 bg-[#2B5379] rounded-full
                      transition-all duration-500 ease-out
                    `}
                    style={{
                      width: step.id < currentStep ? "100%" : "0%",
                    }}
                  />
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
