import React from "react";
import { Card,CardBody } from "@heroui/card";
import { Divider } from "@heroui/divider";
import { Button } from "@heroui/button";
import { useRouter } from "next/navigation";
import FinancialButton from "@/components/financialButton";

export default function AssetGuest(){
    const router=useRouter()
    const name=null
    return(
        <Card className="shadow-md rounded-[28px] w-full">
            <CardBody className="flex flex-col gap-3">
                <Button 
                color="primary"
                onPress={()=>{
                    router.push(`/proyect`)
                }}>
                    Agregar Proyecto
                </Button>
                <Divider/>
                <FinancialButton/>
            </CardBody>
        </Card>
    )
}