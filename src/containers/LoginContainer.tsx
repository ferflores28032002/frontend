import { useState } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { Building2 } from "lucide-react";

import { loginSchema } from "./shema/loginSchema";
import { Card, CardContent } from "../components/ui/card";
import { Alert, AlertDescription } from "../components/ui/alert";
import { Input } from "../components/ui/input";
import { Button } from "../components/ui/button";
import { useMainStore } from "../store";
import { useNavigate } from "react-router-dom";
import ApiMain from "../assets/ApiMain";

type FormData = {
  email: string;
  password: string;
};

export default function LoginContainer() {
  const [genericError, setGenericError] = useState<string | null>(null);
  const login = useMainStore((state) => state.login);
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({
    resolver: yupResolver(loginSchema),
  });

  const onSubmit = async (data: FormData) => {
    try {
      login({
        email: data.email,
        id: 1,
        name: data.email,
      });

      const resp = await ApiMain.post("/Auth/login", {
        correo: data.email,
        password: data.password,
      });

      if (resp.data.error) {
        setGenericError(resp.data.error);
        return;
      } else {
        navigate("/");
      }
    } catch (error) {
      setGenericError("Ha ocurrido un error. Por favor, intenta de nuevo.");
    }
  };

  return (
    <div className="flex items-center justify-center h-screen w-full">
      <Card className="w-full max-w-md mx-auto">
        <CardContent className="pt-6">
          <div className="flex flex-col items-center mb-6">
            <Building2 className="h-12 w-12 mb-2" />
            <h1 className="text-2xl font-semibold mb-2">Formulario de login</h1>
            <p className="text-center text-sm text-muted-foreground">
              Somos líderes en distribución de productos premium en todo el
              país. Tu socio comercial de confianza desde 1995.
            </p>
          </div>

          {genericError && (
            <Alert variant="destructive" className="mb-4">
              <AlertDescription>{genericError}</AlertDescription>
            </Alert>
          )}

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div className="space-y-2">
              <label htmlFor="email" className="text-sm font-medium">
                Email
              </label>
              <Input
                id="email"
                type="email"
                {...register("email")}
                placeholder="ejemplo: contacto@empresa.com"
                className="bg-[#F4F0ED] border-0 placeholder:text-muted-foreground/50"
              />
              {errors.email && (
                <p className="text-sm text-red-500">{errors.email.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <label htmlFor="password" className="text-sm font-medium">
                Password
              </label>
              <Input
                id="password"
                type="password"
                {...register("password")}
                placeholder="Ingresa tu contraseña"
                className="bg-[#F4F0ED] border-0 placeholder:text-muted-foreground/50"
              />
              {errors.password && (
                <p className="text-sm text-red-500">
                  {errors.password.message}
                </p>
              )}
            </div>

            <Button
              type="submit"
              className="w-full bg-[#2088CA] hover:bg-[#1c7ab5]"
            >
              Iniciar sesión
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
