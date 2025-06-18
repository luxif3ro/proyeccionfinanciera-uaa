"use client";
import React, { useEffect, useState } from "react";
import { Card, CardBody, CardFooter, CardHeader } from "@heroui/card";
import { Button } from "@heroui/button";
import { ArrowLeft } from "@/components/icons";
import { useRouter, useParams } from "next/navigation";
import { Image } from "@heroui/image";
import { Avatar } from "@heroui/avatar";
import { supabase } from "@/lib/supabaseClient";
import { Proyecto } from "@/types";

export default function ProyectViewPage() {
  const router = useRouter();
  const params = useParams();
  const Name = decodeURIComponent(params.name as string);

  const [proyecto, setProyecto] = useState<Proyecto | null>(null);

  useEffect(() => {
    if (!Name) return;

    const fetchProyecto = async () => {
      const { data, error } = await supabase
        .from("proyecto")
        .select(
          `
        *,
        categoria(id_categoria, nombre),
        muestra(id_muestra, fecha),
        maestro(id_maestro, nombre, apellido_paterno, apellido_materno)
      `
        )
        .eq("nombre", Name)
        .neq("tipo", "ADMIN")
        .single();

      if (error) {
        console.error("Error al obtener el proyecto:", error);
      } else {
        const logoUrl = data.logo
          ? supabase.storage.from("logos").getPublicUrl(data.logo).data
              .publicUrl
          : null;

        const imageUrl = data.imagen
          ? supabase.storage.from("imagenes").getPublicUrl(data.imagen).data
              .publicUrl
          : null;

        setProyecto({
          ...data,
          logo: logoUrl,
          imagen: imageUrl,
        });
      }
    };

    fetchProyecto();

    // Crear canal para suscripción realtime
    const channel = supabase.channel(`realtime-proyecto-${Name}`);

    channel.on(
      "postgres_changes",
      {
        event: "*",
        schema: "public",
        table: "proyecto",
        filter: `nombre=eq.${Name}`,
      },
      (payload: any) => {
        console.log("Proyecto actualizado en realtime:", payload);
        fetchProyecto();
      }
    );

    channel.subscribe();

    return () => {
      channel.unsubscribe();
    };
  }, [Name]);

  const nombreCompletoMaestro = [
    proyecto?.maestro?.nombre,
    proyecto?.maestro?.apellido_paterno,
    proyecto?.maestro?.apellido_materno,
  ]
    .filter(Boolean)
    .join(" ");
  return (
    <section className="flex md:w-2/5 justify-center content-center">
      <Card className="w-full flex">
        <CardHeader>
          <Button
            className="max-w-8 bg-transparent"
            onPress={() => router.back()}
          >
            <ArrowLeft />
          </Button>
        </CardHeader>
        <CardBody className="flex flex-col items-center content-center gap-3">
          <section className="flex flex-col items-center">
            <Avatar
              className="w-20 h-20 text-large"
              src={
                proyecto?.logo ?? "https://heroui.com/images/default-avatar.png"
              }
            />
            <p className="text-primary-400">Nombre:</p>
            {proyecto?.nombre}

            <p className="text-primary-400">Maestro Asesor:</p>
            {nombreCompletoMaestro || "No disponible"}

            <p className="text-primary-400">Categoría:</p>
            {proyecto?.categoria?.nombre || "Sin categoría"}

            <p className="text-primary-400">Año de la muestra:</p>
            {proyecto?.muestra?.fecha || "Sin año"}

            <p className="text-primary-400">Descripción:</p>
            {proyecto?.descripcion}

            <p className="text-primary-400">Eslogan:</p>
            {proyecto?.slogan}
          </section>

          <Image
            alt="Imagen del proyecto"
            src={
              proyecto?.imagen ??
              "https://heroui.com/images/hero-card-complete.jpeg"
            }
            className="md:w-[300px] w-full"
          />
        </CardBody>
        <CardFooter />
      </Card>
    </section>
  );
}
