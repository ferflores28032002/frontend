import { yupResolver } from "@hookform/resolvers/yup";
import { useEffect, useState } from "react";
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
    equipoId: yup
      .number()
      .required("El equipo es requerido")
      .moreThan(0, "Debe seleccionar un equipo"),
    trabajadorId: yup
      .number()
      .required("El trabajador es requerido")
      .moreThan(0, "Debe seleccionar un trabajador"),
    estadoId: yup
      .number()
      .required("El estado es requerido")
      .oneOf([1, 2, 3], "Estado inválido"), // Ajustar según los estados disponibles
    descripcion: yup.string().required("La descripción es requerida"),
    diagnostico: yup.string().required("El diagnóstico es requerido"),
    solucion: yup.string().required("La solución es requerida"),
    costoReparacion: yup
      .number()
      .required("El costo es requerido")
      .min(0, "El costo debe ser mayor o igual a 0"),
    fechaInicio: yup.string().required("La fecha de inicio es requerida"),
    fechaFin: yup.string().required("La fecha de fin es requerida"),
    observaciones: yup.string().optional(),
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
  const [equipos, setEquipos] = useState<any[]>([]);
  const [trabajadores, setTrabajadores] = useState<any[]>([]);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<FormData>({
    resolver: yupResolver(schema),
    defaultValues: {
      equipoId: 0,
      trabajadorId: 0,
      estadoId: 0,
      descripcion: "",
      diagnostico: "",
      solucion: "",
      costoReparacion: 0,
      fechaInicio: "",
      fechaFin: "",
      observaciones: "",
    },
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [equiposRes, trabajadoresRes] = await Promise.all([
          fetch(
            "https://www.registroreparacionesmantenmientos.somee.com/api/Equipo"
          ).then((res) => res.json()),
          fetch(
            "https://www.registroreparacionesmantenmientos.somee.com/api/Trabajadores"
          ).then((res) => res.json()),
        ]);

        setEquipos(equiposRes);
        setTrabajadores(trabajadoresRes);
      } catch (error) {
        console.error("Error al cargar los datos:", error);
      }
    };

    fetchData();

    if (initialValues) {
      reset({
        ...initialValues,
        fechaInicio: initialValues.fechaInicio
          ? initialValues.fechaInicio.slice(0, 16) // Formato YYYY-MM-DDTHH:mm
          : "",
        fechaFin: initialValues.fechaFin
          ? initialValues.fechaFin.slice(0, 16) // Formato YYYY-MM-DDTHH:mm
          : "",
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
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>
            {initialValues?.id
              ? "Editar Reparación"
              : "Agregar Nueva Reparación"}
          </DialogTitle>
        </DialogHeader>
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="grid grid-cols-2 gap-4"
        >
          <div className="space-y-2 col-span-2 sm:col-span-1">
            <Label htmlFor="equipoId">Equipo</Label>
            <select
              id="equipoId"
              {...register("equipoId", { valueAsNumber: true })}
              className="block w-full px-3 py-2 border rounded-md focus:outline-none"
            >
              <option value={0}>Seleccione un equipo</option>
              {equipos.map((equipo) => (
                <option key={equipo.id} value={equipo.id}>
                  {equipo.nombre}
                </option>
              ))}
            </select>
            {errors.equipoId && (
              <p className="text-sm text-destructive">
                {errors.equipoId.message}
              </p>
            )}
          </div>

          <div className="space-y-2 col-span-2 sm:col-span-1">
            <Label htmlFor="trabajadorId">Trabajador</Label>
            <select
              id="trabajadorId"
              {...register("trabajadorId", { valueAsNumber: true })}
              className="block w-full px-3 py-2 border rounded-md focus:outline-none"
            >
              <option value={0}>Seleccione un trabajador</option>
              {trabajadores.map((trabajador) => (
                <option key={trabajador.id} value={trabajador.id}>
                  {trabajador.nombre} {trabajador.apellido}
                </option>
              ))}
            </select>
            {errors.trabajadorId && (
              <p className="text-sm text-destructive">
                {errors.trabajadorId.message}
              </p>
            )}
          </div>

          <div className="space-y-2 col-span-2 sm:col-span-1">
            <Label htmlFor="estadoId">Estado</Label>
            <select
              id="estadoId"
              {...register("estadoId", { valueAsNumber: true })}
              className="block w-full px-3 py-2 border rounded-md focus:outline-none"
            >
              <option value={0}>Seleccione un estado</option>
              <option value={1}>Pendiente</option>
              <option value={2}>En Proceso</option>
              <option value={3}>Finalizado</option>
            </select>
            {errors.estadoId && (
              <p className="text-sm text-destructive">
                {errors.estadoId.message}
              </p>
            )}
          </div>

          <div className="space-y-2 col-span-2 sm:col-span-1">
            <Label htmlFor="descripcion">Descripción</Label>
            <Input id="descripcion" {...register("descripcion")} />
            {errors.descripcion && (
              <p className="text-sm text-destructive">
                {errors.descripcion.message}
              </p>
            )}
          </div>

          <div className="space-y-2 col-span-2 sm:col-span-1">
            <Label htmlFor="diagnostico">Diagnóstico</Label>
            <Input id="diagnostico" {...register("diagnostico")} />
            {errors.diagnostico && (
              <p className="text-sm text-destructive">
                {errors.diagnostico.message}
              </p>
            )}
          </div>

          <div className="space-y-2 col-span-2 sm:col-span-1">
            <Label htmlFor="solucion">Solución</Label>
            <Input id="solucion" {...register("solucion")} />
            {errors.solucion && (
              <p className="text-sm text-destructive">
                {errors.solucion.message}
              </p>
            )}
          </div>

          <div className="space-y-2 col-span-2 sm:col-span-1">
            <Label htmlFor="costoReparacion">Costo de Reparación</Label>
            <Input
              id="costoReparacion"
              {...register("costoReparacion", { valueAsNumber: true })}
              type="number"
            />
            {errors.costoReparacion && (
              <p className="text-sm text-destructive">
                {errors.costoReparacion.message}
              </p>
            )}
          </div>

          <div className="space-y-2 col-span-2 sm:col-span-1">
            <Label htmlFor="fechaInicio">Fecha de Inicio</Label>
            <Input
              id="fechaInicio"
              {...register("fechaInicio")}
              type="datetime-local"
            />
            {errors.fechaInicio && (
              <p className="text-sm text-destructive">
                {errors.fechaInicio.message}
              </p>
            )}
          </div>

          <div className="space-y-2 col-span-2 sm:col-span-1">
            <Label htmlFor="fechaFin">Fecha de Fin</Label>
            <Input
              id="fechaFin"
              {...register("fechaFin")}
              type="datetime-local"
            />
            {errors.fechaFin && (
              <p className="text-sm text-destructive">
                {errors.fechaFin.message}
              </p>
            )}
          </div>

          <div className="space-y-2 col-span-2">
            <Label htmlFor="observaciones">Observaciones</Label>
            <Input id="observaciones" {...register("observaciones")} />
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
