import FinancialButton from "@/components/financialButton";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@heroui/button";
import { Card, CardBody } from "@heroui/card";
import { Divider } from "@heroui/divider";
import { useRouter } from "next/navigation";
import React from "react";

export default function AssetsUser() {
    const {user} = useAuth()
    const router=useRouter()
    return (
        <Card className="shadow-md rounded-[28px] w-full">
            <CardBody className="flex flex-col gap-3">
                <Button
                color="primary"
                onPress={()=>{
                    router.push(`/proyect/${encodeURIComponent(String(user))}`)
                }}
                >Editar Proyecto</Button>
                <Divider />
                <FinancialButton/>
            </CardBody>
        </Card>
    )
}