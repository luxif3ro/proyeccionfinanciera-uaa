"use client";

import { Card, CardBody, CardFooter, CardHeader } from "@heroui/card";
import { Input } from "@heroui/input";
import { Select, SelectItem } from "@heroui/select";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabaseClient";
import { Maestro, Proyecto } from "@/types";
import { Button } from "@heroui/button";
import { useAuth } from "@/contexts/AuthContext";
import FinancialButton from "@/components/financialButton";

export default function ProyectView({ name }: { name: string }) {
  const router = useRouter();
  const id = name;
  const role = useAuth();

  const [nombre, setNombre] = useState("");
  const [descripcion, setDescripcion] = useState("");
  const [constrasena, setContrasena] = useState("");
  const [logo, setLogo] = useState<File | null>(null);
  const [imagen, setImagen] = useState<File | null>(null);
  const [alumnos, setAlumnos] = useState(
    Array(6).fill({
      id_alumno: "",
      nombre: "",
      apellido_paterno: "",
      apellido_materno: "",
      genero: "",
    })
  );

  const [profesores, setProfesores] = useState<Maestro[]>([]);
  const [muestras, setMuestras] = useState<
    { id_muestra: number; es_actual: boolean; fecha: string }[]
  >([]);
  const [categorias, setCategorias] = useState<
    { id_categoria: number; nombre: string }[]
  >([]);

  const [profesorSeleccionado, setProfesorSeleccionado] = useState<string>("");
  const [muestraSeleccionada, setMuestraSeleccionada] = useState<string>("");
  const [categoriaSeleccionada, setCategoriaSeleccionada] =
    useState<string>("");

  const [proyecto, setProyecto] = useState<Proyecto | null>(null);

  const handleAlumnoChange = (index: number, field: string, value: string) => {
    const updated = [...alumnos];
    updated[index] = { ...updated[index], [field]: value };
    setAlumnos(updated);
  };

  const subirArchivo = async (archivo: File, bucket: string) => {
    const nombreArchivo = `${Date.now()}-${archivo.name}`;
    const { error } = await supabase.storage
      .from(bucket)
      .upload(nombreArchivo, archivo, {
        cacheControl: "3600",
        upsert: false,
      });
    if (error) throw error;
    const { data } = supabase.storage.from(bucket).getPublicUrl(nombreArchivo);
    return data.publicUrl;
  };

  const handleGuardar = async () => {
    try {
      let logoUrl = null;
      let imagenUrl = null;
      if (logo) logoUrl = await subirArchivo(logo, "logos");
      if (imagen) imagenUrl = await subirArchivo(imagen, "imagenes");

      let proyectoId = id;

      if (!id) {
        const { data, error } = await supabase
          .from("proyecto")
          .insert({
            nombre,
            descripcion,
            logo: logoUrl,
            imagen: imagenUrl,
            tipo: "USER",
            id_maestro: Number(profesorSeleccionado),
            id_muestra: Number(muestraSeleccionada),
            id_categoria: Number(categoriaSeleccionada),
          })
          .select()
          .single();

        if (error) throw error;
        proyectoId = data.id_proyecto;

        const alumnosData = alumnos
          .filter((a) => a.nombre && a.apellido_paterno && a.id_alumno)
          .map((a) => ({
            ...a,
            id_proyecto: Number(proyectoId),
          }));

        const { error: errorAlumnos } = await supabase
          .from("alumno")
          .insert(alumnosData)
          .select("id_alumno");
        if (errorAlumnos) throw errorAlumnos;
      } else {
        const { error } = await supabase
          .from("proyecto")
          .update({
            nombre,
            descripcion,
            logo: logoUrl,
            imagen: imagenUrl,
            id_maestro: Number(profesorSeleccionado),
            id_muestra: Number(muestraSeleccionada),
            id_categoria: Number(categoriaSeleccionada),
          })
          .eq("nombre", id);
        if (error) throw error;

        for (const alumno of alumnos) {
          if (!alumno.id_alumno) continue;
          const { error: errorUpdate } = await supabase
            .from("alumno")
            .update({
              nombre: alumno.nombre,
              apellido_paterno: alumno.apellido_paterno,
              apellido_materno: alumno.apellido_materno,
              genero: alumno.genero,
            })
            .eq("id_alumno", alumno.id_alumno);
          if (errorUpdate) throw errorUpdate;
        }
      }

      alert("Proyecto guardado correctamente");
    } catch (error) {
      alert("Error al guardar: " + (error as Error).message);
    }
  };

  useEffect(() => {
    async function cargarDatos() {
      try {
        const { data: profesoresData } = await supabase
          .from("maestro")
          .select("id_maestro, nombre, apellido_paterno, apellido_materno");
        if (profesoresData) setProfesores(profesoresData);

        const { data: muestrasData } = await supabase
          .from("muestra")
          .select("id_muestra, es_actual, fecha");
        if (muestrasData) setMuestras(muestrasData);

        const { data: categoriasData } = await supabase
          .from("categoria")
          .select("id_categoria, nombre");
        if (categoriasData) setCategorias(categoriasData);
      } catch (error) {
        console.error("Error cargando datos:", error);
        alert("Error cargando datos: " + (error as Error).message);
      }
    }

    cargarDatos();
  }, []);

  useEffect(() => {
    if (!id) return;

    let channel = supabase.channel(`realtime-proyecto-${id}`);

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
        .eq("nombre", id)
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

        const { data: alumnosData } = await supabase
          .from("alumno")
          .select("id_alumno, nombre, apellido_paterno, apellido_materno, genero")
          .eq("id_proyecto", data.id);

        if (alumnosData) {
          setAlumnos([
            ...alumnosData,
            ...Array(Math.max(0, 6 - alumnosData.length)).fill({
              id_alumno: "",
              nombre: "",
              apellido_paterno: "",
              apellido_materno: "",
              genero: "",
            }),
          ]);
        }
      }
    };

    fetchProyecto();

    channel.on(
      "postgres_changes",
      {
        event: "*",
        schema: "public",
        table: "proyecto",
        filter: `nombre=eq.${id}`,
      },
      () => {
        fetchProyecto();
      }
    );

    channel.subscribe();
    return () => {
      channel.unsubscribe();
    };
  }, [id]);

  useEffect(() => {
    if (proyecto) {
      setNombre(proyecto.nombre);
      setDescripcion(proyecto.descripcion);
      setProfesorSeleccionado(String(proyecto.maestro?.id_maestro));
      setMuestraSeleccionada(String(proyecto.muestra?.id_muestra));
      setCategoriaSeleccionada(String(proyecto.categoria?.id_categoria));
    }
  }, [proyecto]);

  return (
    <section
      className="p-4 max-w-3xl mx-auto space-y-6"
      style={{ maxHeight: "100vh", overflowY: "auto" }}
    >
      <Card>
        <CardHeader>Información del Proyecto</CardHeader>
        <CardBody className="space-y-4">
          <Input
            label="Nombre del Proyecto"
            value={nombre}
            onChange={(e) => setNombre(e.target.value)}
          />
          <Input
            label="Descripción"
            value={descripcion}
            onChange={(e) => setDescripcion(e.target.value)}
          />
          <Input
            label="Contraseña"
            value={constrasena}
            onChange={(e) => setContrasena(e.target.value)}
          />
          <Input
            type="file"
            label="Logo"
            onChange={(e) => setLogo(e.target.files?.[0] ?? null)}
          />
          <Input
            type="file"
            label="Imagen"
            onChange={(e) => setImagen(e.target.files?.[0] ?? null)}
          />

          <Select
            label="Profesor"
            selectedKeys={new Set([profesorSeleccionado])}
            onSelectionChange={(keys) =>
              setProfesorSeleccionado(String(Array.from(keys)[0]))
            }
          >
            {profesores.map((prof) => (
              <SelectItem key={String(prof.id_maestro)}>
                {`${prof.nombre ?? ""} ${prof.apellido_paterno ?? ""} ${
                  prof.apellido_materno ?? ""
                }`}
              </SelectItem>
            ))}
          </Select>

          <Select
            label="Muestra"
            selectedKeys={new Set([muestraSeleccionada])}
            onSelectionChange={(keys) =>
              setMuestraSeleccionada(String(Array.from(keys)[0]))
            }
          >
            {muestras.map((muestra) => (
              <SelectItem key={String(muestra.id_muestra)}>
                {`${muestra.fecha} ${muestra.es_actual ? "(Actual)" : ""}`}
              </SelectItem>
            ))}
          </Select>

          <Select
            label="Categoría"
            selectedKeys={new Set([categoriaSeleccionada])}
            onSelectionChange={(keys) =>
              setCategoriaSeleccionada(String(Array.from(keys)[0]))
            }
          >
            {categorias.map((cat) => (
              <SelectItem key={String(cat.id_categoria)}>
                {cat.nombre}
              </SelectItem>
            ))}
          </Select>

          {alumnos.map((alumno, index) => (
            <div key={index} className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <h3 className="text-lg font-semibold">Alumno {index + 1}</h3>
              <Input
                label="Matrícula"
                value={alumno.id_alumno}
                onChange={(e) =>
                  handleAlumnoChange(index, "id_alumno", e.target.value)
                }
              />
              <Input
                label="Nombre"
                value={alumno.nombre}
                onChange={(e) =>
                  handleAlumnoChange(index, "nombre", e.target.value)
                }
              />
              <Input
                label="Apellido Paterno"
                value={alumno.apellido_paterno}
                onChange={(e) =>
                  handleAlumnoChange(index, "apellido_paterno", e.target.value)
                }
              />
              <Input
                label="Apellido Materno"
                value={alumno.apellido_materno}
                onChange={(e) =>
                  handleAlumnoChange(index, "apellido_materno", e.target.value)
                }
              />
              <Select
                label="Género"
                selectedKeys={new Set([alumno.genero])}
                onSelectionChange={(keys) =>
                  handleAlumnoChange(index, "genero", String(Array.from(keys)[0]))
                }
              >
                <SelectItem key="Masculino">Masculino</SelectItem>
                <SelectItem key="Femenino">Femenino</SelectItem>
              </Select>
            </div>
          ))}
        </CardBody>
        <CardFooter className="flex">
          {role.role === "admin" && <FinancialButton />}
          <Button
            onPress={async () => {
              await handleGuardar();
              router.push("/home");
            }}
          >
            Guardar
          </Button>
          <Button onPress={() => console.log(alumnos)}>alumnos</Button>
        </CardFooter>
      </Card>
    </section>
  );
}
