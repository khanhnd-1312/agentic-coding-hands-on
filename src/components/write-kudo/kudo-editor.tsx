"use client";

import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Link from "@tiptap/extension-link";
import Mention from "@tiptap/extension-mention";
import CharacterCount from "@tiptap/extension-character-count";
import Placeholder from "@tiptap/extension-placeholder";
import type { JSONContent } from "@tiptap/core";
import { Icon } from "@/components/ui/icon";

const MAX_CHARS = 1000;

interface KudoEditorProps {
	onChange: (content: JSONContent) => void;
	error?: string;
}

export function KudoEditor({ onChange, error }: KudoEditorProps) {
	const editor = useEditor({
		extensions: [
			StarterKit.configure({
				heading: false, // Not needed per spec
				codeBlock: false,
				code: false,
				horizontalRule: false,
			}),
			Link.configure({
				openOnClick: false,
				HTMLAttributes: { class: "text-blue-600 underline" },
			}),
			Mention.configure({
				HTMLAttributes: { class: "text-blue-600 font-bold" },
				suggestion: {
					char: "@",
					items: async ({ query }: { query: string }) => {
						if (query.length === 0) return [];
						try {
							const res = await fetch(
								`/api/users/search?q=${encodeURIComponent(query)}`,
							);
							if (!res.ok) return [];
							const body = (await res.json()) as { data?: Array<{ id: string; name: string }> };
							return (
								body.data?.map(
									(u: { id: string; name: string }) => ({
										id: u.id,
										label: u.name,
									}),
								) ?? []
							);
						} catch {
							return [];
						}
					},
				},
			}),
			CharacterCount.configure({ limit: MAX_CHARS }),
			Placeholder.configure({
				placeholder:
					"Hãy gửi lời cảm ơn và ghi nhận đến đồng đội tại đây nhé!",
			}),
		],
		editorProps: {
			attributes: {
				class:
					"w-full min-h-[200px] px-6 py-4 bg-white font-[family-name:var(--font-montserrat)] text-base font-bold leading-6 text-[#00101A] outline-none prose prose-sm max-w-none",
			},
		},
		onUpdate: ({ editor: ed }) => {
			onChange(ed.getJSON());
		},
	});

	if (!editor) return null;

	const charCount = editor.storage.characterCount.characters();
	const borderColor = error ? "border-[#E46060]" : "border-[#998C5F]";

	const toolbarButtons = [
		{
			icon: "bold",
			label: "Bold",
			action: () => editor.chain().focus().toggleBold().run(),
			isActive: editor.isActive("bold"),
		},
		{
			icon: "italic",
			label: "Italic",
			action: () => editor.chain().focus().toggleItalic().run(),
			isActive: editor.isActive("italic"),
		},
		{
			icon: "strikethrough",
			label: "Strikethrough",
			action: () => editor.chain().focus().toggleStrike().run(),
			isActive: editor.isActive("strike"),
		},
		{
			icon: "list-ordered",
			label: "Ordered List",
			action: () => editor.chain().focus().toggleOrderedList().run(),
			isActive: editor.isActive("orderedList"),
		},
		{
			icon: "link",
			label: "Link",
			action: () => {
				const url = window.prompt("URL:");
				if (url) {
					editor.chain().focus().setLink({ href: url }).run();
				}
			},
			isActive: editor.isActive("link"),
		},
		{
			icon: "quote",
			label: "Quote",
			action: () => editor.chain().focus().toggleBlockquote().run(),
			isActive: editor.isActive("blockquote"),
		},
	];

	return (
		<div className="w-full flex flex-col">
			{/* Toolbar + Editor wrapped in single border container */}
			<div className={`border ${borderColor} rounded-lg overflow-hidden`}>
				{/* Toolbar */}
				<div className="flex items-center h-10 border-b border-[#998C5F]">
					{toolbarButtons.map((btn) => (
						<button
							key={btn.icon}
							type="button"
							onClick={btn.action}
							className={`w-12 h-10 flex items-center justify-center border-r border-[#998C5F] transition-colors ${
								btn.isActive
									? "bg-black/10"
									: "bg-transparent hover:bg-black/5"
							}`}
							aria-label={btn.label}
							aria-pressed={btn.isActive}
						>
							<Icon name={btn.icon} size={20} className="text-[#00101A]" />
						</button>
					))}
					<a
						href="/community-standards"
						className="ml-2 text-base font-bold font-[family-name:var(--font-montserrat)] text-[#E46060] underline"
					>
						Tiêu chuẩn cộng đồng
					</a>
				</div>

				{/* Editor */}
				<EditorContent editor={editor} />
			</div>

			{/* Hint D.1 — centered, black text */}
			<p className="mt-2 text-base font-bold font-[family-name:var(--font-montserrat)] text-[#00101A] leading-6 text-center">
				Bạn có thể &quot;@ + tên&quot; để nhắc tới đồng nghiệp khác
			</p>
		</div>
	);
}
