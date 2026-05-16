import type { Meta, StoryObj } from "@storybook/react";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { ProgressBar, ProgressBarProps } from "../../Component/ProgressBar";

const meta: Meta<typeof ProgressBar> = {
  title: "Component/ProgressBar",
  component: ProgressBar,
  parameters: {
    layout: "centered",
  },
};

export default meta;
type Story = StoryObj<typeof ProgressBar>;

export const Default: Story = {
  args: {
    progressMinValue: 0,
    progressMaxValue: 100,
    progressValue: 32,
    showValue: true,
  },
};

export const AnimationTest: Story = {
  args: {
    progressMinValue: 0,
    progressMaxValue: 100,
    progressValue: 0,
    showValue: true,
  },
  render: (args) => {
    const [progress, setProgress] = useState(0);

    useEffect(() => {
      const interval = window.setInterval(() => {
        setProgress((prev) => (prev >= 100 ? 0 : prev + 1));
      }, 150);

      return () => window.clearInterval(interval);
    }, []);

    return <AnimationProgressBar args={args} progress={progress} />;
  },
};

function AnimationProgressBar({ args, progress }: { args: ProgressBarProps; progress: number }) {
  const { t } = useTranslation();

  return (
    <div className="w-96 rounded-lg bg-[#0b1020] p-6">
      <ProgressBar
        {...args}
        progressValue={progress}
        descriptionText={progress >= 50 ? t("status.extracting") : t("status.downloading")}
      />
    </div>
  );
}
