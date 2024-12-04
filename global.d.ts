// global.d.ts
declare global {
    interface Window {
      initializeFeedbackWidget: (shopOrigin: string, apiKey: string) => void;
    }
  }
  
  export {};
  