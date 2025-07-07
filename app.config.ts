export default defineAppConfig({
  ui: {
    primary: "brandy",
    gray: "neutral",
    formGroup: {
      help: "mt-0 text-sm",
      error: "mt-0 text-sm",
    },
    card: {
      body: {
        base: "h-full",
      },
      ring: "ring-0",
    },
    notifications: {
      // Show toasts at the top right of the screen
      position: "top-0 bottom-auto",
    },
  },
});
