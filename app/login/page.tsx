"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";

export default function LoginPage() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();

    setError("");
    setLoading(true);

    // 1. Autenticar al usuario con Supabase
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      setError("Correo o contraseña incorrectos.");
      setLoading(false);
      return;
    }

    if (!data.user) {
      setError("No se pudo identificar al usuario.");
      setLoading(false);
      return;
    }

    // 2. Buscar el rol del usuario
    const { data: roleData, error: roleError } = await supabase
      .from("user_roles")
      .select("role")
      .eq("user_id", data.user.id)
      .single();

    if (roleError || !roleData) {
      await supabase.auth.signOut();

      setError("El usuario no tiene un rol asignado.");
      setLoading(false);
      return;
    }

    // 3. Guardar el rol para utilizarlo en la interfaz
    localStorage.setItem("rol", roleData.role);

    // 4. Entrar a la intranet
    router.push("/intranet");
  };

  return (
    <main className="min-h-screen bg-[#020B5B] flex items-center justify-center px-4">

      <div className="w-full max-w-md">

        <div className="bg-white rounded-3xl shadow-2xl p-8">

          {/* ENCABEZADO */}

          <div className="text-center mb-8">

            <h1 className="text-4xl font-bold text-[#020B5B]">
              DELCÓN
            </h1>

            <p className="text-gray-500 mt-2">
              Ingreso a la Intranet
            </p>

          </div>

          {/* FORMULARIO */}

          <form onSubmit={handleLogin} className="space-y-5">

            {/* CORREO */}

            <div>

              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Correo electrónico
              </label>

              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="correo@ejemplo.com"
                required
                className="w-full border border-gray-300 rounded-xl px-4 py-3
                text-gray-900 outline-none
                focus:ring-2 focus:ring-[#020B5B]"
              />

            </div>

            {/* CONTRASEÑA */}

            <div>

              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Contraseña
              </label>

              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                required
                className="w-full border border-gray-300 rounded-xl px-4 py-3
                text-gray-900 outline-none
                focus:ring-2 focus:ring-[#020B5B]"
              />

            </div>

            {/* ERROR */}

            {error && (
              <div className="bg-red-100 border border-red-300 text-red-700 rounded-xl p-3 text-sm">
                {error}
              </div>
            )}

            {/* BOTÓN */}

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-red-600 hover:bg-red-700
              disabled:bg-gray-400 text-white font-bold
              py-3 rounded-xl transition-all"
            >
              {loading ? "Ingresando..." : "Ingresar"}
            </button>

          </form>

          {/* VOLVER */}

          <div className="text-center mt-6">

            <button
              type="button"
              onClick={() => router.push("/")}
              className="text-sm text-gray-500 hover:text-[#020B5B]"
            >
              ← Volver
            </button>

          </div>

        </div>

      </div>

    </main>
  );
}