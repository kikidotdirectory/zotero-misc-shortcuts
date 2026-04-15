import { WindowShortcuts } from "./modules/window-shortcuts";
import { createZToolkit } from "./utils/ztoolkit";

async function onStartup() {
	await Promise.all([
		Zotero.initializationPromise,
		Zotero.unlockPromise,
		Zotero.uiReadyPromise,
	]);

	WindowShortcuts.registerShortcuts();

	addon.data.initialized = true;
}

async function onMainWindowLoad(_win: _ZoteroTypes.MainWindow): Promise<void> {
	addon.data.ztoolkit = createZToolkit();
}

async function onMainWindowUnload(_win: Window): Promise<void> {
	ztoolkit.unregisterAll();
}

function onShutdown(): void {
	ztoolkit.unregisterAll();
	addon.data.alive = false;
	// @ts-expect-error - Plugin instance is not typed
	delete Zotero[addon.data.config.addonInstance];
}

function onShortcuts(type: string) {
	switch (type) {
		case "toggleContextPane":
			WindowShortcuts.toggleContextPane();
			break;
		case "toggleSidebar":
			WindowShortcuts.shortcutToggleSidebar();
			break;
		default:
			break;
	}
}

export default {
	onStartup,
	onShutdown,
	onMainWindowLoad,
	onMainWindowUnload,
	onShortcuts,
};
