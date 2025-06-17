"use client";

import { Button } from "@heroui/button";
import { Card, CardBody, CardHeader } from "@heroui/card";
import { Chip } from "@heroui/chip";
import { Divider } from "@heroui/divider";
import { Input } from "@heroui/input";
import { Select, SelectItem } from "@heroui/select";
import React, { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";

type Categoria = {
  id_categoria: string;
  nombre: string;
};

type Props = {
  selectedCategory: string;
  onCategoryChange: (category: string) => void;
  keywords: string[];
  setKeywords: React.Dispatch<React.SetStateAction<string[]>>;
};

export default function FiltrerCard({
  selectedCategory,
  onCategoryChange,
  keywords,
  setKeywords,
}: Props) {
  const [word, setWord] = React.useState<string>("");

  const [categories, setCategories] = useState<Categoria[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Traer categorías desde Supabase
  useEffect(() => {
    const fetchCategories = async () => {
      setLoading(true);
      setError(null);
      const { data, error } = await supabase
        .from("categoria")
        .select("id_categoria,nombre")
        .order("nombre", { ascending: true });

      if (error) {
        setError("Error al cargar categorías");
        setCategories([]);
      } else {
        setCategories(data || []);
      }
      setLoading(false);
    };

    fetchCategories();
  }, []);

  const uniqueCategories = [
    { key: "all", label: "Todas" },
    ...categories.map((cat) => ({
      key: cat.id_categoria,
      label: cat.nombre,
    })),
  ];

  const addKeyword = () => {
    if (word.trim() !== "") {
      setKeywords((prev) => [...prev, word.trim()]);
      setWord("");
    }
  };

  const removeKeyword = (keywordToRemove: string) => {
    setKeywords((prev) => prev.filter((kw) => kw !== keywordToRemove));
  };

  return (
    <Card className="shadow-md rounded-[28px] w-full">
      <CardHeader>
        <h1>Filtrar por ...</h1>
      </CardHeader>
      <CardBody className="flex flex-col gap-3">
        <Divider />
        <h2>Categorías</h2>
        {loading ? (
          <p>Cargando categorías...</p>
        ) : error ? (
          <p className="text-red-500">{error}</p>
        ) : (
          <Select
            label="Categoría"
            placeholder="Seleccione Categoría"
            labelPlacement="outside-left"
            selectedKeys={selectedCategory ? [selectedCategory] : []}
            onSelectionChange={(key) => {
              const selected = Array.from(key)[0];
              onCategoryChange(selected as string);
            }}
          >
            {uniqueCategories.map((category) => (
              <SelectItem key={category.key}>{category.label}</SelectItem>
            ))}
          </Select>
        )}

        <Divider />
        <h2>Palabras Clave</h2>
        <div className="flex gap-2">
          <Input
            label="Palabra Clave"
            labelPlacement="outside-left"
            placeholder="Escribe la Palabra Clave"
            variant="underlined"
            value={word}
            onValueChange={setWord}
            className="flex-1"
          />
          <Button onPress={addKeyword}>Agregar</Button>
        </div>

        <div className="flex flex-wrap gap-2 mt-2">
          {keywords.map((keyword) => (
            <Chip
              key={keyword}
              variant="bordered"
              onClose={() => removeKeyword(keyword)}
            >
              {keyword}
            </Chip>
          ))}
        </div>
      </CardBody>
    </Card>
  );
}
