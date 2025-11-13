import React from 'react';
import { usePermissions } from '../contexts/PermissionsContext';
import { useLanguage } from '../contexts/LanguageContext';

export default function PermissionDialog({ onClose }) {
  const { permissions, requestPermission } = usePermissions();
  const { t } = useLanguage();

  const handlePermissionRequest = async (permission) => {
    const granted = await requestPermission(permission);
    if (granted && allPermissionsGranted()) {
      onClose();
    }
  };

  const allPermissionsGranted = () => {
    return Object.values(permissions).every(Boolean);
  };

  const permissionsList = [
    {
      name: 'notifications',
      icon: '🔔',
      title: t('permissions.notifications.title'),
      description: t('permissions.notifications.description')
    },
    {
      name: 'location',
      icon: '📍',
      title: t('permissions.location.title'),
      description: t('permissions.location.description')
    },
    {
      name: 'microphone',
      icon: '🎤',
      title: t('permissions.microphone.title'),
      description: t('permissions.microphone.description')
    },
    {
      name: 'camera',
      icon: '📷',
      title: t('permissions.camera.title'),
      description: t('permissions.camera.description')
    }
  ];

  return (
    <div className="permission-dialog-overlay">
      <div 
        className="permission-dialog" 
        role="dialog" 
        aria-labelledby="permissions-title"
      >
        <h2 id="permissions-title" className="dialog-title">
          {t('permissions.dialogTitle')}
        </h2>
        <p className="dialog-description">
          {t('permissions.dialogDescription')}
        </p>

        <div className="permissions-list">
          {permissionsList.map(({ name, icon, title, description }) => (
            <div key={name} className="permission-item">
              <div className="permission-header">
                <span className="permission-icon">{icon}</span>
                <div className="permission-text">
                  <h3>{title}</h3>
                  <p>{description}</p>
                </div>
              </div>
              <button
                className={`permission-button ${permissions[name] ? 'granted' : ''}`}
                onClick={() => handlePermissionRequest(name)}
                disabled={permissions[name]}
              >
                {permissions[name] ? t('permissions.granted') : t('permissions.request')}
              </button>
            </div>
          ))}
        </div>

        <div className="dialog-actions">
          <button 
            className="btn btn-outline"
            onClick={onClose}
          >
            {t('common.later')}
          </button>
          <button
            className="btn btn-primary"
            onClick={onClose}
            disabled={!allPermissionsGranted()}
          >
            {t('common.continue')}
          </button>
        </div>
      </div>
    </div>
  );
}