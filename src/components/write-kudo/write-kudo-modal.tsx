"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import type { JSONContent } from "@tiptap/core";
import { Icon } from "@/components/ui/icon";
import { useCreateKudo } from "@/hooks/use-create-kudo";
import { RecipientField } from "./recipient-field";
import { DanhHieuField } from "./danh-hieu-field";
import { KudoEditor } from "./kudo-editor";
import { HashtagField } from "./hashtag-field";
import { ImageUploadField } from "./image-upload-field";
import { AnonymousToggle } from "./anonymous-toggle";

interface UserResult {
	id: string;
	name: string;
	avatar_url: string | null;
	department_name: string | null;
}

interface ImageAttachment {
	url: string;
}

interface WriteKudoModalProps {
	isOpen: boolean;
	onClose: () => void;
	onSuccess?: () => void;
}

export function WriteKudoModal({
	isOpen,
	onClose,
	onSuccess,
}: WriteKudoModalProps) {
	// ─── Form State ──────────────────────────────────────────────
	const [selectedRecipient, setSelectedRecipient] =
		useState<UserResult | null>(null);
	const [danhHieu, setDanhHieu] = useState("");
	const [editorContent, setEditorContent] = useState<JSONContent | null>(null);
	const [selectedHashtags, setSelectedHashtags] = useState<
		Array<{ id: string; name: string }>
	>([]);
	const [attachedImages, setAttachedImages] = useState<ImageAttachment[]>([]);
	const [isAnonymous, setIsAnonymous] = useState(false);
	const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});

	const modalRef = useRef<HTMLDivElement>(null);
	const titleRef = useRef<HTMLHeadingElement>(null);

	// ─── Submission ──────────────────────────────────────────────
	const { submit, isSubmitting, error: submitError } = useCreateKudo(() => {
		onSuccess?.();
		onClose();
	});

	// ─── Derived State ───────────────────────────────────────────
	const hasContent =
		editorContent !== null &&
		JSON.stringify(editorContent) !== '{"type":"doc","content":[{"type":"paragraph"}]}';

	const isFormValid =
		selectedRecipient !== null &&
		danhHieu.trim() !== "" &&
		danhHieu.length <= 50 &&
		hasContent &&
		selectedHashtags.length >= 1;

	// ─── Handlers ────────────────────────────────────────────────
	const handleSubmit = useCallback(async () => {
		if (!isFormValid || isSubmitting || !selectedRecipient || !editorContent) return;

		const errors: Record<string, string> = {};
		if (!selectedRecipient) errors.recipient = "Trường bắt buộc";
		if (!danhHieu.trim()) errors.danhHieu = "Trường bắt buộc";
		if (!hasContent) errors.content = "Trường bắt buộc";
		if (selectedHashtags.length === 0) errors.hashtags = "Chọn ít nhất 1 hashtag";

		if (Object.keys(errors).length > 0) {
			setFieldErrors(errors);
			return;
		}

		setFieldErrors({});

		const success = await submit({
			receiver_id: selectedRecipient.id,
			title: danhHieu,
			content: editorContent as Record<string, unknown>,
			hashtag_ids: selectedHashtags.map((h) => h.id),
			image_urls: attachedImages.map((img) => img.url),
			is_anonymous: isAnonymous,
		});

		if (!success) {
			// Show stale recipient error on the recipient field if applicable
			if (submitError === "Người nhận không hợp lệ") {
				setFieldErrors((prev) => ({ ...prev, recipient: "Người nhận không hợp lệ" }));
			}
		}
	}, [
		isFormValid,
		isSubmitting,
		selectedRecipient,
		danhHieu,
		editorContent,
		hasContent,
		selectedHashtags,
		attachedImages,
		isAnonymous,
		submit,
	]);

	const handleClose = useCallback(() => {
		if (!isSubmitting) {
			onClose();
		}
	}, [isSubmitting, onClose]);

	// ─── Keyboard: ESC to close ──────────────────────────────────
	useEffect(() => {
		if (!isOpen) return;
		const handleKeyDown = (e: KeyboardEvent) => {
			if (e.key === "Escape") handleClose();
		};
		document.addEventListener("keydown", handleKeyDown);
		return () => document.removeEventListener("keydown", handleKeyDown);
	}, [isOpen, handleClose]);

	// ─── Focus trap on open ──────────────────────────────────────
	useEffect(() => {
		if (isOpen) {
			titleRef.current?.focus();
		}
	}, [isOpen]);

	// ─── Beforeunload warning ────────────────────────────────────
	useEffect(() => {
		const hasData =
			selectedRecipient !== null ||
			danhHieu.trim() !== "" ||
			hasContent ||
			selectedHashtags.length > 0 ||
			attachedImages.length > 0;

		if (!isOpen || !hasData) return;

		const handleBeforeUnload = (e: BeforeUnloadEvent) => {
			e.preventDefault();
		};
		window.addEventListener("beforeunload", handleBeforeUnload);
		return () =>
			window.removeEventListener("beforeunload", handleBeforeUnload);
	}, [
		isOpen,
		selectedRecipient,
		danhHieu,
		hasContent,
		selectedHashtags,
		attachedImages,
	]);

	if (!isOpen) return null;

	return (
		<div
			className="fixed inset-0 z-50 flex items-center justify-center bg-[#00101A]/80"
			onClick={(e) => {
				if (e.target === e.currentTarget) handleClose();
			}}
			role="presentation"
		>
			{/* Modal */}
			<div
				ref={modalRef}
				role="dialog"
				aria-modal="true"
				aria-labelledby="write-kudo-title"
				className="w-full max-w-[752px] max-h-screen overflow-y-auto p-10 rounded-3xl bg-[#FFF8E1] flex flex-col gap-8 animate-in fade-in zoom-in-95 duration-200
					max-md:max-w-full max-md:h-full max-md:rounded-none max-md:p-5
					md:max-lg:max-w-[90vw] md:max-lg:p-8"
			>
				{/* A: Title */}
				<h2
					id="write-kudo-title"
					ref={titleRef}
					tabIndex={-1}
					className="w-full text-[32px] font-bold leading-10 text-center font-[family-name:var(--font-montserrat)] text-[#00101A] outline-none
						max-md:text-2xl"
				>
					Gửi lời cám ơn và ghi nhận đến đồng đội
				</h2>

				{/* B: Người nhận */}
				<RecipientField
					selectedRecipient={selectedRecipient}
					onSelect={setSelectedRecipient}
					error={fieldErrors.recipient}
				/>

				{/* B': Danh hiệu */}
				<DanhHieuField
					value={danhHieu}
					onChange={setDanhHieu}
					error={fieldErrors.danhHieu}
				/>

				{/* Content section: Editor + Hashtags + Images */}
				<div className="w-full flex flex-col gap-6">
					{/* C+D: Rich Text Editor */}
					<KudoEditor
						onChange={setEditorContent}
						error={fieldErrors.content}
					/>

					{/* E: Hashtags */}
					<HashtagField
						selectedHashtags={selectedHashtags}
						onChange={setSelectedHashtags}
						error={fieldErrors.hashtags}
					/>

					{/* F: Images */}
					<ImageUploadField
						images={attachedImages}
						onAdd={(url) =>
							setAttachedImages((prev) => [...prev, { url }])
						}
						onRemove={(index) =>
							setAttachedImages((prev) =>
								prev.filter((_, i) => i !== index),
							)
						}
					/>
				</div>

				{/* G: Anonymous Toggle */}
				<AnonymousToggle
					checked={isAnonymous}
					onChange={setIsAnonymous}
				/>

				{/* Error message */}
				{submitError && (
					<p className="text-base font-bold font-[family-name:var(--font-montserrat)] text-[#E46060]">
						{submitError}
					</p>
				)}

				{/* H: Action Row */}
				<div className="w-full flex items-start gap-6">
					{/* H.1: Cancel */}
					<button
						type="button"
						onClick={handleClose}
						disabled={isSubmitting}
						className="h-[60px] px-10 py-4 border border-[#998C5F] bg-[#FFEA9E]/10 font-[family-name:var(--font-montserrat)] text-base font-bold text-[#00101A] flex items-center gap-2 transition-colors hover:bg-[#FFEA9E]/20 disabled:opacity-50"
					>
						Hủy
						<Icon name="close" size={16} className="text-[#00101A]" />
					</button>

					{/* H.2: Submit */}
					<button
						type="button"
						onClick={handleSubmit}
						disabled={!isFormValid || isSubmitting}
						className="flex-1 h-[60px] px-4 rounded-lg bg-[#FFEA9E] font-[family-name:var(--font-montserrat)] text-[22px] font-bold text-[#00101A] flex items-center justify-center gap-2 transition-colors hover:bg-[#FFE27A] disabled:bg-[#E5E5E5] disabled:text-[#999] disabled:cursor-not-allowed
							max-md:w-full"
					>
						{isSubmitting ? (
							<span className="w-5 h-5 border-2 border-[#00101A] border-t-transparent rounded-full animate-spin" />
						) : (
							<>
								Gửi
								<Icon name="send" size={16} className="text-[#00101A]" />
							</>
						)}
					</button>
				</div>
			</div>
		</div>
	);
}
