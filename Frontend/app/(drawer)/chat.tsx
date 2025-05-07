import React, { useState, useRef, useEffect } from 'react';
import {
  SafeAreaView,
  FlatList,
  View,
  StyleSheet,
  ActivityIndicator,
  Text,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import Header from '@/components/ui/Header';
import ChatBubble from '@/components/chat/ChatBubble';
import ChatInputBar from '@/components/chat/ChatInputBar';
import ChatTypeSelector from '@/components/chat/ChatTypeSelector';
import { useTheme } from '@/context/ThemeContext';
import { sendAiMessage } from '@/services/health';
import { useAuth } from '@/context/AuthContext';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
}

type ChatType = 'symptom' | 'food' | 'explore';

export default function ChatScreen() {
  const { actualTheme } = useTheme();
  const isDark = actualTheme === 'dark';
  const { user } = useAuth();

  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [chatType, setChatType] = useState<ChatType>('symptom');
  const [loading, setLoading] = useState(false);

  const flatListRef = useRef<FlatList>(null);

  useEffect(() => {
    let welcomeMessage = '';
    switch (chatType) {
      case 'symptom':
        welcomeMessage =
          "👋 Describe your symptoms, and I'll help you understand what might be going on.";
        break;
      case 'food':
        welcomeMessage =
          "🍎 Ask me about any food, and I'll provide nutritional info.";
        break;
      case 'explore':
        welcomeMessage = '🔍 Explore any medical condition with me!';
        break;
    }

    setMessages([
      {
        id: Date.now().toString(),
        role: 'assistant',
        content: welcomeMessage,
      },
    ]);
  }, [chatType]);
  const sendMessage = async () => {
    if (!input.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: input,
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput('');
    setLoading(true);

    // Scroll after rendering user message
    setTimeout(() => {
      flatListRef.current?.scrollToEnd({ animated: true });
    }, 100);

    // Create a loading placeholder (e.g. "..." bubble)
    const loadingMessageId = (Date.now() + 1).toString();
    setMessages((prev) => [
      ...prev,
      { id: loadingMessageId, role: 'assistant', content: '...' },
    ]);

    try {
      const response = await sendAiMessage(
        user?._id || 'guest-user',
        chatType,
        userMessage.content
      );

      const fullText = response.response;

      // Replace the "..." message with empty text before animating
      setMessages((prev) =>
        prev.map((msg) =>
          msg.id === loadingMessageId ? { ...msg, content: '' } : msg
        )
      );

      let index = 0;
      const typingInterval = setInterval(() => {
        index++;
        setMessages((prev) =>
          prev.map((msg) =>
            msg.id === loadingMessageId
              ? { ...msg, content: fullText.slice(0, index) }
              : msg
          )
        );

        if (index >= fullText.length) {
          clearInterval(typingInterval);
          setLoading(false);
        }
      }, 20);
    } catch (error: any) {
      console.error('Error sending message:', error.message);
      setMessages((prev) =>
        prev.map((msg) =>
          msg.id === loadingMessageId
            ? {
                ...msg,
                content: '❌ Sorry, something went wrong.',
              }
            : msg
        )
      );
      setLoading(false);
    }
  };

  return (
    <SafeAreaView
      style={[
        styles.container,
        { backgroundColor: isDark ? '#111' : '#f5f5f5' },
      ]}
    >
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 90 : 0}
      >
        <FlatList
          ref={flatListRef}
          data={messages}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <ChatBubble role={item.role} content={item.content} />
          )}
          ListHeaderComponent={
            <ChatTypeSelector chatType={chatType} setChatType={setChatType} />
          }
          contentContainerStyle={[
            styles.messageList,
            { paddingBottom: loading ? 60 : 16 },
          ]}
          onContentSizeChange={() =>
            flatListRef.current?.scrollToEnd({ animated: true })
          }
        />

        {loading && (
          <View style={styles.loadingContainer}>
            <ActivityIndicator color="#4C1D95" size="small" />
            <Text
              style={[styles.loadingText, { color: isDark ? '#bbb' : '#666' }]}
            >
              AI is typing...
            </Text>
          </View>
        )}

        <ChatInputBar
          input={input}
          setInput={setInput}
          onSend={sendMessage}
          placeholder={
            chatType === 'symptom'
              ? 'Describe your symptoms...'
              : chatType === 'food'
              ? 'Ask about a food...'
              : 'Ask about any health topic...'
          }
        />
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  messageList: {
    paddingHorizontal: 8,
    flexGrow: 1,
  },
  loadingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    position: 'absolute',
    bottom: 60,
    left: 0,
    right: 0,
  },
  loadingText: {
    marginLeft: 8,
    fontSize: 14,
    fontFamily: 'Inter-Regular',
  },
});
