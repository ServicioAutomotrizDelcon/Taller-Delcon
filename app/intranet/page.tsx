import Sidebar from "@/components/Sidebar";

export default function Intranet() {

  return (

    <main className="flex bg-gray-100 min-h-screen">

      <Sidebar />

      <div className="flex-1 p-10">

        <h1 className="text-5xl font-bold text-[#020B5B] mb-3">
          Panel Administrativo
        </h1>

        <p className="text-gray-600 text-lg mb-10">
          Bienvenido al sistema DELCON.
        </p>

        <div className="grid grid-cols-3 gap-6">

          <div className="bg-white rounded-2xl p-6 shadow-lg border-l-8 border-red-600">

            <h2 className="text-3xl font-bold text-[#020B5B]">
              0
            </h2>

            <p className="text-gray-500 mt-2">
              Vehículos registrados
            </p>

          </div>

          <div className="bg-white rounded-2xl p-6 shadow-lg border-l-8 border-blue-700">

            <h2 className="text-3xl font-bold text-[#020B5B]">
              0
            </h2>

            <p className="text-gray-500 mt-2">
              Servicios realizados
            </p>

          </div>

          <div className="bg-white rounded-2xl p-6 shadow-lg border-l-8 border-yellow-500">

            <h2 className="text-3xl font-bold text-[#020B5B]">
              S/ 0
            </h2>

            <p className="text-gray-500 mt-2">
              Ingresos del mes
            </p>

          </div>

        </div>

      </div>

    </main>

  );
}