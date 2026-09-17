"use client";

import { useEffect, useRef, useState } from "react";
import Sidebar from "@/components/Sidebar";
import { supabase } from "@/lib/supabase";

export default function Vehiculos() {

  const [placa, setPlaca] = useState("");
  const [marca, setMarca] = useState("");
  const [modelo, setModelo] = useState("");
  const [motor, setMotor] = useState("");
  const [color, setColor] = useState("");
  const [anio, setAnio] = useState("");
  const [propietario, setPropietario] = useState("");
  const [foto, setFoto] = useState<File | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const [vehiculosRegistrados, setVehiculosRegistrados] = useState<any[]>([]);
  const [busquedaPlaca, setBusquedaPlaca] = useState("");

  useEffect(() => {
    cargarVehiculosRegistrados();
  }, []);

  async function cargarVehiculosRegistrados() {

    const { data, error } = await supabase
      .from("vehiculos")
      .select("*")
      .order("placa");

    if (error) {
      console.log(error);
      return;
    }

    setVehiculosRegistrados(data || []);
  }
  async function actualizarPropietario(vehiculo: any) {

  const { error } = await supabase
      .from("vehiculos")
      .update({
        propietario: vehiculo.propietario,
      })
      .eq("id", vehiculo.id);

    if (error) {

      alert(error.message);
      return;

    }

    alert("Propietario actualizado correctamente");

  }

  async function registrarVehiculo() {

    const existe = vehiculosRegistrados.find(
      (v) =>
        v.placa.toLowerCase() === placa.toLowerCase()
    );

    if (existe) {
      alert("La placa ya está registrada");
      return;
    }

    let fotoUrl = "";

    // Subir foto
    if (foto) {

      const nombreArchivo =
        `${Date.now()}-${foto.name}`;

      const { error: errorFoto } =
        await supabase.storage
          .from("vehiculos")
          .upload(nombreArchivo, foto);

      if (errorFoto) {
        alert(errorFoto.message);
        return;
      }

      const { data } = supabase.storage
        .from("vehiculos")
        .getPublicUrl(nombreArchivo);

      fotoUrl = data.publicUrl;
    }

    // Guardar vehículo
    const { error } = await supabase
      .from("vehiculos")
      .insert([
        {
          placa,
          propietario,
          marca,
          modelo,
          motor,
          color,
          anio: Number(anio),
          foto: fotoUrl,
        },
      ]);

    if (error) {
      alert(error.message);
      return;
    }

    alert("Vehículo registrado correctamente");

    setPlaca("");
    setMarca("");
    setModelo("");
    setMotor("");
    setColor("");
    setAnio("");
    setPropietario("");
    setFoto(null);

    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }

    cargarVehiculosRegistrados();
  }

  const resultadosPlaca =
    vehiculosRegistrados.filter((v) =>
      v.placa.toLowerCase().includes(
        busquedaPlaca.toLowerCase()
      )
    );

  return (

    <main className="flex bg-gray-100 min-h-screen">

      <Sidebar />

      <div className="flex-1 p-10">

        <h1 className="text-5xl font-bold text-[#020B5B] mb-10">
          Registrar Vehículo
        </h1>

        <div className="bg-white p-10 rounded-3xl shadow-xl">

          <div className="grid grid-cols-2 gap-6">

            {/* PLACA */}
            <div className="relative">

              <input
                type="text"
                placeholder="Placa"
                value={placa}
                onChange={(e)=>{
                  setPlaca(e.target.value);
                  setBusquedaPlaca(e.target.value);
                }}
                className="border p-4 rounded-xl w-full"
              />

              {busquedaPlaca !== "" && (

                <div className="absolute top-full left-0 w-full bg-white border rounded-xl shadow-lg max-h-52 overflow-auto z-50">

                  {resultadosPlaca.map((vehiculo)=> (

                    <div
                      key={vehiculo.id}
                      className="p-3 border-b hover:bg-gray-100"
                    >
                      {vehiculo.placa}
                    </div>

                  ))}

                  {resultadosPlaca.length > 0 && (

                    <div className="p-3 text-red-600 font-bold">

                      Esa placa ya existe

                    </div>

                  )}

                </div>

              )}

            </div>

            <input
              type="text"
              placeholder="Marca"
              value={marca}
              onChange={(e)=>setMarca(e.target.value)}
              className="border p-4 rounded-xl"
            />

            <input
              type="text"
              placeholder="Modelo"
              value={modelo}
              onChange={(e)=>setModelo(e.target.value)}
              className="border p-4 rounded-xl"
            />

            <input
              type="text"
              placeholder="Motor"
              value={motor}
              onChange={(e)=>setMotor(e.target.value)}
              className="border p-4 rounded-xl"
            />

            <input
              type="text"
              placeholder="Color"
              value={color}
              onChange={(e)=>setColor(e.target.value)}
              className="border p-4 rounded-xl"
            />

            <input
              type="number"
              placeholder="Año"
              value={anio}
              onChange={(e)=>setAnio(e.target.value)}
              className="border p-4 rounded-xl"
            />

            <input
              type="text"
              placeholder="Propietario"
              value={propietario}
              onChange={(e)=>setPropietario(e.target.value)}
              className="border p-4 rounded-xl col-span-2"
            />

            <input
              type="file"
              ref={fileInputRef}
              onChange={(e)=>{

                if(
                  e.target.files &&
                  e.target.files[0]
                ){
                  setFoto(e.target.files[0]);
                }

              }}
              className="border p-4 rounded-xl col-span-2"
            />

          </div>

          <button
            onClick={registrarVehiculo}
            className="mt-8 bg-red-600 hover:bg-red-700 text-white px-10 py-4 rounded-2xl font-bold"
          >
            Guardar Vehículo
          </button>

        </div>

        {/* TABLA */}

        <div className="bg-white rounded-3xl shadow-xl overflow-hidden mt-10">

          <div className="bg-[#020B5B] text-white p-5">

            <h2 className="text-xl font-bold">
              Vehículos Registrados
            </h2>

          </div>

          <table className="w-full">

            <thead className="bg-gray-200">

              <tr>

                <th className="p-4">Foto</th>
                <th className="p-4">Placa</th>
                <th className="p-4">Marca</th>
                <th className="p-4">Modelo</th>
                <th className="p-4">Propietario</th>
                <th className="p-4">Acciones</th>

              </tr>

            </thead>

            <tbody>

              {vehiculosRegistrados.map((vehiculo)=>(

                <tr
                  key={vehiculo.id}
                  className="border-b"
                >

                  <td className="p-4">

                    {vehiculo.foto ? (

                      <img
                        src={vehiculo.foto}
                        className="w-20 h-16 rounded-lg object-cover"
                      />

                    ) : (

                      "Sin foto"

                    )}

                  </td>

                  <td className="p-4">
                    {vehiculo.placa}
                  </td>

                  <td className="p-4">
                    {vehiculo.marca}
                  </td>

                  <td className="p-4">
                    {vehiculo.modelo}
                  </td>

                  <td className="p-4">

                    <input
                      type="text"
                      value={vehiculo.propietario || ""}
                      onChange={(e) => {

                        setVehiculosRegistrados((prev) =>
                          prev.map((v) =>
                            v.id === vehiculo.id
                              ? {
                                  ...v,
                                  propietario: e.target.value,
                                }
                              : v
                          )
                        );

                      }}
                      className="border rounded-lg p-2 w-full"
                    />

                  </td>
                  <td className="p-4">
                    <button
                      onClick={() => actualizarPropietario(vehiculo)}
                      className="
                        bg-green-600
                        hover:bg-green-700
                        text-white
                        px-4
                        py-2
                        rounded-lg
                        font-bold
                      "
                    > Guardar
                    </button>

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