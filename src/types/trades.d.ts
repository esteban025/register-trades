export interface Trade {
  id: number;
  accounts_id: number;
  instruments_id: number;
  date: string;
  type: "compra" | "venta";
  lotage: number;
  entry_price: number;
  exit_price: number;
  swap: number;
  rollover: number;
  comentario?: string;
}

export interface TradeRow {
  id: number
  date: string
  instruments_id: number
  instrument_name: string
  type: "compra" | "venta"
  lotage: number
  entry_price: number
  exit_price: number
  swap: number
  rollover: number
  comentario?: string
  gross_profit: number
  net_profit: number
}
