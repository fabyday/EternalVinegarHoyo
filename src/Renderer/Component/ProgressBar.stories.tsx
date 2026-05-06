import type { Meta, StoryObj } from "@storybook/react";
import { ProgressBar } from "./PrgoressBar";
import { useEffect, useState } from "react";

const meta: Meta<typeof ProgressBar> = {
  title: "Component/ProgressBar",
  component: ProgressBar,
  parameters: {
    layout: "fullscreen",
  },
};

export default meta;
type Story = StoryObj<typeof ProgressBar>;

export const Default: Story = {
  args: {
    pregressMinValue: 0,
    progressMaxMaxValue: 100,
    progressValue: 10,
  },
};

const texts = ["하하 밥똥이리호요가 설치됐어", "정말 대단한데"];

export const AnimationTest: Story = {
  args: {
    pregressMinValue: 0,
    progressMaxMaxValue: 100,
    progressValue: 0,
  },
  render: (args) => {
    const [progress, setProgress] = useState(0);
    const [text, setText] = useState("");
    useEffect(() => {
      const interval = setInterval(() => {
        setProgress((prev) => {
          if (prev >= 100) {
            return 0;
          } else {
            return prev + 1;
          }
        });
      }, 150);

      return () => clearInterval(interval);
    }, []);
    const currentDescription = progress >= 50 ? texts[1] : texts[0];
    return (
      <div className="w-full max-w-md p-8 bg-amber-700 rounded-xl">
        <ProgressBar
          {...args}
          progressValue={progress}
          descriptionText={currentDescription}
        />
      </div>
    );
  },
};
