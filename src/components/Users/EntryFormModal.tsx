import { yupResolver } from "@hookform/resolvers/yup";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
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

const schema = yup
  .object({
    nombre: yup.string().required("El nombre es requerido"),
    apellido: yup.string().required("El apellido es requerido"),
    correo: yup
      .string()
      .email("Debe ser un correo válido")
      .required("El correo es requerido"),
    telefono: yup
      .string()
      .matches(/^\d+$/, "El teléfono debe contener solo números")
      .required("El teléfono es requerido"),
    cargo: yup.string().required("El cargo es requerido"),
    estadoId: yup
      .number()
      .oneOf([1, 2], "Debe seleccionar un estado válido")
      .required("El estado es requerido"),
  })
  .required();

type FormData = yup.InferType<typeof schema>;

interface EntryFormModalProps {
  initialValues?: Partial<FormData & { id?: string }>; // Incluye `id` opcional
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: FormData & { id?: string }) => void; // Ajustar tipo de `onSave`
}

export function EntryFormModal({
  initialValues,
  isOpen,
  onClose,
  onSave,
}: EntryFormModalProps) {
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<FormData>({
    resolver: yupResolver(schema),
    defaultValues: initialValues || {}, // Cargar valores iniciales
  });

  useEffect(() => {
    if (initialValues) {
      reset(initialValues); // Reinicia el formulario con los valores iniciales si los hay
    } else {
      reset({
        nombre: "",
        apellido: "",
        correo: "",
        telefono: "",
        cargo: "",
        estadoId: 1, // Valor predeterminado para estadoId (1 = Activo)
      }); // Limpia el formulario al crear
    }
  }, [initialValues, reset]);

  const onSubmit = async (data: FormData) => {
    try {
      await onSave({ ...data, id: initialValues?.id });
      onClose();
      reset();
    } catch (error) {
      console.error("Error al guardar los datos:", error);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>
            {initialValues?.id ? "Editar Usuario" : "Agregar Nuevo Usuario"}
          </DialogTitle>
        </DialogHeader>
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="grid grid-cols-2 gap-4"
        >
          <div className="space-y-2 col-span-2 sm:col-span-1">
            <Label htmlFor="nombre">Nombre</Label>
            <Input id="nombre" {...register("nombre")} />
            {errors.nombre && (
              <p className="text-sm text-destructive">
                {errors.nombre.message}
              </p>
            )}
          </div>

          <div className="space-y-2 col-span-2 sm:col-span-1">
            <Label htmlFor="apellido">Apellido</Label>
            <Input id="apellido" {...register("apellido")} />
            {errors.apellido && (
              <p className="text-sm text-destructive">
                {errors.apellido.message}
              </p>
            )}
          </div>

          <div className="space-y-2 col-span-2 sm:col-span-1">
            <Label htmlFor="correo">Correo</Label>
            <Input id="correo" {...register("correo")} />
            {errors.correo && (
              <p className="text-sm text-destructive">
                {errors.correo.message}
              </p>
            )}
          </div>

          <div className="space-y-2 col-span-2 sm:col-span-1">
            <Label htmlFor="telefono">Teléfono</Label>
            <Input id="telefono" {...register("telefono")} />
            {errors.telefono && (
              <p className="text-sm text-destructive">
                {errors.telefono.message}
              </p>
            )}
          </div>

          <div className="space-y-2 col-span-2 sm:col-span-1">
            <Label htmlFor="cargo">Cargo</Label>
            <Input id="cargo" {...register("cargo")} />
            {errors.cargo && (
              <p className="text-sm text-destructive">{errors.cargo.message}</p>
            )}
          </div>

          <div className="space-y-2 col-span-2 sm:col-span-1">
            <Label htmlFor="estadoId">Estado</Label>
            <select
              id="estadoId"
              {...register("estadoId", { valueAsNumber: true })}
              className="block w-full px-3 py-2 border rounded-md focus:outline-none focus:ring focus:ring-blue-300"
            >
              <option value={1}>Activo</option>
              <option value={2}>Inactivo</option>
            </select>
            {errors.estadoId && (
              <p className="text-sm text-destructive">
                {errors.estadoId.message}
              </p>
            )}
          </div>

          <div className="col-span-2">
            <Button type="submit" className="w-full">
              {initialValues?.id ? "Actualizar" : "Guardar"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
