"use client";

import React from "react";

import { CheckIcon, XMarkIcon } from "@/components/icons";

interface PasswordRequirement {
  label: string;
  test: (password: string) => boolean;
}

interface PasswordStrengthProps {
  password: string;
}

const requirements: PasswordRequirement[] = [
  {
    label: "At least 8 characters",
    test: (password: string) => password.length >= 8,
  },
  {
    label: "At least one uppercase letter",
    test: (password: string) => /[A-Z]/.test(password),
  },
  {
    label: "At least one lowercase letter",
    test: (password: string) => /[a-z]/.test(password),
  },
  {
    label: "At least one number",
    test: (password: string) => /\d/.test(password),
  },
  {
    label: "At least one special character",
    test: (password: string) =>
      /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password),
  },
];

const getPasswordStrength = (
  password: string,
): {
  score: number;
  label: string;
  color: string;
} => {
  if (password.length === 0) {
    return { score: 0, label: "", color: "bg-gray-200" };
  }

  // Must have at least 8 characters and at least 3 of the other 4 requirements
  const hasMinLength = requirements[0].test(password);
  const otherRequirements = requirements.slice(1);
  const passedOtherRequirements = otherRequirements.filter((req) =>
    req.test(password),
  ).length;

  if (!hasMinLength) {
    return { score: 1, label: "Very Weak", color: "bg-red-500" };
  }

  // Calculate score based on passed requirements (0-4 for other requirements)
  const totalScore = passedOtherRequirements;

  if (totalScore <= 1) {
    return { score: 2, label: "Weak", color: "bg-orange-500" };
  } else if (totalScore === 2) {
    return { score: 3, label: "Fair", color: "bg-yellow-500" };
  } else if (totalScore === 3) {
    return { score: 4, label: "Good", color: "bg-primary-blue" };
  } else {
    return { score: 5, label: "Strong", color: "bg-green-500" };
  }
};

export const PasswordStrength: React.FC<PasswordStrengthProps> = ({
  password,
}) => {
  const strength = getPasswordStrength(password);
  const passedRequirements = requirements.filter((req) => req.test(password));

  if (password.length === 0) {
    return null;
  }

  return (
    <div className="space-y-3">
      {/* Strength Bar */}
      <div className="space-y-2">
        <div className="flex justify-between text-sm">
          <span className="text-gray-600">Password strength:</span>
          <span
            className={`font-medium ${
              strength.score <= 2
                ? "text-red-600"
                : strength.score === 3
                  ? "text-yellow-600"
                  : strength.score === 4
                    ? "text-blue-600"
                    : "text-green-600"
            }`}
          >
            {strength.label}
          </span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div
            className={`h-2 rounded-full transition-all duration-300 ${strength.color}`}
            style={{ width: `${(strength.score / 5) * 100}%` }}
          />
        </div>
      </div>

      {/* Requirements List */}
      <div className="space-y-2">
        <p className="text-sm font-medium text-gray-700">
          Password requirements:
        </p>
        <div className="space-y-1">
          {requirements.map((requirement, index) => {
            const isMet = requirement.test(password);

            return (
              <div key={index} className="flex items-center gap-2 text-sm">
                {isMet ? (
                  <CheckIcon className="w-4 h-4 text-green-500" />
                ) : (
                  <XMarkIcon className="w-4 h-4 text-red-500" />
                )}
                <span className={isMet ? "text-green-700" : "text-red-700"}>
                  {requirement.label}
                </span>
              </div>
            );
          })}
        </div>
        <p className="text-xs text-gray-500 mt-2">
          Need at least 8 characters and 3 of the 4 other requirements
        </p>
      </div>
    </div>
  );
};
