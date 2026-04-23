import type { Meta, StoryObj } from '@storybook/react';
import { WineeryView } from './MainFrame';

const meta: Meta<typeof WineeryView> = {
  title: 'Views/WineeryView',
  component: WineeryView,
  parameters: {
    layout: 'fullscreen',
  },
};

export default meta;
type Story = StoryObj<typeof WineeryView>;

export const Default: Story = {};