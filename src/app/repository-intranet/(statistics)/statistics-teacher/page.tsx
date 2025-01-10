"use client";
import StatisticsPieChart from "@/components/common/StatisticsPieChart";
import {
  useGetByAccessTeacherQuery,
  useGetByDocTopTeacherQuery,
  useGetByQualificationTopTeacherQuery,
  useGetByQualificationAVGTeacherQuery,
} from "@/redux/features/apiStatistics";
import { useRetrieveUserQuery } from "@/redux/features/authApiSlice";
import StatisticsChart from "@/components/common/StatisticsChart";
import StatisticsDonutChart from "@/components/common/StatisticsDonutChart";

export default function StatisticsTeacherPage() {
  const { data: user } = useRetrieveUserQuery();
  const idUser = String(user?.id);
  const { data = [] } = useGetByAccessTeacherQuery(idUser);
  const { data: chartDataTopTeacher = [] } = useGetByDocTopTeacherQuery(idUser);
  const { data: chartDataTopQualification = [] } =
    useGetByQualificationTopTeacherQuery(idUser);
  const { data: chartDataQualificationAVG } =
    useGetByQualificationAVGTeacherQuery(idUser);
  console.log();

  const colors2 = ["#4285F4", "#FFA500", "#FF4500", "#1E90FF", "#32CD32"]; // Colores predefinidos

  const chartData = data.map((stat, index) => ({
    name: stat.document__type_access
      ? "Documentos públicos "
      : "Documentos privados ", // Modificación aquí
    value: stat.document, // Total de documentos en esa área
    fill: colors2[index % colors2.length], // Asignar un color único
  }));

  const chartDataTopDoc = chartDataTopTeacher.map((stat) => ({
    category: stat.document_title,
    value: stat.views,
  }));

  const chartDataQualificationTopDoc = chartDataTopQualification.map(
    (stat) => ({
      category: stat.document_title,
      value: stat.qualification,
    })
  );

  const averagePercentage = chartDataQualificationAVG?.avg_qualification || 0;
  const totalDocuments = chartDataQualificationAVG?.document || 0;

  const chartConfig = {
    views: {
      label: "Vistas Totales",
      color: "hsl(var(--chart-1))",
    },
    requests: {
      label: "Solicitudes Totales",
      color: "hsl(var(--chart-2))",
    },
  };

  const chartConfig2 = {
    views: {
      label: "Vistas Totales",
      color: "hsl(var(--chart-1s))",
    },
    requests: {
      label: "Solicitudes Totales",
      color: "hsl(var(--chart-2))",
    },
  };

  return (
    <div className="flex flex-col w-full justify-center items-center gap-4 h-screen p-4">
      <div className="flex h-screen gap-4">
        <section className="flex justify-center items-center h-full">
          <StatisticsPieChart
            title="Documentos tipo de acceso"
            description="Número total de documentos subidos por el profesor"
            data={chartData}
            metricLabel="Nº Documentos"
          />
        </section>
        <section className="flex justify-center items-center h-full">
          <StatisticsDonutChart
            info = {totalDocuments}
            percentage={averagePercentage}
            label="Visitors"
            color="#E91E63" // Color personalizado
          />
        </section>
      </div>
      <div className="flex h-screen gap-4">
        <section className="flex justify-center items-center w-full">
          <StatisticsChart
            chartData={chartDataTopDoc}
            title="Top 3 Documentos Academicos"
            description="Documentos con el mayor número de vistas subidos por"
            barColor="#82ca9d"
            chartConfig={chartConfig}
          />
        </section>
        <section className="flex justify-center items-center w-full">
          <StatisticsChart
            chartData={chartDataQualificationTopDoc}
            title="Top 3 Documentos Academicos con mejor nota"
            description="Documentos academicos con mejor nota"
            barColor="#443d3d"
            chartConfig={chartConfig2}
          />
        </section>
      </div>
    </div>
  );
}
