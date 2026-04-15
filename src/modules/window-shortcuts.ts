export class WindowShortcuts {
	static registerShortcuts() {
		ztoolkit.Keyboard.register((ev, keyOptions) => {
			ztoolkit.log(ev, keyOptions.keyboard);
			if (keyOptions.keyboard?.equals("shift,l")) {
				addon.hooks.onShortcuts("larger");
			}
			if (ev.shiftKey && ev.key === "S") {
				addon.hooks.onShortcuts("smaller");
			}
		});
	}

	static exampleShortcutLargerCallback() {
		new ztoolkit.ProgressWindow(addon.data.config.addonName)
			.createLine({
				text: "Larger!",
				type: "default",
			})
			.show();
	}

	static exampleShortcutSmallerCallback() {
		new ztoolkit.ProgressWindow(addon.data.config.addonName)
			.createLine({
				text: "Smaller!",
				type: "default",
			})
			.show();
	}
}
