import { useEffect, useRef, useState, useCallback } from 'react';
import { io, Socket } from 'socket.io-client';
import { Message } from '../types';
import { generateRandomNickname } from '../utils';

interface UseChatSocketOptions {
  isOpen: boolean;
  onNewMessage?: () => void;
  onMessagesLoaded?: () => void;
}

export function useChatSocket({ isOpen, onNewMessage, onMessagesLoaded }: UseChatSocketOptions) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [userCount, setUserCount] = useState(0);
  const socketRef = useRef<Socket | null>(null);
  const usernameRef = useRef<string>('');
  const isOpenRef = useRef(isOpen);
  const onNewMessageRef = useRef(onNewMessage);
  const onMessagesLoadedRef = useRef(onMessagesLoaded);

  // 최신 값으로 ref 업데이트
  useEffect(() => {
    isOpenRef.current = isOpen;
  }, [isOpen]);

  useEffect(() => {
    onNewMessageRef.current = onNewMessage;
  }, [onNewMessage]);

  useEffect(() => {
    onMessagesLoadedRef.current = onMessagesLoaded;
  }, [onMessagesLoaded]);

  // 소켓 연결은 컴포넌트 마운트 시 한 번만 생성
  useEffect(() => {
    let username = localStorage.getItem('chat-username');
    if (!username) {
      username = generateRandomNickname();
      localStorage.setItem('chat-username', username);
    }
    usernameRef.current = username;

    socketRef.current = io();

    const socket = socketRef.current;

    socket.on('connect', () => {
      console.log('채팅 서버에 연결되었습니다.');
    });

    socket.on('disconnect', () => {
      console.log('채팅 서버 연결이 끊어졌습니다.');
    });

    socket.on('previousMessages', (prevMessages: Message[]) => {
      setMessages(prevMessages);
      if (onMessagesLoadedRef.current) {
        setTimeout(() => onMessagesLoadedRef.current?.(), 100);
      }
    });

    socket.on('chatMessage', (message: Message) => {
      setMessages((prev) => [...prev, message]);
      if (!isOpenRef.current && onNewMessageRef.current) {
        onNewMessageRef.current();
      }
      if (onMessagesLoadedRef.current) {
        setTimeout(() => onMessagesLoadedRef.current?.(), 100);
      }
    });

    socket.on('userCount', (count: number) => {
      setUserCount(count);
    });

    return () => {
      socket.disconnect();
    };
  }, []); // 빈 의존성 배열 - 마운트 시 한 번만 실행

  const sendMessage = useCallback((message: string) => {
    const trimmedMessage = message.trim();
    if (trimmedMessage && socketRef.current?.connected) {
      socketRef.current.emit('chatMessage', {
        username: usernameRef.current,
        message: trimmedMessage,
      });
    }
  }, []);

  const getUsername = useCallback(() => usernameRef.current, []);

  return {
    messages,
    userCount,
    sendMessage,
    getUsername,
  };
}
