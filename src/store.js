import { atom } from "nanostores";
import { actions } from "astro:actions";

export const isModalInstrumentOpen = atom(false);
export const isModalTradeOpen = atom(false);
export const isModalAccountOpen = atom(false);

// Notification store con mensaje, tipo y estado
export const notificationStore = atom({
  isVisible: false,
  message: "",
  type: "info", // "success" | "error" | "info"
});

// Instruments store
export const instrumentsStore = atom([]);
export const instrumentsLoading = atom(false);

// Accounts store
export const accountsStore = atom([]);
export const accountsLoading = atom(false);

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
    if (data?.success && data.data) {
      instrumentsStore.set(data.data);
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

// Función para refrescar accounts
export async function refreshAccounts() {
  accountsLoading.set(true);
  try {
    const { data, error } = await actions.getAccounts();
    if (data?.success && data.data) {
      accountsStore.set(data.data);
    } else {
      console.error("Error fetching accounts:", error?.message || data?.message);
      accountsStore.set([]);
    }
  } catch (err) {
    console.error("Error refreshing accounts:", err);
    accountsStore.set([]);
  } finally {
    accountsLoading.set(false);
  }
}