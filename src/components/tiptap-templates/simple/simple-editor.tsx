"use client"

import { useCallback, useEffect, useRef, useState } from "react"
import { EditorContent, EditorContext, useEditor } from "@tiptap/react"
import { Code2Icon } from "@/components/tiptap-icons/code2-icon"

// --- Tiptap Core Extensions ---
import { StarterKit } from "@tiptap/starter-kit"
import { FileHandler } from "@tiptap/extension-file-handler"
import { TaskItem, TaskList } from "@tiptap/extension-list"
import { TextAlign } from "@tiptap/extension-text-align"
import { Typography } from "@tiptap/extension-typography"
import { Highlight } from "@tiptap/extension-highlight"
import { Subscript } from "@tiptap/extension-subscript"
import { Superscript } from "@tiptap/extension-superscript"
import { Selection } from "@tiptap/extensions"

// --- UI Primitives ---
import { Button } from "@/components/tiptap-ui-primitive/button"
import { Spacer } from "@/components/tiptap-ui-primitive/spacer"
import {
  Toolbar,
  ToolbarGroup,
  ToolbarSeparator,
} from "@/components/tiptap-ui-primitive/toolbar"

// --- Tiptap Node ---
import { ImageUploadNode } from "@/components/tiptap-node/image-upload-node/image-upload-node-extension"
import { HorizontalRule } from "@/components/tiptap-node/horizontal-rule-node/horizontal-rule-node-extension"
import { CustomImage } from "@/components/tiptap-node/image-node/image-node-extension"
import "@/components/tiptap-node/blockquote-node/blockquote-node.scss"
import "@/components/tiptap-node/code-block-node/code-block-node.scss"
import "@/components/tiptap-node/horizontal-rule-node/horizontal-rule-node.scss"
import "@/components/tiptap-node/list-node/list-node.scss"
import "@/components/tiptap-node/image-node/image-node.scss"
import "@/components/tiptap-node/heading-node/heading-node.scss"
import "@/components/tiptap-node/paragraph-node/paragraph-node.scss"

// --- Tiptap UI ---
import { HeadingDropdownMenu } from "@/components/tiptap-ui/heading-dropdown-menu"
import { ImageUploadButton } from "@/components/tiptap-ui/image-upload-button"
import { ListDropdownMenu } from "@/components/tiptap-ui/list-dropdown-menu"
import { BlockquoteButton } from "@/components/tiptap-ui/blockquote-button"
import { CodeBlockButton } from "@/components/tiptap-ui/code-block-button"
import {
  ColorHighlightPopover,
  ColorHighlightPopoverContent,
  ColorHighlightPopoverButton,
} from "@/components/tiptap-ui/color-highlight-popover"
import {
  LinkPopover,
  LinkContent,
  LinkButton,
} from "@/components/tiptap-ui/link-popover"
import { MarkButton } from "@/components/tiptap-ui/mark-button"
import { TextAlignButton } from "@/components/tiptap-ui/text-align-button"
import { UndoRedoButton } from "@/components/tiptap-ui/undo-redo-button"

// --- Icons ---
import { ArrowLeftIcon } from "@/components/tiptap-icons/arrow-left-icon"
import { HighlighterIcon } from "@/components/tiptap-icons/highlighter-icon"
import { LinkIcon } from "@/components/tiptap-icons/link-icon"

// --- Hooks ---
import { useIsBreakpoint } from "@/hooks/use-is-breakpoint"
import { useWindowSize } from "@/hooks/use-window-size"
import { useCursorVisibility } from "@/hooks/use-cursor-visibility"

// --- Components ---
import { ThemeToggle } from "@/components/tiptap-templates/simple/theme-toggle"

// --- Lib ---
import { handleImageUpload, MAX_FILE_SIZE } from "@/lib/tiptap-utils"

// --- Hooks ---
import { useImageUpload } from "@/hooks/use-image-upload"

// --- Styles ---
import "@/components/tiptap-templates/simple/simple-editor.scss"

// content is going be passed as a prop from the parent component instead.
//import content from "@/components/tiptap-templates/simple/data/content.json"

