import { useSelector, useDispatch } from "react-redux";
import type { TypedUseSelectorHook } from "react-redux";
import type { RootState, AppDispatch } from "./store";

/* Se facilita y asegura el uso de Redux */

//Permite enviar acciones al store de Redux para actualizar el estado
export const useAppDispatch: () => AppDispatch = useDispatch; 

// Obtiene datos del estado del store de Redux de manera segura, asegurando que solo uses las partes correctas del estado.
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;