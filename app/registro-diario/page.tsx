"use client";

import { useEffect, useState } from "react";
import Sidebar from "@/components/Sidebar";
import { supabase } from "@/lib/supabase";

export default function RegistroDiario() {

  const [vehiculos, setVehiculos] = useState<any[]>([]);
  const [busqueda, setBusqueda] = useState("");
  const [vehiculoSeleccionado, setVehiculoSeleccionado] = useState<any>(null);
  const [fecha, setFecha] = useState("");
  const [registros, setRegistros] = useState<any[]>([]);
  const [servicios, setServicios] = useState<any[]>([]);
  const [busquedaServicio, setBusquedaServicio] = useState("");
  const [serviciosAdicionales, setServiciosAdicionales] = useState<any[]>([]);
  const resultadosServicios = servicios.filter((s) =>
    s.servicio.toLowerCase().includes(
      busquedaServicio.toLowerCase()
    )
  );

  useEffect(() => {
  cargarVehiculos();
  cargarRegistros();
  cargarServicios();
}, []);

    async function eliminarRegistro(id: number) {

      const { error } = await supabase
        .from("registro_diario")
        .delete()
        .eq("id", id);

      if (error) {
        alert(error.message);
        return;
      }

      await cargarRegistros();
    }

    async function agregarRegistro() {

    if (!fecha) {
        alert("Seleccione una fecha");
        return;
    }

    if (!vehiculoSeleccionado) {
        alert("Seleccione una placa");
        return;
    }

    const { error } = await supabase
        .from("registro_diario")
        .insert([
        {
            fecha,
            vehiculo_id: vehiculoSeleccionado.id,
            estado: "Pendiente",
        },
        ]);

    if (error) {
        console.log(error);
        alert("Error al registrar");
        return;
    }

    alert("Registro agregado correctamente");

    await cargarRegistros();
    setBusqueda("");
    setVehiculoSeleccionado(null);
    }
  
async function guardarRegistro(registro: any) {

  if (!registro.servicio || registro.servicio.trim() === "") {
    alert("Ingrese o seleccione un servicio");
    return;
  }

  if (
    registro.precio_cobrado === "" ||
    registro.precio_cobrado === null ||
    registro.precio_cobrado === undefined
  ) {
    alert("Ingrese el precio");
    return;
  }

  let servicioId = registro.servicio_id;

  // =====================================================
  // SI ESCRIBIÓ UN SERVICIO NUEVO
  // =====================================================

  if (!servicioId) {

    const nombreServicio = registro.servicio.trim();

    // Buscar si ya existe
    const { data: servicioExistente, error: errorBusqueda } =
      await supabase
        .from("servicios")
        .select("id, precio_base")
        .ilike("servicio", nombreServicio)
        .maybeSingle();

    if (errorBusqueda) {
      console.log(errorBusqueda);
      alert(errorBusqueda.message);
      return;
    }

    // Si ya existe, usamos su ID
    if (servicioExistente) {

      servicioId = servicioExistente.id;

    } else {

      // Si no existe, lo creamos
      const { data: nuevoServicio, error: errorCrear } =
        await supabase
          .from("servicios")
          .insert([
            {
              servicio: nombreServicio,
              precio_base: Number(registro.precio_cobrado),
              descripcion: "Servicio registrado desde Registro Diario",
            },
          ])
          .select("id")
          .single();

      if (errorCrear) {
        console.log(errorCrear);
        alert(errorCrear.message);
        return;
      }

      servicioId = nuevoServicio.id;
    }
  }

  // =====================================================
  // GUARDAR REGISTRO DIARIO
  // =====================================================

  const { error } = await supabase
    .from("registro_diario")
    .update({
      servicio_id: servicioId,
      precio_cobrado: Number(registro.precio_cobrado),
      estado: "Registrado",
    })
    .eq("id", registro.id);

  if (error) {
    console.log(error);
    alert(error.message);
    return;
  }

  alert("Registro guardado correctamente");

  await cargarRegistros();
  await cargarServicios();
}

  async function cargarVehiculos() {

    const { data, error } = await supabase
      .from("vehiculos")
      .select("id, placa")
      .order("placa");

    if (error) {
      console.log(error);
      return;
    }

    setVehiculos(data || []);
  }
  async function cargarRegistros() {

  const { data, error } = await supabase
    .from("registro_diario")
    .select(`
      *,
      vehiculos (
        placa,
        marca,
        modelo,
        anio,
        propietario,
        motor,
        foto
      ),
      servicios (
        id,
        servicio,
        precio_base
      )
    `)
    .order("id", { ascending: false });

  if (error) {
    console.log(error);
    return;
  }

  console.log("REGISTROS:", data);

  setRegistros(data || []);
}
async function cargarServicios() {

    const { data, error } = await supabase
      .from("servicios")
      .select("*")
      .order("servicio");

    if (error) {
      console.log(error);
      return;
    }

    setServicios(data || []);
  }


  const resultados = vehiculos.filter((v) =>
    v.placa.toLowerCase().includes(busqueda.toLowerCase())
  );

  return (
    <main className="flex min-h-screen bg-gray-100">

      <Sidebar />

      <div className="flex-1 p-10">

        <h1 className="text-5xl font-bold text-[#020B5B] mb-8">
          Registro Diario
        </h1>

        <div className="bg-white p-8 rounded-3xl shadow-xl mb-8">

          <h2 className="text-2xl font-bold text-[#020B5B] mb-6">
            Nuevo Registro
          </h2>

          <div className="grid grid-cols-3 gap-4 items-start">

            <input
                type="date"
                value={fecha}
                onChange={(e) => setFecha(e.target.value)}
                className="border p-4 rounded-xl"
                />

            <div className="relative">

              <input
                type="text"
                placeholder="Ingrese la placa..."
                value={busqueda}
                onChange={(e) => {
                  setBusqueda(e.target.value);
                  setVehiculoSeleccionado(null);
                }}
                className="border p-4 rounded-xl w-full text-center text-lg font-semibold"
              />

              {busqueda !== "" && vehiculoSeleccionado === null && (

                <div className="absolute top-full left-0 w-full bg-white border rounded-xl shadow-xl max-h-60 overflow-y-auto z-50">

                  {resultados.map((vehiculo) => (

                    <div
                      key={vehiculo.id}
                      onClick={() => {
                        setBusqueda(vehiculo.placa);
                        setVehiculoSeleccionado(vehiculo);
                      }}
                      className="p-3 hover:bg-gray-100 cursor-pointer border-b"
                    >
                      {vehiculo.placa}
                    </div>

                  ))}

                  {resultados.length === 0 && (

                    <div className="p-3 text-gray-500">
                      No se encontraron placas
                    </div>

                  )}

                </div>

              )}

            </div>

            <button
            onClick={agregarRegistro}
            className="
                bg-red-600
                hover:bg-red-700
                text-white
                font-bold
                rounded-xl
                h-[58px]
                transition
            "
            >
            Agregar
            </button>

          </div>

        </div>

        <div className="bg-white rounded-3xl shadow-xl overflow-hidden">

          <div className="bg-[#020B5B] text-white p-5">

            <h2 className="text-xl font-bold">
              Vehículos Registrados
            </h2>

          </div>

          <div className="overflow-x-auto">

            <table className="w-full">

              <thead className="bg-gray-200">

                <tr>
                  <th className="p-4 text-left">Fecha</th>
                  <th className="p-4 text-left">Foto</th>
                  <th className="p-4 text-left">Placa</th>
                  <th className="p-4 text-left">Marca</th>
                  <th className="p-4 text-left">Modelo</th>
                  <th className="p-4 text-left">Año</th>
                  <th className="p-4 text-left">Propietario</th>
                  <th className="p-4 text-left">Motor</th>
                  <th className="p-4 text-left">Servicio</th>
                  <th className="p-4 text-left">Precio</th>
                  <th className="p-4 text-left">Estado</th>
                  <th className="p-4 text-left">Acciones</th>

                </tr>

              </thead>

              <tbody>

                {registros.map((registro) => (

                  <tr
                    key={registro.id}
                    className="border-b"
                  >
                    <td className="p-4">
                      {registro.fecha}
                    </td>
                    <td className="p-4">

                      {registro.vehiculos?.foto ? (

                        <a
                          href={registro.vehiculos?.foto}
                          target="_blank"
                        >
                          <img
                            src={registro.vehiculos?.foto}
                            alt="Vehículo"
                            className="w-24 h-16 object-cover rounded-lg cursor-pointer hover:scale-105 transition"
                          />
                        </a>

                      ) : (

                        "Sin Foto"

                      )}

                    </td>

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
                      {registro.vehiculos?.anio}
                    </td>

                    <td className="p-4">
                      {registro.vehiculos?.propietario}
                    </td>

                    <td className="p-4">
                      {registro.vehiculos?.motor
                        ? registro.vehiculos.motor.substring(0, 3).toUpperCase()
                        : "-"}
                    </td>

                    <td className="p-4">

                      <div className="relative flex items-center gap-2">

                        {registro.estado === "Registrado" ? (

                          <div className="border rounded-lg p-2 w-56 bg-gray-100 text-gray-700">
                            {registro.servicios?.servicio || registro.servicio || ""}
                          </div>

                        ) : (

                          <input
                            type="text"
                            value={registro.servicio || ""}
                            placeholder="Escriba el servicio..."
                            onChange={(e) => {

                              const texto = e.target.value;

                              setRegistros((prev) =>
                                prev.map((r) =>
                                  r.id === registro.id
                                    ? {
                                        ...r,
                                        servicio: texto,
                                        servicio_id: null,
                                      }
                                    : r
                                )
                              );

                            }}
                            className="border rounded-lg p-2 w-56"
                          />

                        )}
                       
                        {/* BOTÓN + */}
                        {registro.estado === "Registrado" ? (

                          <button
                            type="button"
                            disabled
                            className="
                              bg-gray-400
                              text-white
                              font-bold
                              w-9
                              h-9
                              rounded-lg
                              flex
                              items-center
                              justify-center
                              text-xl
                              cursor-not-allowed
                            "
                          >
                            +
                          </button>

                        ) : (

                          <button
                            type="button"
                            onClick={async () => {

                              const { data, error } = await supabase
                                .from("registro_diario")
                                .insert([
                                  {
                                    fecha: registro.fecha,
                                    vehiculo_id: registro.vehiculo_id,
                                    estado: "Pendiente",
                                  },
                                ])
                                .select(`
                                  *,
                                  vehiculos (
                                    placa,
                                    marca,
                                    modelo,
                                    anio,
                                    propietario,
                                    motor,
                                    foto
                                  )
                                `)
                                .single();

                              if (error) {
                                alert(error.message);
                                console.log(error);
                                return;
                              }

                              setRegistros((prev) => [
                                data,
                                ...prev,
                              ]);

                            }}
                            className="
                              bg-blue-600
                              hover:bg-blue-700
                              text-white
                              font-bold
                              w-9
                              h-9
                              rounded-lg
                              flex
                              items-center
                              justify-center
                              text-xl
                            "
                          >
                            +
                          </button>

                        )}


                        {registro.servicio &&
                          registro.servicio_id === null &&
                          servicios.filter((s) =>
                            s.servicio
                              .toLowerCase()
                              .includes(registro.servicio.toLowerCase())
                          ).length > 0 && (

                            <div className="absolute left-0 top-full mt-1 w-56 bg-white border rounded-lg shadow-xl z-50">

                              {servicios
                                .filter((s) =>
                                  s.servicio
                                    .toLowerCase()
                                    .includes(registro.servicio.toLowerCase())
                                )
                                .map((servicio) => (

                                  <div
                                    key={servicio.id}
                                    onClick={() => {

                                      setRegistros((prev) =>
                                        prev.map((r) =>
                                          r.id === registro.id
                                            ? {
                                                ...r,
                                                servicio: servicio.servicio,
                                                servicio_id: servicio.id,
                                                precio_cobrado: servicio.precio_base,
                                              }
                                            : r
                                        )
                                      );

                                    }}
                                    className="p-3 cursor-pointer hover:bg-gray-100 border-b"
                                  >
                                    {servicio.servicio}
                                  </div>

                                ))}

                            </div>

                          )}

                      </div>

                    </td>

                    <td className="p-4">

                      <input
                        type="number"
                        value={registro.precio_cobrado || ""}
                        disabled={registro.estado === "Registrado"}
                        onChange={(e) => {

                          setRegistros((prev) =>
                            prev.map((r) =>
                              r.id === registro.id
                                ? {
                                    ...r,
                                    precio_cobrado: e.target.value,
                                  }
                                : r
                            )
                          );

                        }}
                        className={`border rounded-lg p-2 w-28 ${
                          registro.estado === "Registrado"
                            ? "bg-gray-200 cursor-not-allowed"
                            : ""
                        }`}
                      />
                    </td>

                    <td className="p-4">
                      {registro.estado}
                    </td>

                    <td className="p-4 flex gap-2">

                      {registro.estado === "Registrado" ? (

                      <button
                        disabled
                        className="
                          bg-gray-400
                          text-white
                          px-4
                          py-2
                          rounded-lg
                          cursor-not-allowed
                        "
                      >
                        Guardado
                      </button>

                    ) : (

                      <button
                        onClick={() => guardarRegistro(registro)}
                        className="
                          bg-green-600
                          hover:bg-green-700
                          text-white
                          px-4
                          py-2
                          rounded-lg
                        "
                      >
                        Guardar
                      </button>

                    )}

                      <button
                        onClick={() => eliminarRegistro(registro.id)}
                        className="
                          bg-red-600
                          hover:bg-red-700
                          text-white
                          px-4
                          py-2
                          rounded-lg
                        "
                      >
                        Eliminar
                      </button>

                    </td>

                  </tr>

                ))}

              </tbody>

            </table>

          </div>

        </div>

      </div>

    </main>
  );
}