"use client";
import { Button } from "@heroui/button";
import { Card, CardBody, CardFooter, CardHeader } from "@heroui/card";
import { Input } from "@heroui/input";
import { Radio, RadioGroup } from "@heroui/radio";
import { Select, SelectItem } from "@heroui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableColumn,
  TableHeader,
  TableRow,
} from "@heroui/table";
import React, { useState, useMemo, useEffect } from "react";

interface IndicadorFinanciero {
  tipo: "V.A.N" | "T.I.R" | "B/C" | "P.R.I";
  valor: string;
  viabilidad: "viable" | "no viable";
  criterio: string;
}

interface varios {
  concepto: string;
  valor: number | "";
}

const TipoDeActivo = [
  "MAQUINAS Y HERRAMIENTAS",
  "TERRENOS Y EDIFICIOS",
  "EQUIPO DE TRANSPORTE",
  "MOBILIARIO DE OFICINA",
  "EQUIPO DE COMPUTO",
  "GASTOS DE INSTALACION",
];

interface Activos {
  concepto: string;
  cantidad: number;
  precioUnitario: number;
  tipo: string;
  seTiene: number | "";
  propia: number | "";
}

interface costo {
  concepto: string;
  monto: number | string;
}

let varios = [
  {
    concepto: "TREMA",
    valor: 0,
  },
  {
    concepto: "plazoCredito",
    valor: 0,
  },
  {
    concepto: "TMP",
    valor: 0,
  },
  {
    concepto: "porcentajeMinoristas",
    valor: 0,
  },
  {
    concepto: "produccionEsperada",
    valor: 0,
  },
  {
    concepto: "porcentajeGananciaFinal",
    valor: 0,
  },
];

interface Mes {
  mes: string;
  demanda: string;
}

