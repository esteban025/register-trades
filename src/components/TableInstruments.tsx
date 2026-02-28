import type { Instrument } from "@/types/instruments";
import { useStore } from "@nanostores/react";
import { instrumentsStore, instrumentsLoading, refreshInstruments } from "@/store";
import { useEffect } from "react";

const headerTable = ["Nombre", "Pip/Valor", "Acciones"];

export const TableInstruments = () => {
  const instruments = useStore(instrumentsStore);
  const loading = useStore(instrumentsLoading);
  const formatedNumber = (number: number) => {
    if (number == null || isNaN(number)) return "0.00";
    return Number(number).toLocaleString('es-ES', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    });
  }

  useEffect(() => {
    refreshInstruments();
  }, []);

  return (
    <div className="ss">
      {loading && <p>Cargando...</p>}
      {!loading && (
        <div className="container-table">
          <table>
            <thead>
              <tr>
                {headerTable.map((header) => (
                  <th key={header}>{header}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {instruments.map((instrument: Instrument) => (
                <tr key={instrument.id}>
                  <td>{instrument.name}</td>
                  <td>{formatedNumber(instrument.pip_value)}</td>
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
  );
};