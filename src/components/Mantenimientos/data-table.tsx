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
import { Button } from "../ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import { Input } from "../ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../ui/table";
import { EntryFormModal } from "./EntryFormModal";

interface Maintenance {
  id?: string;
  fechaInicio: string;
  fechaFin: string;
  descripcion: string;
  observaciones?: string;
  equipoId: number;
  equipoNombre?: string;
  trabajadorId: number;
  trabajadorNombre?: string;
  tipoId: number;
  tipoNombre?: string;
  estadoId: number;
}


export function DataTableMantenimiento() {
  const [data, setData] = useState<Maintenance[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});
  const [rowSelection, setRowSelection] = useState({});
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingMaintenance, setEditingMaintenance] =
    useState<Maintenance | null>(null);

  const fetchMaintenances = async () => {
    try {
      setLoading(true);
      const response = await fetch(
        "https://www.registroreparacionesmantenmientos.somee.com/api/Mantenimiento"
      );
      const maintenances = await response.json();
      setData(maintenances);
    } catch (error) {
      setError("Error fetching data");
    } finally {
      setLoading(false);
    }
  };

  const createMaintenance = async (maintenance: Maintenance) => {
    try {
      const response = await fetch(
        "https://www.registroreparacionesmantenmientos.somee.com/api/Mantenimiento",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(maintenance),
        }
      );
      if (response.ok) {
        await fetchMaintenances();
      } else {
        throw new Error("Error al crear el mantenimiento");
      }
    } catch (error) {
      console.error("Error al crear mantenimiento:", error);
    }
  };

  const updateMaintenance = async (maintenance: Maintenance) => {
    try {
      const response = await fetch(
        `https://www.registroreparacionesmantenmientos.somee.com/api/Mantenimiento/${maintenance.id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(maintenance),
        }
      );
      if (response.ok) {
        await fetchMaintenances();
      } else {
        throw new Error("Error al actualizar el mantenimiento");
      }
    } catch (error) {
      console.error("Error al actualizar mantenimiento:", error);
    }
  };

  const handleEdit = (maintenance: Maintenance) => {
    setEditingMaintenance(maintenance);
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
          `https://www.registroreparacionesmantenmientos.somee.com/api/Mantenimiento/${id}`,
          {
            method: "DELETE",
          }
        );

        if (response.ok) {
          await fetchMaintenances();
          Swal.fire(
            "Eliminado",
            "El mantenimiento ha sido eliminado.",
            "success"
          );
        } else {
          throw new Error("Error al eliminar el mantenimiento");
        }
      } catch (error) {
        Swal.fire(
          "Error",
          "Hubo un problema al eliminar el mantenimiento.",
          "error"
        );
      }
    }
  };

  useEffect(() => {
    fetchMaintenances();
  }, []);

  const table = useReactTable({
    data,
    columns: [
      { accessorKey: "id", header: "ID" },
      { accessorKey: "fechaInicio", header: "Fecha Inicio" },
      { accessorKey: "fechaFin", header: "Fecha Fin" },
      { accessorKey: "descripcion", header: "Descripción" },
      { accessorKey: "observaciones", header: "Observaciones" },
      { accessorKey: "equipoNombre", header: "Equipo" },
      { accessorKey: "trabajadorNombre", header: "Trabajador" },
      { accessorKey: "estadoNombre", header: "Estado" },
      { accessorKey: "tipoNombre", header: "Tipo" },
      {
        id: "actions",
        header: "Acciones",
        cell: ({ row }) => {
          const maintenance = row.original;
          return (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="h-8 w-8 p-0">
                  <span className="sr-only">Abrir menú</span>
                  <MoreHorizontal className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => handleEdit(maintenance)}>
                  Editar
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() => handleDelete(maintenance.id || "")}
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
        initialValues={editingMaintenance || undefined}
        onClose={() => {
          setIsModalOpen(false);
          setEditingMaintenance(null);
        }}
        onSave={async (maintenance) => {
          if (maintenance.id) {
            await updateMaintenance(maintenance);
          } else {
            await createMaintenance(maintenance);
          }
          setIsModalOpen(false);
          setEditingMaintenance(null);
        }}
      />
      <div className="flex items-center py-4">
        <Input
          placeholder="Filtrar por descripción..."
          value={
            (table.getColumn("descripcion")?.getFilterValue() as string) ?? ""
          }
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
        <div>Cargando...</div>
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
