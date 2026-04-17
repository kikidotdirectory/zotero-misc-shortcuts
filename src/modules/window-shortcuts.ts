export class WindowShortcuts {
	// define keyboard shortcuts
	static _lastKeydownTime = 0;

	static registerShortcuts() {
		const shortcuts = [
			{
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

	// define helper functions

	static currentZoteroTab() {
		const Zotero_Tabs = ztoolkit.getGlobal("Zotero_Tabs");
		const currentTab = Zotero.Reader.getByTabID(Zotero_Tabs.selectedID);
		return currentTab;
	}

	static activeSidebarTab(): "annotations" | "thumbnails" | "outline" {
		return WindowShortcuts.currentZoteroTab()._internalReader._state.sidebarView;
	}

	static getReaderContainer() {
		const innerWindow = WindowShortcuts.currentZoteroTab()._iframe?.contentWindow?.document;

		if (!innerWindow) return null;
		return innerWindow;
	}

	static focusSidebar(panel: "annotations" | "thumbnails" | "outline") {
		const sidebar = WindowShortcuts.getReaderContainer().getElementById("sidebarContainer")
		if (!sidebar) return;

		const container = WindowShortcuts.getReaderContainer();
		switch (panel) {
			case "thumbnails": {
				const selectedThumbnail = container.querySelector(".thumbnail.selected > .image") as HTMLElement;
				selectedThumbnail?.focus();
				break;
			}
			case "annotations": {
				const firstAnnotation = container.querySelector(".annotation") as HTMLElement;
				if (!firstAnnotation) return;
				firstAnnotation.focus();
				break;
			}
			case "outline":
				// todo i've never needed to use this
				break;
		}
	}

	// behavior
	static toggleContextPane() {
		const win = ztoolkit.getGlobal("Zotero_Tabs");
		ztoolkit.log(win);
		// if (contextPane.activeEditor) {
		// const editorInstance = contextPane.activeEditor.getCurrentInstance();
		// ztoolkit.log(editorInstance);
		// if (editorInstance) {
		// 	editorInstance.focus();
		// }
		// }
	}

	// need to split this function into open and close sidebar functions so that they
	// can be called in separate functions
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
			WindowShortcuts.currentZoteroTab()._internalReader.toggleSidebar(!openStatus);
			Zotero.Reader._sidebarOpen = !openStatus;
			WindowShortcuts.focusSidebar(WindowShortcuts.activeSidebarTab());
			return;
		}
	}
}

// gets the PDF reader section
function getReaderInternals() {
	const Zotero_Tabs = ztoolkit.getGlobal("Zotero_Tabs");
	const currentTab = Zotero.Reader.getByTabID(Zotero_Tabs.selectedID);
	const innerWindow = currentTab._iframe?.contentWindow?.frames[0];

	if (!innerWindow) return null;

	return {
		reader: innerWindow._reader,
		doc: innerWindow.document,
		pdfApp: innerWindow.PDFViewerApplication, // null for EPUB
	};
}
