"use client";

import { Card, CardBody, CardHeader, CardFooter } from "@heroui/card";
import { Input } from "@heroui/input";
import { Select, SelectItem } from "@heroui/select";
import { Button } from "@heroui/button";
import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

interface props{
name:string| null
}

export default function ProyectView({name}:props) {
  const router = useRouter();
  const params = useSearchParams();
  const id = params.get("id");

  const [nombre, setNombre] = useState("");
  const [descripcion, setDescripcion] = useState("");
  const [logo, setLogo] = useState<File | null>(null);
  const [imagen, setImagen] = useState<File | null>(null);
  const [alumnos, setAlumnos] = useState(
    Array(6).fill({
      id: "",
      nombre: "",
      apellido_paterno: "",
      apellido_materno: "",
      sexo: "",
    })
  );

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
        // INSERTAR proyecto
        const { data, error } = await supabase
          .from("proyectos")
          .insert({
            nombre,
            descripcion,
            logo: logoUrl,
            imagen: imagenUrl,
            id_profesor: Number(profesorSeleccionado),
            id_muestra: Number(muestraSeleccionada),
            id_categoria: Number(categoriaSeleccionada),
          })
          .select()
          .single();

        if (error) throw error;
        proyectoId = data.id;
      } else {
        // ACTUALIZAR proyecto
        const { error } = await supabase
          .from("proyectos")
          .update({
            nombre,
            descripcion,
            logo: logoUrl,
            imagen: imagenUrl,
            id_profesor: Number(profesorSeleccionado),
            id_muestra: Number(muestraSeleccionada),
            id_categoria: Number(categoriaSeleccionada),
          })
          .eq("id", id);

        if (error) throw error;
      }

      // Insertar alumnos si es nuevo
      if (!id && proyectoId) {
        const alumnosData = alumnos.map((a) => ({
          ...a,
          id_proyecto: proyectoId,
        }));
        const { error: errorAlumnos } = await supabase
          .from("alumnos")
          .insert(alumnosData);
        if (errorAlumnos) throw errorAlumnos;
      }

      alert("Proyecto guardado correctamente");
      router.push("/proyectos");
    } catch (error) {
      alert("Error al guardar: " + (error as Error).message);
    }
  };
  const [profesores, setProfesores] = useState<
    {
      id_profesor: number;
      nombre: string;
      apellido_paterno: string;
      apellido_materno: string;
    }[]
  >([]);
  const [muestras, setMuestras] = useState<
    { id_muestra: number; es_actual: boolean; fecha: string }[]
  >([]);
  const [categorias, setCategorias] = useState<
    { id_categoria: number; nombre: string }[]
  >([]);

  // Estados para valores seleccionados
  const [profesorSeleccionado, setProfesorSeleccionado] = useState<string>("");
  const [muestraSeleccionada, setMuestraSeleccionada] = useState<string>("");
  const [categoriaSeleccionada, setCategoriaSeleccionada] =
    useState<string>("");

  useEffect(() => {
    async function cargarDatos() {
      try {
        // Profesores
        const { data: profesoresData, error: errorProf } = await supabase
          .from("profesor")
          .select("id_profesor, nombre, apellido_paterno, apellido_materno");
        if (errorProf) throw errorProf;
        if (profesoresData) setProfesores(profesoresData);

        // Muestras
        const { data: muestrasData, error: errorMuestras } = await supabase
          .from("muestra")
          .select("id_muestra, es_actual, fecha");
        if (errorMuestras) throw errorMuestras;
        if (muestrasData) setMuestras(muestrasData);

        // Categorías
        const { data: categoriasData, error: errorCat } = await supabase
          .from("categoria")
          .select("id_categoria, nombre");
        if (errorCat) throw errorCat;
        if (categoriasData) setCategorias(categoriasData);
      } catch (error) {
        alert("Error cargando datos: " + (error as Error).message);
      }
    }

    cargarDatos();
  }, []);

  return (
    <section
      className="p-4 max-w-3xl mx-auto space-y-6"
      style={{
        maxHeight: "100vh", // máximo el alto de la ventana
        overflowY: "auto", // scroll vertical si excede alto
      }}
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
            selectedKeys={profesorSeleccionado}
            onSelectionChange={(value) =>
              setProfesorSeleccionado(String(value))
            }
          >
            {profesores.map((prof) => (
              <SelectItem key={prof.id_profesor}>
                {`${prof.nombre} ${prof.apellido_paterno} ${prof.apellido_materno}`}
              </SelectItem>
            ))}
          </Select>

          <Select
            label="Muestra"
            selectedKeys={muestraSeleccionada}
            onSelectionChange={(value) => setMuestraSeleccionada(String(value))}
          >
            {muestras.map((muestra) => (
              <SelectItem key={muestra.id_muestra}>
                {`${muestra.fecha} ${muestra.es_actual ? "(Actual)" : ""}`}
              </SelectItem>
            ))}
          </Select>

          <Select
            label="Categoría"
            selectedKeys={categoriaSeleccionada}
            onSelectionChange={(value) =>
              setCategoriaSeleccionada(String(value))
            }
          >
            {categorias.map((cat) => (
              <SelectItem key={cat.id_categoria}>{cat.nombre}</SelectItem>
            ))}
          </Select>

          {alumnos.map((alumno, index) => (
            <div key={index} className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Input
                label="Matrícula"
                value={alumno.id}
                onChange={(e) =>
                  handleAlumnoChange(index, "id", e.target.value)
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
                label="Sexo"
                selectedKeys={alumno.sexo}
                onSelectionChange={(value) =>
                  handleAlumnoChange(index, "sexo", String(value))
                }
              >
                <SelectItem key="Masculino">Masculino</SelectItem>
                <SelectItem key="Femenino">Femenino</SelectItem>
              </Select>
            </div>
          ))}
        </CardBody>
      </Card>
    </section>
  );
}
