import React from 'react';
import { CheckCircle, ArrowRight, Code, Palette, Layout, Box, Layers, Settings, Globe } from 'lucide-react';

interface StepsListProps {
  steps: string[];
  currentStep?: number;
}

const StepsList: React.FC<StepsListProps> = ({ steps, currentStep = steps.length }) => {
  const getStepIcon = (index: number) => {
    const icons = [
      <Layout className="w-5 h-5" />,
      <Code className="w-5 h-5" />,
      <Palette className="w-5 h-5" />,
      <Box className="w-5 h-5" />,
      <Layers className="w-5 h-5" />,
      <Settings className="w-5 h-5" />,
      <Globe className="w-5 h-5" />
    ];
    return icons[index % icons.length];
  };

  return (
    <div className="p-6">
      <h2 className="text-xl font-semibold mb-6 text-gray-800">Generation Progress</h2>
      <div className="space-y-6">
        {steps.map((step, index) => (
          <div key={index} className="relative">
            <div className="flex items-start gap-4">
              <div className="flex-shrink-0 mt-1">
                {index < currentStep ? (
                  <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center">
                    <CheckCircle className="w-5 h-5 text-green-600" />
                  </div>
                ) : (
                  <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center">
                    {getStepIcon(index)}
                  </div>
                )}
              </div>
              <div className="flex-1">
                <h3 className={`font-medium ${
                  index < currentStep ? 'text-green-600' : 'text-gray-700'
                }`}>
                  {step}
                </h3>
                <p className="mt-1 text-sm text-gray-500">
                  {getStepDescription(index)}
                </p>
              </div>
              {index < steps.length - 1 && (
                <div className="absolute left-4 top-10 bottom-0 w-[1px] bg-gray-200" />
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

const getStepDescription = (index: number): string => {
  const descriptions = [
    "Analyzing requirements and setting up project structure",
    "Generating component hierarchy and routing setup",
    "Creating responsive layouts and UI components",
    "Implementing core functionality and features",
    "Adding styling and visual enhancements",
    "Optimizing performance and accessibility",
    "Finalizing and preparing for deployment"
  ];
  return descriptions[index] || "";
};

export default StepsList;