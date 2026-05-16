import type { Meta, StoryObj } from "@storybook/react";
import { SelectMenu } from "../../Component/SelectMenu";

const meta: Meta<typeof SelectMenu> = {
  title: "Component/SelectMenu",
  component: SelectMenu,
  parameters: {
    layout: "centered",
  },
  args: {
    value: "rose",
    label: "Accent color",
    options: [
      { value: "rose", label: "Rose", swatchColor: "rgb(244 63 94)" },
      { value: "sky", label: "Sky", swatchColor: "rgb(14 165 233)" },
      { value: "emerald", label: "Emerald", swatchColor: "rgb(16 185 129)" },
    ],
    onChange: () => undefined,
  },
};

export default meta;
type Story = StoryObj<typeof SelectMenu>;

export const Default: Story = {
  render: (args) => (
    <div className="w-80 bg-[#0b1020] p-4 text-slate-100">
      <SelectMenu {...args} />
    </div>
  ),
};
