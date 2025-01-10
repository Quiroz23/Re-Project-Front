"use client";

import React, { useMemo } from "react";
import { TrendingUp } from "lucide-react";
import { CartesianGrid, LabelList, Line, LineChart, XAxis, YAxis } from "recharts";

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

// Data Mock (puedes reemplazar esto con data real)
const mockData = [
  { id: 1, title: "Algo", views: 12 },
  { id: 2, title: "DOC7", views: 6 },
  { id: 3, title: "Robot dormi", views: 4 },
];

export default function StatisticsChartLine() {
  return (
    <Card className="w-full">
      <CardHeader className="text-center">
        <CardTitle>Ultimos 3 Documentos Vistos</CardTitle>
        <CardDescription>
          Cantidad de veces que fueron vistos
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex justify-center items-center">
          <LineChart
            data={mockData}
            width={400}
            height={300}
            margin={{
              top: 24,
              left: 24,
              right: 24,
              bottom: 12,
            }}
          >
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="title"
              tickLine={false}
              axisLine={false}
              tick={{ fontSize: 12 }}
              angle={-45}
              textAnchor="end"
            />
            <YAxis
              tickLine={false}
              axisLine={false}
              tick={{ fontSize: 12 }}
            />
            <Line
              dataKey="views"
              type="natural"
              stroke="blue" // Color fijo
              strokeWidth={2}
              dot={{ fill: "blue" }}
              activeDot={{ r: 6 }}
            >
              <LabelList position="top" offset={12} fontSize={12} dataKey="title" />
            </Line>
          </LineChart>
        </div>
      </CardContent>
    </Card>
  );
}
