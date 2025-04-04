import { useWindowSize } from "@vueuse/core";
import type { TailwindBreakpoint } from "~/utils/styleUtils.js";

export const useScreenSize = () => {
  const viewport = useViewport();
  const { width, height } = useWindowSize();

  const isMinimumMd = computed(() => viewport.isGreaterOrEquals("md"));
  const isMinimumLg = computed(() => viewport.isGreaterOrEquals("lg"));
  const isMinimumXl = computed(() => viewport.isGreaterOrEquals("xl"));

  const isMobile = computed(() => !isMinimumMd.value);
  const isLandscape = computed(() => width.value > height.value);

  const currentBreakpoint = computed(
    () => viewport.breakpoint.value as TailwindBreakpoint,
  );

  return {
    isMinimumMd,
    isMinimumLg,
    isMinimumXl,
    isMobile,
    isLandscape,
    currentBreakpoint,
  };
};
