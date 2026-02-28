import type { Instrument } from "@/types/instruments";
import { actions } from "astro:actions";
import { useEffect, useState } from "react";

const headerTable = ["Nombre", "Pip/Valor", "Acciones"];

export const TableInstruments = () => {
  const [instruments, setInstruments] = useState<Instrument[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchInstruments = async () => {
      try {
        const { data, error } = await actions.getInstruments({})
        if (!data?.success || error) {
          setError(data?.message || error?.message || "Error fetching instruments");
          return;
        }
        setInstruments(data.instruments);
      } catch (error) {
        setError("Error fetching instruments");
      } finally {
        setLoading(false);
      }
    }
    fetchInstruments();
  }, [])
  return (
    <div className="ss">
      {loading && <p>Cargando...</p>}
      {error && <p>{error}</p>}
      {!loading && !error && (
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
              {instruments.map((instrument) => (
                <tr key={instrument.id}>
                  <td>{instrument.name}</td>
                  <td>{instrument.pip_value}</td>
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