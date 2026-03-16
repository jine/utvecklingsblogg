"use client";

import { useCallback, useState } from "react";
import { handleImageUpload as uploadImage } from "@/lib/tiptap-utils";
import type { Editor } from "@tiptap/react";

export interface UploadError {
	message: string;
	file?: string;
}

export interface UseImageUploadOptions {
	editor: Editor | null;
	onError?: (error: UploadError) => void;
	onSuccess?: (url: string) => void;
}

export interface UseImageUploadReturn {
	isUploading: boolean;
	uploadProgress: number;
	currentFile: string | null;
	uploadFile: (file: File, pos?: number) => Promise<void>;
	uploadFiles: (files: File[], pos?: number) => Promise<void>;
	clearError: () => void;
	error: UploadError | null;
}

/**
 * Hook for handling image uploads with progress tracking and error handling
 * Encapsulates common upload logic used by both ImageUploadNode and FileHandler
 */
export function useImageUpload({
	editor,
	onError,
	onSuccess,
}: UseImageUploadOptions): UseImageUploadReturn {
	const [isUploading, setIsUploading] = useState(false);
	const [uploadProgress, setUploadProgress] = useState(0);
	const [currentFile, setCurrentFile] = useState<string | null>(null);
	const [error, setError] = useState<UploadError | null>(null);

	const clearError = useCallback(() => {
		setError(null);
	}, []);

	const uploadFile = useCallback(
		async (file: File, pos?: number) => {
			if (!editor) return;

			setIsUploading(true);
			setUploadProgress(0);
			setCurrentFile(file.name);
			setError(null);

			try {
				const url = await uploadImage(
					file,
					({ progress }) => setUploadProgress(progress),
				);

				// Insert image at position or current cursor position
				if (typeof pos === "number") {
					editor
						.chain()
						.insertContentAt(pos, {
							type: "image",
							attrs: {
								src: url,
								alt: file.name.replace(/\.[^/.]+$/, ""),
								title: file.name,
							},
						})
						.focus()
						.run();
				} else {
					editor
						.chain()
						.insertContent({
							type: "image",
							attrs: {
								src: url,
								alt: file.name.replace(/\.[^/.]+$/, ""),
								title: file.name,
							},
						})
						.focus()
						.run();
				}

				onSuccess?.(url);
			} catch (err) {
				const uploadError: UploadError = {
					message: err instanceof Error ? err.message : "Upload failed",
					file: file.name,
				};
				setError(uploadError);
				onError?.(uploadError);
				console.error("Image upload failed:", err);
			} finally {
				setIsUploading(false);
				setUploadProgress(0);
				setCurrentFile(null);
			}
		},
		[editor, onError, onSuccess],
	);

	const uploadFiles = useCallback(
		async (files: File[], pos?: number) => {
			// Upload files sequentially to maintain order
			for (const file of files) {
				await uploadFile(file, pos);
				// For multiple files, insert at incremented positions
				if (typeof pos === "number") {
					pos += 1;
				}
			}
		},
		[uploadFile],
	);

	return {
		isUploading,
		uploadProgress,
		currentFile,
		uploadFile,
		uploadFiles,
		clearError,
		error,
	};
}
