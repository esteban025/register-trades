import { db } from "@/lib/db";
import type { Trade } from "@/types/trades";
import { defineAction } from "astro:actions";
import { z } from "astro:schema";

export const getTrades = defineAction({
  async handler() {
    const query = `SELECT * FROM trading_report ORDER BY date DESC;`;
    const [res] = await db.query(query)
    const data = res as Trade[];

    return {
      success: true,
      message: "Trades obtenidos exitosamente",
      data
    }
  }
})

export const createTrade = defineAction({
  input: z.object({
    account_id: z.number(),
    instrument_id: z.number(),
    date: z.string(),
    type: z.enum(["compra", "venta"]),
    lotage: z.number(),
    entry_price: z.number(),
    exit_price: z.number(),
    swap: z.number().default(0),
    rollover: z.number().default(0),
    comentario: z.string().optional(),
  }),
  async handler(input) {
    try {
      const query = `
        INSERT INTO trades 
        (accounts_id, instruments_id, date, type, lotage, entry_price, exit_price, swap, rollover, comentario)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `;
      await db.query(query, [
        input.account_id,
        input.instrument_id,
        input.date,
        input.type,
        input.lotage,
        input.entry_price,
        input.exit_price,
        input.swap,
        input.rollover,
        input.comentario || null
      ]);

      return {
        success: true,
        message: "Operación creada exitosamente",
      };
    } catch (error) {
      console.error("Error creating trade:", error);
      return {
        success: false,
        message: "Error al crear la operación",
      };
    }
  }
})