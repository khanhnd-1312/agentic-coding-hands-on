import type { SuggestionOptions, SuggestionProps } from "@tiptap/suggestion";

interface MentionItem {
	id: string;
	label: string;
}

/**
 * Tiptap Mention suggestion render function.
 * Creates a floating dropdown that shows matching users when typing @.
 */
export function mentionSuggestionRender(): SuggestionOptions<MentionItem>["render"] {
	let popup: HTMLDivElement | null = null;
	let selectedIndex = 0;
	let items: MentionItem[] = [];
	let command: SuggestionProps<MentionItem>["command"] | null = null;

	function createPopup() {
		const el = document.createElement("div");
		el.className =
			"absolute z-[100] w-64 max-h-48 overflow-y-auto rounded border border-[#998C5F] bg-white shadow-lg";
		el.style.display = "none";
		document.body.appendChild(el);
		return el;
	}

	function renderItems() {
		if (!popup) return;

		if (items.length === 0) {
			popup.style.display = "none";
			return;
		}

		popup.style.display = "block";
		popup.innerHTML = items
			.map(
				(item, index) =>
					`<button
						type="button"
						data-index="${index}"
						class="w-full px-3 py-2 text-left text-sm text-[#00101A] hover:bg-gray-100 ${
							index === selectedIndex ? "bg-[#FFEA9E]/40" : ""
						}"
					>${escapeHtml(item.label)}</button>`,
			)
			.join("");

		// Add click handlers
		popup.querySelectorAll("button").forEach((btn) => {
			btn.addEventListener("mousedown", (e) => {
				e.preventDefault();
				const idx = Number(btn.dataset.index);
				if (command && items[idx]) {
					command(items[idx]);
				}
			});
		});
	}

	function positionPopup(props: SuggestionProps<MentionItem>) {
		if (!popup) return;
		const rect = props.clientRect?.();
		if (!rect) return;
		popup.style.position = "fixed";
		popup.style.left = `${rect.left}px`;
		popup.style.top = `${rect.bottom + 4}px`;
	}

	return () => ({
		onStart(props: SuggestionProps<MentionItem>) {
			popup = createPopup();
			items = props.items;
			command = props.command;
			selectedIndex = 0;
			positionPopup(props);
			renderItems();
		},

		onUpdate(props: SuggestionProps<MentionItem>) {
			items = props.items;
			command = props.command;
			selectedIndex = 0;
			positionPopup(props);
			renderItems();
		},

		onKeyDown(props: { event: KeyboardEvent }) {
			if (props.event.key === "ArrowDown") {
				selectedIndex = (selectedIndex + 1) % items.length;
				renderItems();
				return true;
			}
			if (props.event.key === "ArrowUp") {
				selectedIndex =
					(selectedIndex - 1 + items.length) % items.length;
				renderItems();
				return true;
			}
			if (props.event.key === "Enter") {
				if (command && items[selectedIndex]) {
					command(items[selectedIndex]);
				}
				return true;
			}
			if (props.event.key === "Escape") {
				popup?.remove();
				popup = null;
				return true;
			}
			return false;
		},

		onExit() {
			popup?.remove();
			popup = null;
		},
	});
}

function escapeHtml(str: string): string {
	return str
		.replace(/&/g, "&amp;")
		.replace(/</g, "&lt;")
		.replace(/>/g, "&gt;")
		.replace(/"/g, "&quot;");
}
