"use client";

import React, { useMemo } from "react";
import { TrendingUp } from "lucide-react";
import { Area, AreaChart, CartesianGrid, XAxis } from "recharts";

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";

// Tipo de dato esperado para las entradas
interface UploadData {
  upload_year: string; // Año en formato 'YYYY'
  total_uploads: number; // Total de documentos subidos en ese año
}

// Definir la estructura de los datos transformados
interface ChartData {
  year: string;
  total_uploads: number;
}

interface DocumentUploadsChartProps {
  data: UploadData[]; // Datos de entrada
}

export default function StatisticsChartArea({
  data,
}: DocumentUploadsChartProps) {
  // Transformar los datos para agrupar por año
  const chartData = useMemo<ChartData[]>(() => {
    const groupedByYear = data.reduce<{ [key: string]: number }>((acc, { upload_year, total_uploads }) => {
      acc[upload_year] = (acc[upload_year] || 0) + total_uploads;
      return acc;
    }, {});

    // Convertir el objeto en un array para usarlo con recharts
    return Object.entries(groupedByYear).map(([year, uploads]) => ({
      year,
      total_uploads: uploads,
    }));
  }, [data]);

  // Configuración del gráfico
  const chartConfig: ChartConfig = {
    total_uploads: {
      label: "Total Uploads",
      color: "hsl(var(--chart-1))",
    },
  };

  return (
    <Card className="w-full h-fit">
      <CardHeader className="text-center">
        <CardTitle>Publicaciones por Año</CardTitle>
        <CardDescription>
          Total de documentos publicados por año.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig}>
          <AreaChart
            accessibilityLayer
            data={chartData}
            margin={{
              left: 12,
              right: 12,
            }}
          >
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="year"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              tickFormatter={(value) => value} // Mostrar el año completo
            />
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent indicator="line" />}
            />
            <Area
              dataKey="total_uploads"
              type="natural"
              fill="var(--color-total_uploads)"
              fillOpacity={0.4}
              stroke="var(--color-total_uploads)"
            />
          </AreaChart>
        </ChartContainer>
      </CardContent>
      <CardFooter>
      </CardFooter>
    </Card>
  );
}
