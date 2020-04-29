const checkCanNotify = () => {
  if (!("permission" in Notification)) {
    return false;
  } else {
    return Notification.permission === "granted";
  }
};

export const tryNotify = ({
  title,
  description
}: {
  title: string;
  description: string;
}) => {
  if (!checkCanNotify()) {
    return;
  }

  const notification = new Notification(title, { body: description });
  document.addEventListener("visibilitychange", () => {
    if (document.visibilityState === "visible") {
      notification.close();
    }
  });
};
