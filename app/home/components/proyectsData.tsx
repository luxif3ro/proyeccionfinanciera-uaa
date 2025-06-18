"use client";

import {
  Table,
  TableBody,
  TableCell,
  TableColumn,
  TableHeader,
  TableRow,
} from "@heroui/table";
import { Button } from "@heroui/button";
import { ChevronRight } from "@/components/icons";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import { Proyecto } from "@/types";

type ProyectsDataProps = {
  search: string;
  category: string;
  keywords: string[];
};

export default function ProyectsData({
  search,
  category,
  keywords,
}: ProyectsDataProps) {
  const router = useRouter();
  const { role } = useAuth();
  const [proyectos, setProyectos] = useState<Proyecto[]>([]);

  useEffect(() => {
    let channel = supabase.channel("public:proyecto");

    const fetchData = async () => {
      let query = supabase
        .from("proyecto")
        .select(
          `
        *,
        categoria:categoria(id_categoria, nombre),
        muestra:muestra(id_muestra, es_actual, fecha),
        maestro:maestro(id_maestro, nombre, apellido_paterno, apellido_materno)
      `
        )
        .neq("tipo", "ADMIN");

      if (search) {
        query = query.ilike("nombre", `%${search}%`);
      }

      if (category !== "all") {
        query = query.eq("id_categoria", category);
      }

      const { data, error } = await query;

      if (error) {
        console.error("Error al obtener proyectos:", error);
        setProyectos([]);
      } else {
        const filtrados = (data || []).filter(
          (p) =>
            keywords.length === 0 ||
            keywords.every((kw) =>
              p.descripcion?.toLowerCase().includes(kw.toLowerCase())
            )
        );
        setProyectos(filtrados);
      }
    };

    // Ejecuta fetch inicial
    fetchData();

    // Suscribirse a los cambios en la tabla 'proyecto'
    channel.on(
      "postgres_changes",
      { event: "*", schema: "public", table: "proyecto" },
      (payload: any) => {
        console.log("Evento realtime:", payload);
        fetchData();
      }
    );

    channel.subscribe();

    // Cleanup al desmontar o cuando cambian dependencias
    return () => {
      channel.unsubscribe();
    };
  }, [search, category, keywords]);

  return (
    <div className="w-full overflow-x-auto">
      <Table aria-label="Proyectos filtrados" className="w-full" removeWrapper>
        <TableHeader>
          <TableColumn>Nombre</TableColumn>
          <TableColumn>Profesor</TableColumn>
          <TableColumn>Categoría</TableColumn>
          <TableColumn>Muestra</TableColumn>
          <TableColumn>{[]}</TableColumn>
        </TableHeader>
        <TableBody emptyContent="No hay proyectos que coincidan">
          {proyectos.map((proyect) => {
            const maestro = proyect.maestro;
            const nombreCompletoMaestro = maestro
              ? [
                  maestro.nombre,
                  maestro.apellido_paterno,
                  maestro.apellido_materno,
                ]
                  .filter(Boolean)
                  .join(" ")
              : proyect.maestro?.nombre;

            return (
              <TableRow key={proyect.id_proyecto}>
                <TableCell>{proyect.nombre}</TableCell>
                <TableCell>{nombreCompletoMaestro}</TableCell>
                <TableCell>
                  {proyect.categoria?.nombre || proyect.categoria?.id_categoria}
                </TableCell>
                <TableCell>
                  {proyect.muestra?.fecha || proyect.muestra?.id_muestra}
                </TableCell>
                <TableCell>
                  <Button
                    size="sm"
                    radius="full"
                    isIconOnly
                    className="bg-transparent"
                    onPress={() => {
                      const nombreURL = encodeURIComponent(proyect.nombre);
                      if (role === "admin") {
                        router.push(`/proyect/${nombreURL}`);
                      } else {
                        router.push(`/proyect-view/${nombreURL}`);
                      }
                    }}
                  >
                    <ChevronRight />
                  </Button>
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </div>
  );
}
