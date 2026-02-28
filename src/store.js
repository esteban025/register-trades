import { atom } from "nanostores";

export const isModalInstrumentOpen = atom(false);

// Notification store con mensaje, tipo y estado
export const notificationStore = atom({
  isVisible: false,
  message: "",
  type: "info", // "success" | "error" | "info"
});

// Helper para mostrar notificación
export function showNotification(message, type = "info", duration = 4000) {
  notificationStore.set({ isVisible: true, message, type });

  setTimeout(() => {
    notificationStore.set({ isVisible: false, message: "", type: "info" });
  }, duration);
}