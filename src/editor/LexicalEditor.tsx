'use dom';

import { $getRoot, $getSelection } from 'lexical';
import { $isRangeSelection } from 'lexical';
import { LexicalComposer } from '@lexical/react/LexicalComposer';
import { RichTextPlugin } from '@lexical/react/LexicalRichTextPlugin';
import { ContentEditable } from '@lexical/react/LexicalContentEditable';
import { HistoryPlugin } from '@lexical/react/LexicalHistoryPlugin';
import { AutoFocusPlugin } from '@lexical/react/LexicalAutoFocusPlugin';
import { LinkPlugin } from '@lexical/react/LexicalLinkPlugin';
import { ListPlugin } from '@lexical/react/LexicalListPlugin';
import { MarkdownShortcutPlugin } from '@lexical/react/LexicalMarkdownShortcutPlugin';
import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext';
import { $isLinkNode, TOGGLE_LINK_COMMAND } from '@lexical/link';
import { 
  INSERT_ORDERED_LIST_COMMAND, 
  INSERT_UNORDERED_LIST_COMMAND,
  REMOVE_LIST_COMMAND,
  $isListNode
} from '@lexical/list';
import { $isCodeNode } from '@lexical/code';
import { FORMAT_TEXT_COMMAND } from 'lexical';
import { TRANSFORMERS } from '@lexical/markdown';
import { HeadingNode, QuoteNode } from '@lexical/rich-text';
import { ListItemNode, ListNode } from '@lexical/list';
import { CodeNode } from '@lexical/code';
import { LinkNode, AutoLinkNode } from '@lexical/link';
import { MarkNode } from '@lexical/mark';
import { useEffect, useCallback, useState } from 'react';
import { editorIcons } from './icons';

interface LexicalEditorProps {
  content?: string;
  onUpdate?: (content: string) => Promise<void>;
  onReady?: () => void;
  dom?: import('expo/dom').DOMProps;
}

