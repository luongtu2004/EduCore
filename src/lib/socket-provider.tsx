'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import { io, Socket } from 'socket.io-client';

interface Notification {
  id: string;
  leadId?: string;
  title: string;
  message: string;
  type: 'info' | 'success' | 'warning';
  createdAt: Date;
  read: boolean;
  paymentMethod?: string;
}

interface SocketContextType {
  socket: Socket | null;
  notifications: Notification[];
  unreadCount: number;
  markAsRead: (id: string) => void;
  clearAll: () => void;
}

const SocketContext = createContext<SocketContextType | undefined>(undefined);

export const SocketProvider = ({ children }: { children: React.ReactNode }) => {
  const [socket, setSocket] = useState<Socket | null>(null);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem('educore_notifications');
    if (saved) {
      try {
        setNotifications(JSON.parse(saved));
      } catch (e) {}
    }
    setIsLoaded(true);
  }, []);

  useEffect(() => {
    if (isLoaded) {
      localStorage.setItem('educore_notifications', JSON.stringify(notifications));
    }
  }, [notifications, isLoaded]);

  useEffect(() => {
    // Kết nối tới Backend Socket (Mặc định port 5000)
    const newSocket = io(process.env.NEXT_PUBLIC_SOCKET_URL || 'http://localhost:5000');
    setSocket(newSocket);

    // Lắng nghe sự kiện Lead mới
    newSocket.on('newLead', (data) => {
      const newNotification: Notification = {
        id: Math.random().toString(36).substr(2, 9),
        leadId: data.id,
        title: 'Lead mới đăng ký',
        message: `${data.fullName} vừa đăng ký tư vấn ${data.courseName || 'khóa học'}.`,
        type: 'success',
        createdAt: new Date(),
        read: false,
        paymentMethod: data.paymentMethod,
      };
      setNotifications((prev) => [newNotification, ...prev]);
      
      // Có thể tích hợp âm thanh thông báo ở đây
      const audio = new Audio('/notification.mp3');
      audio.play().catch(() => {});
    });

    return () => {
      newSocket.close();
    };
  }, []);

  const unreadCount = notifications.filter((n) => !n.read).length;

  const markAsRead = (id: string) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: true } : n))
    );
  };

  const clearAll = () => {
    setNotifications([]);
  };

  return (
    <SocketContext.Provider value={{ socket, notifications, unreadCount, markAsRead, clearAll }}>
      {children}
    </SocketContext.Provider>
  );
};

export const useSocket = () => {
  const context = useContext(SocketContext);
  if (context === undefined) {
    throw new Error('useSocket must be used within a SocketProvider');
  }
  return context;
};
