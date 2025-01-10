import { apiSlice } from "../services/apiSlice";

// Area interface
export interface Area {
    id: number;
    area_name: string;
    director: number;
    director_email?: string;
  }
  
  // Career interface
  export interface Career {
    id: number;
    career_name: string;
    area: number; // Refers to the Area's id
    areaName?: string; // Propiedad opcional para el nombre del área

  }
  
  // Signature interface
  export interface Signature {
    id: number;
    signature_name: string;
    career: number; // Refers to the Career's id
    semester: number;
    code_signature: string;
    careerName?: string;
  }
  
  // Section interface
  export interface Section {
    id: number;
    section_name: string;
    semester?: number;
    teacher_guide: number; // Refers to the Profile's id in 'userApp.Profile'
    signature: number; // Refers to the Signature's id
    signatureName?: string;
    teacherName?: string;
  }
  


const academicApi = apiSlice.injectEndpoints({

    endpoints: (builder) => ({
        getAreas: builder.query<Area[], void>({
            query: () => ({
                url: `/area/`,
                method: 'GET',
            }),
        }),
        getCareers: builder.query<Career[], void>({
            query: () => ({
                url: `/career/`,
                method: 'GET',
            }),
        }),
        getSignatures: builder.query<Signature[], void>({
            query: () => ({
                url: `/signature/`,
                method: 'GET',
            }),
        }),
        getSections: builder.query<Section[], void>({
            query: () => ({
                url: `/section/`,
                method: 'GET',
            }),
        }),
        getArea: builder.query<Area, number>({
            query: (id) => ({
                url: `/area/${id}`,
                method: 'GET',
            }),
        }),
        getCareer: builder.query<Career, number>({
            query: (id) => ({
                url: `/career/${id}`,
                method: 'GET',
            }),
        }),
        getSignature: builder.query<Signature, number>({
            query: (id) => ({
                url: `/signature/${id}`,
                method: 'GET',
            }),
        }),
        getSection: builder.query<Section, number>({
            query: (id) => ({
                url: `/section/${id}`,
                method: 'GET',
            }),
        }),
        postArea: builder.mutation<Area, FormData>({
            query: (area) => ({
                url: `/area/`,
                method: 'POST',
                body: area,
            }),
        }),
        postCareer: builder.mutation<Career, FormData>({
            query: (data) => ({
                url: `/career/`,
                method: 'POST',
                body: data,
            }),
        }),
        postSignature: builder.mutation<Signature, FormData>({
            query: (signature) => ({
                url: `/signature/`,
                method: 'POST',
                body: signature,
            }),
        }),
        postSection: builder.mutation<Section, FormData>({
            query: (section) => ({
                url: `/section/`,
                method: 'POST',
                body: section,
            }),
        }),
        deleteCareer: builder.mutation<void, number>({
            query: (id) => ({
              url: `/career/${id}/`, // Ruta para eliminar el recurso
              method: 'DELETE',
            }),

        }),
        deleteSignature: builder.mutation<void, number>({
            query: (id) => ({
              url: `/signature/${id}/`, // Ruta para eliminar el recurso
              method: 'DELETE',
            }),

        }),
        deleteSection: builder.mutation<void, number>({
            query: (id) => ({
              url: `/section/${id}/`, // Ruta para eliminar el recurso
              method: 'DELETE',
            })
        }),
        putCareer: builder.mutation<Career, Partial<Career> & { id: number }>({
            query: (career) => ({
              url: `/career/${career.id}/`,
              method: 'PUT',
              body: career,
            }),
          }),
          
        putSignature: builder.mutation<Signature, Signature>({
            query: (signature) => ({
                url: `/signature/${signature.id}/`,
                method: 'PUT',
                body: signature
            })
        }),
        putSection: builder.mutation<Section, Section>({
            query: (section) => ({
                url: `/section-update/${section.id}/`,
                method: 'PUT',
                body: section
            })
        }),
        getSectionsTeacher: builder.query<Section[], { teacherId?: number }>({
            query: ({ teacherId }) => ({
                url:`/section/by-teacher/${teacherId}/`,
                method: 'GET',
            }),
        }),

        getAreasMod: builder.query<Area[], void>({
            query: () => ({
                url: `/areaMod/`,
                method: 'GET',
            }),
        }),
        patchArea: builder.mutation<Area, Partial<Area> & { id: number }>({
            query: (area) => ({
                url: `areaMod/${area.id}/update-director/`,
                method: 'PATCH',
                body: area
            })
        }),
    }),
});

export const { useGetAreasQuery, useGetCareersQuery, useGetAreaQuery, useGetCareerQuery, useGetSignaturesQuery, useGetSignatureQuery, useGetSectionsQuery, useGetSectionQuery, usePostAreaMutation, usePostCareerMutation, usePostSignatureMutation, usePostSectionMutation, useDeleteCareerMutation, useDeleteSignatureMutation, useDeleteSectionMutation, usePutCareerMutation, usePutSignatureMutation, usePutSectionMutation, useGetSectionsTeacherQuery, useGetAreasModQuery, usePatchAreaMutation } = academicApi
