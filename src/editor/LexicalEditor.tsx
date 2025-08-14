'use dom';

import { $getRoot, $getSelection, $createParagraphNode, $createTextNode } from 'lexical';
import { $isRangeSelection } from 'lexical';
import { LexicalComposer } from '@lexical/react/LexicalComposer';
import { RichTextPlugin } from '@lexical/react/LexicalRichTextPlugin';
import { ContentEditable } from '@lexical/react/LexicalContentEditable';
import { HistoryPlugin } from '@lexical/react/LexicalHistoryPlugin';
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
import { Asset } from 'expo-asset';

interface LexicalEditorProps {
  content?: string;
  onUpdate?: (content: string) => Promise<void>;
  onReady?: () => void;
  keyboardDismissed?: boolean;
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
    // Notify parent that editor is ready - only once when component mounts
    if (onReady) {
      const timer = setTimeout(() => {
        onReady();
      }, 100);
      return () => clearTimeout(timer);
    }
  }, []); // Remove onReady from dependencies to prevent repeated calls

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

      {/* Color and Highlight - Temporarily disabled for debugging */}
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

  const convertTipTapToText = (tipTapContent: any): string => {
    if (!tipTapContent || !tipTapContent.content) return '';
    
    const extractText = (node: any): string => {
      if (node.type === 'text') {
        return node.text || '';
      }
      
      if (node.content && Array.isArray(node.content)) {
        return node.content.map(extractText).join('');
      }
      
      return '';
    };

    return tipTapContent.content.map(extractText).join('\n\n');
  };

  useEffect(() => {
    if (content) {
      try {
        const parsedContent = JSON.parse(content);
        
        // Check if this is TipTap format (has 'type' and 'content' structure)
        if (parsedContent.type && parsedContent.content) {
          // Convert TipTap content to plain text for now to avoid data loss
          const plainText = convertTipTapToText(parsedContent);
          editor.update(() => {
            const root = $getRoot();
            root.clear();
            
            // Split by paragraphs and create proper nodes
            const paragraphs = plainText.split('\n\n').filter(p => p.trim());
            paragraphs.forEach((paragraph) => {
              if (paragraph.trim()) {
                const paragraphNode = $createParagraphNode();
                paragraphNode.append($createTextNode(paragraph.trim()));
                root.append(paragraphNode);
              }
            });
            
            if (paragraphs.length === 0) {
              // Empty content, add a single empty paragraph
              const paragraphNode = $createParagraphNode();
              root.append(paragraphNode);
            }
          });
        } else {
          // Try to parse as Lexical format
          const editorState = editor.parseEditorState(parsedContent);
          editor.setEditorState(editorState);
        }
      } catch (error) {
        // If all parsing fails, set as plain text
        editor.update(() => {
          const root = $getRoot();
          root.clear();
          const paragraphNode = $createParagraphNode();
          paragraphNode.append($createTextNode(content || ''));
          root.append(paragraphNode);
        });
      }
    }
  }, [editor, content]);

  return null;
}

