import { apiSlice } from "../services/apiSlice";


  // interfaces/TypeDocument.ts
  export interface TypeDocument {
    id: number;
    type_name: string; // 'Proyecto de Integración' | 'Seminario de Título' | 'Seminario de Grado' | 'Proyecto de Título'
  }


// Añade esto en el archivo donde definiste DocumentModel
export interface DocumentModel {
    id: number;
    title: string;
    abstract: string;
    type_access: boolean; // True = Público, False = Privado
    area: number; // ID of Area
    academic_degree: '1' | '2' | '3'; // 'Técnico de Nivel Superior' | 'Ingeniero' | 'Licenciado'
    qualification: number;
    document: string; // URL to the file
    publisher: '1' | '2' | '3'; // 'Universidad Inacap' | 'Instituto Profesional Inacap' | 'Centro de Formación Técnica Inacap'
    identifier: string;
    teacher_guide: string;
    entry_date: string; // ISO Date
    available_date: string; // ISO Date
    publication_year: number;
    author: number; // ID of CustomGroup
    career?: number; // ID of CustomGroup
    signature?: number; // ID of CustomGroup
    type_document: number; // ID of TypeDocument
    encryptionKey?: Uint8Array | null; // Usando Uint8Array para almacenar datos binarios, con opción nula
    author_names: string
    type_document_name: string,
    teacher_name: string,
  }
  


// Statistics interface
export interface Statistics {
    id: number;
    views: number;
    requests: number;
    document: number; // ID of Document
    document_title: string;
    last_viewed?: string; // ISO Date
  }
  
  // ApplicationForm interface
  export interface ApplicationForm {
    id: number;
    state: string;
    reason: string;
    document: number; // ID of Document
    student: number; // ID of Profile
    expiration_date: Date;
    student_name: string;
    created_at: string;
    document_title: string;
  }
  
  // Record interface
  export interface Record {
    id: number;
    application: number; // ID of ApplicationForm
    user: number; // ID of Profile
  }
  
  // PublishForm interface
  export interface PublishForm {
    id: number;
    state: '1' | '2' | '3'; // 'Pendiente' | 'Aprobado' | 'Rechazado'
    created_at: string; // ISO Date
    document: number; // ID of Document
    teacher_guide: number; // ID of Profile
    document_title: string;
    teacher_name: string;
    area: number;
    area_name: string;
  }

  interface DocumentPublic {
    id: number;
    title: string;
    abstract: string;
    type_access: boolean; // True = Público, False = Privado
    area: number; // ID of Area
    academic_degree: '1' | '2' | '3'; // 'Técnico de Nivel Superior' | 'Ingeniero' | 'Licenciado'
    qualification: number;
    publisher: '1' | '2' | '3'; // 'Universidad Inacap' | 'Instituto Profesional Inacap' | 'Centro de Formación Técnica Inacap'
    identifier: string;
    teacher_guide: string;
    entry_date: string; // ISO Date
    available_date: string; // ISO Date
    publication_year: number;
    teacher_guide_name: string;
    author_names: string[] | null; // Lista de nombres de autores en lugar del ID
    type_document: number; // ID of TypeDocument
    teacher_name: string;
    area_name: string;
    career_name: string;
    signature_name: string | null;
  }
  