export default function FinancialPage() {
  //Necesarios para actualizar activos --Inicio
  const [listaActivos, setListaActivos] = useState<Activos[]>([]);
  const [activoConcepto, setActivoConcepto] = React.useState<string>("");
  const [activoPrecioUnitario, setActivoPrecioUnitario] =
    React.useState<string>("");
  const [activoCantidad, setActivoCantidad] = React.useState<string>("");
  const [activoTipoActivo, setActivoTipoActivo] = React.useState<string>("");
  const [activoSeTiene, setActivoSeTiene] = React.useState<string>("");
  const [activoPropia, setActivoPropia] = React.useState<string>("");

  //Necesarios para actualizar activos --Fin

  //Necesarios para actualizar indicadores --Inicio
  const [indicadores, setIndicadores] = React.useState<IndicadorFinanciero[]>([
    {
      tipo: "V.A.N",
      valor: "15000",
      viabilidad: "viable",
      criterio: "Mayor o igual a 0",
    },
    {
      tipo: "T.I.R",
      valor: "18%",
      viabilidad: "no viable",
      criterio: "Mayor que TREMA",
    },
    {
      tipo: "B/C",
      valor: "1.5",
      viabilidad: "viable",
      criterio: "Mayor a 1",
    },
    {
      tipo: "P.R.I",
      valor: "3 años",
      viabilidad: "no viable",
      criterio: "El menor tiempo posible",
    },
  ]);
  const handleListaIndicadoresValor = (index: number, valor: string) => {
    const nuevosVarios = [...indicadores];
    indicadores[index].valor = valor;
    setIndicadores(indicadores);
  };
  const handleListaIndicadoresViabilidad = (
    index: number,
    viabilidad: string
  ) => {
    const nuevosIndicadores = [...indicadores];
    if (viabilidad == "viable" || viabilidad == "no viable")
      nuevosIndicadores[index].viabilidad = viabilidad;
    setIndicadores(nuevosIndicadores);
  };
  //Necesarios para actualizar indicadores --Fin

  //Necesarios para actualizar Varios --inicio
  const [listaVarios, setListaVarios] = React.useState<varios[]>([
    {
      concepto: "tasa de interes(TREMA)",
      valor: "",
    },
    {
      concepto: "plazo del credito",
      valor: "",
    },
    {
      concepto: "TMP OP",
      valor: "",
    },
    {
      concepto: "Porcentaje de ganancia deseado",
      valor: "",
    },
    {
      concepto: "Produccion esperada",
      valor: "",
    },
    {
      concepto: "Porcentaje de ganancia final",
      valor: "",
    },
  ]);
  const handleListaVarios = (index: number, valor: number) => {
    const nuevosVarios = [...listaVarios];
    nuevosVarios[index].valor = valor;
    setListaVarios(nuevosVarios);
  };
  //Necesarios para actualizar Varios --fin

  //Necesarios para actualizar costos --Inicio
  const [costosFijos, setCostosFijos] = React.useState<costo[]>([
    {
      concepto: "renta",
      monto: "",
    },
    {
      concepto: "luz",
      monto: "",
    },
    {
      concepto: "agua",
      monto: "",
    },
    {
      concepto: "telefono",
      monto: "",
    },
    {
      concepto: "internet",
      monto: "",
    },
    {
      concepto: "gas",
      monto: "",
    },
    {
      concepto: "gasolina",
      monto: "",
    },
    {
      concepto: "sueldos",
      monto: "",
    },
    {
      concepto: "salarios",
      monto: "",
    },
    {
      concepto: "imss,infonavit",
      monto: "",
    },
    {
      concepto: "publicidad",
      monto: "",
    },
  ]);
  const handleCostosFijosChange = (index: number, value: number) => {
    const nuevosCostos = [...costosFijos];
    nuevosCostos[index].monto = value;
    setCostosFijos(nuevosCostos);
  };

  const [costosVariables, setCostosVariables] = React.useState<costo[]>([]);
  const handleCostosVariables = (nuevoCosto: costo) => {
    const nuevosCostos = [...costosVariables, nuevoCosto];
    setCostosVariables(nuevosCostos);
  };
  const [costoVariableConcepto, setCostoVariableConcepto] =
    React.useState<string>("");
  const [costoVariableCantidad, setCostoVariableCantidad] =
    React.useState<string>("");
  //Necesarios para actualizar costos --Fin

  //Necesarios para Demanda Anual --Inicio
  const [meses, setMeses] = React.useState<Mes[]>([
    { mes: "Enero", demanda: "" },
    { mes: "Febrero", demanda: "" },
    { mes: "Marzo", demanda: "" },
    { mes: "Abril", demanda: "" },
    { mes: "Mayo", demanda: "" },
    { mes: "Junio", demanda: "" },
    { mes: "Julio", demanda: "" },
    { mes: "Agosto", demanda: "" },
    { mes: "Septiembre", demanda: "" },
    { mes: "Octubre", demanda: "" },
    { mes: "Noviembre", demanda: "" },
    { mes: "Diciembre", demanda: "" },
  ]);

  const handleMeses = (index: number, demanda: string) => {
    const nuevosMeses = [...meses];
    meses[index].demanda = demanda;
    setMeses(nuevosMeses);
  };

  //Necesarios para Demanda Anual --Fin

  //Necesarios para Activos circulantes --Inicio
  const [activosCirculantes, setActivosCirculantes] = useState<Activos[]>([
    {
      concepto: "BANCOS",
      cantidad: 1,
      precioUnitario: 0,
      tipo: "ACTIVO CIRCULANTE",
      seTiene: "",
      propia: "",
    },
    {
      concepto: "CLIENTES",
      cantidad: 1,
      precioUnitario: 0,
      tipo: "ACTIVO CIRCULANTE",
      seTiene: "",
      propia: "",
    },
    {
      concepto: "INVENTARIOS",
      cantidad: 1,
      precioUnitario: 0,
      tipo: "ACTIVO CIRCULANTE",
      seTiene: "",
      propia: "",
    },
    {
      concepto: "MANO DE OBRA EN ESPECIE",
      cantidad: 1,
      precioUnitario: 0,
      tipo: "ACTIVO CIRCULANTE",
      seTiene: "",
      propia: "",
    },
  ]);

  const handleSeTieneChange = (index: number, value: number) => {
    const nuevosActivos = [...activosCirculantes];
    nuevosActivos[index].seTiene = value;
    setActivosCirculantes(nuevosActivos);
  };

  const handlePropiaChange = (index: number, value: number) => {
    const nuevosActivos = [...activosCirculantes];
    nuevosActivos[index].propia = value;
    setActivosCirculantes(nuevosActivos);
  };

  const actualizarPrecioUnitario = (concepto: string, nuevoPrecio: number) => {
    setActivosCirculantes((prev) =>
      prev.map((item) =>
        item.concepto === concepto
          ? { ...item, precioUnitario: nuevoPrecio }
          : item
      )
    );
  };

  //Necesarios para Activos circulantes --Fin

  //Necesarios Credito
  const totalInversiones =
    listaActivos.reduce(
      (suma, activo) =>
        suma +
        activo.cantidad * activo.precioUnitario -
        (Number(activo.seTiene) + Number(activo.propia)),
      0
    ) +
    activosCirculantes.reduce(
      (suma, activo) =>
        suma +
        activo.cantidad * activo.precioUnitario -
        (Number(activo.seTiene) + Number(activo.propia)),
      0
    );

  const trema = Number(listaVarios[0]?.valor) || 0;
  const plazo = Number(listaVarios[1]?.valor) || 1;

  const creditoTotal =
    (totalInversiones / plazo + totalInversiones * (trema / 100)) / 12;
  const [item, setItem] = React.useState<costo[]>([
    ...costosFijos,
    { concepto: "credito", monto: creditoTotal },
  ]);

  const handleCredito = (monto: number) => {
    const newItem = [...item];
    newItem.filter((a) => a.concepto === "credito")[0].monto = monto;
    setItem(newItem);
  };

  //Necesarios Credito

  //FORMULAS
  const totalCostosVariables = useMemo(() => {
    return costosVariables.reduce(
      (suma, costo) => suma + Number(costo.monto),
      0
    );
  }, [costosVariables]);

  const totalCostosFijos = useMemo(() => {
    return item.reduce((suma, costo) => (suma += Number(costo.monto)), 0);
  }, [item]);

  const produccionEsperada = useMemo(() => {
    return Number(listaVarios[4]?.valor) || 1; // Evita división por 0
  }, [listaVarios]);

  const gananciaDeseada = useMemo(() => {
    return Number(listaVarios[3]?.valor) / 100 || 0;
  }, [listaVarios]);

  const margenDeGanancia = useMemo(() => {
    return Number(listaVarios[5]?.valor) / 100 || 0;
  }, [listaVarios]);

  const CT = useMemo(() => {
    return totalCostosVariables + totalCostosFijos / produccionEsperada;
  }, [totalCostosVariables, totalCostosFijos, produccionEsperada]);

  const PVm = useMemo(() => {
    return CT + CT * gananciaDeseada;
  }, [CT, gananciaDeseada]);

  const PVF = useMemo(() => {
    return PVm + PVm * margenDeGanancia;
  }, [PVm, margenDeGanancia]);

  const PE = useMemo(() => {
    const denominador = PVF - totalCostosVariables;
    return denominador !== 0 ? totalCostosFijos / denominador : 0;
  }, [totalCostosFijos, totalCostosVariables, PVF]);

  const [proveedores, setProveedores] = React.useState("");
  // PROYECCION ANUAL
  const [ventasNetasAnuales, setVentasNetasAnuales] = useState(0);
  const [costosOperativosAnuales, setCostosOperativosAnuales] = useState(0);
  const [gastosOperativosAnuales, setGastosOperativosAnuales] = useState(0);

  const calcularBase = (demanda: string) => {
    let porcentaje = 0;
    let unidades = 0;

    if (demanda === "ALTA") {
      porcentaje = 0.15;
      unidades = produccionEsperada;
    } else if (demanda === "MEDIA") {
      porcentaje = 0.13;
      unidades = (produccionEsperada + PE) / 2;
    } else {
      porcentaje = 0.1;
      unidades = PE;
    }

    return { porcentaje, unidades };
  };

  const { totalVentasNetas, totalCostosOperativos, totalGastosOperativos } =
    meses.reduce(
      (totales, { demanda }) => {
        const { porcentaje, unidades } = calcularBase(demanda);
        const ventasNetas = unidades * PVF;
        const costoVentas = unidades * CT;
        const gastosOperacion = porcentaje * ventasNetas;

        return {
          totalVentasNetas: totales.totalVentasNetas + ventasNetas,
          totalCostosOperativos: totales.totalCostosOperativos + costoVentas,
          totalGastosOperativos:
            totales.totalGastosOperativos + gastosOperacion,
        };
      },
      {
        totalVentasNetas: 0,
        totalCostosOperativos: 0,
        totalGastosOperativos: 0,
      }
    );

  // Actualiza los estados una sola vez
  React.useEffect(() => {
    setVentasNetasAnuales(totalVentasNetas);
    setCostosOperativosAnuales(totalCostosOperativos);
    setGastosOperativosAnuales(totalGastosOperativos);
  }, [totalVentasNetas, totalCostosOperativos, totalGastosOperativos]);

  const totalMaquinas = useMemo(() => {
    return listaActivos
      .filter((activo) => activo.tipo == TipoDeActivo[0])
      .reduce(
        (suma, activo) => (suma += activo.cantidad * activo.precioUnitario),
        0
      );
  }, [listaActivos]);

  const totalEdificios = useMemo(() => {
    return listaActivos
      .filter((activo) => activo.tipo == TipoDeActivo[1])
      .reduce(
        (suma, activo) => (suma += activo.cantidad * activo.precioUnitario),
        0
      );
  }, [listaActivos]);

  const totalTransporte = useMemo(() => {
    return listaActivos
      .filter((activo) => activo.tipo == TipoDeActivo[2])
      .reduce(
        (suma, activo) => (suma += activo.cantidad * activo.precioUnitario),
        0
      );
  }, [listaActivos]);

  const totalMobiliario = useMemo(() => {
    return listaActivos
      .filter((activo) => activo.tipo == TipoDeActivo[3])
      .reduce(
        (suma, activo) => (suma += activo.cantidad * activo.precioUnitario),
        0
      );
  }, [listaActivos]);

  const totalComputo = useMemo(() => {
    return listaActivos
      .filter((activo) => activo.tipo == TipoDeActivo[4])
      .reduce(
        (suma, activo) => (suma += activo.cantidad * activo.precioUnitario),
        0
      );
  }, [listaActivos]);

  const totalInstalacion = useMemo(() => {
    return listaActivos
      .filter((activo) => activo.tipo == TipoDeActivo[5])
      .reduce(
        (suma, activo) => (suma += activo.cantidad * activo.precioUnitario),
        0
      );
  }, [listaActivos]);

  const depreciaciones = useMemo(() => {
    const nuevasDepreciaciones = [
      {
        texto: TipoDeActivo[1],
        monto: totalEdificios,
        vidaUtil: 30,
        depreciciacionAnual: totalEdificios / 30,
      },
      {
        texto: TipoDeActivo[0],
        monto: totalMaquinas,
        vidaUtil: 15,
        depreciciacionAnual: totalMaquinas / 15,
      },
      {
        texto: TipoDeActivo[2],
        monto: totalTransporte,
        vidaUtil: 4,
        depreciciacionAnual: totalTransporte / 4,
      },
      {
        texto: TipoDeActivo[3],
        monto: totalMobiliario,
        vidaUtil: 10,
        depreciciacionAnual: totalMobiliario / 10,
      },
      {
        texto: TipoDeActivo[4],
        monto: totalComputo,
        vidaUtil: 3,
        depreciciacionAnual: totalComputo / 3,
      },
    ];
    return nuevasDepreciaciones;
  }, [
    totalComputo,
    totalEdificios,
    totalInstalacion,
    totalMobiliario,
    totalTransporte,
    totalMaquinas,
  ]);
  // Calculamos todos los valores necesarios una sola vez

  const saldoInicial = useMemo(() => {
    return totalCostosFijos * Number(listaVarios[2]?.valor || 0);
  }, [totalCostosFijos, listaVarios]);
  React.useEffect(() => {
    const credit = item.find((i) => i.concepto === "credito");
    setItem([
      ...costosFijos,
      credit ? credit : { concepto: "credito", monto: 0 },
    ]);
  }, [costosFijos]);

  React.useEffect(() => {
    actualizarPrecioUnitario("BANCOS", saldoInicial);
  }, [saldoInicial]);

  const totalPropia = useMemo(() => {
    const circulante = activosCirculantes.reduce(
      (suma, activo) => (suma += Number(activo.propia)),
      0
    );
    const noCirculante = listaActivos.reduce(
      (suma, activo) => (suma += Number(activo.propia)),
      0
    );
    return circulante + noCirculante;
  }, [activosCirculantes, listaActivos]);

  const totalSeTiene = useMemo(() => {
    const circulante = activosCirculantes.reduce(
      (suma, activo) => (suma += Number(activo.seTiene)),
      0
    );
    const noCirculante = listaActivos.reduce(
      (suma, activo) => (suma += Number(activo.seTiene)),
      0
    );
    return circulante + noCirculante;
  }, [activosCirculantes, listaActivos]);

  type AñoAmortizacion = {
    año: number;
    saldoInicial: number;
    abonoCapital: number;
    intereses: number;
    pagoTotal: number;
    saldoFinal: number;
  };

  const tablaCredito = useMemo(() => {
    const años = plazo === 1 ? 5 : plazo;
    const tasa = trema / 100;
    const abonoAnual = totalInversiones / plazo;

    const resultado: AñoAmortizacion[] = [];

    let saldo = totalInversiones;

    for (let i = 0; i <= años; i++) {
      const abono = i === 0 ? 0 : abonoAnual;
      const interes = i === 0 ? 0 : saldo * tasa;
      const pago = abono + interes;
      const saldoFinal = i === 0 ? saldo : saldo - abono;

      resultado.push({
        año: i,
        saldoInicial: saldo,
        abonoCapital: abono,
        intereses: interes,
        pagoTotal: pago,
        saldoFinal,
      });

      saldo = saldoFinal;
    }

    return resultado;
  }, [totalInversiones, plazo, trema]);

  const columnas = [
    <TableColumn key="concepto">Concepto</TableColumn>,
    ...tablaCredito.map((año) => (
      <TableColumn key={`año-${año.año}`}>AÑO {año.año}</TableColumn>
    )),
  ];

  const amortiguaciones = useMemo(() => {
    return [
      {
        texto: TipoDeActivo[5],
        monto: totalInstalacion,
        vidaUtil: 10,
        depreciciacionAnual: totalInstalacion / 10,
      },
    ];
  }, [totalInstalacion]);

  const totalAD = useMemo(() => {
    return (
      amortiguaciones.reduce(
        (suma, concepto) => (suma += concepto.depreciciacionAnual),
        0
      ) +
      depreciaciones.reduce(
        (suma, concepto) => (suma += concepto.depreciciacionAnual),
        0
      )
    );
  }, [amortiguaciones, depreciaciones]);

  const tablaD = useMemo(() => {
    const nuevaTabla = [
      {
        concepto: TipoDeActivo[1],
        años: [
          0,
          depreciaciones[0].depreciciacionAnual,
          depreciaciones[0].depreciciacionAnual,
          depreciaciones[0].depreciciacionAnual,
          depreciaciones[0].depreciciacionAnual,
          depreciaciones[0].depreciciacionAnual,
        ],
      },
      {
        concepto: TipoDeActivo[0],
        años: [
          0,
          depreciaciones[1].depreciciacionAnual,
          depreciaciones[1].depreciciacionAnual,
          depreciaciones[1].depreciciacionAnual,
          depreciaciones[1].depreciciacionAnual,
          depreciaciones[1].depreciciacionAnual,
        ],
      },
      {
        concepto: TipoDeActivo[2],
        años: [
          0,
          depreciaciones[2].depreciciacionAnual,
          depreciaciones[2].depreciciacionAnual,
          depreciaciones[2].depreciciacionAnual,
          depreciaciones[2].depreciciacionAnual,
          0,
        ],
      },
      {
        concepto: TipoDeActivo[3],
        años: [
          0,
          depreciaciones[3].depreciciacionAnual,
          depreciaciones[3].depreciciacionAnual,
          depreciaciones[3].depreciciacionAnual,
          depreciaciones[3].depreciciacionAnual,
          depreciaciones[3].depreciciacionAnual,
        ],
      },
      {
        concepto: TipoDeActivo[4],
        años: [
          0,
          depreciaciones[4].depreciciacionAnual,
          depreciaciones[4].depreciciacionAnual,
          depreciaciones[4].depreciciacionAnual,
          0,
          0,
        ],
      },
      {
        concepto: "Total de depreciasiones",
        años: [
          0,
          depreciaciones.reduce(
            (suma, concept) => (suma += concept.depreciciacionAnual),
            0
          ),
          depreciaciones.reduce(
            (suma, concept) => (suma += concept.depreciciacionAnual),
            0
          ),
          depreciaciones.reduce(
            (suma, concept) => (suma += concept.depreciciacionAnual),
            0
          ),
          depreciaciones
            .filter((e) => e.texto != TipoDeActivo[4])
            .reduce((s, c) => (s += c.depreciciacionAnual), 0),
          depreciaciones
            .filter(
              (e) => e.texto != TipoDeActivo[4] && e.texto != TipoDeActivo[2]
            )
            .reduce((s, c) => (s += c.depreciciacionAnual), 0),
        ],
      },
    ];
    return nuevaTabla;
  }, [depreciaciones]);
  const tablaA = useMemo(() => {
    return [
      {
        concepto: TipoDeActivo[5],
        años: [
          0,
          amortiguaciones[0].depreciciacionAnual,
          amortiguaciones[0].depreciciacionAnual,
          amortiguaciones[0].depreciciacionAnual,
          amortiguaciones[0].depreciciacionAnual,
          amortiguaciones[0].depreciciacionAnual,
        ],
      },
    ];
  }, [amortiguaciones]);

  const utilidadBruta = useMemo(() => {
    return ventasNetasAnuales - costosOperativosAnuales;
  }, [ventasNetasAnuales, costosOperativosAnuales]);
  const utilidadDeOperacion = useMemo(() => {
    return utilidadBruta - gastosOperativosAnuales;
  }, [utilidadBruta, gastosOperativosAnuales]);
  const UtilidadAII = useMemo(() => {
    const nuevaUAII = [
      0,
      utilidadDeOperacion - (tablaA[0].años[1] + tablaD[5].años[1]),
      utilidadDeOperacion * 1.1 - (tablaA[0].años[2] + tablaD[5].años[2]),
      utilidadDeOperacion * 1.13 - (tablaA[0].años[3] + tablaD[5].años[3]),
      utilidadDeOperacion * 1.17 - (tablaA[0].años[4] + tablaD[5].años[4]),
      utilidadDeOperacion * 1.17 - (tablaA[0].años[5] + tablaD[5].años[5]),
    ];
    return nuevaUAII;
  }, [utilidadDeOperacion, tablaA, tablaD]);
  const UtilidadAI = useMemo(() => {
    const nuevaUAI = [];
    for (let index = 0; index <= 5; index++) {
      nuevaUAI.push(UtilidadAII[index] - tablaCredito[index].intereses);
    }
    return nuevaUAI;
  }, [UtilidadAII, tablaCredito]);

  const Impuestos = useMemo(() => {
    const nuevosImpuestos = [];
    for (let index = 0; index <= 5; index++) {
      if (UtilidadAI[index] > 0) {
        nuevosImpuestos.push(UtilidadAI[index] * 0.3);
      } else {
        nuevosImpuestos.push(0);
      }
    }
    return nuevosImpuestos;
  }, [UtilidadAI]);

  const utilidadNeta = useMemo(() => {
    const nuevaUN = [];
    for (let index = 0; index <= 5; index++) {
      nuevaUN.push(UtilidadAI[index] - Impuestos[index]);
    }
    return nuevaUN;
  }, [UtilidadAI, Impuestos]);

  const tablaER = useMemo(() => {
    const nuevaTabla = [
      {
        concepto: "Ventas",
        años: [
          0,
          ventasNetasAnuales,
          ventasNetasAnuales * 1.1,
          ventasNetasAnuales * 1.13,
          ventasNetasAnuales * 1.17,
          ventasNetasAnuales * 1.17,
        ],
        Color: "NEUTRO",
      },
      {
        concepto: "Costo de ventas",
        años: [
          0,
          costosOperativosAnuales,
          costosOperativosAnuales * 1.1,
          costosOperativosAnuales * 1.13,
          costosOperativosAnuales * 1.17,
          costosOperativosAnuales * 1.17,
        ],
        Color: "ROJO",
      },
      {
        concepto: "Utilidad Bruta",
        años: [
          0,
          utilidadBruta,
          utilidadBruta * 1.1,
          utilidadBruta * 1.13,
          utilidadBruta * 1.17,
          utilidadBruta * 1.17,
        ],
        Color: "NEUTRO",
      },
      {
        concepto: "Gastos de operacion",
        años: [
          0,
          gastosOperativosAnuales,
          gastosOperativosAnuales * 1.1,
          gastosOperativosAnuales * 1.13,
          gastosOperativosAnuales * 1.17,
          gastosOperativosAnuales * 1.17,
        ],
        Color: "ROJO",
      },
      {
        concepto: "Utilidad de operacion",
        años: [
          0,
          utilidadDeOperacion,
          utilidadDeOperacion * 1.1,
          utilidadDeOperacion * 1.13,
          utilidadDeOperacion * 1.17,
          utilidadDeOperacion * 1.17,
        ],
        Color: "NEUTRO",
      },
      {
        concepto: "Depreciaciones",
        años: [...tablaD[5].años],
        Color: "ROJO",
      },
      {
        concepto: "Amortizaciones",
        años: [...tablaA[0].años],
        Color: "ROJO",
      },
      {
        concepto: "Utilidad antes de inetereses e impuestos",
        años: [...UtilidadAII],
        Color: "NEUTRO",
      },
      {
        concepto: "Gastos financieros",
        años: [
          tablaCredito[0].intereses,
          tablaCredito[1].intereses,
          tablaCredito[2].intereses,
          tablaCredito[3].intereses,
          tablaCredito[4].intereses,
          tablaCredito[5].intereses,
        ],
        Color: "ROJO",
      },
      {
        concepto: "Utilidad antes de impuestos",
        años: [...UtilidadAI],
        Color: "NEUTRO",
      },
      {
        concepto: "Impuestos",
        años: [...Impuestos],
        Color: "ROJO",
      },
      {
        concepto: "Utilidad Neta",
        años: [...utilidadNeta],
        Color: "NEUTRO",
      },
    ];
    return nuevaTabla;
  }, [
    utilidadNeta,
    Impuestos,
    UtilidadAI,
    tablaCredito,
    UtilidadAII,
    tablaA,
    tablaD,
    utilidadDeOperacion,
    gastosOperativosAnuales,
    costosOperativosAnuales,
    ventasNetasAnuales,
    utilidadBruta,
  ]);
  type FlujoEfectivoAnual = {
    año: number;
    saldoInicial: number;
    ventas: number;
    credito: number;
    totalIngresos: number;
    disponible: number;
    inicioOperaciones: number;
    acondicionamiento: number;
    costoVentas: number;
    gastosOperacion: number;
    pagoCredito: number;
    interesesCredito: number;
    impuestos: number;
    totalEgresos: number;
    flujoNeto: number;
    saldoFinal: number;
  };
  const tablaFE = useMemo<FlujoEfectivoAnual[]>(() => {
    const años = 6;
    const datos: FlujoEfectivoAnual[] = [];

    for (let i = 0; i < años; i++) {
      const ventas = i === 0 ? 0 : tablaER[0].años[i];
      const credito = i === 0 ? tablaCredito[0].saldoInicial : 0;
      const totalIngresos = ventas + credito;
      const disponible = saldoInicial + totalIngresos;

      const inicioOperaciones =
        i === 0 ? totalInversiones - totalInstalacion : 0;
      const acondicionamiento = i === 0 ? totalInstalacion : 0;
      const costoVentas = i === 0 ? 0 : tablaER[1].años[i];
      const gastosOperacion = i === 0 ? 0 : tablaER[3].años[i];
      const pagoCredito = i === 0 ? 0 : tablaCredito[i].abonoCapital;
      const interesesCredito = i === 0 ? 0 : tablaCredito[i].intereses;
      const impuestos = i === 0 ? 0 : Impuestos[i];

      const totalEgresos =
        inicioOperaciones +
        acondicionamiento +
        costoVentas +
        gastosOperacion +
        pagoCredito +
        interesesCredito +
        impuestos;

      const flujoNeto = disponible - totalEgresos;
      const saldoFinal = flujoNeto;

      datos.push({
        año: i,
        saldoInicial: i === 0 ? saldoInicial : datos[i - 1].saldoFinal,
        ventas,
        credito,
        totalIngresos,
        disponible,
        inicioOperaciones,
        acondicionamiento,
        costoVentas,
        gastosOperacion,
        pagoCredito,
        interesesCredito,
        impuestos,
        totalEgresos,
        flujoNeto,
        saldoFinal,
      });
    }

    return datos;
  }, [
    saldoInicial,
    totalInversiones,
    totalInstalacion,
    tablaER,
    tablaCredito,
    Impuestos,
  ]);

  type FilaTablaFE = {
    concepto: string;
    años: number[];
  };

  const tablaFEFilas: FilaTablaFE[] = useMemo(() => {
    const conceptos = [
      "saldoInicial",
      "ventas",
      "credito",
      "totalIngresos",
      "disponible",
      "inicioOperaciones",
      "acondicionamiento",
      "costoVentas",
      "gastosOperacion",
      "pagoCredito",
      "interesesCredito",
      "impuestos",
      "totalEgresos",
      "flujoNeto",
      "saldoFinal",
    ];

    return conceptos.map((concepto) => ({
      concepto,
      años: tablaFE.map(
        (anio) => anio[concepto as keyof typeof anio] as number
      ),
    }));
  }, [tablaFE]);

  const totalActivosCirculantes = useMemo(() => {
    return tablaFEFilas[14].años.map(
      (flujo) =>
        flujo +
        activosCirculantes[1].precioUnitario +
        activosCirculantes[2].precioUnitario
    );
  }, [activosCirculantes, tablaFEFilas]);

  const tablaDepreciacionAcumulada = useMemo(() => {
    const acumulada = (anual: number, añosDepreciables: number) => {
      const arr = [0];
      let suma = 0;
      for (let i = 1; i <= 5; i++) {
        if (i <= añosDepreciables) {
          suma += anual;
        }
        arr.push(suma);
      }
      return arr;
    };

    return [
      {
        concepto: "Depreciación Acum. Edificios",
        años: acumulada(totalEdificios / 30, 5),
      },
      {
        concepto: "Depreciación Acum. Maquinaria",
        años: acumulada(totalMaquinas / 15, 5),
      },
      {
        concepto: "Depreciación Acum. Transporte",
        años: acumulada(totalTransporte / 4, 4),
      },
      {
        concepto: "Depreciación Acum. Mobiliario",
        años: acumulada(totalMobiliario / 10, 5),
      },
      {
        concepto: "Depreciación Acum. Cómputo",
        años: acumulada(totalComputo / 3, 3),
      },
    ];
  }, [
    totalEdificios,
    totalMaquinas,
    totalTransporte,
    totalMobiliario,
    totalComputo,
  ]);

  const totalFijo = useMemo(() => {
    const totalInicial =
      totalEdificios +
      totalMaquinas +
      totalTransporte +
      totalMobiliario +
      totalComputo;

    return Array.from({ length: 6 }, (_, i) => {
      const depreciacionAcumulada = tablaDepreciacionAcumulada.reduce(
        (suma, item) => suma += item.años[i],
        0
      );
      return totalInicial - depreciacionAcumulada;
    });
  }, [
    totalEdificios,
    totalMaquinas,
    totalTransporte,
    totalMobiliario,
    totalComputo,
    tablaDepreciacionAcumulada,
  ]);

  const tablaAmortiguazionesAcumulada = useMemo(() => {
    const acumulada = (anual: number, añosDepreciables: number) => {
      const arr = [0];
      let suma = 0;
      for (let i = 1; i <= 5; i++) {
        if (i <= añosDepreciables) {
          suma += anual;
        }
        arr.push(suma);
      }
      return arr;
    };

    return {
      concepto: "Amortizacion Acum  Gtos. Instalacion",
      años: acumulada(totalInstalacion / 10, 5),
    };
  }, [totalInstalacion]);

  const totalDiferido = useMemo(() => {
    return Array.from({ length: 6 }, (_, i) => {
      return totalInstalacion - tablaAmortiguazionesAcumulada.años[i];
    });
  }, [tablaAmortiguazionesAcumulada, totalInstalacion]);

  const totalActivo = useMemo(() => {
    return Array.from({ length: 6 }, (_, i) => {
      return totalDiferido[i] + totalFijo[i] + totalActivosCirculantes[i];
    });
  }, [totalDiferido, totalFijo, totalActivosCirculantes]);

  const totalPasivosCorto = useMemo(() => {
    return [
      Number(proveedores) - tablaCredito[1].abonoCapital,
      Number(proveedores) - tablaCredito[1].abonoCapital,
      Number(proveedores) - tablaCredito[1].abonoCapital,
      Number(proveedores) - tablaCredito[1].abonoCapital,
      Number(proveedores) - tablaCredito[1].abonoCapital,
      Number(proveedores),
    ];
  }, [proveedores, tablaCredito]);

  const bancoLargoPlazo = useMemo(() => {
    return [
      tablaCredito[1].abonoCapital * 4,
      tablaCredito[1].abonoCapital * 3,
      tablaCredito[1].abonoCapital * 2,
      tablaCredito[1].abonoCapital,
      0,
      0,
    ];
  }, [tablaCredito]);

  const totalPasivos = useMemo(() => {
    return Array.from({ length: 6 }, (_, i) => {
      return totalPasivosCorto[0] + bancoLargoPlazo[0];
    });
  }, [totalPasivosCorto, bancoLargoPlazo]);

  const URA = useMemo(() => {
    const nuevoURA = [];
    let acumulado = 0;

    for (let i = 0; i < utilidadNeta.length; i++) {
      acumulado += utilidadNeta[i];
      nuevoURA.push(acumulado);
    }

    return nuevoURA;
  }, [utilidadNeta]);

  const totalCapital = useMemo(() => {
    return Array.from({ length: 6 }, (_, i) => {
      return (
        totalSeTiene + totalPropia + saldoInicial + URA[i] + utilidadNeta[i]
      );
    });
  }, [totalSeTiene, totalPropia, saldoInicial, URA, utilidadNeta]);

  const pasivoCapital = useMemo(() => {
    return Array.from({ length: 6 }, (_, i) => {
      return totalCapital[i] + totalPasivos[i];
    });
  }, [totalCapital, totalPasivos]);

  const diferencia = useMemo(() => {
    return Array.from({ length: 6 }, (_, i) => {
      return totalActivo[i] - pasivoCapital[i];
    });
  }, [totalActivo, pasivoCapital]);

  const estadoBG = useMemo(() => {
    const clientes = activosCirculantes[1].precioUnitario;
    const inventarios = activosCirculantes[2].precioUnitario;

    const añosClientes = Array(6).fill(clientes);
    const añosInventarios = Array(6).fill(inventarios);
    const añosEdificios = Array(6).fill(totalEdificios);
    const añosMaquinaria = Array(6).fill(totalMaquinas);
    const añosTransporte = Array(6).fill(totalTransporte);
    const añosMobiliario = Array(6).fill(totalMobiliario);
    const añosComputo = Array(6).fill(totalComputo);
    
    const añosInstalacion = Array(6).fill(totalInstalacion);
    const añosProveedores = Array(6).fill(Number(proveedores));
    const bancoCorto = Array(6).fill(tablaCredito[1].abonoCapital);
    bancoCorto[5] = 0;
    const añosCapitalSolcial = Array(6).fill(totalSeTiene + totalPropia);
    const añosAportaciones = Array(6).fill(saldoInicial);

    return [
      {
        concepto: "Caja y Bancos",
        años: [...tablaFEFilas[14].años],
      },
      {
        concepto: "Clientes",
        años: añosClientes,
      },
      {
        concepto: "Inventarios",
        años: añosInventarios,
      },
      {
        concepto: "Total Activos Circulantes",
        años: totalActivosCirculantes,
      },
      {
        concepto: "Edificios",
        años: añosEdificios,
      },
      {
        concepto: "Depreciación Acumulada Edificios",
        años: tablaDepreciacionAcumulada[0].años,
      },
      {
        concepto: "Maquinaria",
        años: añosMaquinaria,
      },
      {
        concepto: "Depreciación Acumulada Maquinaria",
        años: tablaDepreciacionAcumulada[1].años,
      },
      {
        concepto: "Equipo de transporte",
        años: añosTransporte,
      },
      {
        concepto: "Depreciación Acumulada Equipo de transporte",
        años: tablaDepreciacionAcumulada[2].años,
      },
      {
        concepto: "Mobiliario",
        años: añosMobiliario,
      },
      {
        concepto: "Depreciación Acumulada Mobiliario",
        años: tablaDepreciacionAcumulada[3].años,
      },
      {
        concepto: "Equipo de computo",
        años: añosComputo,
      },
      {
        concepto: "Depreciación Acumulada Equipo de computo",
        años: tablaDepreciacionAcumulada[4].años,
      },
      {
        concepto: "Total Activo Fijo",
        años: totalFijo,
      },
      {
        concepto: "Gastos de Instalacion",
        años: añosInstalacion,
      },
      {
        concepto: "Amortizacion Acum  Gtos. Instalacion",
        años: tablaAmortiguazionesAcumulada.años,
      },
      {
        concepto: "Total Activo Diferido",
        años: totalDiferido,
      },
      {
        concepto: "Total Activo",
        años: totalActivo,
      },
      {
        concepto: "Proveedores",
        años: añosProveedores,
      },
      {
        concepto: "Banco a Corto Plazo",
        años: bancoCorto,
      },
      {
        concepto: "Total Pasivo a Corto Plazo",
        años: totalPasivosCorto,
      },
      {
        concepto: "Banco de largo plazo",
        años: bancoLargoPlazo,
      },
      {
        concepto: "Total Pasivos a Largo Plazo",
        años: bancoLargoPlazo,
      },
      {
        concepto: "Total Pasivos",
        años: totalPasivos,
      },
      {
        concepto: "Capital Social",
        años: añosCapitalSolcial,
      },
      {
        concepto: "Aportaciones pendientes de capitalizar",
        años: añosAportaciones,
      },
      {
        concepto: "Utilidades retenidas acumuladas",
        años: URA,
      },
      {
        concepto: "Utilidad del ejercicio (utilidad neta)",
        años: utilidadNeta,
      },
      {
        concepto: "Total Capital",
        años: totalCapital,
      },
      {
        concepto: "Total pasivo mas capital",
        años: pasivoCapital,
      },
      {
        concepto: "Diferencias",
        años: diferencia,
      },
    ];
  }, [
    tablaFEFilas,
    activosCirculantes,
    totalEdificios,
    totalMaquinas,
    totalTransporte,
    totalMobiliario,
    totalComputo,
    tablaDepreciacionAcumulada,
    totalFijo,
    totalInstalacion,
    tablaAmortiguazionesAcumulada,
    totalDiferido,
    totalActivo,
    proveedores,
    tablaCredito,
    totalSeTiene,
    totalPropia,
    saldoInicial,
    URA,
    utilidadNeta,
    totalCapital,
    pasivoCapital,
    diferencia,
    totalPasivos,
    totalPasivosCorto,
    bancoLargoPlazo,
  ]);

  const totalDAcumulada = useMemo(() => {
    return tablaDepreciacionAcumulada.reduce(
      (suma, activ) => (suma += activ.años[5]),
      0
    );
  }, [tablaDepreciacionAcumulada]);
  const totalRescarte = useMemo(() => {
    return (
      totalMaquinas +
      totalEdificios +
      totalTransporte +
      totalMobiliario +
      totalComputo
    );
  }, [
    totalMaquinas,
    totalEdificios,
    totalTransporte,
    totalMobiliario,
    totalComputo,
  ]);

  const flujos = useMemo(() => {
    return Array.from({ length: 6 }, (_, i) => {
      return tablaFEFilas[13].años[i] + tablaCredito[2].abonoCapital;
    });
  }, [tablaFEFilas, tablaCredito]);

  const flujosDescontados = useMemo(() => {
    return flujos.map((flujo, i) => flujo / Math.pow(1 + trema, i));
  }, [flujos, trema]);

  const totalFD = useMemo(() => {
    return flujosDescontados.reduce((suma, flujo) => (suma += flujo), 0);
  }, [flujosDescontados]);

  const VAN = useMemo(() => {
    return totalFD - totalInversiones;
  }, [totalFD, totalInversiones]);

  useEffect(() => {
    handleListaIndicadoresValor(0, String(VAN));
    if (VAN >= 0) {
      handleListaIndicadoresViabilidad(0, "viable");
    } else {
      handleListaIndicadoresViabilidad(0, "no viable");
    }
  }, [VAN]);

  const calcularTIRSimple = (flujos: number[]): number => {
    let tir = -0.99; // Probar desde -99%
    const paso = 0.0001;
    const maxTir = 1.0; // Hasta 100%

    while (tir <= maxTir) {
      const vanSimulado = flujos.reduce((suma, flujo, i) => {
        return suma + flujo / Math.pow(1 + tir, i);
      }, 0);

      if (Math.abs(vanSimulado - totalInversiones) < 0.01) {
        return tir;
      }

      tir += paso;
    }

    return NaN; // Si no se encontró una TIR válida
  };

  const TIR = useMemo(() => calcularTIRSimple(flujos), [flujos]);

  // 4. Evaluar VAN
  useEffect(() => {
    handleListaIndicadoresValor(0, String(VAN));
    if (VAN >= 0) {
      handleListaIndicadoresViabilidad(0, "viable");
    } else {
      handleListaIndicadoresViabilidad(0, "no viable");
    }
  }, [VAN]);

  // 5. Evaluar TIR
  useEffect(() => {
    handleListaIndicadoresValor(1, `${(TIR * 100).toFixed(2)}%`);
    if (TIR > trema / 100) {
      handleListaIndicadoresViabilidad(1, "viable");
    } else {
      handleListaIndicadoresViabilidad(1, "no viable");
    }
  }, [TIR, trema]);

  const flujoDeIngresos = useMemo(() => {
    return tablaER[0].años;
  }, [tablaER]);

  const flujoDeEgresos = useMemo(() => {
    return tablaFEFilas[12].años.map((año) => {
      return año - tablaCredito[0].abonoCapital;
    });
  }, [tablaFEFilas, tablaCredito]);

  const flujoDeIngresosDescontados = useMemo(() => {
    return flujoDeIngresos.map((año, index) => {
      return (año / (1 + trema / 100) ** 2).toFixed(2);
    });
  }, [flujoDeIngresos, trema]);

  const flujoDeEgresosDescontados = useMemo(() => {
    return flujoDeEgresos.map((año, index) => {
      return (año / (1 + trema / 100) ** 2).toFixed(2);
    });
  }, [flujoDeIngresos, trema]);

  const sumaDeIngresos = useMemo(() => {
    return flujoDeIngresosDescontados.reduce((s, f) => (s += Number(f)), 0);
  }, [flujoDeIngresosDescontados]);

  const sumaDeEgresos = useMemo(() => {
    return flujoDeEgresosDescontados.reduce((s, f) => (s += Number(f)), 0);
  }, [flujoDeIngresosDescontados]);

  const BC = useMemo(() => {
    return sumaDeIngresos / sumaDeEgresos;
  }, [sumaDeEgresos, sumaDeIngresos]);

  // 4. Evaluar VAN
  useEffect(() => {
    handleListaIndicadoresValor(2, String(BC));
    if (BC >= 1) {
      handleListaIndicadoresViabilidad(2, "viable");
    } else {
      handleListaIndicadoresViabilidad(2, "no viable");
    }
  }, [BC]);

  const promedioFlujos = useMemo(() => {
    const tamaño = flujosDescontados.length;
    return totalFD / tamaño;
  }, [totalFD]);

  const PRI = useMemo(() => {
    return totalInversiones / promedioFlujos;
  }, [promedioFlujos, totalInversiones]);

  // 4. Evaluar VAN
  useEffect(() => {
    handleListaIndicadoresValor(3, String(PRI));
    if (PRI <= 3) {
      handleListaIndicadoresViabilidad(3, "viable");
    } else {
      handleListaIndicadoresViabilidad(3, "no viable");
    }
  }, [PRI]);

  return (
    <section className="flex flex-col gap-x-6 gap-y-3 h-screen overflow-auto">
      <section className="flex flex-row w-full gap-6">
        <section className="flex flex-col w-full gap-3">
          <section className="flex flex-row w-full gap-2 justify-center">
            <Card>
              <CardHeader className="flex content-center items-center justify-center">
                <h1>INDICADORES</h1>
              </CardHeader>
              <CardBody className="flex flex-col gap-3">
                <Table aria-label="Indicadores" removeWrapper>
                  <TableHeader>
                    <TableColumn>Indicador</TableColumn>
                    <TableColumn>Valor del indicador</TableColumn>
                    <TableColumn>Conclusion</TableColumn>
                    <TableColumn>Criterio de decision</TableColumn>
                  </TableHeader>
                  <TableBody>
                    {indicadores.map((indicador, index) => (
                      <TableRow key={index}>
                        <TableCell>{indicador.tipo}</TableCell>
                        <TableCell>{indicador.valor}</TableCell>
                        <TableCell
                          className={
                            indicador.viabilidad === "viable"
                              ? "text-green-600 font-semibold"
                              : "text-red-600 font-semibold"
                          }
                        >
                          {indicador.viabilidad}
                        </TableCell>
                        <TableCell>{indicador.criterio}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
                {listaVarios
                  .filter(
                    (vario) =>
                      vario.concepto == "tasa de interes(TREMA)" ||
                      vario.concepto == "plazo del credito"
                  )
                  .map((vario, index) => (
                    <div key={`${vario.concepto}-${index}`}>
                      <Input
                        label={`${vario.concepto}:`}
                        labelPlacement="outside-left"
                        placeholder="Ingrese Cantidad"
                        variant="underlined"
                        type="number"
                        value={String(vario.valor)}
                        onValueChange={(value) =>
                          handleListaVarios(index, Number(value))
                        }
                      />
                    </div>
                  ))}
              </CardBody>
            </Card>
            <Card>
              <CardHeader className="flex content-center items-center justify-center">
                <h1>ACTIVOS</h1>
              </CardHeader>
              <CardBody className="flex flex-col gap-2">
                <Input
                  label="Concepto:"
                  labelPlacement="outside-left"
                  placeholder="Ingrese concepto"
                  variant="underlined"
                  value={activoConcepto}
                  onValueChange={setActivoConcepto}
                />
                <Input
                  label="Cantidad:"
                  labelPlacement="outside-left"
                  placeholder="Ingrese cantidad"
                  variant="underlined"
                  type="number"
                  value={activoCantidad}
                  onValueChange={setActivoCantidad}
                />
                <Input
                  label="Precio:"
                  labelPlacement="outside-left"
                  placeholder="Ingrese el precio"
                  variant="underlined"
                  type="number"
                  value={activoPrecioUnitario}
                  onValueChange={setActivoPrecioUnitario}
                />
                <Select
                  label="Tipo de activo"
                  placeholder="Seleccione el tipo"
                  labelPlacement="outside-left"
                  variant="underlined"
                  selectedKeys={activoTipoActivo ? [activoTipoActivo] : []}
                  onSelectionChange={(key) => {
                    const selected = Array.from(key)[0];
                    setActivoTipoActivo(selected as string);
                  }}
                >
                  {TipoDeActivo.map((tipo, index) => (
                    <SelectItem key={index}>{tipo}</SelectItem>
                  ))}
                </Select>
                <h1>Aportacion de socios</h1>
                <Input
                  label="Se tiene:"
                  labelPlacement="outside-left"
                  placeholder="Ingrese cantidad"
                  variant="underlined"
                  type="number"
                  value={activoSeTiene}
                  onValueChange={setActivoSeTiene}
                />
                <Input
                  label="Propia:"
                  labelPlacement="outside-left"
                  placeholder="Ingrese cantidad"
                  variant="underlined"
                  type="number"
                  value={activoPropia}
                  onValueChange={setActivoPropia}
                />
              </CardBody>
              <CardFooter className="flex flex-row gap-2 justify-end">
                <Button
                  color="danger"
                  variant="ghost"
                  onPress={() => {
                    setActivoConcepto("");
                    setActivoCantidad("");
                    setActivoPrecioUnitario("");
                    setActivoTipoActivo("");
                    setActivoSeTiene("");
                    setActivoPropia("");
                  }}
                >
                  Borrar registro
                </Button>
                <Button
                  color="primary"
                  onPress={() => {
                    setListaActivos([
                      ...listaActivos,
                      {
                        concepto: activoConcepto,
                        cantidad: Number(activoCantidad),
                        precioUnitario: Number(activoPrecioUnitario),
                        tipo: TipoDeActivo[Number(activoTipoActivo)],
                        seTiene: Number(activoSeTiene),
                        propia: Number(activoPropia),
                      },
                    ]);
                    handleCredito(creditoTotal);

                    setActivoConcepto("");
                    setActivoCantidad("");
                    setActivoPrecioUnitario("");
                    setActivoTipoActivo("");
                    setActivoSeTiene("");
                    setActivoPropia("");
                  }}
                >
                  Registrar
                </Button>
              </CardFooter>
            </Card>
          </section>
          <section className="flex flex-row gap-3">
            <Card>
              <CardHeader className="flex justify-center content-center items-center">
                COSTOS VARIABLES
              </CardHeader>
              <CardBody>
                <Input
                  label="Concepto:"
                  placeholder="Ingrese el concepto"
                  labelPlacement="outside-left"
                  variant="underlined"
                  type="text"
                  value={costoVariableConcepto}
                  onValueChange={setCostoVariableConcepto}
                />
                <Input
                  label="Monto:"
                  placeholder="Ingrese la cantidad"
                  labelPlacement="outside-left"
                  variant="underlined"
                  value={costoVariableCantidad}
                  onValueChange={setCostoVariableCantidad}
                />
              </CardBody>
              <CardFooter className="flex flex-row gap-2 justify-end">
                <Button
                  color="danger"
                  variant="ghost"
                  onPress={() => {
                    setCostoVariableConcepto("");
                    setCostoVariableCantidad("");
                  }}
                >
                  Borrar registro
                </Button>
                <Button
                  color="primary"
                  onPress={() => {
                    handleCostosVariables({
                      concepto: costoVariableConcepto,
                      monto: costoVariableCantidad,
                    });
                    setCostoVariableConcepto("");
                    setCostoVariableCantidad("");
                  }}
                >
                  Registrar
                </Button>
              </CardFooter>
            </Card>
            <Card>
              <CardHeader className="flex justify-center content-center items-center">
                VARIOS
              </CardHeader>
              <CardBody className="flex flex-col">
                {listaVarios
                  .filter(
                    (vario) =>
                      vario.concepto != "tasa de interes(TREMA)" &&
                      vario.concepto != "plazo del credito"
                  )
                  .map((vario, index) => (
                    <div key={`${vario.concepto}-${index}`}>
                      <Input
                        label={`${vario.concepto}:`}
                        labelPlacement="outside-left"
                        placeholder="Ingrese Cantidad"
                        variant="underlined"
                        type="number"
                        value={String(vario.valor)}
                        onValueChange={(value) =>
                          handleListaVarios(index + 2, Number(value))
                        }
                      />
                    </div>
                  ))}
              </CardBody>
            </Card>
          </section>
        </section>
        <section className="flex flex-col size-full gap-3">
          <Card>
            <CardHeader className="flex content-center items-center justify-center">
              <h1>COSTOS FIJOS</h1>
            </CardHeader>
            <CardBody className="flex flex-col">
              {costosFijos.map((costo, index) => (
                <div key={`${costo.concepto}-${index}`}>
                  <Input
                    label={`${costo.concepto}:`}
                    labelPlacement="outside-left"
                    placeholder="Ingrese Cantidad"
                    variant="underlined"
                    type="number"
                    value={String(costo.monto)}
                    onValueChange={(value) =>
                      handleCostosFijosChange(index, Number(value))
                    }
                  />
                </div>
              ))}
            </CardBody>
          </Card>
          <Card>
            <CardBody className="flex gap-6">
              <Button>GENERAR PROYECCION</Button>
              <Button>GUARDAR VALORES</Button>
            </CardBody>
          </Card>
        </section>
      </section>
      <section>
        <Card>
          <CardHeader className="flex justify-center">
            PROYECCION DE DEMANDA ANUAL POR MESES
          </CardHeader>
          <CardBody className="flex flex-col gap-3">
            <p>Selecciona por cada mes como esperas que sea la demanda</p>
            <section className="grid grid-cols-3 grid-rows-4 gap-10">
              {meses.map((mes, index) => (
                <section className="flex flex-row gap-1" key={index}>
                  <p>{mes.mes}</p>
                  <RadioGroup
                    orientation="horizontal"
                    value={mes.demanda}
                    onValueChange={(value) => handleMeses(index, value)}
                  >
                    <Radio color="success" value="ALTA">
                      ALTA
                    </Radio>
                    <Radio color="warning" value="MEDIA">
                      MEDIA
                    </Radio>
                    <Radio color="danger" value="BAJA">
                      BAJA
                    </Radio>
                  </RadioGroup>
                </section>
              ))}
            </section>
          </CardBody>
        </Card>
      </section>
      <section>
        <Card>
          <CardHeader className="flex justify-center">
            <h1>PROYECCION FINANCIERA</h1>
          </CardHeader>
          <CardBody className="flex flex-col gap-4">
            <h2>ACTIVOS</h2>
            <section>
              <h3>TERRENOS Y EDIFICIOS</h3>
              <Table aria-label="tabla de activos">
                <TableHeader>
                  <TableColumn>Concepto</TableColumn>
                  <TableColumn>Cantidad</TableColumn>
                  <TableColumn>Precio unitario</TableColumn>
                  <TableColumn>Inversion</TableColumn>
                  <TableColumn>Se tiene</TableColumn>
                  <TableColumn>Aportacion propia</TableColumn>
                  <TableColumn>Financiamiento Externo</TableColumn>
                </TableHeader>
                <TableBody>
                  {listaActivos
                    .filter((activo) => activo.tipo == TipoDeActivo[1])
                    .map((activo, index) => (
                      <TableRow key={index}>
                        <TableCell>{activo.concepto}</TableCell>
                        <TableCell>{activo.cantidad}</TableCell>
                        <TableCell>{"$" + activo.precioUnitario}</TableCell>
                        <TableCell>
                          {"$" + activo.precioUnitario * activo.cantidad}
                        </TableCell>
                        <TableCell>{"$" + activo.seTiene}</TableCell>
                        <TableCell>{activo.propia}</TableCell>
                        <TableCell>
                          {"$" +
                            (activo.precioUnitario * activo.cantidad -
                              (Number(activo.seTiene) + Number(activo.propia)))}
                        </TableCell>
                      </TableRow>
                    ))}
                </TableBody>
              </Table>
              <p>
                Total del concepto: $
                {listaActivos
                  .filter((activo) => activo.tipo === TipoDeActivo[1])
                  .reduce(
                    (suma, activo) =>
                      suma + activo.cantidad * activo.precioUnitario,
                    0
                  )}
              </p>

              <p>
                Total de compras: $
                {listaActivos
                  .filter((activo) => activo.tipo === TipoDeActivo[1])
                  .reduce(
                    (suma, activo) =>
                      suma +
                      (activo.cantidad * activo.precioUnitario -
                        Number(activo.seTiene)),
                    0
                  )}
              </p>
            </section>
            <section>
              <h3>MAQUINARIA Y EQUIPO</h3>
              <Table aria-label="tabla de activos">
                <TableHeader>
                  <TableColumn>Concepto</TableColumn>
                  <TableColumn>Cantidad</TableColumn>
                  <TableColumn>Precio unitario</TableColumn>
                  <TableColumn>Inversion</TableColumn>
                  <TableColumn>Se tiene</TableColumn>
                  <TableColumn>Aportacion propia</TableColumn>
                  <TableColumn>Financiamiento Externo</TableColumn>
                </TableHeader>
                <TableBody>
                  {listaActivos
                    .filter((activo) => activo.tipo == TipoDeActivo[0])
                    .map((activo, index) => (
                      <TableRow key={index}>
                        <TableCell>{activo.concepto}</TableCell>
                        <TableCell>{activo.cantidad}</TableCell>
                        <TableCell>{"$" + activo.precioUnitario}</TableCell>
                        <TableCell>
                          {"$" + activo.precioUnitario * activo.cantidad}
                        </TableCell>
                        <TableCell>{"$" + activo.seTiene}</TableCell>
                        <TableCell>{activo.propia}</TableCell>
                        <TableCell>
                          {"$" +
                            (activo.precioUnitario * activo.cantidad -
                              (Number(activo.seTiene) + Number(activo.propia)))}
                        </TableCell>
                      </TableRow>
                    ))}
                </TableBody>
              </Table>
              <p>
                Total del concepto: $
                {listaActivos
                  .filter((activo) => activo.tipo === TipoDeActivo[0])
                  .reduce(
                    (suma, activo) =>
                      suma + activo.cantidad * activo.precioUnitario,
                    0
                  )}
              </p>

              <p>
                Total de compras: $
                {listaActivos
                  .filter((activo) => activo.tipo === TipoDeActivo[0])
                  .reduce(
                    (suma, activo) =>
                      suma +
                      (activo.cantidad * activo.precioUnitario -
                        Number(activo.seTiene)),
                    0
                  )}
              </p>
            </section>
            <section>
              <h3>EQUIPO DE TRANSPORTE</h3>
              <Table aria-label="tabla de activos">
                <TableHeader>
                  <TableColumn>Concepto</TableColumn>
                  <TableColumn>Cantidad</TableColumn>
                  <TableColumn>Precio unitario</TableColumn>
                  <TableColumn>Inversion</TableColumn>
                  <TableColumn>Se tiene</TableColumn>
                  <TableColumn>Aportacion propia</TableColumn>
                  <TableColumn>Financiamiento Externo</TableColumn>
                </TableHeader>
                <TableBody>
                  {listaActivos
                    .filter((activo) => activo.tipo == TipoDeActivo[2])
                    .map((activo, index) => (
                      <TableRow key={index}>
                        <TableCell>{activo.concepto}</TableCell>
                        <TableCell>{activo.cantidad}</TableCell>
                        <TableCell>{"$" + activo.precioUnitario}</TableCell>
                        <TableCell>
                          {"$" + activo.precioUnitario * activo.cantidad}
                        </TableCell>
                        <TableCell>{"$" + activo.seTiene}</TableCell>
                        <TableCell>{activo.propia}</TableCell>
                        <TableCell>
                          {"$" +
                            (activo.precioUnitario * activo.cantidad -
                              (Number(activo.seTiene) + Number(activo.propia)))}
                        </TableCell>
                      </TableRow>
                    ))}
                </TableBody>
              </Table>
              <p>
                Total del concepto: $
                {listaActivos
                  .filter((activo) => activo.tipo === TipoDeActivo[2])
                  .reduce(
                    (suma, activo) =>
                      suma + activo.cantidad * activo.precioUnitario,
                    0
                  )}
              </p>

              <p>
                Total de compras: $
                {listaActivos
                  .filter((activo) => activo.tipo === TipoDeActivo[2])
                  .reduce(
                    (suma, activo) =>
                      suma +
                      (activo.cantidad * activo.precioUnitario -
                        Number(activo.seTiene)),
                    0
                  )}
              </p>
            </section>
            <section>
              <h3>MOBILIARIO DE OFICINA</h3>
              <Table aria-label="tabla de activos">
                <TableHeader>
                  <TableColumn>Concepto</TableColumn>
                  <TableColumn>Cantidad</TableColumn>
                  <TableColumn>Precio unitario</TableColumn>
                  <TableColumn>Inversion</TableColumn>
                  <TableColumn>Se tiene</TableColumn>
                  <TableColumn>Aportacion propia</TableColumn>
                  <TableColumn>Financiamiento Externo</TableColumn>
                </TableHeader>
                <TableBody>
                  {listaActivos
                    .filter((activo) => activo.tipo == TipoDeActivo[3])
                    .map((activo, index) => (
                      <TableRow key={index}>
                        <TableCell>{activo.concepto}</TableCell>
                        <TableCell>{activo.cantidad}</TableCell>
                        <TableCell>{"$" + activo.precioUnitario}</TableCell>
                        <TableCell>
                          {"$" + activo.precioUnitario * activo.cantidad}
                        </TableCell>
                        <TableCell>{"$" + activo.seTiene}</TableCell>
                        <TableCell>{activo.propia}</TableCell>
                        <TableCell>
                          {"$" +
                            (activo.precioUnitario * activo.cantidad -
                              (Number(activo.seTiene) + Number(activo.propia)))}
                        </TableCell>
                      </TableRow>
                    ))}
                </TableBody>
              </Table>
              <p>
                Total del concepto: $
                {listaActivos
                  .filter((activo) => activo.tipo === TipoDeActivo[3])
                  .reduce(
                    (suma, activo) =>
                      suma + activo.cantidad * activo.precioUnitario,
                    0
                  )}
              </p>

              <p>
                Total de compras: $
                {listaActivos
                  .filter((activo) => activo.tipo === TipoDeActivo[3])
                  .reduce(
                    (suma, activo) =>
                      suma +
                      (activo.cantidad * activo.precioUnitario -
                        Number(activo.seTiene)),
                    0
                  )}
              </p>
            </section>
            <section>
              <h3>EQUIPO DE COMPUTO</h3>
              <Table aria-label="tabla de activos">
                <TableHeader>
                  <TableColumn>Concepto</TableColumn>
                  <TableColumn>Cantidad</TableColumn>
                  <TableColumn>Precio unitario</TableColumn>
                  <TableColumn>Inversion</TableColumn>
                  <TableColumn>Se tiene</TableColumn>
                  <TableColumn>Aportacion propia</TableColumn>
                  <TableColumn>Financiamiento Externo</TableColumn>
                </TableHeader>
                <TableBody>
                  {listaActivos
                    .filter((activo) => activo.tipo == TipoDeActivo[4])
                    .map((activo, index) => (
                      <TableRow key={index}>
                        <TableCell>{activo.concepto}</TableCell>
                        <TableCell>{activo.cantidad}</TableCell>
                        <TableCell>{"$" + activo.precioUnitario}</TableCell>
                        <TableCell>
                          {"$" + activo.precioUnitario * activo.cantidad}
                        </TableCell>
                        <TableCell>{"$" + activo.seTiene}</TableCell>
                        <TableCell>{activo.propia}</TableCell>
                        <TableCell>
                          {"$" +
                            (activo.precioUnitario * activo.cantidad -
                              (Number(activo.seTiene) + Number(activo.propia)))}
                        </TableCell>
                      </TableRow>
                    ))}
                </TableBody>
              </Table>
              <p>
                Total del concepto: $
                {listaActivos
                  .filter((activo) => activo.tipo === TipoDeActivo[4])
                  .reduce(
                    (suma, activo) =>
                      suma + activo.cantidad * activo.precioUnitario,
                    0
                  )}
              </p>

              <p>
                Total de compras: $
                {listaActivos
                  .filter((activo) => activo.tipo === TipoDeActivo[4])
                  .reduce(
                    (suma, activo) =>
                      suma +
                      (activo.cantidad * activo.precioUnitario -
                        Number(activo.seTiene)),
                    0
                  )}
              </p>
            </section>
            <section>
              <h3>GASTOS DE INSTALACION</h3>
              <Table aria-label="tabla de activos">
                <TableHeader>
                  <TableColumn>Concepto</TableColumn>
                  <TableColumn>Cantidad</TableColumn>
                  <TableColumn>Precio unitario</TableColumn>
                  <TableColumn>Inversion</TableColumn>
                  <TableColumn>Se tiene</TableColumn>
                  <TableColumn>Aportacion propia</TableColumn>
                  <TableColumn>Financiamiento Externo</TableColumn>
                </TableHeader>
                <TableBody>
                  {listaActivos
                    .filter((activo) => activo.tipo == TipoDeActivo[5])
                    .map((activo, index) => (
                      <TableRow key={index}>
                        <TableCell>{activo.concepto}</TableCell>
                        <TableCell>{activo.cantidad}</TableCell>
                        <TableCell>{"$" + activo.precioUnitario}</TableCell>
                        <TableCell>
                          {"$" + activo.precioUnitario * activo.cantidad}
                        </TableCell>
                        <TableCell>{"$" + activo.seTiene}</TableCell>
                        <TableCell>{activo.propia}</TableCell>
                        <TableCell>
                          {"$" +
                            (activo.precioUnitario * activo.cantidad -
                              (Number(activo.seTiene) + Number(activo.propia)))}
                        </TableCell>
                      </TableRow>
                    ))}
                </TableBody>
              </Table>
              <p>
                Total del concepto: $
                {listaActivos
                  .filter((activo) => activo.tipo === TipoDeActivo[5])
                  .reduce(
                    (suma, activo) =>
                      suma + activo.cantidad * activo.precioUnitario,
                    0
                  )}
              </p>

              <p>
                Total de compras: $
                {listaActivos
                  .filter((activo) => activo.tipo === TipoDeActivo[5])
                  .reduce(
                    (suma, activo) =>
                      suma +
                      (activo.cantidad * activo.precioUnitario -
                        Number(activo.seTiene)),
                    0
                  )}
              </p>
            </section>
            <section>
              <h3>ACTIVOS CIRCULANTES</h3>
              <Table aria-label="tabla de activos">
                <TableHeader>
                  <TableColumn>Concepto</TableColumn>
                  <TableColumn>Cantidad</TableColumn>
                  <TableColumn>Precio unitario</TableColumn>
                  <TableColumn>Inversion</TableColumn>
                  <TableColumn>Se tiene</TableColumn>
                  <TableColumn>Aportacion propia</TableColumn>
                  <TableColumn>Financiamiento Externo</TableColumn>
                </TableHeader>
                <TableBody>
                  {activosCirculantes.map((activo, index) => (
                    <TableRow key={index}>
                      <TableCell>{activo.concepto}</TableCell>
                      <TableCell>{activo.cantidad}</TableCell>
                      <TableCell>${activo.precioUnitario}</TableCell>
                      <TableCell>
                        ${activo.cantidad * activo.precioUnitario}
                      </TableCell>
                      <TableCell>
                        <Input
                          placeholder="Ingresa la cantidad"
                          variant="underlined"
                          value={String(activo.seTiene)}
                          onValueChange={(value) => {
                            handleSeTieneChange(index, Number(value));
                            handleCredito(creditoTotal);
                          }}
                          type="number"
                        />
                      </TableCell>
                      <TableCell>
                        <Input
                          placeholder="Ingresa la cantidad"
                          variant="underlined"
                          value={String(activo.propia)}
                          onValueChange={(value) => {
                            handlePropiaChange(index, Number(value));
                            handleCredito(creditoTotal);
                          }}
                          type="number"
                        />
                      </TableCell>
                      <TableCell>
                        $
                        {activo.cantidad * activo.precioUnitario -
                          (Number(activo.seTiene) + Number(activo.propia))}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
              <p>
                Total del concepto: $
                {activosCirculantes.reduce(
                  (suma, activo) =>
                    suma + activo.cantidad * activo.precioUnitario,
                  0
                )}
              </p>

              <p>
                Total de compras: $
                {activosCirculantes
                  .filter((activo) => activo.concepto === "INVENTARIOS")
                  .reduce(
                    (suma, activo) =>
                      suma +
                      (activo.cantidad * activo.precioUnitario -
                        Number(activo.seTiene)),
                    0
                  )}
              </p>
            </section>
            <section>
              <h2>TOTALES</h2>
              <Table>
                <TableHeader>
                  <TableColumn>{[]}</TableColumn>
                  <TableColumn>Total</TableColumn>
                  <TableColumn>Se tiEne</TableColumn>
                  <TableColumn>Propia</TableColumn>
                  <TableColumn>Bancos</TableColumn>
                </TableHeader>
                <TableBody>
                  <TableRow>
                    <TableCell>Total de inverisones ($)</TableCell>
                    <TableCell>
                      {listaActivos.reduce(
                        (suma, activo) =>
                          (suma += activo.cantidad * activo.precioUnitario),
                        0
                      ) +
                        activosCirculantes.reduce(
                          (suma, activo) =>
                            (suma += activo.cantidad * activo.precioUnitario),
                          0
                        )}
                    </TableCell>
                    <TableCell>
                      {listaActivos.reduce(
                        (suma, activo) => (suma += Number(activo.seTiene)),
                        0
                      ) +
                        activosCirculantes.reduce(
                          (suma, activo) => (suma += Number(activo.seTiene)),
                          0
                        )}
                    </TableCell>
                    <TableCell>
                      {listaActivos.reduce(
                        (suma, activo) => (suma += Number(activo.propia)),
                        0
                      ) +
                        activosCirculantes.reduce(
                          (suma, activo) => (suma += Number(activo.propia)),
                          0
                        )}
                    </TableCell>
                    <TableCell>
                      {listaActivos.reduce(
                        (suma, activo) =>
                          (suma +=
                            activo.cantidad * activo.precioUnitario -
                            (Number(activo.seTiene) + Number(activo.propia))),
                        0
                      ) +
                        activosCirculantes.reduce(
                          (suma, activo) =>
                            (suma +=
                              activo.cantidad * activo.precioUnitario -
                              (Number(activo.seTiene) + Number(activo.propia))),
                          0
                        )}
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>Total de inverisones (%)</TableCell>
                    <TableCell>100%</TableCell>
                    <TableCell>
                      {(() => {
                        const total =
                          listaActivos.reduce(
                            (suma, activo) =>
                              (suma += activo.cantidad * activo.precioUnitario),
                            0
                          ) +
                          activosCirculantes.reduce(
                            (suma, activo) =>
                              (suma += activo.cantidad * activo.precioUnitario),
                            0
                          );
                        const valor =
                          listaActivos.reduce(
                            (suma, activo) => (suma += Number(activo.seTiene)),
                            0
                          ) +
                          activosCirculantes.reduce(
                            (suma, activo) => (suma += Number(activo.seTiene)),
                            0
                          );
                        return `${(valor / total) * 100}%`;
                      })()}
                    </TableCell>
                    <TableCell>
                      {(() => {
                        const total =
                          listaActivos.reduce(
                            (suma, activo) =>
                              (suma += activo.cantidad * activo.precioUnitario),
                            0
                          ) +
                          activosCirculantes.reduce(
                            (suma, activo) =>
                              (suma += activo.cantidad * activo.precioUnitario),
                            0
                          );
                        const valor =
                          listaActivos.reduce(
                            (suma, activo) => (suma += Number(activo.propia)),
                            0
                          ) +
                          activosCirculantes.reduce(
                            (suma, activo) => (suma += Number(activo.propia)),
                            0
                          );
                        return `${(valor / total) * 100}%`;
                      })()}
                    </TableCell>
                    <TableCell>
                      {(() => {
                        const total =
                          listaActivos.reduce(
                            (suma, activo) =>
                              (suma += activo.cantidad * activo.precioUnitario),
                            0
                          ) +
                          activosCirculantes.reduce(
                            (suma, activo) =>
                              (suma += activo.cantidad * activo.precioUnitario),
                            0
                          );
                        const valor =
                          listaActivos.reduce(
                            (suma, activo) =>
                              (suma +=
                                activo.cantidad * activo.precioUnitario -
                                (Number(activo.seTiene) +
                                  Number(activo.propia))),
                            0
                          ) +
                          activosCirculantes.reduce(
                            (suma, activo) =>
                              (suma +=
                                activo.cantidad * activo.precioUnitario -
                                (Number(activo.seTiene) +
                                  Number(activo.propia))),
                            0
                          );
                        return `${(valor / total) * 100}%`;
                      })()}
                    </TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </section>
            <section>
              <h2>COMPRAS A REALIZAR</h2>
              <section className="grid grid-cols-3 grid-rows-2">
                <p>
                  Maquinas y Herramientas:$
                  {listaActivos
                    .filter((activo) => activo.tipo == TipoDeActivo[0])
                    .reduce(
                      (suma, activo) =>
                        suma +
                        (activo.cantidad * activo.precioUnitario -
                          Number(activo.seTiene)),
                      0
                    )}
                </p>
                <p>
                  Transporte:$
                  {listaActivos
                    .filter((activo) => activo.tipo == TipoDeActivo[2])
                    .reduce(
                      (suma, activo) =>
                        suma +
                        (activo.cantidad * activo.precioUnitario -
                          Number(activo.seTiene)),
                      0
                    )}
                </p>
                <p>
                  Equipo de computo:$
                  {listaActivos
                    .filter((activo) => activo.tipo == TipoDeActivo[4])
                    .reduce(
                      (suma, activo) =>
                        suma +
                        (activo.cantidad * activo.precioUnitario -
                          Number(activo.seTiene)),
                      0
                    )}
                </p>
                <p>
                  Gastos de instalacion:$
                  {listaActivos
                    .filter((activo) => activo.tipo == TipoDeActivo[5])
                    .reduce(
                      (suma, activo) =>
                        suma +
                        (activo.cantidad * activo.precioUnitario -
                          Number(activo.seTiene)),
                      0
                    )}
                </p>
                <p>
                  Mobiliario de oficina:$
                  {listaActivos
                    .filter((activo) => activo.tipo == TipoDeActivo[3])
                    .reduce(
                      (suma, activo) =>
                        suma +
                        (activo.cantidad * activo.precioUnitario -
                          Number(activo.seTiene)),
                      0
                    )}
                </p>
                <p>
                  inventario inicial:$
                  {activosCirculantes
                    .filter((activo) => activo.concepto == "INVENTARIOS")
                    .reduce(
                      (suma, activo) =>
                        suma +
                        (activo.cantidad * activo.precioUnitario -
                          Number(activo.seTiene)),
                      0
                    )}
                </p>
              </section>
              <p>
                Total de compras: $
                {listaActivos
                  .filter((activo) => activo.tipo != "TERRENOS Y EDIFICIOS")
                  .reduce(
                    (suma, activo) =>
                      (suma += activo.cantidad * activo.precioUnitario),
                    0
                  ) +
                  activosCirculantes[2].cantidad *
                    activosCirculantes[2].precioUnitario}
              </p>
            </section>
            <section className="grid grid-cols-3">
              <p>
                monto: $
                {listaActivos.reduce(
                  (suma, activo) =>
                    (suma +=
                      activo.cantidad * activo.precioUnitario -
                      (Number(activo.seTiene) + Number(activo.propia))),
                  0
                ) +
                  activosCirculantes.reduce(
                    (suma, activo) =>
                      (suma +=
                        activo.cantidad * activo.precioUnitario -
                        (Number(activo.seTiene) + Number(activo.propia))),
                    0
                  )}
              </p>
              <p>Plazo: {listaVarios[1].valor} años</p>
              <p>Tasa: {listaVarios[0].valor} %</p>
            </section>
            <section>
              <h2>COSTOS</h2>
              <h3>COSTOS FIJOS</h3>
              <Table>
                <TableHeader>
                  <TableColumn>Concepto</TableColumn>
                  <TableColumn>Monto</TableColumn>
                </TableHeader>

                <TableBody>
                  {item.map((costo, index) => (
                    <TableRow key={index}>
                      <TableCell>{costo.concepto}</TableCell>
                      <TableCell>${costo.monto}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>

              <h3>COSTOS VARIABLES</h3>
              <Table>
                <TableHeader>
                  <TableColumn>Concepto</TableColumn>
                  <TableColumn>Monto</TableColumn>
                </TableHeader>
                <TableBody>
                  {costosVariables.map((costo, index) => (
                    <TableRow key={index}>
                      <TableCell>{costo.concepto}</TableCell>
                      <TableCell>${costo.monto}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
              <section className="grid grid-cols-3">
                <p>
                  costo mensual: $
                  {item.reduce(
                    (suma, costo) => (suma += Number(costo.monto)),
                    0
                  )}
                </p>
                <p>TMP OP: {listaVarios[2].valor}</p>
                <p>Saldo inicial: ${saldoInicial.toFixed(2)}</p>
              </section>
            </section>
            <section>
              <h2>FORMULAS</h2>
              <p>Porcentaje de ganancia deseado: {listaVarios[3].valor}%</p>
              <section className="grid grid-cols-2 grid-rows-2 gap-8">
                <section className="flex flex-col gap-2">
                  <p>
                    <strong>COSTO TOTAL DEL PRODUCTO O SERVICIO</strong>
                  </p>
                  <p>CT = CTOS. VARIABLES + ( CTOS. FIJOS / PROD. ESPERADA )</p>
                  <p>
                    CT = {totalCostosVariables.toFixed(2)} + (
                    {totalCostosFijos.toFixed(2)} /{" "}
                    {produccionEsperada.toFixed(2)})
                  </p>
                  <p>CT = ${CT.toFixed(2)}</p>
                </section>

                <section className="flex flex-col gap-2 mt-4">
                  <p>
                    <strong>PRECIO DE VENTA A LOS MINORISTAS</strong>
                  </p>
                  <p>PV = CTO. TOTAL + ( CTO. TOTAL × % GANANCIA DESEADA )</p>
                  <p>
                    PVm = {CT.toFixed(2)} + ({CT.toFixed(2)} ×{" "}
                    {gananciaDeseada * 100}%)
                  </p>
                  <p>PVm = ${PVm.toFixed(2)}</p>
                </section>

                <section className="flex flex-col gap-2">
                  <p>PRECIO DE VENTA FINAL A LOS CLIENTES</p>
                  <p>PVF = PR. MIN.+ ( PR. MIN. X % GAN. DESEADA )</p>
                  <p>
                    PVF = {PVm.toFixed(2)} +({PVm.toFixed(2)} *{" "}
                    {margenDeGanancia * 100}%)
                  </p>
                  <p>
                    Precio de venta final (unitario) con utilidad deseada:{" "}
                    <strong>${PVF.toFixed(2)}</strong>
                  </p>
                </section>

                <section className="flex flex-col gap-2 mt-4">
                  <p>
                    <strong>
                      PUNTO DE EQUILIBRIO (VTAS. MIN. PARA CUBRIR COSTOS)
                    </strong>
                  </p>
                  <p>PE = CTOS.FIJOS / ( PR. VTA FIN. - CTOS. VARIABLES )</p>
                  <p>
                    PE = {totalCostosFijos.toFixed(2)} / ({PVF.toFixed(2)} -{" "}
                    {PVF.toFixed(2)})
                  </p>
                  <p>PE = {PE.toFixed(2)} unidades</p>
                </section>
              </section>
            </section>
            <section className="mt-6">
              <h2 className="text-xl font-semibold mb-4">
                Presupuesto operativo anual
              </h2>

              <Table>
                <TableHeader>
                  <TableColumn>PORCENTAJE</TableColumn>
                  <TableColumn>TEMPORADA</TableColumn>
                  <TableColumn>VENTAS</TableColumn>
                  <TableColumn>VENTAS NETAS</TableColumn>
                  <TableColumn>COSTO TOTAL</TableColumn>
                  <TableColumn>GASTO DE OPERACIO</TableColumn>
                </TableHeader>
                <TableBody>
                  <TableRow>
                    <TableCell>15%</TableCell>
                    <TableCell>ALTA</TableCell>
                    <TableCell>{produccionEsperada.toFixed(2)}</TableCell>
                    <TableCell>
                      {(produccionEsperada * PVF).toFixed(2)}
                    </TableCell>
                    <TableCell>
                      {(produccionEsperada * CT).toFixed(2)}
                    </TableCell>
                    <TableCell>
                      {(0.15 * (produccionEsperada * PVF)).toFixed(2)}
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>13%</TableCell>
                    <TableCell>MEDIA</TableCell>
                    <TableCell>
                      {((PE + produccionEsperada) / 2).toFixed(2)}
                    </TableCell>
                    <TableCell>
                      {(((PE + produccionEsperada) / 2) * PVF).toFixed(2)}
                    </TableCell>
                    <TableCell>
                      {(((PE + produccionEsperada) / 2) * CT).toFixed(2)}
                    </TableCell>
                    <TableCell>
                      {(0.13 * (((PE + produccionEsperada) / 2) * PVF)).toFixed(
                        2
                      )}
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>10%</TableCell>
                    <TableCell>BAJA</TableCell>
                    <TableCell>{PE.toFixed(2)}</TableCell>
                    <TableCell>{(PE * PVF).toFixed(2)}</TableCell>
                    <TableCell>{(PE * CT).toFixed(2)}</TableCell>
                    <TableCell>{(0.1 * (PE * PVF)).toFixed(2)}</TableCell>
                  </TableRow>
                </TableBody>
              </Table>

              <Table aria-label="Presupuesto operativo anual">
                <TableHeader>
                  <TableColumn>Mes</TableColumn>
                  <TableColumn>Demanda</TableColumn>
                  <TableColumn>Ventas Netas</TableColumn>
                  <TableColumn>Costo Ventas</TableColumn>
                  <TableColumn>Gastos Operación</TableColumn>
                </TableHeader>
                <TableBody>
                  {meses.map(({ mes, demanda }) => {
                    const { porcentaje, unidades } = calcularBase(demanda);

                    const ventasNetas = unidades * PVF;
                    const costoVentas = unidades * CT;
                    const gastosOperacion = porcentaje * ventasNetas;

                    return (
                      <TableRow key={mes}>
                        <TableCell>{mes}</TableCell>
                        <TableCell>
                          <span
                            className={`px-2 py-1 rounded-full text-white font-semibold text-sm ${
                              demanda === "ALTA"
                                ? "bg-green-500"
                                : demanda === "MEDIA"
                                  ? "bg-yellow-500"
                                  : demanda === "BAJA"
                                    ? "bg-red-500"
                                    : ""
                            }`}
                          >
                            {demanda}
                          </span>
                        </TableCell>
                        <TableCell>${ventasNetas.toFixed(2)}</TableCell>
                        <TableCell>${costoVentas.toFixed(2)}</TableCell>
                        <TableCell>${gastosOperacion.toFixed(2)}</TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
              <div>
                <h3 className="text-lg font-semibold mb-2">Resumen anual</h3>
                <div className="grid grid-cols-3 gap-4 text-center">
                  <div>
                    <p className="text-sm text-gray-500">Ventas Netas</p>
                    <p className="text-lg font-bold text-green-600">
                      ${ventasNetasAnuales.toFixed(2)}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Costos Operativos</p>
                    <p className="text-lg font-bold text-red-600">
                      ${costosOperativosAnuales.toFixed(2)}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Gastos operativos</p>
                    <p className="text-lg font-bold text-blue-600">
                      ${gastosOperativosAnuales.toFixed(2)}
                    </p>
                  </div>
                </div>
              </div>
            </section>
            <section>
              <Table>
                <TableHeader>
                  <TableColumn>Presupuestos operativos</TableColumn>
                  <TableColumn>Año 0</TableColumn>
                  <TableColumn>Año 1</TableColumn>
                  <TableColumn>Año 2(10%)</TableColumn>
                  <TableColumn>Año 3(13%)</TableColumn>
                  <TableColumn>Año 4(17%)</TableColumn>
                  <TableColumn>Año 5(17%)</TableColumn>
                </TableHeader>
                <TableBody>
                  {[
                    { concepto: "Ventas netas", valor: ventasNetasAnuales },
                    {
                      concepto: "Costos anuales",
                      valor: costosOperativosAnuales,
                    },
                    {
                      concepto: "Gastos anuales",
                      valor: gastosOperativosAnuales,
                    },
                  ].map((data, index) => (
                    <TableRow key={index}>
                      <TableCell>{data.concepto}</TableCell>
                      <TableCell>0</TableCell>
                      <TableCell>$ {data.valor}</TableCell>
                      <TableCell>$ {data.valor * 1.1}</TableCell>
                      <TableCell>$ {data.valor * 1.13}</TableCell>
                      <TableCell>$ {data.valor * 1.17}</TableCell>
                      <TableCell>$ {data.valor * 1.17}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </section>
            <section className="grid grid-cols-2 grid-rows-3 gap-9">
              <section>
                <h3>TASA DE IMPUESTOS</h3>
                <Input
                  variant="underlined"
                  placeholder="Ingrese el porcentaje"
                />
              </section>
              <section className="grid grid-cols-2 grid-row-2">
                <h3 className="col-span-2">SALDO INICIAL</h3>
                <strong>{saldoInicial.toFixed(2)}</strong>
              </section>
              <section>
                <h3>CLIENTES 20%</h3>
                <Input
                  placeholder="Ingrese la cantidad de clientes "
                  variant="underlined"
                  onValueChange={(value) => {
                    actualizarPrecioUnitario("CLIENTES", Number(value));
                  }}
                />
                <p>
                  estimado con P.E ={" "}
                  <strong>{(PE * 0.2 * PVF).toFixed(2)}</strong>
                </p>
              </section>
              <section className="grid grid-cols-2 grid-row-2">
                <h3 className="col-span-2">INVENTARIOS</h3>
                <Input
                  variant="underlined"
                  placeholder="Ingrese la cantidad del inventario"
                  onValueChange={(value) => {
                    const nuevoSaldo =
                      item.reduce(
                        (suma, costo) => (suma += Number(costo.monto)),
                        0
                      ) * Number(listaVarios[2].valor);
                    actualizarPrecioUnitario("BANCOS", nuevoSaldo);
                    actualizarPrecioUnitario("INVENTARIOS", Number(value));
                  }}
                />
                <p></p>
              </section>
              <section>
                <h3>PROVEEDORES 10%</h3>
                <Input
                  placeholder="Ingrese la cantidad de proveedor "
                  variant="underlined"
                  onValueChange={setProveedores}
                  value={proveedores}
                  type="number"
                />
                <p>
                  estimado con P.E ={" "}
                  <strong>{(PE * 0.1 * CT).toFixed(2)}</strong>
                </p>
              </section>
              <section>
                <h3>CAPITAL SOCIAL</h3>
                <strong>{(totalPropia + totalSeTiene).toFixed(2)}</strong>
              </section>
            </section>
            <section>
              <section>
                <h1>
                  <strong>AMORTIGUACION DE CREDITO</strong>
                </h1>
                <section className="flex gap-6">
                  <p>monto: ${totalInversiones.toFixed(2)}</p>
                  <p>plazo: {plazo.toFixed(2)} años</p>
                  <p>tasa: {trema.toFixed(2)}%</p>
                </section>
                <Table aria-label="Tabla de crédito">
                  <TableHeader>{columnas}</TableHeader>
                  <TableBody>
                    <TableRow>
                      <TableCell>Saldo inicial</TableCell>
                      <TableCell>{tablaCredito[0].saldoInicial}</TableCell>
                      <TableCell>{tablaCredito[1].saldoInicial}</TableCell>
                      <TableCell>{tablaCredito[2].saldoInicial}</TableCell>
                      <TableCell>{tablaCredito[3].saldoInicial}</TableCell>
                      <TableCell>{tablaCredito[4].saldoInicial}</TableCell>
                      <TableCell>{tablaCredito[5].saldoInicial}</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell>Abono a Capital</TableCell>
                      <TableCell>{tablaCredito[0].abonoCapital}</TableCell>
                      <TableCell>{tablaCredito[1].abonoCapital}</TableCell>
                      <TableCell>{tablaCredito[2].abonoCapital}</TableCell>
                      <TableCell>{tablaCredito[3].abonoCapital}</TableCell>
                      <TableCell>{tablaCredito[4].abonoCapital}</TableCell>
                      <TableCell>{tablaCredito[5].abonoCapital}</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell> interes</TableCell>
                      <TableCell>{tablaCredito[0].intereses}</TableCell>
                      <TableCell>{tablaCredito[1].intereses}</TableCell>
                      <TableCell>{tablaCredito[2].intereses}</TableCell>
                      <TableCell>{tablaCredito[3].intereses}</TableCell>
                      <TableCell>{tablaCredito[4].intereses}</TableCell>
                      <TableCell>{tablaCredito[5].intereses}</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell>Pago total</TableCell>
                      <TableCell>{tablaCredito[0].pagoTotal}</TableCell>
                      <TableCell>{tablaCredito[1].pagoTotal}</TableCell>
                      <TableCell>{tablaCredito[2].pagoTotal}</TableCell>
                      <TableCell>{tablaCredito[3].pagoTotal}</TableCell>
                      <TableCell>{tablaCredito[4].pagoTotal}</TableCell>
                      <TableCell>{tablaCredito[5].pagoTotal}</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell>Saldo final</TableCell>
                      <TableCell>{tablaCredito[0].saldoFinal}</TableCell>
                      <TableCell>{tablaCredito[1].saldoFinal}</TableCell>
                      <TableCell>{tablaCredito[2].saldoFinal}</TableCell>
                      <TableCell>{tablaCredito[3].saldoFinal}</TableCell>
                      <TableCell>{tablaCredito[4].saldoFinal}</TableCell>
                      <TableCell>{tablaCredito[5].saldoFinal}</TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </section>
              <section>
                <h1>
                  <strong>DEPRECIACIONES Y AMORTIZACIONES</strong>
                </h1>
                <section>
                  <h2>Depreciaciones</h2>
                  <Table>
                    <TableHeader>
                      <TableColumn>Concepto</TableColumn>
                      <TableColumn>Monto</TableColumn>
                      <TableColumn>Vida util</TableColumn>
                      <TableColumn>Depreciacion anual</TableColumn>
                    </TableHeader>
                    <TableBody>
                      {depreciaciones.map((concepto, index) => (
                        <TableRow key={index}>
                          <TableCell>{concepto.texto}</TableCell>
                          <TableCell>$ {concepto.monto}</TableCell>
                          <TableCell>{concepto.vidaUtil} años</TableCell>
                          <TableCell>
                            $ {concepto.depreciciacionAnual}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </section>
                <section>
                  <h2>Amortizaciones</h2>
                  <Table>
                    <TableHeader>
                      <TableColumn>Concepto</TableColumn>
                      <TableColumn>Monto</TableColumn>
                      <TableColumn>Vida util</TableColumn>
                      <TableColumn>Depreciacion anual</TableColumn>
                    </TableHeader>
                    <TableBody>
                      {amortiguaciones.map((concepto, index) => (
                        <TableRow key={index}>
                          <TableCell>{concepto.texto}</TableCell>
                          <TableCell>$ {concepto.monto}</TableCell>
                          <TableCell>{concepto.vidaUtil} años</TableCell>
                          <TableCell>
                            $ {concepto.depreciciacionAnual}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </section>
                <p>
                  Total anual de amortizaciones y depreciaciones: $ {totalAD}
                </p>
                <section>
                  <section>
                    <h2>Proyeccion de depreciaciones</h2>
                    <Table>
                      <TableHeader>
                        <TableColumn>Concepto</TableColumn>
                        <TableColumn>año 0</TableColumn>
                        <TableColumn>año 1</TableColumn>
                        <TableColumn>año 2</TableColumn>
                        <TableColumn>año 3</TableColumn>
                        <TableColumn>año 4</TableColumn>
                        <TableColumn>año 5</TableColumn>
                      </TableHeader>
                      <TableBody>
                        {tablaD.map((c, i) => (
                          <TableRow key={i}>
                            <TableCell>{c.concepto}</TableCell>
                            <TableCell>${c.años[0]}</TableCell>
                            <TableCell>${c.años[1]}</TableCell>
                            <TableCell>${c.años[2]}</TableCell>
                            <TableCell>${c.años[3]}</TableCell>
                            <TableCell>${c.años[4]}</TableCell>
                            <TableCell>${c.años[5]}</TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </section>
                  <section>
                    <h2>Proyeccion de Amortizaciones</h2>
                    <Table>
                      <TableHeader>
                        <TableColumn>Concepto</TableColumn>
                        <TableColumn>año 0</TableColumn>
                        <TableColumn>año 1</TableColumn>
                        <TableColumn>año 2</TableColumn>
                        <TableColumn>año 3</TableColumn>
                        <TableColumn>año 4</TableColumn>
                        <TableColumn>año 5</TableColumn>
                      </TableHeader>
                      <TableBody>
                        {tablaA.map((c, i) => (
                          <TableRow key={i}>
                            <TableCell>{c.concepto}</TableCell>
                            <TableCell>${c.años[0]}</TableCell>
                            <TableCell>${c.años[1]}</TableCell>
                            <TableCell>${c.años[2]}</TableCell>
                            <TableCell>${c.años[3]}</TableCell>
                            <TableCell>${c.años[4]}</TableCell>
                            <TableCell>${c.años[5]}</TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </section>
                  <section>
                    <Table>
                      <TableHeader>
                        <TableColumn>Presupuestos operativos</TableColumn>
                        <TableColumn>Año 0</TableColumn>
                        <TableColumn>Año 1</TableColumn>
                        <TableColumn>Año 2</TableColumn>
                        <TableColumn>Año 3</TableColumn>
                        <TableColumn>Año 4</TableColumn>
                        <TableColumn>Año 5</TableColumn>
                      </TableHeader>
                      <TableBody>
                        {[
                          {
                            concepto: "Ventas netas",
                            valor: ventasNetasAnuales,
                          },
                          {
                            concepto: "Costos anuales",
                            valor: costosOperativosAnuales,
                          },
                          {
                            concepto: "Gastos anuales",
                            valor: gastosOperativosAnuales,
                          },
                        ].map((data, index) => (
                          <TableRow key={index}>
                            <TableCell>{data.concepto}</TableCell>
                            <TableCell>0</TableCell>
                            <TableCell>$ {data.valor}</TableCell>
                            <TableCell>$ {data.valor * 1.1}</TableCell>
                            <TableCell>$ {data.valor * 1.13}</TableCell>
                            <TableCell>$ {data.valor * 1.17}</TableCell>
                            <TableCell>$ {data.valor * 1.17}</TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </section>
                </section>
              </section>
              <section>
                <h2>
                  <strong>ESTADO DE RESULTADO</strong>
                </h2>
                <Table>
                  <TableHeader>
                    <TableColumn>Concepto</TableColumn>
                    <TableColumn>Año 0</TableColumn>
                    <TableColumn>Año 1</TableColumn>
                    <TableColumn>Año 2</TableColumn>
                    <TableColumn>Año 3</TableColumn>
                    <TableColumn>Año 4</TableColumn>
                    <TableColumn>Año 5</TableColumn>
                  </TableHeader>
                  <TableBody>
                    {tablaER.map((fila, index) => (
                      <TableRow
                        key={index}
                        className={
                          fila.Color === "ROJO"
                            ? "text-red-600 font-semibold"
                            : "text-white font-semibold"
                        }
                      >
                        <TableCell>{fila.concepto}</TableCell>
                        <TableCell>{fila.años[0]}</TableCell>
                        <TableCell>{fila.años[1]}</TableCell>
                        <TableCell>{fila.años[2]}</TableCell>
                        <TableCell>{fila.años[3]}</TableCell>
                        <TableCell>{fila.años[4]}</TableCell>
                        <TableCell>{fila.años[5]}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </section>
              <section>
                <h2>
                  <strong>ESTADO DE FLUJO DE EFECTIVO</strong>
                </h2>
                <section>
                  <Table>
                    <TableHeader>
                      <TableColumn>Concepto</TableColumn>
                      <TableColumn>Año 0</TableColumn>
                      <TableColumn>Año 1</TableColumn>
                      <TableColumn>Año 2</TableColumn>
                      <TableColumn>Año 3</TableColumn>
                      <TableColumn>Año 4</TableColumn>
                      <TableColumn>Año 5</TableColumn>
                    </TableHeader>
                    <TableBody>
                      {tablaFEFilas.map((fila) => (
                        <TableRow key={fila.concepto}>
                          <TableCell className="font-bold">
                            {fila.concepto
                              .replace(/([A-Z])/g, " $1")
                              .replace(/^\w/, (c) => c.toUpperCase())}
                          </TableCell>
                          <TableCell>{fila.años[0]}</TableCell>
                          <TableCell>{fila.años[1]}</TableCell>
                          <TableCell>{fila.años[2]}</TableCell>
                          <TableCell>{fila.años[3]}</TableCell>
                          <TableCell>{fila.años[4]}</TableCell>
                          <TableCell>{fila.años[5]}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </section>
              </section>
              <section>
                <h2>
                  <strong>Balance General</strong>
                </h2>
                <section>
                  <Table>
                    <TableHeader>
                      <TableColumn>Concepto</TableColumn>
                      <TableColumn>Año 0</TableColumn>
                      <TableColumn>Año 1</TableColumn>
                      <TableColumn>Año 2</TableColumn>
                      <TableColumn>Año 3</TableColumn>
                      <TableColumn>Año 4</TableColumn>
                      <TableColumn>Año 5</TableColumn>
                    </TableHeader>
                    <TableBody>
                      {estadoBG.map((fila) => (
                        <TableRow key={fila.concepto}>
                          <TableCell className="font-bold">
                            {fila.concepto
                              .replace(/([A-Z])/g, " $1")
                              .replace(/^\w/, (c) => c.toUpperCase())}
                          </TableCell>
                          <TableCell>{fila.años[0]}</TableCell>
                          <TableCell>{fila.años[1]}</TableCell>
                          <TableCell>{fila.años[2]}</TableCell>
                          <TableCell>{fila.años[3]}</TableCell>
                          <TableCell>{fila.años[4]}</TableCell>
                          <TableCell>{fila.años[5]}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </section>
              </section>
              <section>
                <h2>
                  <strong>Estructura financiera</strong>
                </h2>
                <section>
                  <Table>
                    <TableHeader>
                      <TableColumn>concepto</TableColumn>
                      <TableColumn>valor</TableColumn>
                    </TableHeader>
                    <TableBody>
                      <TableRow>
                        <TableCell>Inversion Fija</TableCell>
                        <TableCell>{totalFijo[0]}</TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell>Inversion Diferida</TableCell>
                        <TableCell>{totalDiferido[0]}</TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell>Capital de trabajo</TableCell>
                        <TableCell>{totalActivosCirculantes[0]}</TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell>Total inversiones</TableCell>
                        <TableCell>
                          {totalFijo[0] +
                            totalDiferido[0] +
                            totalActivosCirculantes[0]}
                        </TableCell>
                      </TableRow>
                    </TableBody>
                  </Table>
                </section>
                <section>
                  <Table>
                    <TableHeader>
                      <TableColumn>Activo</TableColumn>
                      <TableColumn>Depreciacion Acumulada</TableColumn>
                      <TableColumn>Valor de rescate</TableColumn>
                    </TableHeader>
                    <TableBody>
                      <TableRow>
                        <TableCell>Edificios</TableCell>
                        <TableCell>
                          {tablaDepreciacionAcumulada[0].años[5]}
                        </TableCell>
                        <TableCell>
                          {totalEdificios -
                            tablaDepreciacionAcumulada[0].años[5]}
                        </TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell>Maquinaria</TableCell>
                        <TableCell>
                          {tablaDepreciacionAcumulada[1].años[5]}
                        </TableCell>
                        <TableCell>
                          {totalMaquinas -
                            tablaDepreciacionAcumulada[1].años[5]}
                        </TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell>Equipo de Transporte</TableCell>
                        <TableCell>
                          {tablaDepreciacionAcumulada[2].años[5]}
                        </TableCell>
                        <TableCell>
                          {totalTransporte -
                            tablaDepreciacionAcumulada[2].años[5]}
                        </TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell>Mobiliario de Oficina</TableCell>
                        <TableCell>
                          {tablaDepreciacionAcumulada[3].años[5]}
                        </TableCell>
                        <TableCell>
                          {totalMobiliario -
                            tablaDepreciacionAcumulada[3].años[5]}
                        </TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell>Equipo de Computo</TableCell>
                        <TableCell>
                          {tablaDepreciacionAcumulada[4].años[5]}
                        </TableCell>
                        <TableCell>
                          {totalComputo - tablaDepreciacionAcumulada[4].años[5]}
                        </TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell>Total Depresiaciones</TableCell>
                        <TableCell>{totalDAcumulada}</TableCell>
                        <TableCell>{totalDAcumulada - totalRescarte}</TableCell>
                      </TableRow>
                    </TableBody>
                  </Table>
                </section>
              </section>
              <section>
                <h2>
                  <strong>Evaluacion economica del proyecto</strong>
                </h2>
                <section>
                  flujo de efectivo a utilizar para calculo de los indicadores
                  <section>
                    <Table>
                      <TableHeader>
                        <TableColumn>año 1</TableColumn>
                        <TableColumn>año 2</TableColumn>
                        <TableColumn>año 3</TableColumn>
                        <TableColumn>año 4</TableColumn>
                        <TableColumn>año 5</TableColumn>
                      </TableHeader>
                      <TableBody>
                        <TableRow>
                          <TableCell>{flujos[1]}</TableCell>
                          <TableCell>{flujos[2]}</TableCell>
                          <TableCell>{flujos[3]}</TableCell>
                          <TableCell>{flujos[4]}</TableCell>
                          <TableCell>{flujos[5]}</TableCell>
                        </TableRow>
                      </TableBody>
                    </Table>
                  </section>
                  <section>
                    <h3>
                      <strong>VAN</strong>
                    </h3>
                    <p>tasa de descuento:{trema}</p>
                    <p>flujo de efectivo descontado</p>
                    <section>
                      <Table>
                        <TableHeader>
                          <TableColumn>año 1</TableColumn>
                          <TableColumn>año 2</TableColumn>
                          <TableColumn>año 3</TableColumn>
                          <TableColumn>año 4</TableColumn>
                          <TableColumn>año 5</TableColumn>
                        </TableHeader>
                        <TableBody>
                          <TableRow>
                            <TableCell>{flujosDescontados[1]}</TableCell>
                            <TableCell>{flujosDescontados[2]}</TableCell>
                            <TableCell>{flujosDescontados[3]}</TableCell>
                            <TableCell>{flujosDescontados[4]}</TableCell>
                            <TableCell>{flujosDescontados[5]}</TableCell>
                          </TableRow>
                        </TableBody>
                      </Table>
                    </section>
                    <p>suma de los flujos:{totalFD}</p>
                    <p>VAN:{VAN}</p>
                  </section>
                  <section>
                    <h3>
                      <strong>TRI</strong>
                    </h3>
                    <p>
                      Inversion inicial en valor negativo:{0 - totalInversiones}
                    </p>
                    <p>TIR:{TIR}</p>
                  </section>
                  <section>
                    <h3>
                      <strong>B/C</strong>
                    </h3>
                    <section>
                      <Table>
                        <TableHeader>
                          <TableColumn>concepto</TableColumn>
                          <TableColumn>año 1</TableColumn>
                          <TableColumn>año 2</TableColumn>
                          <TableColumn>año 3</TableColumn>
                          <TableColumn>año 4</TableColumn>
                          <TableColumn>año 5</TableColumn>
                        </TableHeader>
                        <TableBody>
                          <TableRow>
                            <TableCell>Total de Ingresos</TableCell>
                            <TableCell>{flujoDeIngresos[1]}</TableCell>
                            <TableCell>{flujoDeIngresos[2]}</TableCell>
                            <TableCell>{flujoDeIngresos[3]}</TableCell>
                            <TableCell>{flujoDeIngresos[4]}</TableCell>
                            <TableCell>{flujoDeIngresos[5]}</TableCell>
                          </TableRow>
                          <TableRow>
                            <TableCell>Total de Egresos</TableCell>
                            <TableCell>{flujoDeEgresos[1]}</TableCell>
                            <TableCell>{flujoDeEgresos[2]}</TableCell>
                            <TableCell>{flujoDeEgresos[3]}</TableCell>
                            <TableCell>{flujoDeEgresos[4]}</TableCell>
                            <TableCell>{flujoDeEgresos[5]}</TableCell>
                          </TableRow>
                          <TableRow>
                            <TableCell>Total de Ingresos Descontados</TableCell>
                            <TableCell>{flujoDeIngresosDescontados[1]}</TableCell>
                            <TableCell>{flujoDeIngresosDescontados[2]}</TableCell>
                            <TableCell>{flujoDeIngresosDescontados[3]}</TableCell>
                            <TableCell>{flujoDeIngresosDescontados[4]}</TableCell>
                            <TableCell>{flujoDeIngresosDescontados[5]}</TableCell>
                          </TableRow>
                          <TableRow>
                            <TableCell>Total de Egresos Descontados</TableCell>
                            <TableCell>{flujoDeEgresosDescontados[1]}</TableCell>
                            <TableCell>{flujoDeEgresosDescontados[2]}</TableCell>
                            <TableCell>{flujoDeEgresosDescontados[3]}</TableCell>
                            <TableCell>{flujoDeEgresosDescontados[4]}</TableCell>
                            <TableCell>{flujoDeEgresosDescontados[5]}</TableCell>
                          </TableRow>
                        </TableBody>
                      </Table>
                    </section>
                    <p>suma de los Ingresos Descontados:{sumaDeIngresos}</p>
                    <p>suma de los Egresos Descontados:{sumaDeEgresos}</p>
                    <p>B/C:{BC}</p>
                  </section>
                  <section>
                    <h3><strong>PRI</strong></h3>
                    <p>promedio de flujos:{promedioFlujos}</p>
                    <p>valor del PRI:{PRI}</p>
                  </section>
                </section>
              </section>
            </section>
          </CardBody>
        </Card>
      </section>
    </section>
  );
}
