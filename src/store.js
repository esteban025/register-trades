import { atom } from "nanostores";
import { actions } from "astro:actions";

export const isModalInstrumentOpen = atom(false);
export const isModalTradeOpen = atom(false);
export const isModalAccountOpen = atom(false);
export const tradeToEdit = atom(null);
export const selectedInstrumentId = atom(null);

// Instruments store
export const instrumentsStore = atom([]);
export const instrumentsLoading = atom(false);

// Accounts store
export const accountsStore = atom([]);
export const accountsLoading = atom(false);

// Trades store
export const tradesStore = atom([]);
export const tradesLoading = atom(false);
export const currentAccountId = atom(null);

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

// Función para refrescar trades
export async function refreshTrades() {
  tradesLoading.set(true);
  try {
    const { data, error } = await actions.getTrades();
    if (data?.success && data.data) {
      tradesStore.set(data.data);
    } else {
      console.error("Error fetching trades:", error?.message || data?.message);
      tradesStore.set([]);
    }
  } catch (err) {
    console.error("Error refreshing trades:", err);
    tradesStore.set([]);
  } finally {
    tradesLoading.set(false);
  }
}

// Función para refrescar trades por cuenta específica
export async function refreshTradesByAccount(accountId) {
  if (!accountId) return;
  currentAccountId.set(accountId);
  tradesLoading.set(true);
  try {
    const { data, error } = await actions.getTradesByAccount({ account_id: Number(accountId) });
    if (data?.success && data.data) {
      tradesStore.set(data.data);
    } else {
      console.error("Error fetching trades:", error?.message || data?.message);
      tradesStore.set([]);
    }
  } catch (err) {
    console.error("Error refreshing trades by account:", err);
    tradesStore.set([]);
  } finally {
    tradesLoading.set(false);
  }
}