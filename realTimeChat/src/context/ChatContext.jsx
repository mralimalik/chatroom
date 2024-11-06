import { useState, useEffect, createContext } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export const ChatContext = createContext();

export const ChatContextProvider = ({ children }) => {
  const requestPermission = () => {
    if (
      Notification.permission === "default" ||
      Notification.permission === "denied"
    ) {
      Notification.requestPermission().then((permissin) => {
        if (permissin === "granted") {
          console.log("User granted permission for notification");
        } else {
          console.log("User did not granted permission for notification");
        }
      });
    } else {
      console.log("User accepted already");
    }
  };

  useEffect(() => {
    requestPermission();
  }, []);

  return <ChatContext.Provider>{children} </ChatContext.Provider>;
};
