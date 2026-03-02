
import { accountsLoading, accountsStore, refreshAccounts } from "@/store"
import type { Account } from "@/types/accounts"
import { formatedNumber } from "@/utils/formatedNumber"
import { useStore } from "@nanostores/react"
import { useEffect } from "react"

const headTable = ["Nombre", "Capital Inicial", "Divisa", "Acciones"]

export const TableAccounts = () => {
  const accounts = useStore(accountsStore)
  const loading = useStore(accountsLoading)

  useEffect(() => {
    refreshAccounts()
  }, [])

  return (
    <div className="ss">
      {loading && <p>Cargando...</p>}
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
            <tbody>
              {accounts.map((account: Account) => (
                <tr key={account.id}>
                  <td>{account.name}</td>
                  <td>{formatedNumber(account.initial_capital)}</td>
                  <td>{account.badge}</td>
                  <td>
                    {/* Aquí puedes agregar botones de acción, como editar o eliminar */}
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