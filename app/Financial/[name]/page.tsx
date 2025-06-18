"use client";
import { useAuth } from "@/contexts/AuthContext";
import { useParams } from "next/navigation";
import React, { Suspense } from "react";
import FinancialPage from "../view/financialview";

export default function ProyectPage() {
  const params = useParams();
  const name = decodeURIComponent(params.name as string);
  const { role } = useAuth();
  if (role === "admin" || role === "user") {
    return (
      <Suspense fallback={<div>cargando...</div>}>
        <FinancialPage name={name} />
      </Suspense>
    );
  } else {
    return (
      <Suspense fallback={<div>cargando...</div>}>
        <FinancialPage name={name} />
      </Suspense>
    );
  }
}
