import { atom } from "nanostores";
import { actions } from "astro:actions";

export const isModalInstrumentOpen = atom(false);

// Notification store con mensaje, tipo y estado
export const notificationStore = atom({
  isVisible: false,
  message: "",
  type: "info", // "success" | "error" | "info"
});

// Instruments store
export const instrumentsStore = atom([]);
export const instrumentsLoading = atom(false);

// Helper para mostrar notificación
export function showNotification(message, type = "info", duration = 4000) {
  notificationStore.set({ isVisible: true, message, type });

  setTimeout(() => {
    notificationStore.set({ isVisible: false, message: "", type: "info" });
  }, duration);
}

// Función para refrescar instrumentos
export async function refreshInstruments() {
  instrumentsLoading.set(true);
  try {
    const { data, error } = await actions.getInstruments();
    if (data?.success && data.instruments) {
      instrumentsStore.set(data.instruments);
    } else {
      console.error("Error fetching instruments:", error?.message || data?.message);
      instrumentsStore.set([]);
    }
  } catch (err) {
    console.error("Error refreshing instruments:", err);
    instrumentsStore.set([]);
  } finally {
    instrumentsLoading.set(false);
  }
}