import { getAccounts, createAccount } from "./accounts";
import { getInstruments, createInstrument } from "./instruments";
import { getTrades, createTrade } from "./trades";

export const server = {
  getInstruments,
  createInstrument,
  getAccounts,
  createAccount,
  getTrades,
  createTrade
}