"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import Image from "next/image";

export default function Sidebar() {

  const pathname = usePathname();

  return (

    <div className="w-72 min-h-screen bg-[#020B5B] text-white p-5 flex flex-col shadow-2xl">

      {/* LOGO */}

      <div className="flex flex-col items-center mb-10">

        <Image
          src="/images/logo.png"
          alt="Logo Delcon"
          width={170}
          height={170}
          className="mb-3"
          priority
        />

        <h1 className="text-2xl font-bold tracking-wide">
          DELCON
        </h1>

        <p className="text-sm text-gray-300">
          Sistema Administrativo
        </p>

      </div>

      {/* MENU */}

      <nav className="flex flex-col gap-3 flex-1">

        <Link href="/intranet">

          <div
            className={`p-4 rounded-xl cursor-pointer transition-all duration-300 font-semibold flex items-center gap-3
                
            ${
              pathname === "/intranet"
                ? "bg-red-600 shadow-lg"
                : "hover:bg-[#0A167A]"
            }`}
          >

            <span className="text-xl">🏠</span>

            <span>Panel</span>

          </div>

        </Link>

        <Link href="/vehiculos">

          <div
            className={`p-4 rounded-xl cursor-pointer transition-all duration-300 font-semibold flex items-center gap-3
                
            ${
              pathname === "/vehiculos"
                ? "bg-red-600 shadow-lg"
                : "hover:bg-[#0A167A]"
            }`}
          >

            <span className="text-xl">🚗</span>

            <span>Vehículos</span>

          </div>

        </Link>

        <Link href="/servicios">

          <div
            className={`p-4 rounded-xl cursor-pointer transition-all duration-300 font-semibold flex items-center gap-3
                
            ${
              pathname === "/servicios"
                ? "bg-red-600 shadow-lg"
                : "hover:bg-[#0A167A]"
            }`}
          >

            <span className="text-xl">🔧</span>

            <span>Servicios</span>

          </div>

        </Link>

        <Link href="/historial">

          <div
            className={`p-4 rounded-xl cursor-pointer transition-all duration-300 font-semibold flex items-center gap-3
                
            ${
              pathname === "/historial"
                ? "bg-red-600 shadow-lg"
                : "hover:bg-[#0A167A]"
            }`}
          >

            <span className="text-xl">📋</span>

            <span>Historial</span>

          </div>
        </Link>
        <Link href="/registro-diario">

          <div
            className={`p-4 rounded-xl cursor-pointer transition-all duration-300 font-semibold flex items-center gap-3

            ${
              pathname === "/registro-diario"
                ? "bg-red-600 shadow-lg"
                : "hover:bg-[#0A167A]"
            }`}
          >

            <span className="text-xl">📝</span>

            <span>Registro Diario</span>

          </div>

        </Link>

        <Link href="/reportes">

          <div
            className={`p-4 rounded-xl cursor-pointer transition-all duration-300 font-semibold flex items-center gap-3
                
            ${
              pathname === "/reportes"
                ? "bg-red-600 shadow-lg"
                : "hover:bg-[#0A167A]"
            }`}
          >

            <span className="text-xl">📊</span>

            <span>Reportes</span>

          </div>

        </Link>

        <Link href="/cotizaciones">

          <div
            className={`p-4 rounded-xl cursor-pointer transition-all duration-300 font-semibold flex items-center gap-3
                
            ${
              pathname === "/cotizaciones"
                ? "bg-red-600 shadow-lg"
                : "hover:bg-[#0A167A]"
            }`}
          >

            <span className="text-xl">📄</span>

            <span>Cotizaciones</span>

          </div>

        </Link>

      </nav>

      {/* FOOTER */}

      <div className="mt-10 border-t border-blue-400 pt-5">

        <p className="text-center text-sm text-gray-300">
          © DELCON 2026
        </p>

      </div>

    </div>

  );
}