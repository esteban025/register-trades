import { getAccounts, createAccount } from "./accounts";
import { getInstruments, createInstrument } from "./instruments";

export const server = {
  getInstruments,
  createInstrument,
  getAccounts,
  createAccount
}