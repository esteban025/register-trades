import { EditIcon, TrashIcon } from "@/assets/icons/icons"
import { tradesStore, tradesLoading, refreshTradesByAccount, tradeToEdit, isModalTradeOpen } from "@/store"
import { formatedNumber } from "@/utils/formatedNumber"
import { useStore } from "@nanostores/react"
import { useEffect } from "react"
import type { TradeRow } from "@/types/trades"
import { actions } from "astro:actions"

const headTable = [
  "Fecha",
  "Instrumento",
  "Tipo",
  "Lotaje",
  "Entrada",
  "Salida",
  "Beneficio Neto",
  "Comentario",
  "Acciones"
]

export const TableTrades = ({ idAccount }: { idAccount: string }) => {
  const trades = useStore(tradesStore) as TradeRow[]
  const loading = useStore(tradesLoading)

  useEffect(() => {
    refreshTradesByAccount(idAccount)
  }, [idAccount])

  const handleEditTrade = async (tradeId: number) => {
    const { data, error } = await actions.getTradeById({ id: tradeId });
    if (error || !data?.data?.[0]) {
      console.error("Error fetching trade:", error);
      return;
    }
    (tradeToEdit as any).set(data.data[0]);
    isModalTradeOpen.set(true);
  }

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
                {headTable.map((head) => (
                  <th key={head}>{head}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {trades.map((trade) => (
                <tr key={trade.id}>
                  <td>{new Date(trade.date).toLocaleDateString()}</td>
                  <td>{trade.instrument_name}</td>
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
                  <td className="min">
                    <div className="actions-btns">
                      <button className="btn-act btn-edit" onClick={() => handleEditTrade(trade.id)}><EditIcon /></button>
                      <button className="btn-act btn-delete"><TrashIcon /></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}