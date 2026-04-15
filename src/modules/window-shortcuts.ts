export class WindowShortcuts {
	static registerShortcuts() {
		ztoolkit.Keyboard.register((_ev, keyOptions) => {
			if (keyOptions.keyboard?.equals("shift,b")) {
				addon.hooks.onShortcuts("toggleContextPane");
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
			}
		}
	}
}
