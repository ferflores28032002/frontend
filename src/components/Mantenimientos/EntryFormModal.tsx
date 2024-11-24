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
    fechaInicio: yup.string().required("La fecha de inicio es requerida"),
    fechaFin: yup.string().required("La fecha de fin es requerida"),
    descripcion: yup.string().required("La descripción es requerida"),
    observaciones: yup.string().optional(),
    equipoId: yup.number().required("El equipo es requerido"),
    trabajadorId: yup.number().required("El trabajador es requerido"),
    tipoId: yup.number().required("El tipo de mantenimiento es requerido"),
    estadoId: yup.number().required("El estado es requerido"),
  })
  .required();

type FormData = yup.InferType<typeof schema>;

interface EntryFormModalProps {
  initialValues?: Partial<FormData & { id?: string }>;
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: FormData & { id?: string; trabajadorNombre?: string }) => void;
}

export function EntryFormModal({
  initialValues,
  isOpen,
  onClose,
  onSave,
}: EntryFormModalProps) {
  const [equipos, setEquipos] = useState<any[]>([]);
  const [trabajadores, setTrabajadores] = useState<any[]>([]);
  const [tiposMantenimiento, setTiposMantenimiento] = useState<any[]>([]);
  const [estadosMantenimiento, setEstadosMantenimiento] = useState<any[]>([]);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    watch,
  } = useForm<FormData>({
    resolver: yupResolver(schema),
    defaultValues: initialValues || {},
  });

  const estadoId = watch("estadoId");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [equiposRes, trabajadoresRes, tiposRes, estadosRes] =
          await Promise.all([
            fetch(
              "https://www.registroreparacionesmantenmientos.somee.com/api/Equipo"
            ).then((res) => res.json()),
            fetch(
              "https://www.registroreparacionesmantenmientos.somee.com/api/Trabajadores"
            ).then((res) => res.json()),
            fetch(
              "https://www.registroreparacionesmantenmientos.somee.com/api/Mantenimiento/TiposMantenimiento"
            ).then((res) => res.json()),
            fetch(
              "https://www.registroreparacionesmantenmientos.somee.com/api/Mantenimiento/EstadosMantenimiento"
            ).then((res) => res.json()),
          ]);

        setEquipos(equiposRes);
        setTrabajadores(trabajadoresRes);
        setTiposMantenimiento(tiposRes);
        setEstadosMantenimiento(estadosRes);
      } catch (error) {
        console.error("Error al cargar los datos:", error);
      }
    };

    fetchData();

    if (initialValues) {
      reset({
        ...initialValues,
        fechaInicio: initialValues.fechaInicio?.split("T")[0] || "",
        fechaFin: initialValues.fechaFin?.split("T")[0] || "",
        estadoId: initialValues.estadoId || 0, // Asegura que se use el estado actual
      });
    } else {
      reset({
        fechaInicio: "",
        fechaFin: "",
        descripcion: "",
        observaciones: "",
        equipoId: 0,
        trabajadorId: 0,
        tipoId: 0,
        estadoId: 0,
      });
    }
  }, [initialValues, reset]);

  const onSubmit = async (data: FormData) => {
    const trabajadorSeleccionado = trabajadores.find(
      (t) => t.id === data.trabajadorId
    );

    const trabajadorNombre = trabajadorSeleccionado
      ? `${trabajadorSeleccionado.nombre} ${trabajadorSeleccionado.apellido}`
      : undefined;

    try {
      await onSave({ ...data, id: initialValues?.id, trabajadorNombre });
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
            {initialValues?.id
              ? "Editar Mantenimiento"
              : "Agregar Nuevo Mantenimiento"}
          </DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="fechaInicio">Fecha de Inicio</Label>
            <Input id="fechaInicio" {...register("fechaInicio")} type="date" />
            {errors.fechaInicio && (
              <p className="text-sm text-destructive">
                {errors.fechaInicio.message}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="fechaFin">Fecha de Fin</Label>
            <Input id="fechaFin" {...register("fechaFin")} type="date" />
            {errors.fechaFin && (
              <p className="text-sm text-destructive">
                {errors.fechaFin.message}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="descripcion">Descripción</Label>
            <Input id="descripcion" {...register("descripcion")} />
            {errors.descripcion && (
              <p className="text-sm text-destructive">
                {errors.descripcion.message}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="observaciones">Observaciones</Label>
            <Input id="observaciones" {...register("observaciones")} />
          </div>

          <div className="space-y-2">
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

          <div className="space-y-2">
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

          <div className="space-y-2">
            <Label htmlFor="tipoId">Tipo de Mantenimiento</Label>
            <select
              id="tipoId"
              {...register("tipoId", { valueAsNumber: true })}
              className="block w-full px-3 py-2 border rounded-md focus:outline-none"
            >
              <option value={0}>Seleccione un tipo</option>
              {tiposMantenimiento.map((tipo) => (
                <option key={tipo.id} value={tipo.id}>
                  {tipo.nombre}
                </option>
              ))}
            </select>
            {errors.tipoId && (
              <p className="text-sm text-destructive">
                {errors.tipoId.message}
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
              <option value={0}>Seleccione un estado</option>
              {estadosMantenimiento.map((estado) => (
                <option
                  key={estado.id}
                  value={estado.id}
                  selected={estado.id === estadoId} // Selección inicial
                >
                  {estado.nombre}
                </option>
              ))}
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
