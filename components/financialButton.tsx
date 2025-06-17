import { Button } from "@heroui/button";
import { useRouter } from "next/navigation";
import React from "react";

export default function FinancialButton(){
    const router=useRouter()
    return(
    <Button 
    color="primary"
    onPress={()=>{
        router.push("/Financial")
    }}
    >
                    Proyeccion Financiera
                </Button>
    )
}