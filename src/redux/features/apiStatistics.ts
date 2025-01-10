import { apiSlice } from "../services/apiSlice";

export interface Statistics {
  id: number;
  views: number;
  requests: number;
  document: number; // ID del documento
  document_title: string;
  document_area: string;
  document_type: string;
  document_publisher: string;
  document_academic_degree: string;
  last_viewed?: string; // Fecha en formato ISO
}

export interface AggregatedStatistics {
  total_views: number;
  total_requests: number;
}

export interface GroupedStatistics {
  document__publisher?: string; // Publicador
  document__type_document__type_name?: string; // Tipo de documento
  document__area__name?: string; // Nombre del área
  total_views: number;
  total_requests: number;
  document__area__area_name?: string;
  total_documents: number;
}

export interface StatisticsTeacher {
  id?: string;
  views?: number;
  document__type_access?: string;
  document: number;
  avg_qualification: number;
  document_title: string;
  qualification?: number;
 

}

const apiStatistics = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    // Obtener estadísticas de un documento específico por ID
    getStatistics: builder.query<Statistics, number>({
      query: (id) => `/statistics/${id}/`,
    }),

    // Obtener todas las estadísticas
    getAllStatistics: builder.query<Statistics[], void>({
      query: () => `/statistics/all-statistics/`,
    }),

    // Obtener los 10 documentos más vistos
    getMostViewedStatistics: builder.query<Statistics[], void>({
      query: () => `/statistics/most-viewed/`,
    }),

    // Obtener los 10 documentos más solicitados
    getMostRequestedStatistics: builder.query<Statistics[], void>({
      query: () => `/statistics/most-requested/`,
    }),

    // Obtener estadísticas agrupadas por publicador
    getStatisticsByPublisher: builder.query<GroupedStatistics[], void>({
      query: () => `/statistics/by-publisher/`,
    }),

    // Obtener estadísticas agrupadas por tipo de documento
    getStatisticsByTypeDocument: builder.query<GroupedStatistics[], void>({
      query: () => `/statistics/by-type-document/`,
    }),

    // Obtener estadísticas agrupadas por área
    getStatisticsByArea: builder.query<GroupedStatistics[], void>({
      query: () => `/statistics/by-area/`,
    }),
    getStatisticsByDateUploads: builder.query<{ upload_year: string; total_uploads: number }[], void>({
      query: () => `/statistics/by-date-uploads/`,
    }),
    getByAccessTeacher: builder.query<StatisticsTeacher[], string>({
      query: (id) => `/statistics/by-access-type-teacher/?teacher_id=${id}`,

    }),
    getByDocTopTeacher: builder.query<StatisticsTeacher[], string>({
      query: (id) => `/statistics/top-viewed-teacher/?teacher_id=${id}`,

    }),
    getByQualificationTopTeacher: builder.query<StatisticsTeacher[], string>({
      query: (id) => `/statistics/top-qualification-teacher/?teacher_id=${id}`,

    }),
    getByQualificationAVGTeacher: builder.query<StatisticsTeacher, string>({
      query: (id) => `/statistics/avg-qualification/?teacher_id=${id}`,
    }),
    getByQualificationTopArea: builder.query<StatisticsTeacher[], number>({
      query: (id) => `/statistics/top-qualification-area/?area=${id}`,
    }),
    
  }),
});

export const {
  useGetStatisticsQuery,
  useGetAllStatisticsQuery,
  useGetMostViewedStatisticsQuery,
  useGetMostRequestedStatisticsQuery,
  useGetStatisticsByPublisherQuery,
  useGetStatisticsByTypeDocumentQuery,
  useGetStatisticsByAreaQuery,
  useGetStatisticsByDateUploadsQuery,
  useGetByAccessTeacherQuery,
  useGetByDocTopTeacherQuery,
  useGetByQualificationTopTeacherQuery,
  useGetByQualificationAVGTeacherQuery,
  useGetByQualificationTopAreaQuery,

} = apiStatistics;
