import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Link from '@tiptap/extension-link';
import Underline from '@tiptap/extension-underline';
import TextAlign from '@tiptap/extension-text-align';
import { TextStyle } from '@tiptap/extension-text-style';
import { Color } from '@tiptap/extension-color';
import {
  Bold,
  Italic,
  Underline as UnderlineIcon,
  Link as LinkIcon,
  AlignLeft,
  AlignCenter,
  AlignRight,
} from 'lucide-react';
import { useCallback } from 'react';

// Props for RichTextEditor component
interface RichTextEditorProps {
  content: string; // HTML string content from the block
  onChange: (content: string) => void; // Callback when content changes
  placeholder?: string; // Optional placeholder text
  className?: string; // Optional CSS classes
}

// Rich text editor component using Tiptap
// Provides WYSIWYG editing with formatting toolbar for Text blocks
export function RichTextEditor({ content, onChange, placeholder, className }: RichTextEditorProps) {
  // Initialize Tiptap editor with extensions
  const editor = useEditor({
    extensions: [
      // StarterKit: Basic editing features (paragraphs, bold, italic, etc.)
      StarterKit.configure({
        heading: false, // We use separate Heading blocks instead of headings in text
      }),
      // Link: Clickable hyperlinks
      Link.configure({
        openOnClick: false, // Don't open links in editor mode
        HTMLAttributes: {
          class: 'text-blue-500 underline', // Style for links
        },
      }),
      // Underline: Text underline formatting
      Underline,
      // TextAlign: Left/center/right text alignment
      TextAlign.configure({
        types: ['paragraph'], // Apply alignment to paragraphs
      }),
      // TextStyle: Required for color extension
      TextStyle,
      // Color: Text color customization
      Color,
    ],
    content, // Initial content
    // onUpdate callback - fires when user types or formats
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML()); // Send HTML back to parent
    },
    editorProps: {
      attributes: {
        class: 'prose prose-sm max-w-none focus:outline-none min-h-[100px] p-3',
      },
    },
  });

  // Callback to set/edit/remove links in the text
  const setLink = useCallback(() => {
    if (!editor) return;

    // Get existing link URL if cursor is on a link
    const previousUrl = editor.getAttributes('link').href;
    const url = window.prompt('Enter URL:', previousUrl);

    // User cancelled the prompt
    if (url === null) {
      return;
    }

    // User entered empty string - remove the link
    if (url === '') {
      editor.chain().focus().extendMarkRange('link').unsetLink().run();
      return;
    }

    // update link
    editor.chain().focus().extendMarkRange('link').setLink({ href: url }).run();
  }, [editor]);

  if (!editor) {
    return null;
  }

  return (
    <div className={className}>
      {/* Toolbar */}
      <div className="border border-border rounded-t-md bg-muted/30 p-2 flex flex-wrap gap-1">
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleBold().run()}
          className={`p-2 rounded hover:bg-accent ${
            editor.isActive('bold') ? 'bg-accent' : ''
          }`}
          title="Bold"
        >
          <Bold className="w-4 h-4" />
        </button>
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleItalic().run()}
          className={`p-2 rounded hover:bg-accent ${
            editor.isActive('italic') ? 'bg-accent' : ''
          }`}
          title="Italic"
        >
          <Italic className="w-4 h-4" />
        </button>
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleUnderline().run()}
          className={`p-2 rounded hover:bg-accent ${
            editor.isActive('underline') ? 'bg-accent' : ''
          }`}
          title="Underline"
        >
          <UnderlineIcon className="w-4 h-4" />
        </button>
        <div className="w-px h-6 bg-border mx-1" />
        <button
          type="button"
          onClick={setLink}
          className={`p-2 rounded hover:bg-accent ${
            editor.isActive('link') ? 'bg-accent' : ''
          }`}
          title="Add Link"
        >
          <LinkIcon className="w-4 h-4" />
        </button>
        <div className="w-px h-6 bg-border mx-1" />
        <button
          type="button"
          onClick={() => editor.chain().focus().setTextAlign('left').run()}
          className={`p-2 rounded hover:bg-accent ${
            editor.isActive({ textAlign: 'left' }) ? 'bg-accent' : ''
          }`}
          title="Align Left"
        >
          <AlignLeft className="w-4 h-4" />
        </button>
        <button
          type="button"
          onClick={() => editor.chain().focus().setTextAlign('center').run()}
          className={`p-2 rounded hover:bg-accent ${
            editor.isActive({ textAlign: 'center' }) ? 'bg-accent' : ''
          }`}
          title="Align Center"
        >
          <AlignCenter className="w-4 h-4" />
        </button>
        <button
          type="button"
          onClick={() => editor.chain().focus().setTextAlign('right').run()}
          className={`p-2 rounded hover:bg-accent ${
            editor.isActive({ textAlign: 'right' }) ? 'bg-accent' : ''
          }`}
          title="Align Right"
        >
          <AlignRight className="w-4 h-4" />
        </button>
      </div>

      {/* Editor */}
      <div className="border border-t-0 border-border rounded-b-md bg-background">
        <EditorContent editor={editor} placeholder={placeholder} />
      </div>
    </div>
  );
}
