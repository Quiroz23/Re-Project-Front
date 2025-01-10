'use client';

import StatisticsChart from "@/components/common/StatisticsChart";
import StatisticsChartArea from "@/components/common/StatisticsChartArea";
import StatisticsPieChart from "@/components/common/StatisticsPieChart";
import { useRetrieveUserQuery } from "@/redux/features/authApiSlice";
import {
  useGetAllStatisticsQuery,
  useGetMostViewedStatisticsQuery,
  useGetStatisticsByAreaQuery,
  useGetStatisticsByDateUploadsQuery,
  useGetByQualificationTopAreaQuery
  
} from "@/redux/features/apiStatistics";
import { useGetAreasQuery } from "@/redux/features/apiAcademic";




export default function StatisticsPage() {
  // Obtener datos usando las queries adecuadas
  const { data: allStatistics = [], isLoading: isLoadingAll, isError: isErrorAll } =
    useGetAllStatisticsQuery();
  const { data: mostViewedStatistics = [], isLoading: isLoadingMostViewed, isError: isErrorMostViewed } =
    useGetMostViewedStatisticsQuery();
  const { data: statisticsByArea = [], isLoading: isLoadingByArea, isError: isErrorByArea } =
    useGetStatisticsByAreaQuery();

  const { data: statisticsByDate = [] } =
    useGetStatisticsByDateUploadsQuery();

  const { data: areas = [] } = useGetAreasQuery();


  const { data: user } = useRetrieveUserQuery();
  const areaMe = areas.find((area) => area.director === user?.id);
  const areaId = areaMe?.id || 0

  const { data: statisticsByAreaTop = [] } = useGetByQualificationTopAreaQuery(areaId);


  


/*   const idProfesor = 3

  const {data: statisticsByAccess_teacher = []} = useGetByAccessTeacherQuery(idProfesor);
  console.log(statisticsByAccess_teacher) */
 
  // Calcular totales de vistas y solicitudes
  const totalViews = allStatistics.reduce((acc, stat) => acc + stat.views, 0);
  const totalRequests = allStatistics.reduce((acc, stat) => acc + stat.requests, 0);

  

  // Datos para gráficos
  const chartData = [
    { category: "Vistas Totales", value: totalViews },
    { category: "Solicitudes Totales", value: totalRequests },
  ];

  const chartDataTop = mostViewedStatistics.map((stat) => ({
    category: stat.document_title,
    value: stat.views,
  }));

  const chartDataTopQualification = (statisticsByAreaTop || []).map((stat) => ({
    category: stat.document_title,
    value: stat.qualification,
  }));
  
  // Datos para áreas con más solicitudes

  console.log(statisticsByArea)

  // Datos para el gráfico de pastel
  const colors = ["#4285F4", "#FFA500", "#FF4500", "#1E90FF", "#32CD32"];
  const chartDataByArea2 = statisticsByArea.map((stat, index) => ({
    name: stat.document__area__area_name || "Área Desconocida",
    value: stat.total_views,
    fill: colors[index % colors.length],
  }));

  const colors2 = ["#4285F4", "#FFA500", "#FF4500", "#1E90FF", "#32CD32"]; // Colores predefinidos
  const chartData2 = statisticsByArea.map((stat, index) => ({
    name: stat.document__area__area_name|| "Área Desconocida", // Nombre del área
    value: stat.total_documents, // Total de documentos en esa área
    fill: colors2[index % colors.length], // Asignar un color único
  }));

  const chartDataByArea = statisticsByArea
  .slice() // Crear una copia del array original para evitar modificarlo
  .sort((a, b) => b.total_requests - a.total_requests) // Ordenar por solicitudes
  .slice(0, 5) // Mostrar solo las 5 áreas principales
  .map((stat) => ({
    category: stat.document__area__area_name || "Área Desconocida",
    value: stat.total_requests,
  }));

  const simulatedStatisticsByDate = [
    { upload_year: '2023', total_uploads: 5 },
    { upload_year: '2022', total_uploads: 3 },
    // Puedes agregar más fechas o cambiar los valores aquí
  ];

  // Usar los datos simulados si no hay datos reales (puedes cambiar esta lógica según necesites)
  const finalStatisticsByDate = statisticsByDate.length >= 10 
  ? statisticsByDate 
  : [...statisticsByDate, ...simulatedStatisticsByDate];
  console.log(finalStatisticsByDate)


  // Verificar loading y errores
  if (isLoadingAll || isLoadingMostViewed || isLoadingByArea) {
    return <div>Cargando estadísticas...</div>;
  }

  if (isErrorAll || isErrorMostViewed || isErrorByArea) {
    return <div>Error al cargar estadísticas.</div>;
  }

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

  return (
    <div className="grid sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 h-screen p-4">
      {/* Gráfico de estadísticas generales */}
      <section className="flex justify-center items-center transform hover:scale-105 hover:shadow-lg transition-all duration-300">
        <StatisticsChart
          chartData={chartData}
          title="Estadísticas Generales"
          description="Totales de vistas y solicitudes en el sistema"
          chartConfig={chartConfig}
        />
      </section>

      {/* Gráfico de los documentos más vistos */}
      <section className="flex justify-center items-center transform hover:scale-105 hover:shadow-lg transition-all duration-300">
        <StatisticsChart
          chartData={chartDataTop}
          title="Top 5 Documentos Academicos Más Vistos"
          description="Documentos con el mayor número de vistas"
          barColor="#82ca9d"
          chartConfig={chartConfig}
        />
      </section>

      {/* Gráfico de las áreas con más solicitudes */}
      <section className="flex justify-center items-center transform hover:scale-105 hover:shadow-lg transition-all duration-300">
        <StatisticsChart
          chartData={chartDataByArea}
          title="Top 5 Áreas con Más Solicitudes"
          description="Áreas con el mayor número de solicitudes"
          barColor="#ff7300"
          chartConfig={chartConfig}
        />
      </section>

      {/* Gráfico de pastel por vistas agrupadas por área */}
      <section className="flex justify-center items-center transform hover:scale-105 hover:shadow-lg transition-all duration-300">
        <StatisticsPieChart
          title="Vistas por Área"
          description="Vistas totales agrupadas por área"
          data={chartDataByArea2}
          metricLabel="Vistas"
        />
      </section>
      <section className="flex justify-center items-center transform hover:scale-105 hover:shadow-lg transition-all duration-300">
        <StatisticsPieChart
          title="Documentos por Área"
          description="Número total de documentos agrupados por área"
          data={chartData2}
          metricLabel="Documentos"
        />
      </section>
      <section className="flex justify-center items-center transform hover:scale-105 hover:shadow-lg transition-all duration-300">
        <StatisticsChartArea
          data={finalStatisticsByDate}
        />
      </section>
      <section className="flex justify-center items-center transform hover:scale-105 hover:shadow-lg transition-all duration-300">
      <StatisticsChart
          chartData={chartDataTopQualification}
          title="Top 5 Documentos Academicos con mejor calificacion"
          description="Documentos con mejor calificacion por area"
          barColor="#615aa1"
          chartConfig={chartConfig}
        />
      </section>
    </div>
  );
}