export default function LexicalEditor({ 
  content = '', 
  onUpdate,
  onReady,
  keyboardDismissed = false
}: LexicalEditorProps) {
  const [fontAssets, setFontAssets] = useState<{[key: string]: string}>({});

  useEffect(() => {
    // Load font assets
    const loadFontAssets = async () => {
      try {
        const assets = await Asset.loadAsync([
          require('../../assets/web-fonts/CommitMono-400-Regular.otf'),
          require('../../assets/web-fonts/CommitMono-400-Italic.otf'),
          require('../../assets/web-fonts/CommitMono-700-Regular.otf'),
          require('../../assets/web-fonts/CommitMono-700-Italic.otf'),
        ]);
        
        const fontURIs = {
          regular: assets[0].localUri || assets[0].uri,
          italic: assets[1].localUri || assets[1].uri,
          bold: assets[2].localUri || assets[2].uri,
          boldItalic: assets[3].localUri || assets[3].uri,
        };
        
        console.log('Font assets loaded:', fontURIs);
        setFontAssets(fontURIs);
      } catch (error) {
        console.error('Failed to load font assets:', error);
      }
    };

    loadFontAssets();
  }, []);

  // Handle keyboard dismissal from React Native
  useEffect(() => {
    if (keyboardDismissed) {
      console.log('DOM component received keyboard dismissal signal');
      // Add to DOM immediately when component receives the signal
      const script = document.createElement('script');
      script.textContent = `
        console.log('Script injected: Blurring editor');
        const editorInput = document.querySelector('.editor-input');
        if (editorInput && document.activeElement === editorInput) {
          console.log('Found focused editor, blurring...');
          editorInput.blur();
          console.log('Editor blur completed');
        } else {
          console.log('Editor not focused or not found');
        }
      `;
      document.head.appendChild(script);
      
      // Clean up script
      setTimeout(() => {
        if (script.parentNode) {
          script.parentNode.removeChild(script);
        }
      }, 100);
    }
  }, [keyboardDismissed]);
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
        <div className="editor-container">
          <RichTextPlugin
            contentEditable={<ContentEditable className="editor-input" />}
            placeholder={<div className="editor-placeholder"></div>}
            ErrorBoundary={() => <div>Something went wrong!</div>}
          />
          <HistoryPlugin />
          <LinkPlugin />
          <ListPlugin />
          <MarkdownShortcutPlugin transformers={TRANSFORMERS} />
          <UpdatePlugin onUpdate={onUpdate} />
          <InitialContentPlugin content={content} />
        </div>
        <ToolbarPlugin onReady={onReady} />
      </LexicalComposer>

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=JetBrains+Mono:ital,wght@0,400;0,700;1,400;1,700&display=swap');
        
        ${fontAssets.regular ? `
        @font-face {
          font-family: 'CommitMono';
          src: url('${fontAssets.regular}') format('opentype');
          font-weight: 400;
          font-style: normal;
          font-display: swap;
        }
        ` : ''}
        
        ${fontAssets.italic ? `
        @font-face {
          font-family: 'CommitMono';
          src: url('${fontAssets.italic}') format('opentype');
          font-weight: 400;
          font-style: italic;
          font-display: swap;
        }
        ` : ''}
        
        ${fontAssets.bold ? `
        @font-face {
          font-family: 'CommitMono';
          src: url('${fontAssets.bold}') format('opentype');
          font-weight: 700;
          font-style: normal;
          font-display: swap;
        }
        ` : ''}
        
        ${fontAssets.boldItalic ? `
        @font-face {
          font-family: 'CommitMono';
          src: url('${fontAssets.boldItalic}') format('opentype');
          font-weight: 700;
          font-style: italic;
          font-display: swap;
        }
        ` : ''}
        
        html, body {
          height: 100%;
          margin: 0;
          padding: 0;
        }
        
        .lexical-editor-container {
          display: flex;
          flex-direction: column;
          height: 100vh;
          font-family: ${fontAssets.regular ? "'CommitMono'," : ""} 'JetBrains Mono', 'SF Mono', 'Monaco', 'Inconsolata', 'Roboto Mono', 'Source Code Pro', 'Menlo', 'Consolas', monospace;
        }

        .toolbar {
          display: flex;
          flex-wrap: wrap;
          gap: 4px;
          padding: 8px;
          border-top: 1px solid #E5E5E5;
          background: white;
          position: fixed;
          bottom: 20px;
          left: 0;
          right: 0;
          z-index: 10;
          transition: bottom 0.3s ease-in-out;
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
          min-height: calc(100vh - 80px); /* Account for toolbar */
          cursor: text;
          position: relative;
          width: 100%;
          height: 100%;
        }
        


        .editor-input {
          flex: 1;
          padding: 16px;
          outline: none;
          font-size: 16px;
          line-height: 1.6;
          font-family: ${fontAssets.regular ? "'CommitMono'," : ""} 'JetBrains Mono', 'SF Mono', 'Monaco', 'Inconsolata', 'Roboto Mono', 'Source Code Pro', 'Menlo', 'Consolas', monospace !important;
          min-height: 100%;
          width: 100%;
          font-feature-settings: normal;
          font-variant-ligatures: normal;
          -webkit-user-select: text;
          user-select: text;
          -webkit-touch-callout: none;
          -webkit-tap-highlight-color: transparent;
          overflow-y: auto;
          position: relative;
          z-index: 2;
        }
        


        .editor-placeholder {
          position: absolute;
          top: 16px;
          left: 16px;
          color: #999;
          pointer-events: none;
          font-family: 'CommitMono', 'SF Mono', 'Monaco', 'Inconsolata', 'Roboto Mono', 'Source Code Pro', 'Menlo', 'Consolas', monospace;
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
          font-weight: 700;
          font-family: 'CommitMono', 'SF Mono', 'Monaco', 'Inconsolata', 'Roboto Mono', 'Source Code Pro', 'Menlo', 'Consolas', monospace;
        }

        .editor-text-italic {
          font-style: italic;
          font-family: 'CommitMono', 'SF Mono', 'Monaco', 'Inconsolata', 'Roboto Mono', 'Source Code Pro', 'Menlo', 'Consolas', monospace;
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
          font-family: 'CommitMono', 'SF Mono', 'Monaco', 'Inconsolata', 'Roboto Mono', 'Source Code Pro', 'Menlo', 'Consolas', monospace;
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
      
      <script>{`
        // Handle click-to-focus for entire editor area
        document.addEventListener('DOMContentLoaded', () => {
          const handleGlobalClick = (e) => {
            const target = e.target;
            const editorContainer = document.querySelector('.lexical-editor-container');
            const toolbar = document.querySelector('.toolbar');
            const editorInput = document.querySelector('.editor-input');
            
            // Check if click is within editor area but not on toolbar or buttons
            if (editorContainer && editorContainer.contains(target) && 
                !toolbar.contains(target) && 
                !target.closest('button')) {
              
              console.log('Editor area clicked, focusing...', target.className, target.tagName);
              
              if (editorInput) {
                // Always focus the editor
                editorInput.focus();
                
                // Check if we clicked in empty space (not directly on text)
                const rect = editorInput.getBoundingClientRect();
                const clickX = e.clientX - rect.left;
                const clickY = e.clientY - rect.top;
                
                // Create a temporary element to test if we're in empty space
                const tempElement = document.elementFromPoint(e.clientX, e.clientY);
                const isEmptySpace = tempElement === editorInput || 
                                   tempElement === editorContainer ||
                                   tempElement.classList.contains('editor-container') ||
                                   tempElement.classList.contains('editor-input');
                
                if (isEmptySpace) {
                  console.log('Clicked in empty space, moving cursor to end');
                  // Move cursor to end of content
                  setTimeout(() => {
                    const selection = window.getSelection();
                    const range = document.createRange();
                    
                    // Find the last text node
                    const walker = document.createTreeWalker(
                      editorInput,
                      NodeFilter.SHOW_TEXT,
                      null,
                      false
                    );
                    
                    let lastTextNode = null;
                    let node;
                    while (node = walker.nextNode()) {
                      lastTextNode = node;
                    }
                    
                    if (lastTextNode) {
                      range.setStart(lastTextNode, lastTextNode.textContent.length);
                      range.setEnd(lastTextNode, lastTextNode.textContent.length);
                    } else {
                      range.setStart(editorInput, 0);
                      range.setEnd(editorInput, 0);
                    }
                    
                    selection.removeAllRanges();
                    selection.addRange(range);
                  }, 50);
                }
              }
            }
          };
          
          document.addEventListener('click', handleGlobalClick, true);
        });
        
        // Handle keyboard visibility and toolbar positioning
        let keyboardHeight = 0;
        const baseToolbarBottom = 20; // Base position from bottom
        
        function updateToolbarPosition() {
          const toolbar = document.querySelector('.toolbar');
          if (toolbar) {
            const newBottom = baseToolbarBottom + keyboardHeight;
            toolbar.style.bottom = newBottom + 'px';
            console.log('Toolbar moved to:', newBottom + 'px', 'keyboard height:', keyboardHeight);
          }
        }
        
        // Listen for viewport changes (keyboard appearance)
        function handleViewportChange() {
          const visualViewport = window.visualViewport;
          if (visualViewport) {
            const currentKeyboardHeight = window.innerHeight - visualViewport.height;
            if (Math.abs(currentKeyboardHeight - keyboardHeight) > 10) { // Only update if significant change
              keyboardHeight = Math.max(0, currentKeyboardHeight);
              updateToolbarPosition();
            }
          }
        }
        
        // Set up keyboard detection
        if (window.visualViewport) {
          window.visualViewport.addEventListener('resize', handleViewportChange);
          window.visualViewport.addEventListener('scroll', handleViewportChange);
        }
        
        // Fallback for older browsers
        let initialHeight = window.innerHeight;
        window.addEventListener('resize', () => {
          const currentHeight = window.innerHeight;
          const newKeyboardHeight = Math.max(0, initialHeight - currentHeight);
          if (Math.abs(newKeyboardHeight - keyboardHeight) > 10) {
            keyboardHeight = newKeyboardHeight;
            updateToolbarPosition();
          }
        });
        
        // Listen for input focus to trigger keyboard detection
        document.addEventListener('focusin', (e) => {
          if (e.target && e.target.closest('.editor-input')) {
            setTimeout(handleViewportChange, 300);
          }
        });
        
        document.addEventListener('focusout', (e) => {
          if (e.target && e.target.closest('.editor-input')) {
            setTimeout(() => {
              keyboardHeight = 0;
              updateToolbarPosition();
            }, 300);
          }
        });
        
        // Enhanced keyboard dismissal detection for Android
        let lastViewportHeight = window.innerHeight;
        let lastVisualViewportHeight = window.visualViewport ? window.visualViewport.height : window.innerHeight;
        let keyboardWasVisible = false;
        let isKeyboardVisible = false;
        
        function detectKeyboardState() {
          const windowHeight = window.innerHeight;
          const visualHeight = window.visualViewport ? window.visualViewport.height : windowHeight;
          const heightDiff = windowHeight - visualHeight;
          
          console.log('Height check - Window:', windowHeight, 'Visual:', visualHeight, 'Diff:', heightDiff, 'Was visible:', keyboardWasVisible);
          
          // Keyboard is visible if there's a significant height difference
          const keyboardCurrentlyVisible = heightDiff > 100;
          
          if (keyboardCurrentlyVisible && !isKeyboardVisible) {
            // Keyboard just appeared
            console.log('Keyboard appeared');
            isKeyboardVisible = true;
            keyboardWasVisible = true;
          } else if (!keyboardCurrentlyVisible && isKeyboardVisible) {
            // Keyboard just disappeared
            console.log('Keyboard disappeared - blurring editor');
            const editorInput = document.querySelector('.editor-input');
            if (editorInput && document.activeElement === editorInput) {
              editorInput.blur();
            }
            isKeyboardVisible = false;
            keyboardHeight = 0;
            updateToolbarPosition();
          }
          
          // Update keyboard height for toolbar positioning
          if (keyboardCurrentlyVisible) {
            keyboardHeight = heightDiff;
            updateToolbarPosition();
          }
        }
        
        // Set up multiple detection methods
        if (window.visualViewport) {
          window.visualViewport.addEventListener('resize', detectKeyboardState);
          window.visualViewport.addEventListener('scroll', detectKeyboardState);
        }
        window.addEventListener('resize', detectKeyboardState);
        
        // Also try using orientation change as a trigger
        window.addEventListener('orientationchange', () => {
          setTimeout(detectKeyboardState, 500);
        });
        
        // Page visibility change detection (Android back gesture sometimes triggers this)
        document.addEventListener('visibilitychange', () => {
          if (!document.hidden) {
            setTimeout(detectKeyboardState, 100);
          }
        });
        
        // Listen for messages from React Native (keyboard dismissal)
        window.addEventListener('message', (event) => {
          try {
            const data = JSON.parse(event.data);
            if (data.type === 'BLUR_EDITOR') {
              console.log('Received BLUR_EDITOR message from React Native');
              const editorInput = document.querySelector('.editor-input');
              if (editorInput && document.activeElement === editorInput) {
                editorInput.blur();
                keyboardHeight = 0;
                updateToolbarPosition();
              }
            }
          } catch (e) {
            // Ignore non-JSON messages
          }
        });
      `}</script>

    </div>
  );
}
