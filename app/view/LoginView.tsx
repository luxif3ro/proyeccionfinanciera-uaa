"use client";
import { UserIcon } from "@/components/icons";
import InputPassword from "@/components/InputPassword";
import { Avatar } from "@heroui/avatar";
import { Button } from "@heroui/button";
import { Card, CardBody } from "@heroui/card";
import { Input } from "@heroui/input";
import Link from "next/link";
import React, { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useRouter } from "next/navigation";
import { verifyProyectoLogin } from "@/lib/actions/auth";

export default function LoginView() {
  const { login } = useAuth();
  const [password, setPassword] = useState("");
  const [user, setUser] = useState<string>("");
  const router = useRouter();

  return (
    <section className="w-full flex flex-col items-center justify-center px-4 py-8 md:py-10">
      <Card
        style={{ boxShadow: "0px 4px 4px rgba(0, 0, 0, 0.35)" }}
        className="w-full max-w-md md:max-w-lg rounded-[28px] px-6 py-10"
      >
        <CardBody className="flex flex-col items-center justify-center gap-9">
          <Avatar className="w-[120px] h-[120px] text-large" />
          <Input
            label="Nombre del Proyecto"
            labelPlacement="outside"
            placeholder="Ingrese el nombre de su proyecto"
            variant="bordered"
            value={user}
            onValueChange={setUser}
            startContent={
              <UserIcon className="text-2xl text-default-400 pointer-events-none flex-shrink-0" />
            }
          />
          <InputPassword value={password} onChange={setPassword} />
          <Link href="/home">
            <Button
              variant="shadow"
              className="bg-blue-400 w-[160px] shadow-blue-300 shadow-md text-white"
              onPress={() => login("Invitado", "guest")}
            >
              Ingresar como invitado
            </Button>
          </Link>
          <Button
            variant="shadow"
            color="primary"
            className="w-[160px]"
            onPress={async () => {
              const result = await verifyProyectoLogin(user, password);

              if (result.success) {
                login(user, result.rol ?? "guest"); // usa el tipo de proyecto como rol
                console.log("Proyecto autenticado:", result.data);
                router.push("/home");
              } else {
                alert(result.message);
              }
            }}
          >
            Ingresar
          </Button>
        </CardBody>
      </Card>
    </section>
  );
}
