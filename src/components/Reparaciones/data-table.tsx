import {
  ColumnFiltersState,
  SortingState,
  VisibilityState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { useEffect, useState } from "react";
import { MoreHorizontal } from "lucide-react";
import Swal from "sweetalert2";
import { Button } from "../../components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../../components/ui/dropdown-menu";
import { Input } from "../../components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../../components/ui/table";
import { EntryFormModal } from "./EntryFormModal";
import { LoadingSpinner } from "../LoadingSpinner";

interface Reparacion {
  id?: string;
  equipoId: number;
  equipoNombre?: string;
  trabajadorId: number;
  trabajadorNombre?: string;
  estadoId: number;
  estadoNombre?: string;
  descripcion: string;
  diagnostico: string;
  solucion: string;
  costoReparacion: number;
  fechaInicio: string;
  fechaFin: string;
  observaciones?: string;
}
export function DataTableReparaciones() {
  const [data, setData] = useState<Reparacion[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});
  const [rowSelection, setRowSelection] = useState({});
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingReparacion, setEditingReparacion] = useState<Reparacion | null>(
    null
  );

  const fetchReparaciones = async () => {
    try {
      setLoading(true);
      const response = await fetch(
        "https://www.registroreparacionesmantenmientos.somee.com/api/Reparaciones"
      );
      const reparaciones = await response.json();
      setData(reparaciones);
    } catch (error) {
      setError("Error fetching data");
    } finally {
      setLoading(false);
    }
  };

  const createReparacion = async (reparacion: Reparacion) => {
    try {
      const response = await fetch(
        "https://www.registroreparacionesmantenmientos.somee.com/api/Reparaciones",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(reparacion),
        }
      );
      if (response.ok) {
        await fetchReparaciones();
      } else {
        throw new Error("Error al crear la reparación");
      }
    } catch (error) {
      console.error("Error al crear reparación:", error);
    }
  };

  const updateReparacion = async (reparacion: Reparacion) => {
    try {
      const response = await fetch(
        `https://www.registroreparacionesmantenmientos.somee.com/api/Reparaciones/${reparacion.id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(reparacion),
        }
      );
      if (response.ok) {
        await fetchReparaciones();
      } else {
        throw new Error("Error al actualizar la reparación");
      }
    } catch (error) {
      console.error("Error al actualizar reparación:", error);
    }
  };

  const handleEdit = (reparacion: Reparacion) => {
    setEditingReparacion(reparacion);
    setIsModalOpen(true);
  };

  const handleDelete = async (id: string) => {
    const confirmation = await Swal.fire({
      title: "¿Estás seguro?",
      text: "No podrás deshacer esta acción.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Sí, eliminar",
      cancelButtonText: "Cancelar",
    });

    if (confirmation.isConfirmed) {
      try {
        const response = await fetch(
          `https://www.registroreparacionesmantenmientos.somee.com/api/Reparaciones/${id}`,
          {
            method: "DELETE",
          }
        );

        if (response.ok) {
          await fetchReparaciones();
          Swal.fire("Eliminado", "La reparación ha sido eliminada.", "success");
        } else {
          throw new Error("Error al eliminar la reparación");
        }
      } catch (error) {
        Swal.fire(
          "Error",
          "Hubo un problema al eliminar la reparación.",
          "error"
        );
      }
    }
  };

  useEffect(() => {
    fetchReparaciones();
  }, []);

  const table = useReactTable({
    data,
    columns: [
      { accessorKey: "id", header: "ID" },
      { accessorKey: "equipoNombre", header: "Equipo" },
      { accessorKey: "trabajadorNombre", header: "Trabajador" },
      { accessorKey: "estadoNombre", header: "Estado" },
      { accessorKey: "descripcion", header: "Descripción" },
      { accessorKey: "diagnostico", header: "Diagnóstico" },
      { accessorKey: "solucion", header: "Solución" },
      { accessorKey: "costoReparacion", header: "Costo" },
      { accessorKey: "fechaInicio", header: "Fecha Inicio" },
      { accessorKey: "fechaFin", header: "Fecha Fin" },
      { accessorKey: "observaciones", header: "Observaciones" },
      {
        id: "actions",
        header: "Acciones",
        cell: ({ row }) => {
          const reparacion = row.original;
          return (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="h-8 w-8 p-0">
                  <span className="sr-only">Abrir menú</span>
                  <MoreHorizontal className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => handleEdit(reparacion)}>
                  Editar
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() => handleDelete(reparacion.id || "")}
                >
                  Eliminar
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          );
        },
      },
    ],
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      rowSelection,
    },
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
  });

  return (
    <div className="w-full">
      <EntryFormModal
        isOpen={isModalOpen}
        initialValues={editingReparacion || undefined}
        onClose={() => {
          setIsModalOpen(false);
          setEditingReparacion(null);
        }}
        onSave={async (reparacion) => {
          if (reparacion.id) {
            await updateReparacion(reparacion);
          } else {
            await createReparacion(reparacion);
          }
          setIsModalOpen(false);
          setEditingReparacion(null);
        }}
      />
      <div className="flex items-center py-4">
        <Input
          placeholder="Filtrar por descripción..."
          value={(table.getColumn("descripcion")?.getFilterValue() as string) ?? ""}
          onChange={(event) =>
            table.getColumn("descripcion")?.setFilterValue(event.target.value)
          }
          className="w-full mr-2"
        />
        <Button
          className="bg-[#2088CA] hover:bg-[#1c7ab5] ml-2"
          onClick={() => setIsModalOpen(true)}
        >
          Agregar
        </Button>
      </div>
      {loading ? (
        <LoadingSpinner/>
      ) : error ? (
        <div>{error}</div>
      ) : (
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              {table.getHeaderGroups().map((headerGroup) => (
                <TableRow key={headerGroup.id}>
                  {headerGroup.headers.map((header) => (
                    <TableHead key={header.id}>
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )}
                    </TableHead>
                  ))}
                </TableRow>
              ))}
            </TableHeader>
            <TableBody>
              {table.getRowModel().rows?.length ? (
                table.getRowModel().rows.map((row) => (
                  <TableRow key={row.id} className="h-16">
                    {row.getVisibleCells().map((cell) => (
                      <TableCell key={cell.id}>
                        {flexRender(
                          cell.column.columnDef.cell,
                          cell.getContext()
                        )}
                      </TableCell>
                    ))}
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell
                    colSpan={table.getAllColumns().length}
                    className="h-24 text-center"
                  >
                    No se encontraron resultados.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      )}
    </div>
  );
}
