import { tradesStore, tradesLoading, refreshTradesByAccount } from "@/store"
import { formatedNumber } from "@/utils/formatedNumber"
import { useStore } from "@nanostores/react"
import { useEffect } from "react"

interface TradeRow {
  id: number
  date: string
  instrument: string
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

export const TableTrades = ({ idAccount }: { idAccount: string }) => {
  const trades = useStore(tradesStore) as TradeRow[]
  const loading = useStore(tradesLoading)

  useEffect(() => {
    refreshTradesByAccount(idAccount)
  }, [idAccount])

  return (
    <div className="ss">
      {loading && <p>Cargando trades...</p>}
      {!loading && trades.length === 0 && (
        <section className="section-design empty">
          <p>No hay operaciones registradas para esta cuenta</p>
        </section>
      )}
      {!loading && trades.length > 0 && (
        <div className="container-table">
          <table>
            <thead>
              <tr>
                <th>Fecha</th>
                <th>Instrumento</th>
                <th>Tipo</th>
                <th>Lotaje</th>
                <th>Entrada</th>
                <th>Salida</th>
                <th>Beneficio Neto</th>
                <th>Comentario</th>
              </tr>
            </thead>
            <tbody>
              {trades.map((trade) => (
                <tr key={trade.id}>
                  <td>{new Date(trade.date).toLocaleDateString()}</td>
                  <td>{trade.instrument}</td>
                  <td>
                    <span className={`badge ${trade.type === "compra" ? "bg-green-500/20 text-green-400" : "bg-red-500/20 text-red-400"}`}>
                      {trade.type}
                    </span>
                  </td>
                  <td>{trade.lotage}</td>
                  <td>{formatedNumber(trade.entry_price)}</td>
                  <td>{formatedNumber(trade.exit_price)}</td>
                  <td className={`${trade.net_profit >= 0 ? "text-green-400" : "text-red-400"}`}>
                    ${formatedNumber(trade.net_profit)}
                  </td>
                  <td className="max-w-75 truncate">{trade.comentario || "-"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}