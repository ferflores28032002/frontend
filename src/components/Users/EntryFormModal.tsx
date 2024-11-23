import { yupResolver } from "@hookform/resolvers/yup";
import { useEffect } from "react";
import { Controller, useForm } from "react-hook-form";
import * as yup from "yup";
import { Button } from "../../components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "../../components/ui/dialog";
import { Input } from "../../components/ui/input";
import { Label } from "../../components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../components/ui/select";

const schema = yup
  .object({
    nombre: yup.string().required("El nombre es requerido"),
    apellido: yup.string().required("El apellido es requerido"),
    correo: yup
      .string()
      .email("Email inválido")
      .required("El correo es requerido"),
    estado: yup
      .string()
      .oneOf(["Activo", "Inactivo", "Pendiente"])
      .required("El estado es requerido"),
  })
  .required();

type FormData = yup.InferType<typeof schema>;

interface EntryFormModalProps {
  initialValues?: Partial<FormData>; // Valores iniciales opcionales
  isOpen: boolean; // Control de apertura del modal
  onClose: () => void; // Función para cerrar el modal
}

const estados = ["Activo", "Inactivo", "Pendiente"];

export function EntryFormModal({
  initialValues,
  isOpen,
  onClose,
}: EntryFormModalProps) {
  const {
    register,
    handleSubmit,
    formState: { errors },
    control,
    reset,
  } = useForm<FormData>({
    resolver: yupResolver(schema),
    defaultValues: initialValues || {}, // Cargar valores iniciales
  });

  useEffect(() => {
    if (initialValues) {
      reset(initialValues);
    }
  }, [initialValues, reset]);

  const onSubmit = (data: FormData) => {
    console.log(data, "data");
    onClose();
    reset();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>
            {initialValues ? "Editar Usuario" : "Agregar Nuevo Usuario"}
          </DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="nombre">Nombre</Label>
            <Input id="nombre" {...register("nombre")} />
            {errors.nombre && (
              <p className="text-sm text-destructive">
                {errors.nombre.message}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="apellido">Apellido</Label>
            <Input id="apellido" {...register("apellido")} />
            {errors.apellido && (
              <p className="text-sm text-destructive">
                {errors.apellido.message}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="correo">Correo</Label>
            <Input id="correo" type="email" {...register("correo")} />
            {errors.correo && (
              <p className="text-sm text-destructive">
                {errors.correo.message}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="estado">Estado</Label>
            <Controller
              name="estado"
              control={control}
              render={({ field }) => (
                <Select
                  onValueChange={field.onChange}
                  value={field.value}
                  defaultValue={initialValues?.estado || ""}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Seleccionar estado" />
                  </SelectTrigger>
                  <SelectContent>
                    {estados.map((estado) => (
                      <SelectItem key={estado} value={estado}>
                        {estado}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
            />
            {errors.estado && (
              <p className="text-sm text-destructive">
                {errors.estado.message}
              </p>
            )}
          </div>

          <Button type="submit" className="w-full">
            {initialValues ? "Actualizar" : "Guardar"}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}