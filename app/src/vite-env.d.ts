/// <reference types="vite/client" />

interface ImportMetaEnv {
	readonly VITE_GAS_WEBAPP_URL?: string;
	readonly VITE_GAS_MAIL_SECRET?: string;
	readonly VITE_AIRBNB_URL?: string;
}

interface ImportMeta {
	readonly env: ImportMetaEnv;
}
