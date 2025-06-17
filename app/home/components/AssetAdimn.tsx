import FinancialButton from "@/components/financialButton";
import { Button } from "@heroui/button";
import { Card, CardBody } from "@heroui/card";
import { Divider } from "@heroui/divider";
import { useRouter } from "next/navigation";
import React from "react";

export default function AssetAdmin() {
    const router = useRouter()
    return (
        <Card className="shadow-md rounded-[28px] w-full">
            <CardBody className="flex flex-col gap-3">
                <Button color="primary" onPress={()=>{
                    router.push("/Admin")
                }}>
                    Panel de administrador
                </Button>
                <Divider />
                <FinancialButton />
            </CardBody>
        </Card>
    )
}