"use client";
import { Input } from "@heroui/input";
import React from "react";
import { SearchIcon } from "@/components/icons";

type InputSearchProps = {
    value: string;
    onChange: (newValue: string) => void;
  };
  
  export default function InputSearch({ value, onChange }: InputSearchProps) {
    return (
      <Input
        type="text"
        value={value}
        onValueChange={onChange}
        endContent={
          <button
            aria-label="toggle search"
            className="focus:outline-none"
            type="button"
            onClick={() => alert("Se está buscando el proyecto: " + value)}
          >
            <SearchIcon />
          </button>
        }
        placeholder="Buscar..."
        variant="bordered"
      />
    );
  }
  