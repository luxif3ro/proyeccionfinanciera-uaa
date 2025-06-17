import { supabase } from "@/lib/supabaseClient"

export async function verifyProyectoLogin(nombre: string, contrasena: string) {
  const { data, error } = await supabase
    .from("proyecto")
    .select("nombre, contrasena, tipo") // solo traes lo necesario
    .eq("nombre", nombre)
    .eq("contrasena", contrasena)
    .single()

  if (error || !data) {
    return { success: false, message: "Usuario o contraseña incorrectos" }
  }

  return {
    success: true,
    data,
    rol: (data.tipo?.toLowerCase() ?? "user") as "admin" | "user" | "guest",
  }
}
