"use client";

import { RadialBar, RadialBarChart, PolarAngleAxis } from "recharts";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../ui/card";

interface StatisticsDonutChartProps {
  percentage: number; // El promedio o porcentaje a mostrar
  label: string; // Texto central, por ejemplo: "Promedio"
  color: string; // Color del anillo
  info: number;
}

export default function StatisticsDonutChart({
  percentage,
  label,
  color,
  info,
}: StatisticsDonutChartProps) {
  // Datos para el gráfico (relleno y parte vacía)
  const chartData = [{ value: percentage, fill: color, info }];

  return (
    <Card className="w-full py-6">
      <CardHeader className="text-center">
        <CardTitle>Promedio de Calificaciones</CardTitle>
        <CardDescription>
          Promedio general de calificaciones de documentos guíados
        </CardDescription>
      </CardHeader>
      <CardContent className="relative flex justify-center items-center">
        {/* Gráfico circular */}
        <RadialBarChart
          width={180}
          height={180}
          innerRadius="80%"
          outerRadius="100%"
          data={chartData}
          startAngle={90}
          endAngle={-270}
        >
          <PolarAngleAxis
            type="number"
            domain={[0, 70]} // Ajusta según el máximo posible
            angleAxisId={0}
            tick={false} // Oculta los ticks
          />
          <RadialBar
            background
            dataKey="value"
            cornerRadius={50}
            className="stroke-transparent"
          />
        </RadialBarChart>

        {/* Texto central */}
        <div className="absolute inset-0 flex flex-col items-center justify-center mb-4">
          <p className="text-2xl font-bold text-black">{percentage.toFixed(1)}</p>
          <span className="text-sm text-muted-foreground">Promedio</span>
        </div>
      </CardContent>
    </Card>
  );
}
