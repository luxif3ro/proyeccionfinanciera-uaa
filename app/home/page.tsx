"use client";

import { Card, CardBody, CardFooter, CardHeader } from "@heroui/card";
import InputSearch from "./components/searchInput";
import FiltrerCard from "./components/filtrerCard";
import ProyectsData from "./components/proyectsData";
import AssetsUser from "./components/AssetUser";
import { useAuth } from "@/contexts/AuthContext";
import AssetGuest from "./components/AssetGuest";
import AssetAdmin from "./components/AssetAdimn";
import React from "react";

export default function SearchPage() {
  const { role } = useAuth();
  const [search, setSearch] = React.useState<string>("");
  const [category, setCategory] = React.useState<string>("all");
  const [keywords, setKeywords] = React.useState<string[]>([]);

  const renderRoleComponent = () => {
    if (role === "user") return <AssetsUser />;
    if (role === "admin") return <AssetAdmin />;
    return <AssetGuest />;
  };

  return (
    <section className="flex flex-col md:flex-row gap-6 md:gap-14 px-6 md:px-[58px] py-5 w-full h-full">
      <section className="flex flex-col gap-6 w-full md:w-[300px] order-1 md:order-2">
        <FiltrerCard
          selectedCategory={category}
          onCategoryChange={setCategory}
          keywords={keywords}
          setKeywords={setKeywords}
        />
        {renderRoleComponent()}
      </section>

      <Card className="shadow-xl rounded-[28px] h-full w-full md:flex-1 order-2 md:order-1 h-m">
        <CardHeader className="w-full h-auto p-6 md:p-14 flex justify-center items-start">
          <InputSearch value={search} onChange={setSearch} />
        </CardHeader>
        <CardBody>
          <ProyectsData
            search={search}
            category={category}
            keywords={keywords}
          />
        </CardBody>
        <CardFooter />
      </Card>
    </section>
  );
}
