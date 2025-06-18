import { SVGProps } from "react";

export type IconSvgProps = SVGProps<SVGSVGElement> & {
  size?: number;
};

export type Maestro = {
  id_maestro:number
  nombre: string;
  apellido_paterno: string | null;
  apellido_materno: string | null;
};

export type Muestra= {
    id_muestra:number
    es_actual:boolean
    fecha: string;
  };

export type Categoria= {
    id_categoria:string
    nombre: string;
  };

export type Proyecto = {
  id_proyecto: number;
  nombre: string;
  descripcion: string;
  contraseña:string;
  slogan: string;
  logo?: string | null;
  imagen?: string | null;
  categoria?: {
    id_categoria:string
    nombre: string;
  };
  muestra?: Muestra
  maestro?: Maestro
};

export type Finanzas ={
  id_finanzas:number
activos:JSON		
costos_fijos:JSON		
costos_variables:JSON		
demanda_anual:JSON		
varios:JSON		
id_proyecto:number
}
