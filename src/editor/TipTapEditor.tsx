'use dom';

import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import TextStyle from '@tiptap/extension-text-style';
import Color from '@tiptap/extension-color';
import Highlight from '@tiptap/extension-highlight';
import Link from '@tiptap/extension-link';
import { useEffect, useCallback } from 'react';
import { editorIcons } from './icons';

interface TipTapEditorProps {
  content?: string;
  onUpdate?: (content: string) => Promise<void>;
  onReady?: () => void;
  dom?: import('expo/dom').DOMProps;
}

export default function TipTapEditor({ 
  content = '', 
  onUpdate,
  onReady
}: TipTapEditorProps) {
  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        // Configure nested lists
        bulletList: {
          keepMarks: true,
          keepAttributes: false,
        },
        orderedList: {
          keepMarks: true,
          keepAttributes: false,
        },
        listItem: {
          nested: true,
        },
        // Disable built-in link to avoid conflicts
        link: false,
      }),
      TextStyle,
      Color,
      Highlight.configure({
        multicolor: true,
      }),
      Link.configure({
        openOnClick: false,
        HTMLAttributes: {
          class: 'text-blue-500 underline',
        },
      }),
    ],
    content,
    editorProps: {
      attributes: {
        class: 'prose prose-sm sm:prose lg:prose-lg xl:prose-2xl mx-auto focus:outline-none min-h-screen p-4',
      },
    },
    onUpdate: ({ editor }) => {
      const html = editor.getHTML();
      const json = JSON.stringify(editor.getJSON());
      onUpdate?.(json);
    },
  });

  // Update editor content when prop changes
  useEffect(() => {
    if (editor && content && content !== JSON.stringify(editor.getJSON())) {
      try {
        const parsedContent = JSON.parse(content);
        editor.commands.setContent(parsedContent);
      } catch {
        // If it's not JSON, treat as HTML
        editor.commands.setContent(content);
      }
      
      // Notify that editor is ready with content
      if (onReady) {
        setTimeout(() => {
          onReady();
        }, 50);
      }
    }
  }, [editor, content, onReady]);

  const setLink = useCallback(() => {
    if (!editor) return;
    
    const previousUrl = editor.getAttributes('link').href;
    const url = window.prompt('URL', previousUrl);

    if (url === null) return;

    if (url === '') {
      editor.chain().focus().extendMarkRange('link').unsetLink().run();
      return;
    }

    editor.chain().focus().extendMarkRange('link').setLink({ href: url }).run();
  }, [editor]);

  const renderIcon = (iconName: keyof typeof editorIcons, isActive: boolean) => {
    const iconSvg = editorIcons[iconName];
    const color = isActive ? '#fff' : '#697180';
    return (
      <div 
        dangerouslySetInnerHTML={{ 
          __html: iconSvg.replace(/currentColor/g, color) 
        }} 
      />
    );
  };

  if (!editor) {
    return <div>Loading editor...</div>;
  }

  return (
    <div className="w-full h-full bg-white">
      {/* Toolbar */}
      <div className="sticky top-0 bg-white border-b border-gray-200 p-2 flex flex-wrap gap-1 z-10">
        {/* Text formatting */}
        <button
          onClick={() => editor.chain().focus().toggleBold().run()}
          className={`p-2 rounded ${
            editor.isActive('bold') 
              ? 'bg-blue-500' 
              : 'bg-gray-100 hover:bg-gray-200'
          }`}
          title="Bold"
        >
          {renderIcon('bold', editor.isActive('bold'))}
        </button>
        
        <button
          onClick={() => editor.chain().focus().toggleItalic().run()}
          className={`p-2 rounded ${
            editor.isActive('italic') 
              ? 'bg-blue-500' 
              : 'bg-gray-100 hover:bg-gray-200'
          }`}
          title="Italic"
        >
          {renderIcon('italic', editor.isActive('italic'))}
        </button>

        <button
          onClick={() => editor.chain().focus().toggleUnderline().run()}
          className={`p-2 rounded ${
            editor.isActive('underline') 
              ? 'bg-blue-500' 
              : 'bg-gray-100 hover:bg-gray-200'
          }`}
          title="Underline"
        >
          {renderIcon('underline', editor.isActive('underline'))}
        </button>

        <button
          onClick={() => editor.chain().focus().toggleStrike().run()}
          className={`p-2 rounded ${
            editor.isActive('strike') 
              ? 'bg-blue-500' 
              : 'bg-gray-100 hover:bg-gray-200'
          }`}
          title="Strikethrough"
        >
          {renderIcon('strikethrough', editor.isActive('strike'))}
        </button>

        <button
          onClick={() => editor.chain().focus().toggleCode().run()}
          className={`p-2 rounded ${
            editor.isActive('code') 
              ? 'bg-blue-500' 
              : 'bg-gray-100 hover:bg-gray-200'
          }`}
          title="Inline Code"
        >
          {renderIcon('code', editor.isActive('code'))}
        </button>

        {/* Lists */}
        <button
          onClick={() => editor.chain().focus().toggleBulletList().run()}
          className={`p-2 rounded ${
            editor.isActive('bulletList') 
              ? 'bg-blue-500' 
              : 'bg-gray-100 hover:bg-gray-200'
          }`}
          title="Bullet List"
        >
          {renderIcon('list', editor.isActive('bulletList'))}
        </button>

        <button
          onClick={() => editor.chain().focus().toggleOrderedList().run()}
          className={`p-2 rounded ${
            editor.isActive('orderedList') 
              ? 'bg-blue-500' 
              : 'bg-gray-100 hover:bg-gray-200'
          }`}
          title="Numbered List"
        >
          {renderIcon('numberedList', editor.isActive('orderedList'))}
        </button>

        {/* Quote */}
        <button
          onClick={() => editor.chain().focus().toggleBlockquote().run()}
          className={`p-2 rounded ${
            editor.isActive('blockquote') 
              ? 'bg-blue-500' 
              : 'bg-gray-100 hover:bg-gray-200'
          }`}
          title="Quote"
        >
          {renderIcon('quote', editor.isActive('blockquote'))}
        </button>

        {/* Link */}
        <button
          onClick={setLink}
          className={`p-2 rounded ${
            editor.isActive('link') 
              ? 'bg-blue-500' 
              : 'bg-gray-100 hover:bg-gray-200'
          }`}
          title="Link"
        >
          {renderIcon('link', editor.isActive('link'))}
        </button>

        {/* Colors */}
        <div className="flex gap-1">
          <button
            onClick={() => {
              const color = window.prompt('Enter text color (hex, rgb, or name):', editor.getAttributes('textStyle').color || '#000000');
              if (color) {
                editor.chain().focus().setColor(color).run();
              }
            }}
            className={`p-2 rounded ${
              editor.getAttributes('textStyle').color 
                ? 'bg-blue-500' 
                : 'bg-gray-100 hover:bg-gray-200'
            }`}
            title="Text Color"
          >
            {renderIcon('color', !!editor.getAttributes('textStyle').color)}
          </button>
          
          <button
            onClick={() => {
              const color = window.prompt('Enter highlight color (hex, rgb, or name):', '#ffff00');
              if (color) {
                editor.chain().focus().toggleHighlight({ color }).run();
              }
            }}
            className={`p-2 rounded ${
              editor.isActive('highlight') 
                ? 'bg-blue-500' 
                : 'bg-gray-100 hover:bg-gray-200'
            }`}
            title="Highlight"
          >
            {renderIcon('highlighter', editor.isActive('highlight'))}
          </button>
        </div>
      </div>

      {/* Editor */}
      <div className="flex-1 overflow-auto">
        <EditorContent editor={editor} />
      </div>

      {/* Basic CSS for the editor */}
      <style>{`
        .ProseMirror {
          outline: none;
          padding: 1rem;
          line-height: 1.6;
          font-family: 'SF Mono', 'Monaco', 'Inconsolata', 'Roboto Mono', 'Source Code Pro', 'Menlo', 'Consolas', monospace;
          font-weight: 400;
          font-size: 16px;
        }
        
        .ProseMirror ul, .ProseMirror ol {
          padding-left: 1.5rem;
        }
        
        .ProseMirror li {
          margin: 0.25rem 0;
        }
        
        .ProseMirror blockquote {
          border-left: 4px solid #e5e7eb;
          padding-left: 1rem;
          margin: 1rem 0;
          font-style: italic;
          color: #6b7280;
        }
        
        .ProseMirror code {
          background-color: #f3f4f6;
          padding: 0.125rem 0.25rem;
          border-radius: 0.25rem;
          font-family: 'Monaco', 'Consolas', monospace;
        }
        
        .ProseMirror pre {
          background-color: #1f2937;
          color: #f9fafb;
          padding: 1rem;
          border-radius: 0.5rem;
          overflow-x: auto;
        }
        
        .ProseMirror pre code {
          background: none;
          padding: 0;
          color: inherit;
        }
        
        .ProseMirror a {
          color: #3b82f6;
          text-decoration: underline;
        }
        
        .ProseMirror p {
          margin: 0.5rem 0;
        }
        
        .ProseMirror h1, .ProseMirror h2, .ProseMirror h3 {
          margin: 1rem 0 0.5rem 0;
          font-weight: 700;
        }
        
        .ProseMirror h1 { font-size: 1.5rem; }
        .ProseMirror h2 { font-size: 1.25rem; }
        .ProseMirror h3 { font-size: 1.125rem; }
        
        /* CommitMono font weight and style mappings */
        .ProseMirror strong {
          font-weight: 700;
        }
        
        .ProseMirror em {
          font-style: italic;
        }
        
        .ProseMirror strong em,
        .ProseMirror em strong {
          font-weight: 700;
          font-style: italic;
        }
      `}</style>
    </div>
  );
}
