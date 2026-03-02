export interface Trade {
  id: number;
  account_id: number;
  instrument_id: number;
  date: string;
  type: "compra" | "venta";
  lotage: number;
  entry_price: number;
  exit_price: number;
  swap: number;
  rollover: number;
  comentario?: string;
}