import { apiSlice } from '@/redux/services/apiSlice';

/* Se determinan los tipos de datos */
interface Group {
	id:number;
    name: string;
}

interface Profile {
	id: number;
    first_name: string;
	last_name: string;
	section: string;
}

interface User {
	id: number;
    email: string;
    group: Group | null; // Puede ser Group o nulo
    profile: Profile | null; // Puede ser Profile o nulo
}

/* Se inyectan los endpoints a apiSlice */
const authApiSlice = apiSlice.injectEndpoints({
	endpoints: builder => ({
		retrieveUser: builder.query<User, void>({ // builder.query para consultas GET
			query: () => '/users/me/',
		}),
		login: builder.mutation({
			query: ({ email, password }) => ({
				url: '/jwt/create/',
				method: 'POST',
				body: { email, password },
			}),
		}),
		register: builder.mutation({ // builder.mutation para consultas POST, PUT...
			query: ({
				email,
				password,
			}) => ({
				url: '/users/',
				method: 'POST',
				body: {  email, password },
			}),
		}),
		verify: builder.mutation({
			query: () => ({
				url: '/jwt/verify/',
				method: 'POST',
			}),
		}),
		logout: builder.mutation({
			query: () => ({
				url: '/logout/',
				method: 'POST',
			}),
		}),
	}),
});


/* Exporta los custom hooks de los endpoints para ser utilizados en otros componentes */
export const {
	useRetrieveUserQuery,
	useLoginMutation,
	useRegisterMutation,
	useVerifyMutation,
	useLogoutMutation,
} = authApiSlice;