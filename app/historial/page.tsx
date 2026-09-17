"use client";

import { useEffect, useState } from "react";
import Sidebar from "@/components/Sidebar";
import { supabase } from "@/lib/supabase";

export default function Historial() {

  // ==========================================
  // ESTADOS
  // ==========================================

  const [registros, setRegistros] = useState<any[]>([]);

  const [busquedaPlaca, setBusquedaPlaca] = useState("");
  const [busquedaPropietario, setBusquedaPropietario] = useState("");

  const [fechaDesde, setFechaDesde] = useState("");
  const [fechaHasta, setFechaHasta] = useState("");

  const [sugerenciasPlaca, setSugerenciasPlaca] = useState<any[]>([]);
  const [sugerenciasPropietario, setSugerenciasPropietario] = useState<any[]>([]);

  const [placaSeleccionada, setPlacaSeleccionada] = useState("");
  const [propietarioSeleccionado, setPropietarioSeleccionado] = useState("");

  const [cargando, setCargando] = useState(false);


  // ==========================================
  // CARGAR HISTORIAL AL ABRIR LA PAGINA
  // ==========================================

  useEffect(() => {

    buscarHistorial();

  }, []);


  // ==========================================
  // BUSCAR SUGERENCIAS DE PLACA
  // ==========================================

  async function buscarSugerenciasPlaca(texto: string) {

    setBusquedaPlaca(texto);

    setPlacaSeleccionada("");

    if (texto.trim() === "") {

      setSugerenciasPlaca([]);

      return;
    }

    const { data, error } = await supabase
      .from("vehiculos")
      .select(`
        id,
        placa,
        propietario
      `)
      .ilike("placa", `%${texto.trim()}%`)
      .order("placa", { ascending: true })
      .limit(10);

    if (error) {

      console.log(error);

      return;
    }

    setSugerenciasPlaca(data || []);
  }


  // ==========================================
  // BUSCAR SUGERENCIAS DE PROPIETARIO
  // ==========================================

  async function buscarSugerenciasPropietario(texto: string) {

    setBusquedaPropietario(texto);

    setPropietarioSeleccionado("");

    if (texto.trim() === "") {

      setSugerenciasPropietario([]);

      return;
    }

    const { data, error } = await supabase
      .from("vehiculos")
      .select(`
        id,
        placa,
        propietario
      `)
      .ilike("propietario", `%${texto.trim()}%`)
      .order("propietario", { ascending: true })
      .limit(10);

    if (error) {

      console.log(error);

      return;
    }

    setSugerenciasPropietario(data || []);
  }


  // ==========================================
  // BUSCAR HISTORIAL
  // ==========================================

  async function buscarHistorial() {

    setCargando(true);

    let consulta = supabase
      .from("registro_diario")
      .select(`
        *,
        vehiculos (
          placa,
          marca,
          modelo,
          anio,
          motor,
          color,
          propietario,
          foto
        ),
        servicios (
          id,
          servicio,
          precio_base
        )
      `)
      .order("fecha", { ascending: false })
      .order("id", { ascending: false });


    // ==========================================
    // FILTRO POR FECHA DESDE
    // ==========================================

    if (fechaDesde) {

      consulta = consulta.gte(
        "fecha",
        fechaDesde
      );

    }


    // ==========================================
    // FILTRO POR FECHA HASTA
    // ==========================================

    if (fechaHasta) {

      consulta = consulta.lte(
        "fecha",
        fechaHasta
      );

    }


    const { data, error } = await consulta;


    // ==========================================
    // ERROR
    // ==========================================

    if (error) {

      console.log(error);

      alert(error.message);

      setCargando(false);

      return;
    }


    // ==========================================
    // RESULTADOS
    // ==========================================

    let resultados = data || [];


    // ==========================================
    // FILTRO POR PLACA
    // ==========================================

    if (busquedaPlaca.trim() !== "") {

      const textoPlaca = busquedaPlaca
        .trim()
        .toLowerCase();

      resultados = resultados.filter((registro) =>

        registro.vehiculos?.placa
          ?.toLowerCase()
          .includes(textoPlaca)

      );

    }


    // ==========================================
    // FILTRO POR PROPIETARIO
    // ==========================================

    if (busquedaPropietario.trim() !== "") {

      const textoPropietario = busquedaPropietario
        .trim()
        .toLowerCase();

      resultados = resultados.filter((registro) =>

        registro.vehiculos?.propietario
          ?.toLowerCase()
          .includes(textoPropietario)

      );

    }


    // ==========================================
    // GUARDAR RESULTADOS
    // ==========================================

    setRegistros(resultados);

    setCargando(false);
  }


  // ==========================================
  // LIMPIAR FILTROS
  // ==========================================

  async function limpiarFiltros() {

    setBusquedaPlaca("");
    setBusquedaPropietario("");

    setPlacaSeleccionada("");
    setPropietarioSeleccionado("");

    setSugerenciasPlaca([]);
    setSugerenciasPropietario([]);

    setFechaDesde("");
    setFechaHasta("");

    setCargando(true);


    const { data, error } = await supabase
      .from("registro_diario")
      .select(`
        *,
        vehiculos (
          placa,
          marca,
          modelo,
          anio,
          motor,
          color,
          propietario,
          foto
        ),
        servicios (
          id,
          servicio,
          precio_base
        )
      `)
      .order("fecha", { ascending: false })
      .order("id", { ascending: false });


    // ==========================================
    // ERROR
    // ==========================================

    if (error) {

      console.log(error);

      alert(error.message);

      setCargando(false);

      return;
    }


    setRegistros(data || []);

    setCargando(false);
  }


  // ==========================================
  // INTERFAZ
  // ==========================================

  return (

    <main className="flex min-h-screen bg-gray-100">

      <Sidebar />


      <div className="flex-1 p-10">


        {/* ==========================================
            TITULO
        ========================================== */}

        <h1 className="text-5xl font-bold text-[#020B5B] mb-8">

          Historial

        </h1>


        {/* ==========================================
            FILTROS
        ========================================== */}

        <div className="bg-white p-6 rounded-3xl shadow-xl mb-8">


          <div className="flex items-end justify-between gap-6 flex-wrap">


            {/* ==========================================
                BUSCAR POR PLACA
            ========================================== */}

            <div className="w-64">

              <label className="block text-sm font-bold text-gray-700 mb-2">

                Buscar por placa

              </label>


              <div className="relative">

                <input
                  type="text"
                  placeholder="Ingrese la placa..."
                  value={busquedaPlaca}
                  onChange={(e) =>
                    buscarSugerenciasPlaca(
                      e.target.value
                    )
                  }
                  className="
                    border
                    p-3
                    rounded-xl
                    w-full
                    text-center
                    font-semibold
                    focus:outline-none
                    focus:ring-2
                    focus:ring-[#020B5B]
                  "
                />


                {/* ==========================================
                    LISTA DE PLACAS
                ========================================== */}

                {busquedaPlaca.trim() !== "" &&
                  sugerenciasPlaca.length > 0 && (

                    <div
                      className="
                        absolute
                        z-50
                        left-0
                        right-0
                        mt-1
                        bg-white
                        border
                        border-gray-200
                        rounded-xl
                        shadow-xl
                        overflow-hidden
                      "
                    >

                      {sugerenciasPlaca.map(
                        (vehiculo) => (

                          <button
                            key={vehiculo.id}
                            type="button"
                            onClick={() => {

                              setBusquedaPlaca(
                                vehiculo.placa
                              );

                              setPlacaSeleccionada(
                                vehiculo.placa
                              );

                              setSugerenciasPlaca([]);

                            }}
                            className="
                              w-full
                              text-left
                              px-4
                              py-3
                              hover:bg-gray-100
                              border-b
                              last:border-b-0
                            "
                          >

                            <div className="font-bold text-[#020B5B]">

                              {vehiculo.placa}

                            </div>


                            <div className="text-sm text-gray-500">

                              {vehiculo.propietario ||
                                "Sin propietario"}

                            </div>

                          </button>

                        )
                      )}

                    </div>

                  )}


                {/* ==========================================
                    SI NO HAY RESULTADOS
                ========================================== */}
                
              </div>

            </div>


            {/* ==========================================
                BUSCAR POR PROPIETARIO
            ========================================== */}

            <div className="w-72">

              <label className="block text-sm font-bold text-gray-700 mb-2">

                Buscar por propietario

              </label>


              <div className="relative">

                <input
                  type="text"
                  placeholder="Ingrese el propietario..."
                  value={busquedaPropietario}
                  onChange={(e) =>
                    buscarSugerenciasPropietario(
                      e.target.value
                    )
                  }
                  className="
                    border
                    p-3
                    rounded-xl
                    w-full
                    text-center
                    font-semibold
                    focus:outline-none
                    focus:ring-2
                    focus:ring-[#020B5B]
                  "
                />


                {/* ==========================================
                    LISTA DE PROPIETARIOS
                ========================================== */}

                {busquedaPropietario.trim() !== "" &&
                  sugerenciasPropietario.length > 0 && (

                    <div
                      className="
                        absolute
                        z-50
                        left-0
                        right-0
                        mt-1
                        bg-white
                        border
                        border-gray-200
                        rounded-xl
                        shadow-xl
                        overflow-hidden
                      "
                    >

                      {sugerenciasPropietario.map(
                        (vehiculo) => (

                          <button
                            key={vehiculo.id}
                            type="button"
                            onClick={() => {

                              setBusquedaPropietario(
                                vehiculo.propietario
                              );

                              setPropietarioSeleccionado(
                                vehiculo.propietario
                              );

                              setSugerenciasPropietario([]);

                            }}
                            className="
                              w-full
                              text-left
                              px-4
                              py-3
                              hover:bg-gray-100
                              border-b
                              last:border-b-0
                            "
                          >

                            <div className="font-bold text-[#020B5B]">

                              {vehiculo.propietario}

                            </div>


                            <div className="text-sm text-gray-500">

                              Placa: {vehiculo.placa}

                            </div>

                          </button>

                        )
                      )}

                    </div>

                  )}


                {/* ==========================================
                    SI NO HAY PROPIETARIOS
                ========================================== */}
                
              </div>

            </div>

            {/* ==========================================
                FECHA DESDE
            ========================================== */}

            <div>

              <label className="block text-sm font-bold text-gray-700 mb-2">

                Desde

              </label>


              <input
                type="date"
                value={fechaDesde}
                onChange={(e) =>
                  setFechaDesde(e.target.value)
                }
                className="
                  border
                  p-3
                  rounded-xl
                "
              />

            </div>


            {/* ==========================================
                FECHA HASTA
            ========================================== */}

            <div>

              <label className="block text-sm font-bold text-gray-700 mb-2">

                Hasta

              </label>


              <input
                type="date"
                value={fechaHasta}
                onChange={(e) =>
                  setFechaHasta(e.target.value)
                }
                className="
                  border
                  p-3
                  rounded-xl
                "
              />

            </div>


            {/* ==========================================
                BOTON BUSCAR
            ========================================== */}

            <button
              onClick={buscarHistorial}
              className="
                bg-red-600
                hover:bg-red-700
                text-white
                font-bold
                px-6
                py-3
                rounded-xl
                transition
              "
            >

              Buscar

            </button>


            {/* ==========================================
                BOTON LIMPIAR
            ========================================== */}

            <button
              onClick={limpiarFiltros}
              className="
                bg-gray-500
                hover:bg-gray-600
                text-white
                font-bold
                px-6
                py-3
                rounded-xl
                transition
              "
            >

              Limpiar

            </button>

          </div>

        </div>


        {/* ==========================================
            TABLA
        ========================================== */}

        <div className="bg-white rounded-3xl shadow-xl overflow-hidden">


          <div className="bg-[#020B5B] text-white p-5">

            <h2 className="text-xl font-bold">

              Registros del Historial

            </h2>

          </div>


          <div className="overflow-x-auto">

            <table className="w-full">


              {/* ==========================================
                  ENCABEZADOS
              ========================================== */}

              <thead className="bg-gray-200">

                <tr>

                  <th className="p-4 text-left">
                    Fecha
                  </th>

                  <th className="p-4 text-left">
                    Foto
                  </th>

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
                    Año
                  </th>

                  <th className="p-4 text-left">
                    Motor
                  </th>

                  <th className="p-4 text-left">
                    Color
                  </th>

                  <th className="p-4 text-left">
                    Propietario
                  </th>

                  <th className="p-4 text-left">
                    Servicio
                  </th>

                  <th className="p-4 text-left">
                    Precio
                  </th>

                </tr>

              </thead>


              {/* ==========================================
                  CUERPO
              ========================================== */}

              <tbody>


                {/* ==========================================
                    CARGANDO
                ========================================== */}

                {cargando ? (

                  <tr>

                    <td
                      colSpan={11}
                      className="
                        p-8
                        text-center
                        text-gray-500
                      "
                    >

                      Cargando historial...

                    </td>

                  </tr>


                ) : registros.length === 0 ? (


                  /* ==========================================
                      SIN REGISTROS
                  ========================================== */

                  <tr>

                    <td
                      colSpan={11}
                      className="
                        p-8
                        text-center
                        text-gray-500
                      "
                    >

                      No se encontraron registros

                    </td>

                  </tr>


                ) : (


                  /* ==========================================
                      REGISTROS
                  ========================================== */

                  registros.map((registro) => (

                    <tr
                      key={registro.id}
                      className="
                        border-b
                        hover:bg-gray-50
                      "
                    >


                      {/* ==========================================
                          FECHA
                      ========================================== */}

                      <td className="p-4 whitespace-nowrap">

                        {registro.fecha}

                      </td>


                      {/* ==========================================
                          FOTO
                      ========================================== */}

                      <td className="p-4">

                        {registro.vehiculos?.foto ? (

                          <a
                            href={registro.vehiculos.foto}
                            target="_blank"
                            rel="noopener noreferrer"
                          >

                            <img
                              src={registro.vehiculos.foto}
                              alt="Vehículo"
                              className="
                                w-24
                                h-16
                                object-cover
                                rounded-lg
                                cursor-pointer
                                hover:scale-105
                                transition
                              "
                            />

                          </a>

                        ) : (

                          <span className="text-gray-500">

                            Sin Foto

                          </span>

                        )}

                      </td>


                      {/* ==========================================
                          PLACA
                      ========================================== */}

                      <td className="p-4 font-bold">

                        {registro.vehiculos?.placa}

                      </td>


                      {/* ==========================================
                          MARCA
                      ========================================== */}

                      <td className="p-4">

                        {registro.vehiculos?.marca}

                      </td>


                      {/* ==========================================
                          MODELO
                      ========================================== */}

                      <td className="p-4">

                        {registro.vehiculos?.modelo}

                      </td>


                      {/* ==========================================
                          AÑO
                      ========================================== */}

                      <td className="p-4">

                        {registro.vehiculos?.anio}

                      </td>


                      {/* ==========================================
                          MOTOR
                          SOLO PRIMERAS 3 LETRAS
                      ========================================== */}

                      <td className="p-4">

                        {registro.vehiculos?.motor
                          ? registro.vehiculos.motor.substring(0, 3)
                          : ""}

                      </td>


                      {/* ==========================================
                          COLOR
                      ========================================== */}

                      <td className="p-4">

                        {registro.vehiculos?.color}

                      </td>


                      {/* ==========================================
                          PROPIETARIO
                      ========================================== */}

                      <td className="p-4 max-w-[180px]">

                        <div
                          className="
                            truncate
                            cursor-default
                          "
                          title={
                            registro.vehiculos?.propietario || ""
                          }
                        >

                          {registro.vehiculos?.propietario}

                        </div>

                      </td>


                      {/* ==========================================
                          SERVICIO
                      ========================================== */}

                      <td className="p-4">

                        {registro.servicios?.servicio || ""}

                      </td>


                      {/* ==========================================
                          PRECIO
                      ========================================== */}

                      <td
                        className="
                          p-4
                          font-semibold
                          whitespace-nowrap
                        "
                      >

                        S/ {Number(
                          registro.precio_cobrado || 0
                        ).toFixed(2)}

                      </td>


                    </tr>

                  ))

                )}

              </tbody>

            </table>

          </div>

        </div>

      </div>

    </main>

  );
}