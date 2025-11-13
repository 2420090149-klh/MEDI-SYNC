import { useState, useEffect, createContext, useContext } from 'react';

const PermissionsContext = createContext(null);

export function usePermissions() {
  return useContext(PermissionsContext);
}

export function PermissionsProvider({ children }) {
  const [permissions, setPermissions] = useState({
    notifications: false,
    location: false,
    microphone: false,
    camera: false
  });

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    checkPermissions();
  }, []);

  const checkPermissions = async () => {
    try {
      // Check notification permissions
      if ('Notification' in window) {
        const notificationPermission = await Notification.requestPermission();
        setPermissions(prev => ({
          ...prev,
          notifications: notificationPermission === 'granted'
        }));
      }

      // Check location permissions
      if ('geolocation' in navigator) {
        try {
          await new Promise((resolve, reject) => {
            navigator.geolocation.getCurrentPosition(resolve, reject);
          });
          setPermissions(prev => ({ ...prev, location: true }));
        } catch {
          setPermissions(prev => ({ ...prev, location: false }));
        }
      }

      // Check microphone permissions
      if (navigator.mediaDevices) {
        try {
          const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
          stream.getTracks().forEach(track => track.stop());
          setPermissions(prev => ({ ...prev, microphone: true }));
        } catch {
          setPermissions(prev => ({ ...prev, microphone: false }));
        }
      }

      // Check camera permissions
      if (navigator.mediaDevices) {
        try {
          const stream = await navigator.mediaDevices.getUserMedia({ video: true });
          stream.getTracks().forEach(track => track.stop());
          setPermissions(prev => ({ ...prev, camera: true }));
        } catch {
          setPermissions(prev => ({ ...prev, camera: false }));
        }
      }
    } finally {
      setLoading(false);
    }
  };

  const requestPermission = async (permission) => {
    switch (permission) {
      case 'notifications':
        if ('Notification' in window) {
          const result = await Notification.requestPermission();
          setPermissions(prev => ({
            ...prev,
            notifications: result === 'granted'
          }));
          return result === 'granted';
        }
        break;

      case 'location':
        if ('geolocation' in navigator) {
          try {
            await new Promise((resolve, reject) => {
              navigator.geolocation.getCurrentPosition(resolve, reject);
            });
            setPermissions(prev => ({ ...prev, location: true }));
            return true;
          } catch {
            setPermissions(prev => ({ ...prev, location: false }));
            return false;
          }
        }
        break;

      case 'microphone':
        if (navigator.mediaDevices) {
          try {
            const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
            stream.getTracks().forEach(track => track.stop());
            setPermissions(prev => ({ ...prev, microphone: true }));
            return true;
          } catch {
            setPermissions(prev => ({ ...prev, microphone: false }));
            return false;
          }
        }
        break;

      case 'camera':
        if (navigator.mediaDevices) {
          try {
            const stream = await navigator.mediaDevices.getUserMedia({ video: true });
            stream.getTracks().forEach(track => track.stop());
            setPermissions(prev => ({ ...prev, camera: true }));
            return true;
          } catch {
            setPermissions(prev => ({ ...prev, camera: false }));
            return false;
          }
        }
        break;
    }
    return false;
  };

  return (
    <PermissionsContext.Provider
      value={{
        permissions,
        loading,
        requestPermission
      }}
    >
      {children}
    </PermissionsContext.Provider>
  );
}