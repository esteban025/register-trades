import { getAccountById, getAccounts, createAccount } from "./accounts";
import { getInstruments, createInstrument } from "./instruments";
import { getTrades, getTradeById, createTrade, getTradesByAccount } from "./trades";

export const server = {
  getInstruments,
  createInstrument,
  getAccounts,
  createAccount,
  getAccountById,
  getTradeById,
  getTrades,
  createTrade,
  getTradesByAccount
}