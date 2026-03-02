import { accountsStore, accountsLoading, instrumentsStore, instrumentsLoading, refreshAccounts, refreshInstruments } from "@/store"
import type { Account } from "@/types/accounts"
import type { Instrument } from "@/types/instruments"
import { useStore } from "@nanostores/react"
import { useEffect } from "react"

export const AccountsInstrumentsForm = () => {
  const accounts = useStore(accountsStore)
  const isLoadingAccounts = useStore(accountsLoading)
  const instruments = useStore(instrumentsStore)
  const isLoadingInstruments = useStore(instrumentsLoading)

  useEffect(() => {
    refreshAccounts()
    refreshInstruments()
  }, [])

  return (
    <div className="flex items-center gap-4">
      <div className="content-input w-full">
        {isLoadingAccounts ? (
          <p>Cargando cuentas...</p>
        ) : (
          <select name="account-id" id="account-id" className="space-y-1">
            <option value="" selected disabled>Escoge una cuenta</option>
            {accounts.map((account: Account) => (
              <option key={account.id} value={account.id}>
                {account.name}
              </option>
            ))}
          </select>
        )}
      </div>
      <div className="content-input w-full">
        {isLoadingInstruments ? (
          <p>Cargando instrumentos...</p>
        ) : (
          <select name="instrument-id" id="instrument-id">
            <option value="">Escoge un instrumento</option>
            {instruments.map((instrument: Instrument) => (
              <option key={instrument.id} value={instrument.id}>
                {instrument.name}
              </option>
            ))}
          </select>
        )}
      </div>
    </div>
  )
}