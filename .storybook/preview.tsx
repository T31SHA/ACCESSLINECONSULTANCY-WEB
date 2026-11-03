import type { Preview } from "@storybook/nextjs-vite";
import { inter, syne } from "../src/lib/fonts";
import "../src/app/globals.css";

// Theme tokens resolve var(--font-*) at :root, so the font classes belong on <html> (as in the app).
if (typeof document !== "undefined") document.documentElement.classList.add(syne.variable, inter.variable);

const preview: Preview = {
  parameters: {
    layout: "fullscreen",
    nextjs: { appDirectory: true },
    a11y: { test: "error" },
    backgrounds: { disable: true },
  },
  globalTypes: {
    surface: {
      description: "Surface theme",
      toolbar: { title: "Surface", items: ["sand", "dark", "forest"], dynamicTitle: true },
    },
  },
  initialGlobals: { surface: "sand" },
  decorators: [
    (Story, ctx) => {
      const theme = ctx.globals.surface === "dark" ? "theme-dark" : ctx.globals.surface === "forest" ? "theme-forest" : "";
      return (
        <div className={`${theme} min-h-dvh bg-[var(--surface)] font-sans text-[var(--fg)]`}>
          <Story />
        </div>
      );
    },
  ],
};

export default preview;
