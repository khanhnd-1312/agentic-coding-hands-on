"use client";

import { useState, useRef, useCallback, useEffect } from "react";
import { useUserSearch } from "@/hooks/use-user-search";
import { Icon } from "@/components/ui/icon";

interface Recipient {
	id: string;
	name: string;
	avatar_url: string | null;
	department_name: string | null;
}

interface RecipientFieldProps {
	selectedRecipient: Recipient | null;
	onSelect: (user: Recipient) => void;
	error?: string;
}

export function RecipientField({
	selectedRecipient,
	onSelect,
	error,
}: RecipientFieldProps) {
	const { query, setQuery, results: searchResults, isLoading: searchLoading } = useUserSearch();
	const [isOpen, setIsOpen] = useState(false);
	const [highlightedIndex, setHighlightedIndex] = useState(-1);
	const [allUsers, setAllUsers] = useState<Recipient[]>([]);
	const [allUsersLoading, setAllUsersLoading] = useState(false);

	// When query is empty, show allUsers; when searching, show searchResults
	const results = query.trim().length > 0 ? searchResults : allUsers;
	const isLoading = query.trim().length > 0 ? searchLoading : allUsersLoading;

	const fetchAllUsers = useCallback(async () => {
		if (allUsers.length > 0) return; // already fetched
		setAllUsersLoading(true);
		try {
			const res = await fetch("/api/users/search?q=a"); // fetch with broad query
			if (res.ok) {
				const body = (await res.json()) as { data: Recipient[] };
				setAllUsers(body.data ?? []);
			}
		} catch {
			// ignore
		} finally {
			setAllUsersLoading(false);
		}
	}, [allUsers.length]);
	const containerRef = useRef<HTMLDivElement>(null);
	const inputRef = useRef<HTMLInputElement>(null);
	const listRef = useRef<HTMLUListElement>(null);

	const showDropdown = isOpen;

	const handleInputChange = useCallback(
		(e: React.ChangeEvent<HTMLInputElement>) => {
			setQuery(e.target.value);
			setIsOpen(true);
			setHighlightedIndex(-1);
		},
		[setQuery],
	);

	const handleSelect = useCallback(
		(user: Recipient) => {
			onSelect(user);
			setQuery("");
			setIsOpen(false);
			setHighlightedIndex(-1);
		},
		[onSelect, setQuery],
	);

	const handleKeyDown = useCallback(
		(e: React.KeyboardEvent<HTMLInputElement>) => {
			if (!showDropdown) return;

			switch (e.key) {
				case "ArrowDown": {
					e.preventDefault();
					setHighlightedIndex((prev) =>
						prev < results.length - 1 ? prev + 1 : prev,
					);
					break;
				}
				case "ArrowUp": {
					e.preventDefault();
					setHighlightedIndex((prev) => (prev > 0 ? prev - 1 : prev));
					break;
				}
				case "Enter": {
					e.preventDefault();
					if (highlightedIndex >= 0 && highlightedIndex < results.length) {
						handleSelect(results[highlightedIndex]);
					}
					break;
				}
				case "Escape": {
					e.preventDefault();
					setIsOpen(false);
					setHighlightedIndex(-1);
					break;
				}
			}
		},
		[showDropdown, results, highlightedIndex, handleSelect],
	);

	// Scroll highlighted item into view
	useEffect(() => {
		if (highlightedIndex >= 0 && listRef.current) {
			const items = listRef.current.children;
			if (items[highlightedIndex]) {
				(items[highlightedIndex] as HTMLElement).scrollIntoView({
					block: "nearest",
				});
			}
		}
	}, [highlightedIndex]);

	// Close dropdown when clicking outside
	useEffect(() => {
		function handleClickOutside(e: MouseEvent) {
			if (
				containerRef.current &&
				!containerRef.current.contains(e.target as Node)
			) {
				setIsOpen(false);
				setHighlightedIndex(-1);
			}
		}

		document.addEventListener("mousedown", handleClickOutside);
		return () => document.removeEventListener("mousedown", handleClickOutside);
	}, []);

	const borderColor = error ? "border-[#E46060]" : "border-[#998C5F]";

	return (
		<div className="flex items-center gap-4">
			<label className="w-[146px] shrink-0 whitespace-nowrap font-[family-name:var(--font-montserrat)] text-[22px] font-bold leading-[28px] text-[#00101A]">
				Người nhận<span className="text-[#E46060]">*</span>
			</label>

			<div ref={containerRef} className="relative flex-1">
				<div className={`flex items-center ${borderColor} border rounded-lg bg-white`}>
					<input
						ref={inputRef}
						type="text"
						value={selectedRecipient ? selectedRecipient.name : query}
						onChange={(e) => {
							if (selectedRecipient) {
								// Clear selection when user types
								onSelect(null as unknown as Recipient);
							}
							handleInputChange(e);
						}}
						onFocus={() => {
							if (!selectedRecipient && query.trim().length > 0) {
								setIsOpen(true);
							}
						}}
						onKeyDown={handleKeyDown}
						placeholder="T&#236;m ki&#7871;m"
						className="h-14 flex-1 px-6 py-4 font-[family-name:var(--font-montserrat)] text-base font-bold text-[#00101A] placeholder:text-[#999] focus:outline-none"
					/>
					<button
						type="button"
						tabIndex={-1}
						className="flex items-center pr-4"
						onClick={() => {
							inputRef.current?.focus();
							if (!isOpen) fetchAllUsers();
							setIsOpen((prev) => !prev);
						}}
					>
						<Icon name="dropdown-arrow" size={24} className="text-[#998C5F]" />
					</button>
				</div>

				{showDropdown && (
					<ul
						ref={listRef}
						className={`absolute left-0 right-0 top-full z-10 max-h-60 overflow-y-auto border ${borderColor} bg-white shadow`}
						role="listbox"
					>
						{isLoading ? (
							<li className="px-4 py-3 text-[#999]">...</li>
						) : results.length === 0 ? (
							<li className="px-4 py-3 text-[#999]">
								Kh&#244;ng t&#236;m th&#7845;y &#273;&#7891;ng nghi&#7879;p
							</li>
						) : (
							results.map((user, index) => (
								<li
									key={user.id}
									role="option"
									aria-selected={highlightedIndex === index}
									className={`cursor-pointer px-4 py-3 ${
										highlightedIndex === index ? "bg-gray-100" : ""
									} hover:bg-gray-100`}
									onMouseEnter={() => setHighlightedIndex(index)}
									onMouseDown={(e) => {
										e.preventDefault();
										handleSelect(user);
									}}
								>
									<div className="font-[family-name:var(--font-montserrat)] text-sm font-bold text-[#00101A]">
										{user.name}
									</div>
									{user.department_name && (
										<div className="font-[family-name:var(--font-montserrat)] text-xs text-[#999]">
											{user.department_name}
										</div>
									)}
								</li>
							))
						)}
					</ul>
				)}
			</div>
		</div>
	);
}
