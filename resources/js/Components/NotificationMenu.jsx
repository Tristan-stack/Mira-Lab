import React, { useState, useEffect, useRef } from 'react';
import { FiBell, FiX } from 'react-icons/fi';
import { FaBell } from 'react-icons/fa';
import { toast } from 'react-toastify';
import axios from 'axios';
import { AnimatePresence, motion } from 'framer-motion';

const NotificationMenu = ({ currentUser, variant = 'mininav' }) => {
  const [isNotificationOpen, setIsNotificationOpen] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const notificationRef = useRef(null);

  useEffect(() => {
    const userId = currentUser.id;

    window.Echo.private(`user.${userId}`)
      .listen('.notification.created', (e) => {
        console.log('Notification reçue :', e.notification);
        setNotifications((prevNotifications) => [e.notification, ...prevNotifications]);
      });

    return () => {
      window.Echo.leave(`user.${userId}`);
    };
  }, [currentUser.id]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (notificationRef.current && !notificationRef.current.contains(event.target)) {
        setIsNotificationOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  useEffect(() => {
    if (isNotificationOpen) {
      axios.get('/notifications')
        .then(response => {
          setNotifications(response.data.notifications);
          console.log('Notifications récupérées avec succès :', response.data.notifications);
        })
        .catch(error => {
          console.error('Erreur lors de la récupération des notifications :', error);
          toast.error('Erreur lors de la récupération des notifications.', {
            position: "top-center",
            autoClose: 3000,
          });
        });
    }
  }, [isNotificationOpen]);

  const handleNotificationIconClick = () => {
    setIsNotificationOpen(!isNotificationOpen);
  };

  const handleCloseNotification = () => {
    setIsNotificationOpen(false);
  };

  const handleMarkAsRead = async (id) => {
    try {
      await axios.post(`/notifications/${id}/mark-as-read`);
      setNotifications((prevNotifications) =>
        prevNotifications.map((notification) =>
          notification.id === id
            ? { ...notification, status: 'read' }
            : notification
        )
      );
      toast.success('Notification marquée comme lue.', {
        position: "top-center",
        autoClose: 2000,
      });
    } catch (error) {
      console.error('Erreur lors du marquage de la notification comme lue :', error);
      toast.error('Erreur lors du marquage de la notification comme lue.', {
        position: "top-center",
        autoClose: 3000,
      });
    }
  };

  const handleDeleteNotification = async (id) => {
    try {
      await axios.delete(`/notifications/${id}`);
      setNotifications(notifications.filter(notification => notification.id !== id));
      toast.success('Notification supprimée.', {
        position: "top-center",
        autoClose: 2000,
      });
    } catch (error) {
      console.error('Erreur lors de la suppression de la notification :', error);
      toast.error('Erreur lors de la suppression de la notification.', {
        position: "top-center",
        autoClose: 3000,
      });
    }
  };

  const unreadCount = notifications.filter(n => n.status === 'unread').length;

  return (
    <div className="relative" ref={notificationRef}>
      {variant === 'sidebar' ? (
        // Affichage pour le Sidebar
        <div
          className="w-full flex items-center p-2 hover:bg-gray-100 duration-300 rounded-md cursor-pointer"
          onClick={handleNotificationIconClick}
        >
          <FiBell className="mr-3 text-gray-600" />
          <span>Notifications</span>
          {unreadCount > 0 && (
            <span className="ml-2 bg-red-500 text-white rounded-full text-xs w-5 h-5 flex items-center justify-center">
              {unreadCount}
            </span>
          )}
        </div>
      ) : (
        // Affichage pour le MiniNav
        <div
          className="p-2 rounded hover:bg-white/30 duration-200 cursor-pointer relative"
          onClick={handleNotificationIconClick}
        >
          <FaBell className="text-white text-lg" />
          {unreadCount > 0 && (
            <span className="absolute top-0 right-0 bg-red-500 text-white rounded-full text-xs w-5 h-5 flex items-center justify-center">
              {unreadCount}
            </span>
          )}
        </div>
      )}

      <AnimatePresence>
        {isNotificationOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className={`absolute ${
              variant === 'sidebar' ? 'top-0 left-full ml-2' : 'top-10 left-0'
            } bg-white shadow-lg rounded p-4 z-50 w-72`}
          >
            <div className="flex justify-between items-center mb-2">
              <h3 className="text-lg font-semibold">Notifications</h3>
              <button onClick={handleCloseNotification} className="text-red-500 hover:text-red-700 duration-150">
                <FiX />
              </button>
            </div>
            <div className="space-y-2 max-h-64 overflow-y-auto custom-scrollbar">
              {notifications.length === 0 ? (
                <div className="text-gray-800 text-center">Aucune notification</div>
              ) : (
                notifications.map((notification) => (
                  <div key={notification.id} className="p-2 bg-gray-100 rounded shadow flex justify-between items-center">
                    <div className="flex items-center space-x-2">
                      {notification.status === 'unread' && (
                        <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
                      )}
                      <span onClick={() => handleMarkAsRead(notification.id)} className="cursor-pointer">
                        {notification.text}
                      </span>
                    </div>
                    <button onClick={() => handleDeleteNotification(notification.id)} className="text-gray-500 hover:text-red-700 text-xs">
                      <FiX />
                    </button>
                  </div>
                ))
              )}
            </div>
            <style>{`
              .custom-scrollbar::-webkit-scrollbar {
                width: 6px;
              }
              .custom-scrollbar::-webkit-scrollbar-track {
                background: #f1f1f1;
              }
              .custom-scrollbar::-webkit-scrollbar-thumb {
                background: #888;
                border-radius: 10px;
              }
              .custom-scrollbar::-webkit-scrollbar-thumb:hover {
                background: #555;
              }
            `}</style>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default NotificationMenu;