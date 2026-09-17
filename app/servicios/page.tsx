"use client";

import { useEffect, useState } from "react";
import Sidebar from "@/components/Sidebar";
import { supabase } from "@/lib/supabase";

export default function Servicios() {

  const [servicio, setServicio] = useState("");
  const [precioBase, setPrecioBase] = useState("");
  const [descripcion, setDescripcion] = useState("");

  const [serviciosRegistrados, setServiciosRegistrados] = useState<any[]>([]);
  const [busquedaServicio, setBusquedaServicio] = useState("");

  useEffect(() => {
    cargarServiciosRegistrados();
  }, []);

  async function cargarServiciosRegistrados() {

    const { data, error } = await supabase
      .from("servicios")
      .select("*")
      .order("servicio");

    if (error) {
      console.log(error);
      return;
    }

    setServiciosRegistrados(data || []);
  }

  async function guardarServicio() {

    if (!servicio) {
      alert("Ingrese un servicio");
      return;
    }

    const existe = serviciosRegistrados.find(
      (s) =>
        s.servicio.toLowerCase() ===
        servicio.toLowerCase()
    );

    if (existe) {
      alert("Este servicio ya existe");
      return;
    }

    const { error } = await supabase
      .from("servicios")
      .insert([
        {
          servicio,
          precio_base: Number(precioBase),
          descripcion,
        },
      ]);

    if (error) {
      alert(error.message);
      console.log(error);
      return;
    }

    alert("Servicio registrado correctamente");

    setServicio("");
    setPrecioBase("");
    setDescripcion("");
    setBusquedaServicio("");

    await cargarServiciosRegistrados();
  }

  const resultados = serviciosRegistrados.filter((s) =>
    s.servicio
      .toLowerCase()
      .includes(busquedaServicio.toLowerCase())
  );

  return (

    <main className="flex bg-gray-100 min-h-screen">

      <Sidebar />

      <div className="flex-1 p-10">

        <h1 className="text-5xl font-bold text-[#020B5B] mb-10">
          Servicios
        </h1>

        <div className="bg-white p-10 rounded-3xl shadow-xl">

          <div className="grid grid-cols-2 gap-6">

            <div className="relative col-span-2">

              <input
                type="text"
                placeholder="Nombre del servicio"
                value={servicio}
                onChange={(e) => {
                  setServicio(e.target.value);
                  setBusquedaServicio(e.target.value);
                }}
                className="border p-4 rounded-xl w-full"
              />

              {busquedaServicio !== "" && (

                <div className="absolute top-full left-0 w-full bg-white border rounded-xl shadow-xl max-h-52 overflow-auto z-50">

                  {resultados.map((s) => (

                    <div
                      key={s.id}
                      className="
                        p-3
                        border-b
                        hover:bg-gray-100
                      "
                    >
                      {s.servicio}
                    </div>

                  ))}

                  {resultados.length > 0 && (

                    <div className="p-3 text-red-600 font-bold">

                      Servicio ya registrado

                    </div>

                  )}

                </div>

              )}

            </div>

            <input
              type="number"
              step="0.01"
              placeholder="Precio Base"
              value={precioBase}
              onChange={(e) =>
                setPrecioBase(e.target.value)
              }
              className="border p-4 rounded-xl"
            />

            <input
              type="text"
              placeholder="Descripción"
              value={descripcion}
              onChange={(e) =>
                setDescripcion(e.target.value)
              }
              className="border p-4 rounded-xl"
            />

          </div>

          <button
            onClick={guardarServicio}
            className="
              mt-8
              bg-red-600
              hover:bg-red-700
              text-white
              px-10
              py-4
              rounded-2xl
              font-bold
              text-lg
            "
          >
            Guardar Servicio
          </button>

        </div>

        {/* TABLA */}

        <div className="bg-white rounded-3xl shadow-xl overflow-hidden mt-10">

          <div className="bg-[#020B5B] text-white p-5">

            <h2 className="text-xl font-bold">

              Servicios Registrados

            </h2>

          </div>

          <table className="w-full">

            <thead className="bg-gray-200">

              <tr>

                <th className="p-4 text-left">
                  Servicio
                </th>

                <th className="p-4 text-left">
                  Precio Base
                </th>

                <th className="p-4 text-left">
                  Descripción
                </th>

              </tr>

            </thead>

            <tbody>

              {serviciosRegistrados.map((servicio) => (

                <tr
                  key={servicio.id}
                  className="border-b"
                >

                  <td className="p-4">
                    {servicio.servicio}
                  </td>

                  <td className="p-4">
                    S/ {servicio.precio_base}
                  </td>

                  <td className="p-4">
                    {servicio.descripcion}
                  </td>

                </tr>

              ))}

            </tbody>

          </table>

        </div>

      </div>

    </main>

  );
}