import type { Meta, StoryObj } from "@storybook/react";
import { SplashView } from "./SplashPage";

const meta = {
  component: SplashView,
} satisfies Meta<typeof SplashView>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Primary: Story = {
  parameters: {
    backgrounds: {
      options: {
        red: { name: "Red", value: "#f00" },
        green: { name: "Green", value: "#0f0" },
        blue: { name: "Blue", value: "#00f" },
      },
    },
  },
};