const documentApi = apiSlice.injectEndpoints({
    endpoints: (builder) => ({
        fetchDocument: builder.query<Blob, number>({
        query: (id) => ({
                url: `/document/${id}/desencriptar/`,
                method: 'GET',
                // Configura el tipo de respuesta como 'blob'
                responseHandler: (response) => response.blob(),
            }),
        }),
        getTypeDocuments: builder.query<TypeDocument[], void>({
            query: () => ({
                url: "/typeDocument/",
                method: 'GET',
            }),
        }),
        getDocuments: builder.query<DocumentModel[], void>({
            query: () => ({
                url: "/document/",
                method: 'GET',
            }),
        }),
        getApplicationForms: builder.query<ApplicationForm[], void>({
            query: () => ({
                url: "/applicationForm/",
                method: 'GET',
            }),
        }),
        getRecords: builder.query<Record[], void>({
            query: () => ({
                url: "/record/",
                method: 'GET',
            }),
        }),
        getPublishForms: builder.query<PublishForm[], void>({
            query: () => ({
                url: "/publishForm/",
                method: 'GET',
            }),
        }),
        getTypedDocuments: builder.query<DocumentModel[], number>({
            query: (id) => ({
                url: `/document/${id}/`,
                method: 'GET',
            }),
        }),
        getDocument: builder.query<DocumentModel, number>({
            query: (id) => ({
                url: `/document/${id}/`,
                method: 'GET',
            }),
        }),
        getStadistics: builder.query<Statistics, number>({
            query: (id) => ({
                url: `/statistics/${id}/`,
                method: 'GET',
            }),
        }),
        getApplicationForm: builder.query<ApplicationForm, number>({
            query: (id) => ({
                url: `/applicationForm/${id}/`,
                method: 'GET',
            }),
        }),
        getRecord: builder.query<Record, number>({
            query: (id) => ({
                url: `/record/${id}/`,
                method: 'GET',
            }),
        }),
        getPublishForm: builder.query<PublishForm, number>({
            query: (id) => ({
                url: `/publishForm/${id}/`,
                method: 'GET',
            }),
        }),
        postDocument: builder.mutation<DocumentModel, FormData>({
            query: (formData) => ({
                url: "/document/",
                method: 'POST',
                body: formData
            }),
        }),
        putDocument: builder.mutation<DocumentModel, { id: number, formData: FormData }>({
            query: ({id, formData}) => ({
                url: `/document/${id}/`,
                method: 'PUT',
                body: formData,
            }),
        
        }),
        postApplicationForm: builder.mutation<ApplicationForm , FormData>({
            query: (formData) => ({
                url: "/applicationForm/",
                method: 'POST',
                body: formData
            }),
        }),

        getPublicDocuments: builder.query<DocumentPublic[], void>({
            query: () => ({
                url: "/viewDocument/",
                method: 'GET',
            }),
        }),
        getPublicDocument: builder.query<DocumentPublic, number>({
            query: (id) => ({
                url: `/viewDocument/${id}/`,
                method: 'GET',
            }),
        }),
        patchDocument: builder.mutation<DocumentModel, { id: number, identifier: string }>({
            query: ({ id, identifier }) => {
                const formData = new FormData();
                formData.append("identifier", identifier); // Agregamos solo el campo `identifier` al formData
        
                return {
                    url: `/document/${id}/update_identifier/`, // Endpoint modificado para usar la acción personalizada
                    method: 'PATCH',
                    body: formData, // Enviamos como FormData para multipart/form-data
                };
            },
        }),
        patchDocumentAccess: builder.mutation<DocumentModel, { id: number, type_access: boolean }>({
            query: ({ id, type_access }) => {
                const formData = new FormData();
                formData.append("type_access", type_access.toString()); // Agregamos solo el campo `type_access` al formData
        
                return {
                    url: `/document/${id}/update_type_access/`, // Endpoint modificado para usar la acción personalizada
                    method: 'PATCH',
                    body: formData, // Enviamos como FormData para multipart/form-data
                };
            },
        }),
        getDocumentAccept: builder.query<DocumentModel[], void>({
            query: () => ({
                url: "/documentAccept/",
                method: 'GET',
            }),
        }),
     
        getStatisticsMostViewed: builder.query<Statistics[], void>({
            query: () => ({
                url: "/statistics/most-viewed/",
                method: 'GET',
            })
        }),
        patchPublishForm: builder.mutation<PublishForm, { id: number, state: string }>({
            query: ({ id, state }) => {
                const formData = new FormData();
                formData.append("state", state); 
        
                return {
                    url: `/publishForm/${id}/update_state/`, 
                    method: 'PATCH',
                    body: formData, 
                };
            },
        }),
        patchApplicationForm: builder.mutation<ApplicationForm, { id: number, state: string, expiration_date: Date }>({
            query: ({ id, state, expiration_date }) => {
              const formData = new FormData();
          
              formData.append("state", state);
              formData.append("expiration_date", expiration_date.toISOString()); 
          
              return {
                url: `/applicationForm/${id}/update_state/`, 
                method: 'PATCH',
                body: formData,
              };
            },
          }),
        getApplicationFormValid: builder.query<ApplicationForm, { document_id: number; student_id: number }>({
            query: ({ document_id, student_id }) => ({
              url: `/applicationForm/filter-application-student/`,
              method: 'GET',
              params: { document_id, student_id },
            }),
          }),

        getApplicationFormPending: builder.query<ApplicationForm, { document_id: number; student_id: number }>({
            query: ({ document_id, student_id }) => ({
              url: `/applicationForm/filter-application-pending/`,
              method: 'GET',
              params: { document_id, student_id },
            }),
          }),
        postTypeDocument: builder.mutation<TypeDocument, FormData>({
            query: (formData) => ({
                url: "/typeDocument/",
                method: 'POST',
                body: formData
            }),
        }),
        getTypeDocument: builder.query<TypeDocument, number>({
            query: (id) => ({
                url: `/typeDocument/${id}/`,
                method: 'GET',
            }),
        }),
        putTypeDocument: builder.mutation<TypeDocument, { id: number, formData: FormData }>({
            query: ({id, formData}) => ({
                url: `/typeDocument/${id}/`,
                method: 'PUT',
                body: formData,
            }),
        }),
        putDirectorPublishDoc: builder.mutation<PublishForm, { id: number, formData: FormData }>({
            query: ({id, formData}) => ({
                url: `/publishForm/put-director/${id}/`,
                method: 'PATCH',
                body: formData,
            }),
        }),

        
       
    }),
});



export const {
    useFetchDocumentQuery,
    useGetTypeDocumentsQuery,
    useGetDocumentsQuery,
    useGetApplicationFormsQuery,
    useGetRecordsQuery,
    useGetPublishFormsQuery,
    useGetTypedDocumentsQuery,
    useGetDocumentQuery,
    useGetStadisticsQuery,
    useGetApplicationFormQuery,
    useGetRecordQuery,
    useGetPublishFormQuery,
    usePostDocumentMutation,
    usePutDocumentMutation,
    usePostApplicationFormMutation,
    useGetPublicDocumentsQuery,
    useGetPublicDocumentQuery,
    usePatchDocumentMutation,
    usePatchDocumentAccessMutation,
    useGetDocumentAcceptQuery,
    useGetStatisticsMostViewedQuery,
    usePatchPublishFormMutation,
    usePatchApplicationFormMutation,
    useGetApplicationFormValidQuery,
    useGetApplicationFormPendingQuery,
    usePostTypeDocumentMutation,
    useGetTypeDocumentQuery,
    usePutTypeDocumentMutation,
    usePutDirectorPublishDocMutation,

} = documentApi