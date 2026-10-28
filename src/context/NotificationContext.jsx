import React, { createContext, useContext, useState } from 'react';

const INITIAL_NOTIFICATIONS = [
  {
    id: 'notif-1',
    type: 'workout',
    title: 'Workout Reminder: Leg Day in 30 Mins',
    message: 'Your Thursday Squat Mastery & Posterior Chain session is scheduled for today.',
    time: '25m ago',
    unread: true,
    link: '/workout/live'
  },
  {
    id: 'notif-2',
    type: 'milestone',
    title: '🏆 New Milestone Unlocked!',
    message: 'You hit 96% form accuracy on barbell squats yesterday! Keep it up.',
    time: '3h ago',
    unread: true,
    link: '/analytics'
  },
  {
    id: 'notif-3',
    type: 'alert',
    title: 'Missed Cardio Makeup Ready',
    message: 'You missed Wednesday active recovery. Add a quick 20-min brisk walk today.',
    time: '1d ago',
    unread: false,
    link: '/workout-plan'
  },
  {
    id: 'notif-4',
    type: 'nutrition',
    title: 'Macro Check: 50g Protein Remaining',
    message: 'Reach your 185g daily target with tonight’s Wild Salmon & Casein pudding.',
    time: '2d ago',
    unread: false,
    link: '/nutrition'
  }
];

const NotificationContext = createContext(null);

export function NotificationProvider({ children }) {
  const [notifications, setNotifications] = useState(INITIAL_NOTIFICATIONS);

  const unreadCount = notifications.filter((n) => n.unread).length;

  const markAsRead = (id) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, unread: false } : n))
    );
  };

  const markAllAsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, unread: false })));
  };

  const addNotification = (notif) => {
    const newEntry = {
      ...notif,
      id: 'notif-' + Date.now(),
      time: 'Just now',
      unread: true
    };
    setNotifications((prev) => [newEntry, ...prev]);
  };

  return (
    <NotificationContext.Provider
      value={{
        notifications,
        unreadCount,
        markAsRead,
        markAllAsRead,
        addNotification
      }}
    >
      {children}
    </NotificationContext.Provider>
  );
}

export function useNotifications() {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error('useNotifications must be used within a NotificationProvider');
  }
  return context;
}
