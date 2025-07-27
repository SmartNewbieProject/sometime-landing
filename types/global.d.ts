export {};

declare global {
  interface Window {
    fullpage_api?: {
      moveSectionDown: () => void;
      moveSectionUp?: () => void;
    };
  }
}
