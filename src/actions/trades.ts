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
      // Obtener el pip_value del instrumento
      const [instrumentRows] = await db.query(
        `SELECT pip_value FROM instruments WHERE id = ?`,
        [input.instrument_id]
      ) as any[];

      if (!instrumentRows.length) {
        return {
          success: false,
          message: "Instrumento no encontrado",
        };
      }

      const pipValue = Number(instrumentRows[0].pip_value);

      // Calcular el beneficio neto (lotaje * 100 * pip_value)
      const grossProfit = input.type === "venta"
        ? (input.entry_price - input.exit_price) * input.lotage * 100 * pipValue
        : (input.exit_price - input.entry_price) * input.lotage * 100 * pipValue;

      const netProfit = grossProfit - input.swap - input.rollover;

      // Insertar el trade
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

      // Actualizar el net_profit de la cuenta
      await db.query(
        `UPDATE accounts SET net_profit = net_profit + ? WHERE id = ?`,
        [netProfit, input.account_id]
      );

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

export const getTradesByAccount = defineAction({
  input: z.object({
    account_id: z.number(),
  }),
  async handler(input) {
    try {
      const query = `
        SELECT 
          t.id,
          t.date,
          i.name AS instrument,
          t.type,
          t.lotage,
          t.entry_price,
          t.exit_price,
          t.swap,
          t.rollover,
          t.comentario,
          CASE 
            WHEN t.type = 'venta' THEN (t.entry_price - t.exit_price) * t.lotage * 100 * i.pip_value
            ELSE (t.exit_price - t.entry_price) * t.lotage * 100 * i.pip_value
          END AS gross_profit,
          (CASE 
            WHEN t.type = 'venta' THEN (t.entry_price - t.exit_price) * t.lotage * 100 * i.pip_value
            ELSE (t.exit_price - t.entry_price) * t.lotage * 100 * i.pip_value
          END) - t.swap - t.rollover AS net_profit
        FROM trades t
        JOIN instruments i ON t.instruments_id = i.id
        WHERE t.accounts_id = ?
        ORDER BY t.date DESC
      `;
      const [res] = await db.query(query, [input.account_id]);

      return {
        success: true,
        message: "Trades obtenidos exitosamente",
        data: res
      };
    } catch (error) {
      console.error("Error fetching trades by account:", error);
      return {
        success: false,
        message: "Error al obtener los trades",
        data: []
      };
    }
  }
})