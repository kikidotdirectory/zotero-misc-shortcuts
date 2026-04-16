export class WindowShortcuts {
	static _lastKeydownTime = 0;

	static registerShortcuts() {
		const shortcuts = [
				meta: true,
				shift: true,
				key: "'",
				action: () => WindowShortcuts.shortcutToggleSidebar(),
			},
			{
				meta: true,
				shift: true,
				key: "p",
				action: () => WindowShortcuts.getCurrentSidebarPanel(),
			},
		];

		ztoolkit.Keyboard.register((ev, keyOptions) => {
			if (keyOptions.type !== "keydown") return;

			for (const shortcut of shortcuts) {
				if (
					!!shortcut.meta === ev.metaKey
					&& !!shortcut.shift === ev.shiftKey
					&& !!shortcut.ctrl === ev.ctrlKey
					&& !!shortcut.alt === ev.altKey
					&& shortcut.key === ev.key
					&& ev.timeStamp !== WindowShortcuts._lastKeydownTime
				) {
					WindowShortcuts._lastKeydownTime = ev.timeStamp;
					shortcut.action();
					break;
				}
			}
		});
	}

	static toggleContextPane() {
		const contextPane = Zotero.getMainWindow().ZoteroContextPane;
		contextPane.togglePane();
		if (contextPane.activeEditor) {
			const editorInstance = contextPane.activeEditor.getCurrentInstance();
			if (editorInstance) {
				editorInstance.focus();

	static shortcutToggleSidebar() {
		/**
		 * Toggle Left Pane
		 * @author [MuiseDestiny](https://github.com/MuiseDestiny), windingwind
		 * @usage Assign a shortcut
		 * @link https://github.com/windingwind/zotero-actions-tags/discussions/169
		 * @see https://github.com/windingwind/zotero-actions-tags/discussions/169
		 */
		const Zotero_Tabs = ztoolkit.getGlobal("Zotero_Tabs");
		const document = ztoolkit.getGlobal("document");
		const Zotero = ztoolkit.getGlobal("Zotero");

		if (Zotero_Tabs.selectedType === "library") {
			const splitter = document.querySelector("#zotero-collections-splitter");
			if (splitter.getAttribute("state") == "collapsed") {
				splitter.setAttribute("state", "");
				return;
			} else {
				splitter.setAttribute("state", "collapsed");
				return;
			}
		} else {
			const openStatus = Zotero.Reader._sidebarOpen;
			Zotero.Reader.getByTabID(
				Zotero_Tabs.selectedID,
			)._internalReader.toggleSidebar(!openStatus);
			Zotero.Reader._sidebarOpen = !openStatus;
			return;
		}
	}
}