const MainToolbarContent = ({
  onHighlighterClick,
  onLinkClick,
  isMobile,
  isHtmlMode,
  onHtmlModeClick,
}: {
  onHighlighterClick: () => void
  onLinkClick: () => void
  isMobile: boolean
  isHtmlMode: boolean
  onHtmlModeClick: () => void
}) => {
  return (
    <>
      <Spacer />

      <ToolbarGroup>
        <UndoRedoButton action="undo" />
        <UndoRedoButton action="redo" />
      </ToolbarGroup>

      <ToolbarSeparator />

      <ToolbarGroup>
        <HeadingDropdownMenu levels={[1, 2, 3, 4]} portal={isMobile} />
        <ListDropdownMenu
          types={["bulletList", "orderedList", "taskList"]}
          portal={isMobile}
        />
        <BlockquoteButton />
        <CodeBlockButton />
      </ToolbarGroup>

      <ToolbarSeparator />

      <ToolbarGroup>
        <MarkButton type="bold" />
        <MarkButton type="italic" />
        <MarkButton type="strike" />
        <MarkButton type="code" />
        <MarkButton type="underline" />
        {!isMobile ? (
          <ColorHighlightPopover />
        ) : (
          <ColorHighlightPopoverButton onClick={onHighlighterClick} />
        )}
        {!isMobile ? <LinkPopover /> : <LinkButton onClick={onLinkClick} />}
      </ToolbarGroup>

      <ToolbarSeparator />

      <ToolbarGroup>
        <MarkButton type="superscript" />
        <MarkButton type="subscript" />
      </ToolbarGroup>

      <ToolbarSeparator />

      <ToolbarGroup>
        <TextAlignButton align="left" />
        <TextAlignButton align="center" />
        <TextAlignButton align="right" />
        <TextAlignButton align="justify" />
      </ToolbarGroup>

      <ToolbarSeparator />

      <ToolbarGroup>
        <ImageUploadButton text="Add" />
      </ToolbarGroup>

      <Spacer />

      {isMobile && <ToolbarSeparator />}

      <ToolbarGroup>
        <ThemeToggle />
      </ToolbarGroup>

      <ToolbarSeparator />

      <ToolbarGroup>
        <Button
          type="button"
          variant="ghost"
          onClick={onHtmlModeClick}
          data-active-state={isHtmlMode ? "on" : "off"}
          tooltip={isHtmlMode ? "Visuellt läge" : "HTML-läge"}
        >
          <Code2Icon className="tiptap-button-icon" />
        </Button>
      </ToolbarGroup>
    </>
  )
}

const MobileToolbarContent = ({
  type,
  onBack,
}: {
  type: "highlighter" | "link"
  onBack: () => void
}) => (
  <>
    <ToolbarGroup>
      <Button variant="ghost" onClick={onBack}>
        <ArrowLeftIcon className="tiptap-button-icon" />
        {type === "highlighter" ? (
          <HighlighterIcon className="tiptap-button-icon" />
        ) : (
          <LinkIcon className="tiptap-button-icon" />
        )}
      </Button>
    </ToolbarGroup>

    <ToolbarSeparator />

    {type === "highlighter" ? (
      <ColorHighlightPopoverContent />
    ) : (
      <LinkContent />
    )}
  </>
)

