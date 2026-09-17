"use client";

import { useEffect, useState, useRef } from "react";
import Sidebar from "@/components/Sidebar";
import { supabase } from "@/lib/supabase";


export default function Reportes() {

  const [fechaInicio, setFechaInicio] = useState("");
  const [fechaFin, setFechaFin] = useState("");
  const [reportes, setReportes] = useState<any[]>([]);
  const tablaRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    cargarReportes();
  }, []);

  async function cargarReportes() {

    let query = supabase
      .from("registro_diario")
      .select(`
        *,
        vehiculos(
          placa,
          marca,
          modelo,
          color
        ),
        servicios(
          servicio
        )
      `)
      .order("fecha", { ascending:false });

    if (fechaInicio) {
      query=query.gte(
        "fecha",
        fechaInicio
      );
    }

    if (fechaFin) {
      query=query.lte(
        "fecha",
        fechaFin
      );
    }

    const { data,error } = await query;

    if(error){
      console.log(error);
      return;
    }

    setReportes(data || []);
  }

  const total = reportes.reduce(

    (acumulador,registro)=>

      acumulador +
      Number(
        registro.precio_cobrado || 0
      ),

    0

  );

  function imprimirReporte() {

  const contenido = tablaRef.current?.innerHTML;

  const ventana = window.open(
    "",
    "",
    "width=1200,height=800"
  );

  if (!ventana) return;

  ventana.document.write(`

    <html>

    <head>

      <title>Reporte DELCON</title>

      <style>

        body{
          font-family:Arial;
          padding:20px;
        }

        h1{
          color:#020B5B;
          text-align:center;
          margin-bottom:30px;
        }

        table{
          width:100%;
          border-collapse:collapse;
        }

        th{
          background:#020B5B;
          color:white;
        }

        th,td{
          border:1px solid #ddd;
          padding:10px;
          text-align:left;
        }

        tfoot{
          font-weight:bold;
        }

      </style>

    </head>

    <body>

      <h1>
        REPORTE DELCON
      </h1>

      ${contenido}

    </body>

    </html>

  `);

  ventana.document.close();

  ventana.print();

}

  return (

    <main className="flex min-h-screen bg-gray-100">

      <Sidebar/>

      <div className="flex-1 p-10">

        <h1 className="text-5xl font-bold text-[#020B5B] mb-8">

          Reportes

        </h1>

        {/* FILTROS */}

        <div className="bg-white p-8 rounded-3xl shadow-xl mb-8">

          <h2 className="text-2xl font-bold text-[#020B5B] mb-6">

            Filtro por Fechas

          </h2>

          <div className="grid grid-cols-4 gap-4">

            <input
              type="date"
              value={fechaInicio}
              onChange={(e)=>
                setFechaInicio(
                  e.target.value
                )
              }
              className="border p-4 rounded-xl"
            />

            <input
              type="date"
              value={fechaFin}
              onChange={(e)=>
                setFechaFin(
                  e.target.value
                )
              }
              className="border p-4 rounded-xl"
            />

            <button
              onClick={cargarReportes}
              className="
              bg-red-600
              hover:bg-red-700
              text-white
              rounded-xl
              font-bold
              "
            >

              Buscar

            </button>

            <button
              onClick={imprimirReporte}
              className="
              bg-[#020B5B]
              hover:bg-[#0A167A]
              text-white
              rounded-xl
              font-bold
              "
            >

              Imprimir

            </button>

          </div>

        </div>

        {/* TABLA */}

        <div
          ref={tablaRef}
          className="bg-white rounded-3xl shadow-xl overflow-hidden" >
          <div className="bg-[#020B5B] p-5 text-white">

            <h2 className="text-xl font-bold">

              Reporte General

            </h2>

          </div>

          <div className="overflow-x-auto">

            <table className="w-full">

              <thead className="bg-gray-200">

                <tr>

                  <th className="p-4 text-left">
                    Placa
                  </th>

                  <th className="p-4 text-left">
                    Marca
                  </th>

                  <th className="p-4 text-left">
                    Modelo
                  </th>

                  <th className="p-4 text-left">
                    Color
                  </th>

                  <th className="p-4 text-left">
                    Fecha
                  </th>

                  <th className="p-4 text-left">
                    Servicio
                  </th>

                  <th className="p-4 text-left">
                    Precio
                  </th>

                </tr>

              </thead>

              <tbody>

                {reportes.map((registro)=>(

                  <tr
                    key={registro.id}
                    className="border-b"
                  >

                    <td className="p-4">
                      {registro.vehiculos?.placa}
                    </td>

                    <td className="p-4">
                      {registro.vehiculos?.marca}
                    </td>

                    <td className="p-4">
                      {registro.vehiculos?.modelo}
                    </td>

                    <td className="p-4">
                      {registro.vehiculos?.color}
                    </td>

                    <td className="p-4">
                      {registro.fecha}
                    </td>

                    <td className="p-4">
                      {registro.servicios?.servicio}
                    </td>

                    <td className="p-4">

                      S/
                      {registro.precio_cobrado}

                    </td>

                  </tr>

                ))}

              </tbody>

              <tfoot>

                <tr className="bg-gray-100 font-bold">

                  <td
                    colSpan={6}
                    className="p-5 text-right"
                  >

                    TOTAL:

                  </td>

                  <td className="p-5 text-red-600 text-xl">

                    S/ {total.toFixed(2)}

                  </td>

                </tr>

              </tfoot>

            </table>

          </div>

        </div>

      </div>

    </main>

  );
}