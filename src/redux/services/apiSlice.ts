import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react"; // Crea un slice de API, Función base para hacer solicitudes HTTP
import type {
  BaseQueryFn,
  FetchArgs,
  FetchBaseQueryError,
} from "@reduxjs/toolkit/query"; // Son tipos que definen el tipo de consultas y errores
import { setAuth, logout } from "@/redux/features/authSlice"; // Funciones que modifican el estado de autorización
import { Mutex } from "async-mutex"; // Gestiona el acceso a recursos que pueden ser compartidos (en este caso el proceso de reautenticación)

const mutex = new Mutex();

/* Configuración base para las solicitudes */
const baseQuery = fetchBaseQuery({

  // Se configura la URL base de la API
  baseUrl: `${process.env.NEXT_PUBLIC_HOST}/api`,

  // Permite que las credenciales de las cookies se envíen en cada solicitud
  credentials: "include",
});

/* Encargado de realizar las llamadas a la API y el manejo de usuario no autenticado */
const baseQueryWithReauth: BaseQueryFn<
  string | FetchArgs,
  unknown,
  FetchBaseQueryError
> = async (args, api, extraOptions) => {
  await mutex.waitForUnlock();
  let result = await baseQuery(args, api, extraOptions);

  /*  Validación de usuario no autenticado */
  if (result.error && result.error.status === 401) {
    if (!mutex.isLocked()) {

      const release = await mutex.acquire();

      try {

		// Se intenta obtener un nuevo token 
        const refreshResult = await baseQuery(
          {
            url: "/jwt/refresh/",
            method: "POST",
          },
          api,
          extraOptions
        );

		// Se reintenta la solicitud original
        if (refreshResult.data) {
          api.dispatch(setAuth());

          result = await baseQuery(args, api, extraOptions);

		// Si no se tiene éxito despacha la función logout()
        } else {
          api.dispatch(logout());
        }
      } finally {
        release();
      }
    } else {
      await mutex.waitForUnlock();
      result = await baseQuery(args, api, extraOptions);
    }
  }
  return result;
};

/* Se crea el "slice" de la API */
export const apiSlice = createApi({

  // Se específica el nombre del reductor en el store
  reducerPath: "api",

  // Se epesifíca el basequery que maneja la reautenticación
  baseQuery: baseQueryWithReauth,

  // Se definen los endpoint (se inyectan en otros archivos)
  endpoints: (builder) => ({}),
});
