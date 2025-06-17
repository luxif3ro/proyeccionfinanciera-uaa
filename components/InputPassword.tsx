"use client";

import React from "react";
import { Input } from "@heroui/input";
import { EyeFilledIcon, EyeSlashFilledIcon, LockIcon } from "@/components/icons";

interface InputPasswordProps {
  value: string;
  onChange: (value: string) => void;
}

export default function InputPassword({ value, onChange }: InputPasswordProps) {
  const [isVisible, setIsVisible] = React.useState(false);

  const toggleVisibility = () => setIsVisible(!isVisible);

  return (
    <div className="w-full">
      <Input
        value={value}
        onValueChange={onChange}
        endContent={
          <button
            aria-label="toggle password visibility"
            className="focus:outline-none"
            type="button"
            onClick={toggleVisibility}
          >
            {isVisible ? (
              <EyeSlashFilledIcon className="text-2xl text-default-400 pointer-events-none" />
            ) : (
              <EyeFilledIcon className="text-2xl text-default-400 pointer-events-none" />
            )}
          </button>
        }
        startContent={<LockIcon />}
        label="Contraseña"
        labelPlacement="outside"
        placeholder="Ingrese su contraseña"
        type={isVisible ? "text" : "password"}
        variant="bordered"
        className="w-full"
      />
    </div>
  );
}
