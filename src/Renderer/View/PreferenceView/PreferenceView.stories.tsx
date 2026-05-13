import type { Meta, StoryObj } from "@storybook/react";
import { PreferenceView } from "./PreferenceView";

const meta = {
  component: PreferenceView,
} satisfies Meta<typeof PreferenceView >;

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
