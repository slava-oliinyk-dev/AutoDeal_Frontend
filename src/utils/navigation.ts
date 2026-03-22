import type { MouseEvent } from "react";
import type { Location, NavigateFunction } from "react-router-dom";

export const scrollToSection = (sectionId: string) => {
  const section = document.getElementById(sectionId);
  if (section) {
    section.scrollIntoView({ behavior: "smooth", block: "start" });
  }
};

export const createHomeNavigationHandler =
  (navigate: NavigateFunction, location: Location, onBeforeNavigate?: () => void) =>
  (target: "top" | string) =>
  (event: MouseEvent<HTMLAnchorElement>) => {
    event.preventDefault();
    onBeforeNavigate?.();

    if (location.pathname !== "/") {
      navigate("/", { state: { scrollTo: target } });
      return;
    }

    if (target === "top") {
      window.scrollTo({ top: 0, behavior: "smooth" });
      return;
    }

    scrollToSection(target);
  };
