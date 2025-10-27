export {};

declare global {
  interface Window {
    refreshJobs?: () => void;
  }
}