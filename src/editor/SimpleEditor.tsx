import React, { useEffect, useState, useRef } from 'react';
import {
  View,
  TextInput,
  StyleSheet,
  ScrollView,
  TouchableWithoutFeedback,
} from 'react-native';
import { useTheme } from '../hooks/useTheme';

interface SimpleEditorProps {
  content?: string;
  onUpdate?: (content: string) => Promise<void>;
}

export default function SimpleEditor({ 
  content = '', 
  onUpdate,
}: SimpleEditorProps) {
  const [text, setText] = useState('');
  const [isReady, setIsReady] = useState(false);
  const textInputRef = useRef<TextInput>(null);
  const initializedRef = useRef(false);
  const { colors, typography, fontSize } = useTheme();

  const handleOutsidePress = () => {
    textInputRef.current?.blur();
  };

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

  // Initialize content only once when component mounts
  useEffect(() => {
    if (!initializedRef.current) {
      const initialText = convertToText(content);
      setText(initialText);
      setIsReady(true);
      initializedRef.current = true;
      
      // Focus the input after initialization
      setTimeout(() => {
        textInputRef.current?.focus();
      }, 100);
    }
  }, [content]);



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





  return (
    <TouchableWithoutFeedback onPress={handleOutsidePress}>
      <View style={[styles.container, { backgroundColor: colors.background }]}>
        <ScrollView style={styles.editorContainer}>
          <TouchableWithoutFeedback onPress={() => textInputRef.current?.focus()}>
            <View>
              <TextInput
                ref={textInputRef}
                style={[
                  styles.textInput,
                  {
                    fontFamily: typography.fonts.regular,
                    fontSize: fontSize,
                    color: colors.text.primary,
                  }
                ]}
                value={text}
                onChangeText={handleTextChange}
                placeholder="Start writing..."
                placeholderTextColor={colors.text.secondary}
                multiline
                textAlignVertical="top"
              />
            </View>
          </TouchableWithoutFeedback>
        </ScrollView>
      </View>
    </TouchableWithoutFeedback>
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

});
