import { instrumentsStore, instrumentsLoading, refreshInstruments } from "@/store"
import type { Account } from "@/types/accounts"
import type { Instrument } from "@/types/instruments"
import { useStore } from "@nanostores/react"
import { useEffect } from "react"

export const InstrumentsForm = () => {
  const instruments = useStore(instrumentsStore)
  const isLoadingInstruments = useStore(instrumentsLoading)

  useEffect(() => {
    refreshInstruments()
  }, [])

  return (
    <div className="content-input w-full">
      {isLoadingInstruments ? (
        <p>Cargando instrumentos...</p>
      ) : (
        <select name="instrument-id" id="instrument-id" className="space-y-1" required>
          <option value="" selected disabled>Escoge un instrumento</option>
          {instruments.map((instrument: Instrument) => (
            <option key={instrument.id} value={instrument.id}>
              {instrument.name}
            </option>
          ))}
        </select>
      )}
    </div>
  )
}