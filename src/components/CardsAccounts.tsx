
import { accountsLoading, accountsStore, refreshAccounts } from "@/store"
import type { Account } from "@/types/accounts"
import { getCurrencySymbol } from "@/utils/currencySymbol"
import { formatedNumber } from "@/utils/formatedNumber"
import { useStore } from "@nanostores/react"
import { useEffect } from "react"

export const CardsAccounts = () => {
  const accounts = useStore(accountsStore)
  const loading = useStore(accountsLoading)

  useEffect(() => {
    refreshAccounts()
  }, [])

  return (
    <div className="ss">
      {loading && <p>Cargando...</p>}
      {!loading && (
        <section className="grid grid-cols-3 gap-4">
          {accounts.length === 0 && (
            <section className="section-design empty col-span-3">
              <p>No existe registro de cuentas</p>
            </section>
          )}

          {accounts.length > 0 && (
            accounts.map((account: Account) => {
              const profitDiff = account.net_profit - account.initial_capital;
              const profitPercentage = ((profitDiff / account.initial_capital) * 100).toFixed(2);
              const isPositive = profitDiff > 0;
              const isNegative = profitDiff < 0;

              return (
                <a href={`/accounts/${account.id}`} key={account.id} className="section-design">
                  <div className="relative flex flex-col gap-2">
                    <header className="flex items-center justify-between">
                      <h3 className="font-semibold">{account.name}</h3>
                    </header>
                    <p className={`text-2xl font-semibold ${isPositive ? "text-green-300" : isNegative ? "text-red-300" : "text-green-300"}`}>
                      <span className="mr-2">{getCurrencySymbol(account.badge)}</span>
                      <span>{formatedNumber(account.net_profit)}</span>
                    </p>
                    <div className="absolute top-0 right-0 flex flex-col items-end gap-1">
                      <p className={`${isPositive ? "text-green-500 bg-green-500/10" :
                        isNegative ? "text-red-500 bg-red-500/10" :
                          "text-neutral-500 bg-neutral-500/10"
                        } p-2 rounded-lg porcentage`}>
                        {isPositive ? "⬆" : isNegative ? "⬇" : ""} {Math.abs(Number(profitPercentage))}%
                      </p>
                      <p className="text-neutral-500 text-sm">
                        Capital: {getCurrencySymbol(account.badge)}{formatedNumber(account.initial_capital)}
                      </p>
                    </div>
                  </div>
                </a>
              );
            })
          )}
        </section>
      )}
    </div>
  )
}