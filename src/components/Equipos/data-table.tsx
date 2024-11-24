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

interface Equipo {
  id?: string;
  nombre: string;
  modelo: string;
  numeroSerie: string;
  fechaAdquisicion: string;
  estadoId: number; // 1: Activo, 2: Inactivo
}

export function DataTableEquipos() {
  const [data, setData] = useState<Equipo[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});
  const [rowSelection, setRowSelection] = useState({});
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingEquipo, setEditingEquipo] = useState<Equipo | null>(null);

  const fetchEquipos = async () => {
    try {
      setLoading(true);
      const response = await fetch(
        "https://www.registroreparacionesmantenmientos.somee.com/api/Equipo"
      );
      const equipos = await response.json();
      setData(equipos);
    } catch (error) {
      setError("Error fetching data");
    } finally {
      setLoading(false);
    }
  };

  const createEquipo = async (equipo: Equipo) => {
    try {
      const response = await fetch(
        "https://www.registroreparacionesmantenmientos.somee.com/api/Equipo",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(equipo),
        }
      );
      if (response.ok) {
        await fetchEquipos();
      } else {
        throw new Error("Error al crear el equipo");
      }
    } catch (error) {
      console.error("Error al crear equipo:", error);
    }
  };

  const updateEquipo = async (equipo: Equipo) => {
    try {
      const response = await fetch(
        `https://www.registroreparacionesmantenmientos.somee.com/api/Equipo/${equipo.id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(equipo),
        }
      );
      if (response.ok) {
        await fetchEquipos();
      } else {
        throw new Error("Error al actualizar el equipo");
      }
    } catch (error) {
      console.error("Error al actualizar equipo:", error);
    }
  };

  const handleEdit = (equipo: Equipo) => {
    setEditingEquipo(equipo);
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
          `https://www.registroreparacionesmantenmientos.somee.com/api/Equipo/${id}`,
          {
            method: "DELETE",
          }
        );

        if (response.ok) {
          await fetchEquipos();
          Swal.fire("Eliminado", "El equipo ha sido eliminado.", "success");
        } else {
          throw new Error("Error al eliminar el equipo");
        }
      } catch (error) {
        Swal.fire(
          "Error",
          "Hubo un problema al eliminar el equipo.",
          "error"
        );
      }
    }
  };

  useEffect(() => {
    fetchEquipos();
  }, []);

  const table = useReactTable({
    data,
    columns: [
      { accessorKey: "id", header: "ID" },
      { accessorKey: "nombre", header: "Nombre" },
      { accessorKey: "modelo", header: "Modelo" },
      { accessorKey: "numeroSerie", header: "Número de Serie" },
      { accessorKey: "fechaAdquisicion", header: "Fecha Adquisición" },
      {
        accessorKey: "estadoId",
        header: "Estado",
        cell: ({ row }) => (row.original.estadoId === 1 ? "Activo" : "Inactivo"),
      },
      {
        id: "actions",
        header: "Acciones",
        cell: ({ row }) => {
          const equipo = row.original;
          return (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="h-8 w-8 p-0">
                  <span className="sr-only">Abrir menú</span>
                  <MoreHorizontal className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => handleEdit(equipo)}>
                  Editar
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() => handleDelete(equipo.id || "")}
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
        initialValues={editingEquipo || undefined}
        onClose={() => {
          setIsModalOpen(false);
          setEditingEquipo(null);
        }}
        onSave={async (equipo) => {
          if (equipo.id) {
            await updateEquipo(equipo);
          } else {
            await createEquipo(equipo);
          }
          setIsModalOpen(false);
          setEditingEquipo(null);
        }}
      />
      <div className="flex items-center py-4">
        <Input
          placeholder="Filtrar por nombre..."
          value={(table.getColumn("nombre")?.getFilterValue() as string) ?? ""}
          onChange={(event) =>
            table.getColumn("nombre")?.setFilterValue(event.target.value)
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
