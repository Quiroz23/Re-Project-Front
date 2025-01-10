import { apiSlice } from "../services/apiSlice";

interface CustomGroup {
    id?: number; // Agrega el ID del grupo
    group_name: string;
    teacher_guide: number | null; // Referencia al perfil del profesor
    section?: number | null;
}

interface GroupUser {
    id?: number; // Agrega el ID del usuario en el grupo
    group: number | null ; // Referencia al grupo
    student: string;
}

interface RegisterForm {
    email: string;
    password: string;
    group : string;
}

export interface User {
    id?: number;       // ID opcional (generalmente no lo es en una base de datos)
    email: string;     // Email obligatorio
    group?: Groups;    // Grupo es opcional, pero asegúrate de que siempre exista si es necesario
    password?: string; // Contraseña opcional (generalmente no se expone en respuestas del API)
}

export interface CustomUserRegister{
    id?: number;       // ID opcional (generalmente no lo es en una base de datos)
    email: string;     // Email obligatorio
    group?: string;    // Grupo es opcional, pero asegúrate de que siempre exista si es necesario
    password?: string; // Contraseña opcional (generalmente no se expone en respuestas del API)
}


export interface Profile {
    id: number;
    first_name: string;
    last_name: string;
    section?: string;
    area?: string;
    user?: User;
    email?: string;
    teacherName?: string
}

export interface Groups {
    id: number;
    name: string;
}


const apiUserSlice = apiSlice.injectEndpoints({
    endpoints: (builder) => ({
        getGroups: builder.query<CustomGroup[], void>({
            query: () => ({
                url: "/customGroup/",
                method: "GET",
            }),
        }),
        getProfiles: builder.query<Profile[], void>({
            query: () => ({
                url: "/profile/",
                method: "GET",
            }),
        }),
        getGroup: builder.query<CustomGroup, number>({
            query: (id) => ({
                url: `/customGroup/${id}/`,
                method: "GET",
            }),
        }),
        postGroup: builder.mutation<CustomGroup, CustomGroup>({
            query: (group) => ({
                url: "/customGroup/",
                method: "POST",
                body: group,
            }),
        }),        
        getGroupUsers: builder.query<GroupUser[], void>({
            query: () => ({
                url: `/groupUser/`,
                method: "GET",
            }),
        }),
        getGroupUser: builder.query<GroupUser[], number>({
            query: (id) => ({
                url: `/groupUser/${id}/`,
                method: "GET",
            }),
        }),
        postGroupUser: builder.mutation<GroupUser, GroupUser>({
            query: (groupUser) => ({
                url: `/groupUser/`,
                method: "POST",
                body: groupUser,
            }),
        }),
        postRegisterUser: builder.mutation<RegisterForm, RegisterForm>({
            query: (registerForm) => ({
                url: `/register/`,
                method: "POST",
                body: registerForm,
            })
        }),
        getRegisterUser: builder.query<RegisterForm, number>({
            query: (id) => ({
                url: `/register/${id}/`,
                method: "GET",
            })
        }),
        getUsers: builder.query<User[], void>({
            query: () => ({
                url: "/customUserPro/",
                method: "GET",
            }),
        }),
        getStudients: builder.query<Profile[], void>({
            query: () => ({
                url: "/profile/",
                method: "GET",
            }),
        }),
        putProfile: builder.mutation<Profile, { id: number, first_name: string, last_name: string, section: string | null }>({
            query: ({ id, first_name, last_name, section }) => {
                const formData = new FormData();
                formData.append("first_name", first_name);
                formData.append("last_name", last_name);
                formData.append("section", section ? section : ""); // Usa una cadena vacía si section es null
                return {
                    url: `/profile/${id}/update_section/`,
                    method: "PATCH",
                    body: formData,
                };
            },
        }),
        postUser: builder.mutation<CustomUserRegister, CustomUserRegister>({
            query: (user) => ({
                url: `/customUserRegister/`,
                method: "POST",
                body: {
                    ...user,
                    group: user.group
                }
            })
        }),
        putPassword: builder.mutation({
            query: (body) => ({
              url: '/passwordUpdate/change-password/',
              method: 'PUT',
              body, // Esto debería ser un objeto con el campo password
              headers: {
                'Content-Type': 'application/json',
            },
            }),
          }),
        getStudentsSection: builder.query<Profile[], number>({
            query: (id) => ({
                url: `/section/students-by-section/${id}/`,
                method: "GET",
            }),
        }),
    }),
});

export const {
    useGetGroupsQuery,
    useGetProfilesQuery,
    useGetGroupQuery,
    usePostGroupMutation,
    useGetGroupUsersQuery,
    useGetGroupUserQuery,
    usePostGroupUserMutation,
    useGetRegisterUserQuery,
    usePostRegisterUserMutation,
    useGetUsersQuery,
    useGetStudientsQuery,
    usePutProfileMutation,
    usePostUserMutation,
    usePutPasswordMutation,
    useGetStudentsSectionQuery,
} = apiUserSlice;


