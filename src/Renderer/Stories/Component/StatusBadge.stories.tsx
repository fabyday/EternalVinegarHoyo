import type { Meta, StoryObj } from "@storybook/react";
import { useTranslation } from "react-i18next";
import { StatusBadge } from "../../Component/StatusBadge";

const meta: Meta<typeof StatusBadge> = {
  title: "Component/StatusBadge",
  component: StatusBadge,
  parameters: {
    layout: "centered",
  },
  args: {
    label: "status.available",
    tone: "warning",
  },
};

export default meta;
type Story = StoryObj<typeof StatusBadge>;

export const Default: Story = {
  render: (args) => <DefaultStatusBadge args={args} />,
};

function DefaultStatusBadge({ args }: { args: React.ComponentProps<typeof StatusBadge> }) {
  const { t } = useTranslation();

  return <StatusBadge {...args} label={t(args.label)} />;
}

export const AllTones: Story = {
  render: () => <AllTonesContent />,
};

function AllTonesContent() {
  const { t } = useTranslation();

  return (
    <div className="flex flex-wrap gap-2 rounded-lg bg-[#0b1020] p-6">
      <StatusBadge label={t("status.idle")} tone="neutral" />
      <StatusBadge label={t("status.downloading")} tone="info" />
      <StatusBadge label={t("status.installed")} tone="success" />
      <StatusBadge label={t("status.available")} tone="warning" />
      <StatusBadge label={t("status.error")} tone="danger" />
    </div>
  );
}
