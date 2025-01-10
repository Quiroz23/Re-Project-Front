"use client";

import { Bar, BarChart, CartesianGrid, XAxis } from "recharts";
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

// Interfaz para el gráfico
interface ChartConfig {
  [key: string]: {
    label: string;
    color: string;
  };
}

// Propiedades del componente
interface StatisticsChartProps {
  chartData: Array<{ category: string; value: number | undefined }>;
  title: string;
  description: string;
  barColor?: string;
  chartConfig?: ChartConfig;
}

export default function StatisticsChart({
  chartData,
  title,
  description,
  barColor = "var(--chart-1)",
  chartConfig,
}: StatisticsChartProps) {
  if (!chartConfig) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Error en la configuración</CardTitle>
          <CardDescription>
            La configuración del gráfico no fue proporcionada.
          </CardDescription>
        </CardHeader>
      </Card>
    );
  }
  const truncateText = (text: string, maxLength: number) => {
    return text.length > maxLength
      ? `${text.substring(0, maxLength)}...`
      : text;
  };

  return (
    <Card className="w-full">
      <CardHeader className="text-center">
        <CardTitle>{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent className="h-full mx-2">
        <ChartContainer config={chartConfig} >
          <BarChart data={chartData}  
              width={500} // Ajusta el ancho según lo necesario
              height={350} // Reducimos la altura del gráfico
              >
            <CartesianGrid vertical={false} />
            <XAxis
              height={75}
              dataKey="category"
              tickLine={false}
              tickMargin={10}
              axisLine={false}
              tickFormatter={(value) => truncateText(value, 10)} // Limitar a 20 caracteres
              angle={-20} // Rotar ligeramente los textos
              textAnchor="end"
            />
            <ChartTooltip
              cursor={false}
              content={
                <CustomTooltip /> // Uso de un tooltip personalizado
              }
            />
            <Bar dataKey="value" fill={barColor} radius={8} />
          </BarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
 
// Tooltip personalizado
function CustomTooltip({
  active,
  payload,
}: {
  active?: boolean;
  payload?: Array<{ payload: { category: string; value: number } }>;
}) {
  if (active && payload && payload.length > 0) {
    const { category, value } = payload[0].payload; // Datos del punto del gráfico
    return (
      <div className="p-2 bg-white shadow-md rounded-xl">
        <p className="text-sm font-medium">{category}</p> {/* Mostrar categoría */}
        <p className="text-xs text-center">{value}</p> {/* Mostrar valor */}
      </div>
    );
  }
  return null;
}