type Mod = "meta" | "shift" | "ctrl" | "alt";

class Shortcut {
	constructor(
		readonly mods: Mod[],
		readonly key: string,
		readonly action?: () => void,
	) {}

	matches(ev: KeyboardEvent) {
		return (
			this.mods.includes("meta") === ev.metaKey
			&& this.mods.includes("shift") === ev.shiftKey
			&& this.mods.includes("ctrl") === ev.ctrlKey
			&& this.mods.includes("alt") === ev.altKey
			&& this.key === ev.key
		);
	}
}

export class WindowShortcuts {
	// define keyboard shortcuts
	static _lastKeydownTime = 0;

	static registerShortcuts() {
		const shortcuts = [
			new Shortcut(["meta", "shift"], "'", () => WindowShortcuts.shortcutToggleSidebar()),
			new Shortcut(["meta", "shift"], "m", () => WindowShortcuts.focusSidebar("annotations")),
		];

		ztoolkit.Keyboard.register((ev, keyOptions) => {
			if (keyOptions.type !== "keydown") return;

			for (const shortcut of shortcuts) {
				if (shortcut.matches(ev) && ev.timeStamp !== WindowShortcuts._lastKeydownTime) {
					WindowShortcuts._lastKeydownTime = ev.timeStamp;
					shortcut.action?.();
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
		const sidebar = WindowShortcuts.getReaderContainer().getElementById("sidebarContainer");
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

	static focusReader() {
		const container = WindowShortcuts.getReaderContainer();
		if (!container) return;
		const viewer = container.querySelector("iframe") as HTMLElement;
		viewer?.focus();
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
