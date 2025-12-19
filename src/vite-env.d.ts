/// <reference types="vite/client" />

interface ImportMeta {
  readonly env: {
    readonly MODE: string;
    readonly BASE_URL: string;
    readonly PROD: boolean;
    readonly DEV: boolean;
    readonly VITE_DEBUG?: string;
    readonly VITE_MOCK_TIME?: string;
    readonly VITE_MOCK_DATE?: string;
    /**
     * Holiday mode for the tracker.
     * Valid values: 'easter' | 'christmas'
     * Default: 'easter'
     */
    readonly VITE_HOLIDAY_MODE?: 'easter' | 'christmas';
    readonly [key: string]: string | undefined;
  }
}