function ToolbarPlugin({ onReady }: { onReady?: () => void }) {
  const [editor] = useLexicalComposerContext();
  const [isBold, setIsBold] = useState(false);
  const [isItalic, setIsItalic] = useState(false);
  const [isUnderline, setIsUnderline] = useState(false);
  const [isStrikethrough, setIsStrikethrough] = useState(false);
  const [isCode, setIsCode] = useState(false);
  const [isLink, setIsLink] = useState(false);

  const updateToolbar = useCallback(() => {
    const selection = $getSelection();
    if ($isRangeSelection(selection)) {
      setIsBold(selection.hasFormat('bold'));
      setIsItalic(selection.hasFormat('italic'));
      setIsUnderline(selection.hasFormat('underline'));
      setIsStrikethrough(selection.hasFormat('strikethrough'));
      setIsCode(selection.hasFormat('code'));
      
      const node = selection.anchor.getNode();
      const parent = node.getParent();
      setIsLink($isLinkNode(parent) || $isLinkNode(node));
    }
  }, []);

  useEffect(() => {
    return editor.registerUpdateListener(({ editorState }) => {
      editorState.read(() => {
        updateToolbar();
      });
    });
  }, [editor, updateToolbar]);

  useEffect(() => {
    // Notify parent that editor is ready
    if (onReady) {
      const timer = setTimeout(() => {
        onReady();
      }, 100);
      return () => clearTimeout(timer);
    }
  }, [onReady]);

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

  const insertLink = useCallback(() => {
    if (!isLink) {
      const url = window.prompt('Enter URL:');
      if (url) {
        editor.dispatchCommand(TOGGLE_LINK_COMMAND, url);
      }
    } else {
      editor.dispatchCommand(TOGGLE_LINK_COMMAND, null);
    }
  }, [editor, isLink]);

  return (
    <div className="toolbar">
      {/* Text formatting */}
      <button
        onClick={() => editor.dispatchCommand(FORMAT_TEXT_COMMAND, 'bold')}
        className={`toolbar-button ${isBold ? 'active' : ''}`}
        title="Bold"
      >
        {renderIcon('bold', isBold)}
      </button>

      <button
        onClick={() => editor.dispatchCommand(FORMAT_TEXT_COMMAND, 'italic')}
        className={`toolbar-button ${isItalic ? 'active' : ''}`}
        title="Italic"
      >
        {renderIcon('italic', isItalic)}
      </button>

      <button
        onClick={() => editor.dispatchCommand(FORMAT_TEXT_COMMAND, 'underline')}
        className={`toolbar-button ${isUnderline ? 'active' : ''}`}
        title="Underline"
      >
        {renderIcon('underline', isUnderline)}
      </button>

      <button
        onClick={() => editor.dispatchCommand(FORMAT_TEXT_COMMAND, 'strikethrough')}
        className={`toolbar-button ${isStrikethrough ? 'active' : ''}`}
        title="Strikethrough"
      >
        {renderIcon('strikethrough', isStrikethrough)}
      </button>

      <button
        onClick={() => editor.dispatchCommand(FORMAT_TEXT_COMMAND, 'code')}
        className={`toolbar-button ${isCode ? 'active' : ''}`}
        title="Code"
      >
        {renderIcon('code', isCode)}
      </button>

      {/* Lists */}
      <button
        onClick={() => editor.dispatchCommand(INSERT_UNORDERED_LIST_COMMAND, undefined)}
        className="toolbar-button"
        title="Bullet List"
      >
        {renderIcon('list', false)}
      </button>

      <button
        onClick={() => editor.dispatchCommand(INSERT_ORDERED_LIST_COMMAND, undefined)}
        className="toolbar-button"
        title="Numbered List"
      >
        {renderIcon('numberedList', false)}
      </button>

      {/* Link */}
      <button
        onClick={insertLink}
        className={`toolbar-button ${isLink ? 'active' : ''}`}
        title="Link"
      >
        {renderIcon('link', isLink)}
      </button>

      {/* Color and Highlight */}
      <button
        onClick={() => {
          const color = window.prompt('Enter text color (hex, rgb, or name):', '#000000');
          if (color) {
            editor.update(() => {
              const selection = $getSelection();
              if ($isRangeSelection(selection)) {
                selection.getNodes().forEach((node) => {
                  node.setStyle(`color: ${color}`);
                });
              }
            });
          }
        }}
        className="toolbar-button"
        title="Text Color"
      >
        {renderIcon('color', false)}
      </button>

      <button
        onClick={() => {
          const color = window.prompt('Enter highlight color (hex, rgb, or name):', '#ffff00');
          if (color) {
            editor.update(() => {
              const selection = $getSelection();
              if ($isRangeSelection(selection)) {
                selection.getNodes().forEach((node) => {
                  node.setStyle(`background-color: ${color}`);
                });
              }
            });
          }
        }}
        className="toolbar-button"
        title="Highlight"
      >
        {renderIcon('highlighter', false)}
      </button>
    </div>
  );
}

function UpdatePlugin({ onUpdate }: { onUpdate?: (content: string) => Promise<void> }) {
  const [editor] = useLexicalComposerContext();

  useEffect(() => {
    return editor.registerUpdateListener(({ editorState }) => {
      if (onUpdate) {
        const json = JSON.stringify(editorState.toJSON());
        onUpdate(json);
      }
    });
  }, [editor, onUpdate]);

  return null;
}

function InitialContentPlugin({ content }: { content?: string }) {
  const [editor] = useLexicalComposerContext();

  useEffect(() => {
    if (content) {
      try {
        const parsedContent = JSON.parse(content);
        const editorState = editor.parseEditorState(parsedContent);
        editor.setEditorState(editorState);
      } catch (error) {
        // If parsing fails, set as plain text
        editor.update(() => {
          const root = $getRoot();
          root.clear();
          root.append(editor.createParagraphNode().append(editor.createTextNode(content)));
        });
      }
    }
  }, [editor, content]);

  return null;
}

