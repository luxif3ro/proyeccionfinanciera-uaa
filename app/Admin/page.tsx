"use client";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import AdminDashboard from "./components/adminDashboard";

export default function AdminPage() {
  const { user, role } = useAuth();
  const router = useRouter();

  // Verificar autenticación y rol
  useEffect(() => {
    if (!user || role !== "admin") {
      router.push("/unauthorized");
    }
  }, [user, role, router]);

  if (!user || role !== "admin") {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-800">
            Verificando permisos...
          </h1>
        </div>
      </div>
    );
  }

  return (
    <section>
      <AdminDashboard />
    </section>
  );
}
