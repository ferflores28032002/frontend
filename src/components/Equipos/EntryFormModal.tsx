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
    modelo: yup.string().required("El modelo es requerido"),
    numeroSerie: yup.string().required("El número de serie es requerido"),
    fechaAdquisicion: yup
      .string()
      .required("La fecha de adquisición es requerida"),
    estadoId: yup
      .number()
      .required("El estado es requerido")
      .oneOf([1, 2], "El estado debe ser Activo (1) o Inactivo (2)"),
  })
  .required();

type FormData = yup.InferType<typeof schema>;

interface EntryFormModalProps {
  initialValues?: Partial<FormData & { id?: string }>;
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: FormData & { id?: string }) => void;
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
    defaultValues: initialValues || {},
  });

  useEffect(() => {
    if (initialValues) {
      reset({
        ...initialValues,
        fechaAdquisicion: initialValues.fechaAdquisicion?.split("T")[0] || "",
      });
    } else {
      reset({
        nombre: "",
        modelo: "",
        numeroSerie: "",
        fechaAdquisicion: "",
        estadoId: 1, // Activo por defecto
      });
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
            {initialValues?.id ? "Editar Equipo" : "Agregar Nuevo Equipo"}
          </DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="nombre">Nombre</Label>
            <Input id="nombre" {...register("nombre")} />
            {errors.nombre && (
              <p className="text-sm text-destructive">{errors.nombre.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="modelo">Modelo</Label>
            <Input id="modelo" {...register("modelo")} />
            {errors.modelo && (
              <p className="text-sm text-destructive">{errors.modelo.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="numeroSerie">Número de Serie</Label>
            <Input id="numeroSerie" {...register("numeroSerie")} />
            {errors.numeroSerie && (
              <p className="text-sm text-destructive">
                {errors.numeroSerie.message}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="fechaAdquisicion">Fecha de Adquisición</Label>
            <Input
              id="fechaAdquisicion"
              {...register("fechaAdquisicion")}
              type="date"
            />
            {errors.fechaAdquisicion && (
              <p className="text-sm text-destructive">
                {errors.fechaAdquisicion.message}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="estadoId">Estado</Label>
            <select
              id="estadoId"
              {...register("estadoId", { valueAsNumber: true })}
              className="block w-full px-3 py-2 border rounded-md focus:outline-none"
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

          <Button type="submit" className="w-full">
            {initialValues?.id ? "Actualizar" : "Guardar"}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
