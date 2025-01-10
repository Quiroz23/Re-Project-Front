"use client";

import * as React from "react";
import { Pie, PieChart, Label } from "recharts";
import { TrendingUp } from "lucide-react";

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";

export interface PieChartData {
  name: string; // Nombre de la categoría (por ejemplo, "Chrome", "Safari", etc.)
  value: number; // Valor asociado (por ejemplo, visitas)
  fill: string; // Color del sector
}

export interface PieChartProps {
  title: string; // Título del gráfico
  description: string; // Descripción del gráfico
  data: PieChartData[]; // Datos del gráfico
  innerRadius?: number; // Radio interno del gráfico (para estilo donut)
  dataKey?: string; // Clave de los valores (por defecto "value")
  nameKey?: string; // Clave de los nombres (por defecto "name")
  metricLabel?: string; // Etiqueta del total (por ejemplo, "Visitors")
}

export default function StatisticsPieChart({
  title,
  description,
  data,
  innerRadius = 60,
  dataKey = "value",
  nameKey = "name",
  metricLabel = "Total",
}: PieChartProps) {
  // Calcular el total de valores
  const totalValue = React.useMemo(() => {
    return data.reduce((acc, curr) => acc + curr.value, 0);
  }, [data]);

  return (
    <Card className="flex flex-col w-full h-fit">
      <CardHeader className="items-center pb-0">
        <CardTitle>{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent className="flex-1 pb-0">
        <ChartContainer
          config={{}} // Pasar un objeto vacío si no necesitas configuraciones
          className="mx-auto aspect-square max-h-[347px]"
        >
          <PieChart>
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent hideLabel />}
            />
            <Pie
              data={data}
              dataKey={dataKey}
              nameKey={nameKey}
              innerRadius={innerRadius}
              strokeWidth={5}
            >
              <Label
                content={({ viewBox }) => {
                  if (viewBox && "cx" in viewBox && "cy" in viewBox) {
                    return (
                      <text
                        x={viewBox.cx}
                        y={viewBox.cy}
                        textAnchor="middle"
                        dominantBaseline="middle"
                      >
                        <tspan
                          x={viewBox.cx}
                          y={viewBox.cy}
                          className="fill-foreground text-3xl font-bold"
                        >
                          {totalValue.toLocaleString()}
                        </tspan>
                        <tspan
                          x={viewBox.cx}
                          y={(viewBox.cy || 0) + 24}
                          className="fill-muted-foreground"
                        >
                          {metricLabel}
                        </tspan>
                      </text>
                    );
                  }
                  return null;
                }}
              />
            </Pie>
          </PieChart>
        </ChartContainer>
      </CardContent>
      <CardFooter className="flex-col gap-2 text-sm">
      </CardFooter>
    </Card>
  );
}
