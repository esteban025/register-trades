import { db } from "@/lib/db";
import type { Trade } from "@/types/trades";
import { defineAction } from "astro:actions";
import { z } from "astro:schema";

export const getTrades = defineAction({
  async handler() {
    const query = `SELECT * FROM trades ORDER BY date DESC;`;
    const [res] = await db.query(query)
    const data = res as Trade[];

    return {
      success: true,
      message: "Trades obtenidos exitosamente",
      data
    }
  }
})
export const getTradeById = defineAction({
  input: z.object({
    id: z.number(),
  }),
  async handler(input) {
    const query = `SELECT * FROM trades WHERE id = ?;`;
    const [res] = await db.query(query, [input.id])
    const data = res as Trade[];
    return {
      success: true,
      message: "Trade obtenido exitosamente",
      data
    };
  }
})

// Función helper para calcular beneficios (uso interno)
async function calculateProfitsInternal(params: {
  type: "compra" | "venta";
  lotage: number;
  entry_price: number;
  exit_price: number;
  swap: number;
  rollover: number;
  instrument_id: number;
}) {
  // hallamos el pip_value del instrumento
  const [instrumentRows] = await db.query(
    `SELECT pip_value FROM instruments WHERE id = ?`,
    [params.instrument_id]
  ) as any[];

  if (!instrumentRows || !instrumentRows[0]) {
    throw new Error("Instrumento no encontrado");
  }

  const pipValue = Number(instrumentRows[0].pip_value);

  // calculamos el beneficio bruto
  const grossProfit = params.type === "venta"
    ? (params.entry_price - params.exit_price) * params.lotage * 100 * pipValue
    : (params.exit_price - params.entry_price) * params.lotage * 100 * pipValue;

  // calculamos el beneficio neto
  const netProfit = grossProfit - params.swap - params.rollover;

  return { grossProfit, netProfit };
}

export const calculateProfits = defineAction({
  input: z.object({
    type: z.enum(["compra", "venta"]),
    lotage: z.number(),
    entry_price: z.number(),
    exit_price: z.number(),
    swap: z.number().default(0),
    rollover: z.number().default(0),
    instrument_id: z.number(),
  }),
  async handler(input) {
    try {
      const { grossProfit, netProfit } = await calculateProfitsInternal(input);
      return {
        success: true,
        message: "Beneficios calculados exitosamente",
        data: {
          grossProfit,
          netProfit
        }
      }
    } catch (error) {
      console.error("Error calculating profits:", error);
      return {
        success: false,
        message: "Error al calcular los beneficios",
        data: { grossProfit: 0, netProfit: 0 }
      }
    }
  }
})

export const createTrade = defineAction({
  input: z.object({
    id: z.coerce.number().int().optional(),
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
    const { id } = input;
    console.log("createTrade input:", JSON.stringify(input, null, 2));

    if (id) {
      // actualizamos
      try {
        console.log("Updating trade with id:", id);

        // Obtener el net_profit anterior del trade para ajustar la cuenta
        const [oldTradeRows] = await db.query(
          `SELECT net_profit, accounts_id FROM trades WHERE id = ?`,
          [id]
        ) as any[];

        console.log("Old trade data:", oldTradeRows);

        const oldNetProfit = Number(oldTradeRows[0]?.net_profit || 0);
        const oldAccountId = oldTradeRows[0]?.accounts_id;

        const queryUpdate = `
          UPDATE trades SET
            accounts_id = ?,
            instruments_id = ?,
            date = ?,
            type = ?,
            lotage = ?,
            entry_price = ?,
            exit_price = ?,
            swap = ?,
            rollover = ?,
            gross_profit = ?,
            net_profit = ?,
            comentario = ?
          WHERE id = ?;
        `;
        // recalculamos los beneficios
        const { grossProfit, netProfit } = await calculateProfitsInternal({
          type: input.type,
          lotage: input.lotage,
          entry_price: input.entry_price,
          exit_price: input.exit_price,
          swap: input.swap,
          rollover: input.rollover,
          instrument_id: input.instrument_id
        });

        // actualizamos el trade
        await db.query(queryUpdate, [
          input.account_id,
          input.instrument_id,
          input.date,
          input.type,
          input.lotage,
          input.entry_price,
          input.exit_price,
          input.swap,
          input.rollover,
          grossProfit,
          netProfit,
          input.comentario || null,
          id
        ]);

        // Ajustar el net_profit de la cuenta anterior (restar el viejo)
        if (oldAccountId) {
          await db.query(
            `UPDATE accounts SET net_profit = net_profit - ? WHERE id = ?`,
            [oldNetProfit, oldAccountId]
          );
        }

        // Sumar el nuevo net_profit a la cuenta (puede ser la misma o diferente)
        await db.query(
          `UPDATE accounts SET net_profit = net_profit + ? WHERE id = ?`,
          [netProfit, input.account_id]
        );

        return {
          success: true,
          message: "Operación actualizada exitosamente",
        };
      } catch (error: any) {
        console.error("Error updating trade:", error);
        console.error("Error message:", error?.message);
        console.error("Error stack:", error?.stack);
        return {
          success: false,
          message: `Error al actualizar la operación: ${error?.message || 'desconocido'}`,
        };
      }
    }

    try {
      // calculamos los beneficios
      const { grossProfit, netProfit } = await calculateProfitsInternal({
        type: input.type,
        lotage: input.lotage,
        entry_price: input.entry_price,
        exit_price: input.exit_price,
        swap: input.swap,
        rollover: input.rollover,
        instrument_id: input.instrument_id
      });

      // Insertar el trade
      const query = `
        INSERT INTO trades 
        (accounts_id, instruments_id, date, type, lotage, entry_price, exit_price, swap, rollover, gross_profit, net_profit, comentario)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
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
        grossProfit,
        netProfit,
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
        SELECT t.*, i.name AS instrument_name
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