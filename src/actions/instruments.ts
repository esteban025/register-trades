import { db } from "@/lib/db";
import { defineAction } from "astro:actions";
import { z } from "astro:schema";

export const getInstruments = defineAction({
  async handler() {
    const query = `SELECT * FROM instruments`;
    const [res] = await db.query(query);
    const instruments = res as any[];
    return {
      success: true,
      message: "Instrumentos obtenidos exitosamente",
      instruments,
    };
  }
})

export const createInstrument = defineAction({
  input: z.object({
    name: z.string().min(1, "El nombre del instrumento es requerido"),
    pip_value: z.number().positive("El valor del pip debe ser un número positivo"),
  }),

  async handler({ name, pip_value }) {
    // 1. VERIFICAR QUE EL NOMBRE SEA UNICO
    const queryCheck = `SELECT COUNT(*) as count FROM instruments WHERE name = ?`;
    const [resCheck] = await db.query(queryCheck, [name]);
    const existingActive = resCheck as any[]
    if (existingActive[0].count > 0) {
      return {
        success: false,
        message: "Ya existe un instrumento con ese nombre"
      }
    }

    // 2.HACEMOS EL POST
    const queryPost = `INSERT INTO instruments (name, pip_value) VALUES (?, ?)`;
    await db.query(queryPost, [name, pip_value]);
    return {
      success: true,
      message: "Instrumento creado exitosamente"
    }
  }
})