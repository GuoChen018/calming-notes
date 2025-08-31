import React, { useEffect, useState, useRef } from 'react';
import {
  View,
  TextInput,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Text,
  Alert,
  Keyboard,
  Platform,
  Animated,
} from 'react-native';
import { useTheme } from '../hooks/useTheme';
import Icon from '../components/Icon';

interface SimpleEditorProps {
  content?: string;
  onUpdate?: (content: string) => Promise<void>;
  onReady?: () => void;
}

export default function SimpleEditor({ 
  content = '', 
  onUpdate,
  onReady,
}: SimpleEditorProps) {
  const [text, setText] = useState('');
  const [isReady, setIsReady] = useState(false);
  const [selection, setSelection] = useState({ start: 0, end: 0 });
  const [keyboardHeight, setKeyboardHeight] = useState(0);
  const textInputRef = useRef<TextInput>(null);
  const toolbarAnimValue = useRef(new Animated.Value(0)).current;
  const { colors, typography } = useTheme();

  // Convert JSON content to plain text
  const convertToText = (jsonContent: string): string => {
    if (!jsonContent) return '';
    
    try {
      const parsed = JSON.parse(jsonContent);
      
      // Handle Lexical format
      if (parsed.root && parsed.root.children) {
        return extractLexicalText(parsed.root);
      }
      
      // Handle TipTap format
      if (parsed.type && parsed.content) {
        return extractTipTapText(parsed);
      }
      
      // Fallback to string
      return String(jsonContent);
    } catch {
      return String(jsonContent);
    }
  };

  const extractLexicalText = (node: any): string => {
    let text = '';
    
    if (node.type === 'text') {
      return node.text || '';
    }
    
    if (node.children && Array.isArray(node.children)) {
      text = node.children.map((child: any) => extractLexicalText(child)).join('');
    }
    
    // Add spacing for block elements
    if (node.type === 'paragraph' || node.type === 'heading') {
      text = text + '\n\n';
    }
    
    return text;
  };

  const extractTipTapText = (node: any): string => {
    if (node.type === 'text') {
      return node.text || '';
    }
    
    if (node.content && Array.isArray(node.content)) {
      return node.content.map((child: any) => extractTipTapText(child)).join('');
    }
    
    return '';
  };

  // Convert plain text back to simple JSON format
  const convertToJSON = (plainText: string): string => {
    return JSON.stringify({
      type: 'doc',
      content: [
        {
          type: 'paragraph',
          content: [
            {
              type: 'text',
              text: plainText
            }
          ]
        }
      ]
    });
  };

  // Initialize content
  useEffect(() => {
    const initialText = convertToText(content);
    setText(initialText);
    setIsReady(true);
    
    if (onReady) {
      setTimeout(() => onReady(), 100);
    }
  }, [content, onReady]);

  // Keyboard event listeners
  useEffect(() => {
    const keyboardWillShow = (event: any) => {
      const { height } = event.endCoordinates;
      setKeyboardHeight(height);
      
      // Animate toolbar up
      Animated.timing(toolbarAnimValue, {
        toValue: height,
        duration: event.duration || 250,
        useNativeDriver: false,
      }).start();
    };

    const keyboardWillHide = (event: any) => {
      setKeyboardHeight(0);
      
      // Animate toolbar down
      Animated.timing(toolbarAnimValue, {
        toValue: 0,
        duration: event.duration || 250,
        useNativeDriver: false,
      }).start();
    };

    const showEvent = Platform.OS === 'ios' ? 'keyboardWillShow' : 'keyboardDidShow';
    const hideEvent = Platform.OS === 'ios' ? 'keyboardWillHide' : 'keyboardDidHide';

    const showListener = Keyboard.addListener(showEvent, keyboardWillShow);
    const hideListener = Keyboard.addListener(hideEvent, keyboardWillHide);

    return () => {
      showListener.remove();
      hideListener.remove();
    };
  }, [toolbarAnimValue]);

  // Handle text changes with debouncing
  useEffect(() => {
    if (!isReady || !onUpdate) return;

    const timeoutId = setTimeout(async () => {
      if (text !== convertToText(content)) {
        const jsonContent = convertToJSON(text);
        await onUpdate(jsonContent);
      }
    }, 750);

    return () => clearTimeout(timeoutId);
  }, [text, isReady, onUpdate, content]);

  const handleTextChange = (newText: string) => {
    setText(newText);
  };

  const handleSelectionChange = (event: any) => {
    setSelection(event.nativeEvent.selection);
  };

  // Formatting functions
  const insertText = (insertString: string, prefix = '', suffix = '') => {
    const { start, end } = selection;
    const selectedText = text.substring(start, end);
    const beforeText = text.substring(0, start);
    const afterText = text.substring(end);
    
    let newText;
    let newCursorPos;

    if (selectedText) {
      // Wrap selected text
      newText = beforeText + prefix + selectedText + suffix + afterText;
      newCursorPos = start + prefix.length + selectedText.length + suffix.length;
    } else {
      // Insert at cursor position
      newText = beforeText + insertString + afterText;
      newCursorPos = start + insertString.length;
    }

    setText(newText);
    
    // Set cursor position after state update
    setTimeout(() => {
      textInputRef.current?.setNativeProps({
        selection: { start: newCursorPos, end: newCursorPos }
      });
    }, 0);
  };

  const formatBold = () => {
    insertText('**text**', '**', '**');
  };

  const formatItalic = () => {
    insertText('*text*', '*', '*');
  };

  const formatCode = () => {
    insertText('`code`', '`', '`');
  };

  const insertBulletList = () => {
    const { start } = selection;
    const beforeText = text.substring(0, start);
    const afterText = text.substring(start);
    
    // Check if we're at the beginning of a line
    const lastNewlineIndex = beforeText.lastIndexOf('\n');
    const isAtLineStart = lastNewlineIndex === beforeText.length - 1 || beforeText.length === 0;
    
    const bulletText = isAtLineStart ? '• ' : '\n• ';
    const newText = beforeText + bulletText + afterText;
    const newCursorPos = start + bulletText.length;
    
    setText(newText);
    
    setTimeout(() => {
      textInputRef.current?.setNativeProps({
        selection: { start: newCursorPos, end: newCursorPos }
      });
    }, 0);
  };

  const insertNumberedList = () => {
    const { start } = selection;
    const beforeText = text.substring(0, start);
    const afterText = text.substring(start);
    
    const lastNewlineIndex = beforeText.lastIndexOf('\n');
    const isAtLineStart = lastNewlineIndex === beforeText.length - 1 || beforeText.length === 0;
    
    const numberedText = isAtLineStart ? '1. ' : '\n1. ';
    const newText = beforeText + numberedText + afterText;
    const newCursorPos = start + numberedText.length;
    
    setText(newText);
    
    setTimeout(() => {
      textInputRef.current?.setNativeProps({
        selection: { start: newCursorPos, end: newCursorPos }
      });
    }, 0);
  };

  const insertLink = () => {
    Alert.prompt(
      'Insert Link',
      'Enter the URL:',
      (url) => {
        if (url) {
          insertText(`[link](${url})`, '[', `](${url})`);
        }
      },
      'plain-text',
      '',
      'url'
    );
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <ScrollView style={styles.editorContainer}>
        <TextInput
          ref={textInputRef}
          style={[
            styles.textInput,
            {
              fontFamily: typography.fonts.regular,
              fontSize: typography.sizes.lg,
              color: colors.text.primary,
            }
          ]}
          value={text}
          onChangeText={handleTextChange}
          onSelectionChange={handleSelectionChange}
          placeholder="Start writing..."
          placeholderTextColor={colors.text.secondary}
          multiline
          textAlignVertical="top"
          autoFocus
        />
      </ScrollView>
      
      {/* Enhanced toolbar */}
      <Animated.View 
        style={[
          styles.toolbar, 
          { 
            backgroundColor: colors.surface, 
            borderTopColor: colors.border.light,
            bottom: toolbarAnimValue,
          }
        ]}
      >
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.toolbarScroll}>
          <View style={styles.toolbarButtons}>
            <TouchableOpacity style={styles.toolbarButton} onPress={formatBold}>
              <Icon name="bold" size={16} color={colors.text.primary} />
            </TouchableOpacity>
            
            <TouchableOpacity style={styles.toolbarButton} onPress={formatItalic}>
              <Icon name="italic" size={16} color={colors.text.primary} />
            </TouchableOpacity>
            
            <TouchableOpacity style={styles.toolbarButton} onPress={formatCode}>
              <Icon name="code" size={16} color={colors.text.primary} />
            </TouchableOpacity>
            
            <TouchableOpacity style={styles.toolbarButton} onPress={insertBulletList}>
              <Icon name="list" size={16} color={colors.text.primary} />
            </TouchableOpacity>
            
            <TouchableOpacity style={styles.toolbarButton} onPress={insertNumberedList}>
              <Icon name="numbered-list" size={16} color={colors.text.primary} />
            </TouchableOpacity>
            
            <TouchableOpacity style={styles.toolbarButton} onPress={insertLink}>
              <Icon name="link" size={16} color={colors.text.primary} />
            </TouchableOpacity>
          </View>
        </ScrollView>
        
        <Text style={[styles.toolbarText, { color: colors.text.secondary, fontFamily: typography.fonts.regular }]}>
          {text.length} chars
        </Text>
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  editorContainer: {
    flex: 1,
  },
  textInput: {
    flex: 1,
    padding: 16,
    lineHeight: 28,
    minHeight: '100%',
  },
  toolbar: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 12,
    paddingBottom: 32,
    borderTopWidth: 1,
    justifyContent: 'space-between',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: -2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 5,
  },
  toolbarScroll: {
    flex: 1,
  },
  toolbarButtons: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  toolbarButton: {
    padding: 8,
    borderRadius: 6,
    backgroundColor: 'rgba(0,0,0,0.05)',
    alignItems: 'center',
    justifyContent: 'center',
    minWidth: 32,
    minHeight: 32,
  },
  toolbarText: {
    fontSize: 11,
    marginLeft: 8,
  },
});
