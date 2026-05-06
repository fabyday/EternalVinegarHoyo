import React from "react";
import { ProtoComponentProps } from "../Common/ProtoProps";

export interface ProgressBarProps extends ProtoComponentProps {
  progressValue: number | string;
  pregressMinValue: number | string;
  progressMaxMaxValue: number | string;
  descriptionText?: string;
}

export function ProgressBar({
  pregressMinValue,
  progressMaxMaxValue,
  progressValue,
  descriptionText,
  bgColor,
}: ProgressBarProps) {
  const numericProgress = Math.min(
    Math.max(Number(progressValue), Number(pregressMinValue)),
    Number(progressMaxMaxValue),
  );

  return (
    <div>
      <div className="w-full bg-amber-300 rounded-full dark:bg-gray-500">
        <div
          className="bg-blue-400 h-2.5 rounded-full"
          style={{ width: `${progressValue}%` }}
        />
      </div>
      <div>{descriptionText}</div>
    </div>
  );
}
