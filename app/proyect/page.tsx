"use client";
import React, { Suspense } from "react";
import ProyectView from "./view/proyectview";

export default function ProyectPage() {
  return (
    <Suspense fallback={<div>cargando...</div>}>
      <ProyectView/>
    </Suspense>
  );
}
