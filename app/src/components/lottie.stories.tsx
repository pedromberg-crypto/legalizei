import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { Lottie } from "./lottie";

/**
 * Runtime compartilhado + player de LOOP (driver manual de frame — não usa
 * rAF, pra não congelar em iframe offscreen do /mockup). Usado no N2
 * (welcome, 3 animações) e N3 (paperplane).
 */
const meta = {
  title: "DS/Lottie",
  component: Lottie,
  parameters: { layout: "padded" },
} satisfies Meta<typeof Lottie>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Paperplane: Story = {
  args: { path: "/lottie/paperplane-legalizei.json", fps: 50, className: "w-40 h-40" },
};

export const ContentMod: Story = {
  args: { path: "/lottie/content-mod-legalizei.json", fps: 30, className: "w-40 h-40" },
};
