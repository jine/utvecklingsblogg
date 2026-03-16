"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import type { NodeViewProps } from "@tiptap/react";
import { NodeViewWrapper } from "@tiptap/react";
import Image from "next/image";

type ResizeDirection = "se" | "sw" | "ne" | "nw";

const MIN_WIDTH = 50;
const MIN_HEIGHT = 50;

interface ResizeState {
	direction: ResizeDirection;
	startX: number;
	startY: number;
	startWidth: number;
	startHeight: number;
	aspectRatio: number;
}

/**
 * Custom node view for rendering images with Next.js Image component
 * Includes resize functionality with drag handles
 * 
 * Performance optimization: Uses direct DOM manipulation during resize
 * to avoid React re-renders on every mouse move.
 */
export function ImageNodeView({
	node,
	selected,
	updateAttributes,
}: NodeViewProps) {
	const { src, alt, title, width: attrsWidth, height: attrsHeight } = node.attrs;

	// Use stored dimensions or default
	const [dimensions, setDimensions] = useState({
		width: Math.max(MIN_WIDTH, attrsWidth || 800),
		height: Math.max(MIN_HEIGHT, attrsHeight || 600),
	});

	const containerRef = useRef<HTMLDivElement>(null);
	const resizingRef = useRef<ResizeState | null>(null);
	const isResizingRef = useRef(false);

	// Sync dimensions when node attributes change (e.g., from collaboration or undo)
	useEffect(() => {
		if (attrsWidth && attrsHeight && !isResizingRef.current) {
			setDimensions({
				width: Math.max(MIN_WIDTH, attrsWidth),
				height: Math.max(MIN_HEIGHT, attrsHeight),
			});
		}
	}, [attrsWidth, attrsHeight]);

	// Handle resize drag - using refs to avoid stale closures
	const handleResize = useCallback((e: MouseEvent) => {
		if (!resizingRef.current || !containerRef.current) return;

		const { direction, startX, startY, startWidth, aspectRatio } = resizingRef.current;

		const deltaX = e.clientX - startX;
		let newWidth: number;

		// Calculate new width based on direction
		switch (direction) {
			case "se":
			case "ne":
				newWidth = Math.max(MIN_WIDTH, startWidth + deltaX);
				break;
			case "sw":
			case "nw":
				newWidth = Math.max(MIN_WIDTH, startWidth - deltaX);
				break;
		}

		// Maintain aspect ratio
		const newHeight = Math.max(MIN_HEIGHT, newWidth / aspectRatio);

		// Apply directly to DOM for performance (avoid React re-render during drag)
		containerRef.current.style.width = `${newWidth}px`;
	}, []);

	// Stop resizing and save attributes to node
	const stopResize = useCallback(() => {
		if (!resizingRef.current || !containerRef.current) return;

		isResizingRef.current = false;

		// Get final dimensions from DOM
		const finalWidth = parseInt(containerRef.current.style.width, 10) || dimensions.width;
		const aspectRatio = resizingRef.current.aspectRatio;
		const finalHeight = Math.max(MIN_HEIGHT, finalWidth / aspectRatio);

		// Update state and save to node
		const newDimensions = { width: finalWidth, height: finalHeight };
		setDimensions(newDimensions);
		updateAttributes(newDimensions);

		resizingRef.current = null;

		// Remove listeners
		document.removeEventListener("mousemove", handleResize);
		document.removeEventListener("mouseup", stopResize);
		document.removeEventListener("touchmove", handleTouchResize);
		document.removeEventListener("touchend", stopResize);
	}, [updateAttributes, dimensions.width]);

	// Touch resize handler
	const handleTouchResize = useCallback((e: TouchEvent) => {
		if (!resizingRef.current || !containerRef.current || e.touches.length === 0) return;

		const touch = e.touches[0];
		const { direction, startX, startY, startWidth, aspectRatio } = resizingRef.current;

		const deltaX = touch.clientX - startX;
		let newWidth: number;

		switch (direction) {
			case "se":
			case "ne":
				newWidth = Math.max(MIN_WIDTH, startWidth + deltaX);
				break;
			case "sw":
			case "nw":
				newWidth = Math.max(MIN_WIDTH, startWidth - deltaX);
				break;
		}

		containerRef.current.style.width = `${newWidth}px`;
	}, []);

	// Start resizing
	const startResize = useCallback(
		(direction: ResizeDirection) => (e: React.MouseEvent | React.TouchEvent) => {
			e.preventDefault();
			e.stopPropagation();

			if (!containerRef.current) return;

			isResizingRef.current = true;

			const rect = containerRef.current.getBoundingClientRect();
			const clientX = "touches" in e ? e.touches[0]?.clientX : e.clientX;
			const clientY = "touches" in e ? e.touches[0]?.clientY : e.clientY;

			resizingRef.current = {
				direction,
				startX: clientX,
				startY: clientY,
				startWidth: rect.width,
				startHeight: rect.height,
				aspectRatio: rect.width / rect.height,
			};

			// Mouse events
			if ("button" in e) {
				document.addEventListener("mousemove", handleResize);
				document.addEventListener("mouseup", stopResize);
			}
			// Touch events
			else {
				document.addEventListener("touchmove", handleTouchResize, { passive: false });
				document.addEventListener("touchend", stopResize);
			}
		},
		[handleResize, stopResize, handleTouchResize],
	);

	// Cleanup on unmount
	useEffect(() => {
		return () => {
			if (isResizingRef.current) {
				document.removeEventListener("mousemove", handleResize);
				document.removeEventListener("mouseup", stopResize);
				document.removeEventListener("touchmove", handleTouchResize);
				document.removeEventListener("touchend", stopResize);
			}
		};
	}, [handleResize, stopResize, handleTouchResize]);

	return (
		<NodeViewWrapper
			className={`image-node-view ${selected ? "selected" : ""}`}
			data-drag-handle
		>
			<figure className="tiptap-image-figure">
				<div
					ref={containerRef}
					className="tiptap-image-container"
					style={{
						width: dimensions.width,
						maxWidth: "100%",
					}}
				>
					<Image
						src={src}
						alt={alt || ""}
						title={title || ""}
						width={dimensions.width}
						height={dimensions.height}
						unoptimized
						className="tiptap-image"
						style={{
							width: "100%",
							height: "auto",
							display: "block",
						}}
						// Prevent default drag to allow our resize handles to work
						draggable={false}
					/>

					{/* Resize handles - only show when selected */}
					{selected && (
						<>
							<div
								className="resize-handle resize-handle-nw"
								onMouseDown={startResize("nw")}
								onTouchStart={startResize("nw")}
								role="button"
								aria-label="Resize image from top-left"
								tabIndex={0}
							/>
							<div
								className="resize-handle resize-handle-ne"
								onMouseDown={startResize("ne")}
								onTouchStart={startResize("ne")}
								role="button"
								aria-label="Resize image from top-right"
								tabIndex={0}
							/>
							<div
								className="resize-handle resize-handle-sw"
								onMouseDown={startResize("sw")}
								onTouchStart={startResize("sw")}
								role="button"
								aria-label="Resize image from bottom-left"
								tabIndex={0}
							/>
							<div
								className="resize-handle resize-handle-se"
								onMouseDown={startResize("se")}
								onTouchStart={startResize("se")}
								role="button"
								aria-label="Resize image from bottom-right"
								tabIndex={0}
							/>
						</>
					)}
				</div>

				{title && (
					<figcaption className="tiptap-image-caption">{title}</figcaption>
				)}
			</figure>
		</NodeViewWrapper>
	);
}
