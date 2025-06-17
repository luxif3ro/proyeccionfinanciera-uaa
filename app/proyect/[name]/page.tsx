"use client";
import { useAuth } from "@/contexts/AuthContext";
import React from "react";
import ProyectView from "../view/proyectview";
import { useParams } from "next/navigation";

export default function ProyectPage() {
  const params = useParams();
  const name = decodeURIComponent(params.name as string);
  const { role } = useAuth();
  if (role === "admin" || role === "user") {
    return <ProyectView name={name} />;
  } else {
    <ProyectView name={null} />;
  }
}
