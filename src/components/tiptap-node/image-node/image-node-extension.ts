"use client";

import { Image as TiptapImage } from "@tiptap/extension-image";
import { ReactNodeViewRenderer } from "@tiptap/react";
import { ImageNodeView } from "./image-node-view";

/**
 * Custom Image extension that renders Next.js Image component
 * This provides better performance and optimization for uploaded images
 */
export const CustomImage = TiptapImage.extend({
	addNodeView() {
		return ReactNodeViewRenderer(ImageNodeView);
	},
});

export default CustomImage;
