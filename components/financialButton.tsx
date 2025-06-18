import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@heroui/button";
import { useRouter } from "next/navigation";
import React from "react";

export default function FinancialButton(){
    const user =useAuth()
    const router=useRouter()
    return(
    <Button 
    color="primary"
    onPress={()=>{
        router.push(`/Financial/${user.user}`)
    }}
    >
                    Proyeccion Financiera
                </Button>
    )
}