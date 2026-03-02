import { db } from "@/lib/db";
import type { Account } from "@/types/accounts";
import { defineAction } from "astro:actions";
import { z } from "astro:schema";

export const getAccounts = defineAction({
  async handler() {
    try {
      const query = `SELECT id, name, initial_capital, badge FROM accounts`;
      const [rows] = await db.query(query);
      const data = rows as Account[];
      return {
        success: true,
        message: "Cuentas obtenidas exitosamente",
        data,
      };
    } catch (error) {
      console.error("Error fetching accounts:", error);
      return {
        success: false,
        message: "Error al obtener las cuentas",
      };
    }
  }
});

export const createAccount = defineAction({
  input: z.object({
    name: z.string().min(1, "Name is required"),
    initial_capital: z.number().positive("Initial capital must be a positive number"),
    badge: z.string().default("USD"),
  }),
  async handler({ name, initial_capital, badge }) {
    // verificamos que no exista una cuenta con el mismo nombre
    const queryCheck = `SELECT COUNT(*) as count FROM accounts WHERE name = ?`;
    const [rowsCheck] = await db.query(queryCheck, [name]) as any[];
    if (rowsCheck[0].count > 0) {
      return {
        success: false,
        message: "Ya existe una cuenta con ese nombre",
      }
    }

    // si no existe, creamos la cuenta
    const queryInsert = `INSERT INTO accounts (name, initial_capital, badge) VALUES (?, ?, ?)`;
    await db.query(queryInsert, [name, initial_capital, badge]);

    return {
      success: true,
      message: "Cuenta creada exitosamente",
    };
  }
})