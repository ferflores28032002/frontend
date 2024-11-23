import { StateCreator } from "zustand";

// Definimos la interfaz del usuario
interface User {
  id: number;
  name: string;
  email: string;
}

// Definimos la interfaz del store que manejará el login
export interface LoginStore {
  user: User | null;
  login: (user: User) => void;
  logout: () => void;
}

// LoginSlice para manejar el estado del usuario
export const LoginSlice: StateCreator<LoginStore> = (set) => ({
  // Inicializamos el usuario como null, es decir, no autenticado
  user: null,

  // Función para hacer login y agregar el usuario al estado
  login: (user: User) =>
    set(() => ({
      user: user,
    })),

  // Función para hacer logout y eliminar el usuario del estado
  logout: () =>
    set(() => ({
      user: null,
    })),
});
