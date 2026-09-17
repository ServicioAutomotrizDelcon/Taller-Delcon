import Image from "next/image";
import Link from "next/link";

export default function Home() {

  return (

    <main className="min-h-screen bg-gray-100 flex items-center justify-center p-10">

      <div className="bg-white rounded-3xl shadow-2xl p-14 max-w-4xl w-full">

        <div className="flex flex-col items-center text-center">

          <Image
            src="/images/logo.png"
            alt="Logo Delcon"
            width={300}
            height={300}
            loading="eager"
            className="mb-8"
          />

          <h1 className="text-6xl font-bold text-[#020B5B] mb-5">
            Taller DELCÓN
          </h1>

          <p className="text-2xl text-gray-600 mb-10">
            Sistema interno de gestión automotriz
          </p>

          <Link href="/login">

            <button
              className="bg-red-600 hover:bg-red-700 text-white px-12 py-5 rounded-2xl text-2xl font-bold transition-all shadow-lg"
            >
              Ingresar a Intranet
            </button>

          </Link>

        </div>

      </div>

    </main>

  );
};