// We need to pass onChange as a prop to the SimpleEditor component so that the parent component (PostForm) 
// can receive the updated HTML content whenever it changes in the editor. This way, when the form is submitted, 
// we can include the latest content from the editor in the form data.
export function SimpleEditor({ content, onChange }: { content?: string; onChange?: (html: string) => void }) {
  const isMobile = useIsBreakpoint()
  const { height } = useWindowSize()
  const [mobileView, setMobileView] = useState<"main" | "highlighter" | "link">(
    "main"
  )
  const [isHtmlMode, setIsHtmlMode] = useState(false)
  const [htmlContent, setHtmlContent] = useState(content || "")
  const [uploadError, setUploadError] = useState<string | null>(null)
  const toolbarRef = useRef<HTMLDivElement>(null)

  const handleUploadError = useCallback((error: { message: string; file?: string }) => {
    setUploadError(`${error.message}${error.file ? ` (${error.file})` : ''}`)
    // Clear error after 5 seconds
    setTimeout(() => setUploadError(null), 5000)
  }, [])

  const editor = useEditor({
    immediatelyRender: false,
    editorProps: {
      attributes: {
        autocomplete: "off",
        autocorrect: "off",
        autocapitalize: "off",
        "aria-label": "Main content area, start typing to enter text.",
        class: "simple-editor",
      },
    },
    extensions: [
      StarterKit.configure({
        horizontalRule: false,
        link: {
          openOnClick: false,
          enableClickSelection: true,
        },
      }),
      HorizontalRule,
      TextAlign.configure({ types: ["heading", "paragraph"] }),
      TaskList,
      TaskItem.configure({ nested: true }),
      Highlight.configure({ multicolor: true }),
      CustomImage,
      Typography,
      Superscript,
      Subscript,
      Selection,
      FileHandler.configure({
        allowedMimeTypes: ['image/jpeg', 'image/png', 'image/gif', 'image/webp'],
        onDrop: (editor, files, pos) => {
          // Don't handle if already uploading
          if (isUploading) return
          uploadFiles(Array.from(files), pos)
        },
        onPaste: (editor, files, htmlContent) => {
          // If htmlContent is provided (e.g., copying from other apps), let the default handler work
          if (htmlContent) return false
          // Don't handle if already uploading
          if (isUploading) return false
          uploadFiles(Array.from(files))
          return true
        },
      }),
      ImageUploadNode.configure({
        accept: "image/*",
        maxSize: MAX_FILE_SIZE,
        limit: 3,
        upload: handleImageUpload,
        onError: (error) => {
          console.error("Upload failed:", error)
          handleUploadError({ message: error.message })
        },
      }),
    ],

    // We initialize the editor with the content passed as a prop. 
    // Whenever the editor's content changes, we call the onChange 
    // callback to pass the updated HTML content back to the parent component.
    content: content,
    onUpdate({ editor }) {
      onChange?.(editor.getHTML())
    },
  })

  // Hook for handling drag-drop and paste uploads with error handling
  const { isUploading, uploadProgress, currentFile, uploadFiles } = useImageUpload({
    editor,
    onError: handleUploadError,
  })

  const rect = useCursorVisibility({
    editor,
    overlayHeight: toolbarRef.current?.getBoundingClientRect().height ?? 0,
  })

  useEffect(() => {
    if (!isMobile && mobileView !== "main") {
      setMobileView("main")
    }
  }, [isMobile, mobileView])

  // Sync htmlContent when content prop changes and not in HTML mode
  useEffect(() => {
    if (!isHtmlMode && content !== undefined) {
      setHtmlContent(content)
    }
  }, [content, isHtmlMode])

  // Clear upload error when editor is focused
  useEffect(() => {
    if (!editor) return
    const handleFocus = () => setUploadError(null)
    editor.on('focus', handleFocus)
    return () => {
      editor.off('focus', handleFocus)
    }
  }, [editor])

  const handleHtmlModeToggle = () => {
    if (!isHtmlMode) {
      // Switching to HTML mode - get current HTML from editor
      const currentHtml = editor?.getHTML() || ""
      setHtmlContent(currentHtml)
      setIsHtmlMode(true)
    } else {
      // Switching back to visual mode - set content from textarea
      if (editor) {
        editor.commands.setContent(htmlContent, { parseOptions: { preserveWhitespace: 'full' } })
      }
      setIsHtmlMode(false)
      // Trigger onChange with the new HTML
      onChange?.(htmlContent)
    }
  }

  const handleHtmlChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newHtml = e.target.value
    setHtmlContent(newHtml)
    onChange?.(newHtml)
  }

  return (
    <div className="simple-editor-wrapper">
      {/* Upload Error Toast */}
      {uploadError && (
        <div 
          className="upload-error-toast"
          role="alert"
          style={{
            position: 'absolute',
            top: '10px',
            right: '10px',
            background: 'var(--tt-error-bg, #fee2e2)',
            color: 'var(--tt-error-text, #dc2626)',
            padding: '12px 16px',
            borderRadius: '6px',
            boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
            zIndex: 50,
            maxWidth: '300px',
            fontSize: '14px',
          }}
        >
          <strong>Upload Failed</strong>
          <p style={{ margin: '4px 0 0 0' }}>{uploadError}</p>
          <button 
            onClick={() => setUploadError(null)}
            style={{
              position: 'absolute',
              top: '4px',
              right: '4px',
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              fontSize: '16px',
              color: 'inherit',
            }}
            aria-label="Dismiss error"
          >
            ×
          </button>
        </div>
      )}
      
      {/* Upload Progress Indicator */}
      {isUploading && (
        <div 
          className="upload-progress-indicator"
          style={{
            position: 'absolute',
            top: '10px',
            left: '50%',
            transform: 'translateX(-50%)',
            background: 'var(--tt-bg, white)',
            padding: '8px 16px',
            borderRadius: '20px',
            boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
            zIndex: 50,
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            fontSize: '14px',
          }}
        >
          <span>Uploading {currentFile}...</span>
          <span>{uploadProgress}%</span>
        </div>
      )}
      <EditorContext.Provider value={{ editor }}>
        <Toolbar
          ref={toolbarRef}
          style={{
            ...(isMobile
              ? {
                  bottom: `calc(100% - ${height - rect.y}px)`,
                }
              : {}),
          }}
        >
          {mobileView === "main" ? (
            <MainToolbarContent
              onHighlighterClick={() => setMobileView("highlighter")}
              onLinkClick={() => setMobileView("link")}
              isMobile={isMobile}
              isHtmlMode={isHtmlMode}
              onHtmlModeClick={handleHtmlModeToggle}
            />
          ) : (
            <MobileToolbarContent
              type={mobileView === "highlighter" ? "highlighter" : "link"}
              onBack={() => setMobileView("main")}
            />
          )}
        </Toolbar>

        {isHtmlMode ? (
          <div className="simple-editor-content">
            <textarea
              value={htmlContent}
              onChange={handleHtmlChange}
              className="simple-editor-html-textarea"
              aria-label="HTML-innehåll"
              spellCheck={false}
            />
          </div>
        ) : (
          <EditorContent
            editor={editor}
            role="presentation"
            className="simple-editor-content"
          />
        )}
      </EditorContext.Provider>
    </div>
  )
}