export default function LexicalEditor({ 
  content = '', 
  onUpdate,
  onReady
}: LexicalEditorProps) {
  const initialConfig = {
    namespace: 'CalminNotesEditor',
    theme: {
      paragraph: 'editor-paragraph',
      quote: 'editor-quote',
      heading: {
        h1: 'editor-heading-h1',
        h2: 'editor-heading-h2',
        h3: 'editor-heading-h3',
      },
      list: {
        nested: {
          listitem: 'editor-nested-listitem',
        },
        ol: 'editor-list-ol',
        ul: 'editor-list-ul',
        listitem: 'editor-listitem',
      },
      text: {
        bold: 'editor-text-bold',
        italic: 'editor-text-italic',
        underline: 'editor-text-underline',
        strikethrough: 'editor-text-strikethrough',
        code: 'editor-text-code',
      },
      code: 'editor-code',
      link: 'editor-link',
    },
    nodes: [
      HeadingNode,
      ListNode,
      ListItemNode,
      QuoteNode,
      CodeNode,
      LinkNode,
      AutoLinkNode,
      MarkNode,
    ],
    onError: (error: Error) => {
      console.error('Lexical error:', error);
    },
  };

  return (
    <div className="lexical-editor-container">
      <LexicalComposer initialConfig={initialConfig}>
        <ToolbarPlugin onReady={onReady} />
        <div className="editor-container">
          <RichTextPlugin
            contentEditable={<ContentEditable className="editor-input" />}
            placeholder={<div className="editor-placeholder">Start writing...</div>}
            ErrorBoundary={() => <div>Something went wrong!</div>}
          />
          <HistoryPlugin />
          <AutoFocusPlugin />
          <LinkPlugin />
          <ListPlugin />
          <MarkdownShortcutPlugin transformers={TRANSFORMERS} />
          <UpdatePlugin onUpdate={onUpdate} />
          <InitialContentPlugin content={content} />
        </div>
      </LexicalComposer>

      <style>{`
        .lexical-editor-container {
          display: flex;
          flex-direction: column;
          height: 100%;
          font-family: 'SF Mono', 'Monaco', 'Inconsolata', 'Roboto Mono', 'Source Code Pro', 'Menlo', 'Consolas', monospace;
        }

        .toolbar {
          display: flex;
          flex-wrap: wrap;
          gap: 4px;
          padding: 8px;
          border-bottom: 1px solid #E5E5E5;
          background: white;
          position: sticky;
          top: 0;
          z-index: 10;
        }

        .toolbar-button {
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 8px;
          border: none;
          border-radius: 4px;
          background: #f0f0f0;
          cursor: pointer;
          transition: background-color 0.2s;
        }

        .toolbar-button:hover {
          background: #e0e0e0;
        }

        .toolbar-button.active {
          background: #007AFF;
          color: white;
        }

        .editor-container {
          flex: 1;
          display: flex;
          flex-direction: column;
        }

        .editor-input {
          flex: 1;
          padding: 16px;
          outline: none;
          font-size: 16px;
          line-height: 1.6;
          font-family: inherit;
        }

        .editor-placeholder {
          position: absolute;
          top: 16px;
          left: 16px;
          color: #999;
          pointer-events: none;
          font-family: inherit;
        }

        .editor-paragraph {
          margin: 0 0 8px 0;
        }

        .editor-quote {
          border-left: 4px solid #ccc;
          padding-left: 16px;
          margin: 8px 0;
          font-style: italic;
        }

        .editor-list-ul,
        .editor-list-ol {
          margin: 8px 0;
          padding-left: 24px;
        }

        .editor-listitem {
          margin: 4px 0;
        }

        .editor-nested-listitem {
          list-style-position: inside;
        }

        .editor-text-bold {
          font-weight: bold;
        }

        .editor-text-italic {
          font-style: italic;
        }

        .editor-text-underline {
          text-decoration: underline;
        }

        .editor-text-strikethrough {
          text-decoration: line-through;
        }

        .editor-text-code {
          background: #f0f0f0;
          padding: 2px 4px;
          border-radius: 3px;
          font-family: monospace;
        }

        .editor-code {
          background: #f8f8f8;
          padding: 16px;
          border-radius: 4px;
          font-family: monospace;
          margin: 8px 0;
          overflow-x: auto;
        }

        .editor-link {
          color: #007AFF;
          text-decoration: underline;
        }

        .editor-link:hover {
          text-decoration: none;
        }
      `}</style>
    </div>
  );
}
