import type { Meta, StoryObj } from "@storybook/react";
import { ImageButton } from "./ImangeButton";

const meta: Meta<typeof ImageButton> = {
  title: "Component/WineeryView",
  component: ImageButton,
  parameters: {
    layout: "fullscreen",
  },
};

export default meta;
type Story = StoryObj<typeof ImageButton>;

export const Default: Story = {};
