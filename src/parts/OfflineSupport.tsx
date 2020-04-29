import React, { useEffect } from "react";

const checkNotification = () => {
  try {
    Notification.requestPermission().then();
  } catch (err) {
    return false;
  }

  return true;
};

export const OfflineSupport: React.FC = () => {
  useEffect(() => {
    if ("serviceWorker" in navigator) {
      if (!("Notification" in window)) {
        console.log("This browser does not support notifications.");
        return;
      }

      if (checkNotification()) {
        Notification.requestPermission();
      }
    }
  }, []);

  return null;
};
