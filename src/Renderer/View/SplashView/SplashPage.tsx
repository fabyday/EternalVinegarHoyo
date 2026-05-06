import React from "react";
import { ProgressBar } from "../../Component/PrgoressBar";

export interface SplashViewProps {}

export function SplashView({}: SplashViewProps) {
  return (
    <div className="relative  w-full max-w-lg overflow-hidden shadow-lg">
      <img src="./bobtongirihoyo_wide.png" alt="splash image main" />{" "}
      <div className="absolute inset-0 bg-black opacity-40"></div>
      {/* react-i18next 는... 필요없다 나만 쓸거니까 */}
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="flex flex-col item items-center justify-center">
          <p className="text-3xl font-bold text-white text-shadow-lg/30">
            밥똥이리호요
          </p>
          {/* Progress Bar TODO for testing */}
          <p className="text-white">test alt</p>
          <ProgressBar
            progressMaxMaxValue={100}
            progressValue={10}
            pregressMinValue={0}
          />
        </div>
      </div>
    </div>
  );
}
