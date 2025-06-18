"use client";
import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabaseClient";
import { Pie, Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  BarElement,
} from "chart.js";
import { Card, CardBody, CardHeader } from "@heroui/card";
import { Select, SelectItem } from "@heroui/select";
import { Spinner } from "@heroui/spinner";

ChartJS.register(
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  BarElement
);

type Muestra = {
  id_muestra: number;
  fecha: string;
  es_actual: boolean;
};

type ProyectoStats = {
  totalProyectos: number;
  hombres: number;
  mujeres: number;
  categorias: Record<string, number>;
};

export default function AdminDashboard() {
  const [muestras, setMuestras] = useState<Muestra[]>([]);
  const [muestraSeleccionada, setMuestraSeleccionada] = useState<string>("");
  const [stats, setStats] = useState<ProyectoStats | null>(null);
  const [loading, setLoading] = useState(true);

  // Obtener todas las muestras disponibles
  useEffect(() => {
    const fetchMuestras = async () => {
      const { data, error } = await supabase
        .from("muestra")
        .select("id_muestra, fecha, es_actual")
        .order("fecha", { ascending: false });

      if (error) {
        console.error("Error fetching muestras:", error);
      } else {
        setMuestras(data || []);
        const actual = data?.find((m: Muestra) => m.es_actual);
        if (actual) {
          setMuestraSeleccionada(actual.id_muestra);
        } else if (data && data.length > 0) {
          setMuestraSeleccionada(data[0].id_muestra);
        }
      }
      setLoading(false);
    };

    fetchMuestras();
  }, []);

  // Obtener estadísticas cuando se selecciona una muestra
  useEffect(() => {
    if (muestraSeleccionada === null) return;

    const fetchStats = async () => {
      setLoading(true);

      // 1. Obtener proyectos según muestra
      const { data: proyectos, error: proyectosError } = await supabase
        .from("proyecto")
        .select("id_proyecto, id_categoria")
        .eq("id_muestra", Number(muestraSeleccionada));

      if (proyectosError) {
        console.error("Error fetching proyectos:", proyectosError);
        setLoading(false);
        return;
      }

      const proyectoIds = proyectos?.map((p) => p.id_proyecto) || [];

      // 2. Obtener alumnos que están vinculados a estos proyectos
      const { data: alumnos, error: alumnosError } = await supabase
        .from("alumno")
        .select("id_alumno, genero, id_proyecto")
        .in("id_proyecto", proyectoIds);

      if (alumnosError) {
        console.error("Error fetching alumnos:", alumnosError);
        setLoading(false);
        return;
      }

      // 3. Obtener categorías según los proyectos
      const categoriasIds =
        proyectos?.map((p) => p.id_categoria).filter((id) => id !== null) || [];
      const { data: categorias, error: categoriasError } = await supabase
        .from("categoria")
        .select("id_categoria, nombre")
        .in("id_categoria", categoriasIds);

      if (categoriasError) {
        console.error("Error fetching categorias:", categoriasError);
        setLoading(false);
        return;
      }

      // 4. Calcular estadísticas
      const hombres = alumnos?.filter((a) => a.genero === true).length || 0;
      const mujeres = alumnos?.filter((a) => a.genero === false).length || 0;

      const categoriasStats: Record<string, number> = {};
      proyectos?.forEach((p) => {
        const categoria = categorias?.find(
          (c) => c.id_categoria === p.id_categoria
        );
        if (categoria) {
          categoriasStats[categoria.nombre] =
            (categoriasStats[categoria.nombre] || 0) + 1;
        }
      });

      setStats({
        totalProyectos: proyectos?.length || 0,
        hombres,
        mujeres,
        categorias: categoriasStats,
      });
      setLoading(false);
    };

    fetchStats();
  }, [muestraSeleccionada]);

  // Datos para gráfico de género
  const genderData = {
    labels: ["Hombres", "Mujeres"],
    datasets: [
      {
        data: [stats?.hombres || 0, stats?.mujeres || 0],
        backgroundColor: ["#3b82f6", "#ec4899"],
        hoverBackgroundColor: ["#2563eb", "#db2777"],
      },
    ],
  };

  // Datos para gráfico de categorías
  const categoryData = {
    labels: stats ? Object.keys(stats.categorias) : [],
    datasets: [
      {
        data: stats ? Object.values(stats.categorias) : [],
        backgroundColor: [
          "#3b82f6",
          "#ec4899",
          "#10b981",
          "#f59e0b",
          "#6366f1",
          "#ef4444",
          "#14b8a6",
          "#f97316",
        ],
      },
    ],
  };

  return (
    <section className="p-6">
      <Card>
        <CardHeader className="flex flex-col">
          <h1 className="text-3xl font-bold mb-4">Panel de Administración</h1>
          <h2 className="text-xl font-bold">Estadísticas de Muestras</h2>
        </CardHeader>
        <CardBody className="flex flex-col gap-6">
          <div>
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
          </div>

          {loading ? (
            <div className="flex justify-center items-center h-64">
              <Spinner size="lg" color="primary" />
            </div>
          ) : stats ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <h3 className="text-lg font-semibold">
                    Distribución por Género
                  </h3>
                </CardHeader>
                <CardBody>
                  <div className="h-64">
                    <Pie
                      data={genderData}
                      options={{
                        responsive: true,
                        maintainAspectRatio: false,
                        plugins: {
                          legend: {
                            position: "bottom",
                          },
                          tooltip: {
                            callbacks: {
                              label: (context) => {
                                const total = (
                                  context.dataset.data as number[]
                                ).reduce((a, b) => a + b, 0);
                                const value = context.raw as number;
                                const percentage = Math.round(
                                  (value / total) * 100
                                );
                                return `${context.label}: ${value} (${percentage}%)`;
                              },
                            },
                          },
                        },
                      }}
                    />
                  </div>
                  <p className="mt-2 text-center text-gray-600">
                    Total participantes: {stats.hombres + stats.mujeres}
                  </p>
                </CardBody>
              </Card>

              <Card>
                <CardHeader>
                  <h3 className="text-lg font-semibold">
                    Distribución por Categoría
                  </h3>
                </CardHeader>
                <CardBody>
                  <div className="h-64">
                    <Bar
                      data={categoryData}
                      options={{
                        responsive: true,
                        maintainAspectRatio: false,
                        plugins: {
                          legend: {
                            display: false,
                          },
                          tooltip: {
                            callbacks: {
                              label: (context) => {
                                const total = (
                                  context.dataset.data as number[]
                                ).reduce((a, b) => a + b, 0);
                                const value = context.raw as number;
                                const percentage = Math.round(
                                  (value / total) * 100
                                );
                                return `${context.label}: ${value} (${percentage}%)`;
                              },
                            },
                          },
                        },
                        scales: {
                          y: {
                            beginAtZero: true,
                            ticks: {
                              stepSize: 1,
                            },
                          },
                        },
                      }}
                    />
                  </div>
                  <p className="mt-2 text-center text-gray-600">
                    Total proyectos: {stats.totalProyectos}
                  </p>
                </CardBody>
              </Card>
            </div>
          ) : (
            <p className="text-center text-gray-600">
              No hay datos disponibles para la muestra seleccionada.
            </p>
          )}
        </CardBody>
      </Card>
    </section>
  );
}
