import { refreshTrades, tradesLoading, tradesStore } from "@/store"
import { useStore } from "@nanostores/react"
import { useEffect } from "react"

const headTable = ["Fecha", "Cuenta", "Instrumento", "Cantidad", "Precio", "Tipo", "Acciones"]

export const TableTrades = () => {
  const trades = useStore(tradesStore)
  const loading = useStore(tradesLoading)

  useEffect(() => {
    refreshTrades()
  }, [])
  return (
    <div className="ss">
      {loading && (<p>Cargando...</p>)}
      {!loading && (
        <div className="container-table">
          <table>
            <thead>
              <tr>
                {headTable.map((head) => (
                  <th key={head}>{head}</th>
                ))}
              </tr>
            </thead>
          </table>
        </div>
      )}
    </div>
  )
}