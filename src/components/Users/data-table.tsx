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

interface User {
  id?: string;
  nombre: string;
  apellido: string;
  correo: string;
  telefono: string;
  cargo: string;
  estadoNombre?: string; // Opcional para evitar errores
  fechaContratacion?: any; // Opcional y tipo `any`
}

export function DataTable() {
  const [data, setData] = useState<User[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});
  const [rowSelection, setRowSelection] = useState({});
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const response = await fetch(
        "https://www.registroreparacionesmantenmientos.somee.com/api/Trabajadores"
      );
      const users = await response.json();
      setData(users);
    } catch (error) {
      setError("Error fetching data");
    } finally {
      setLoading(false);
    }
  };

  const createUser = async (user: User) => {
    try {
      const response = await fetch(
        "https://www.registroreparacionesmantenmientos.somee.com/api/Trabajadores",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(user),
        }
      );
      if (response.ok) {
        await fetchUsers();
      } else {
        throw new Error("Error al crear el usuario");
      }
    } catch (error) {
      console.error("Error al crear usuario:", error);
    }
  };

  const updateUser = async (user: User) => {
    try {
      const response = await fetch(
        `https://www.registroreparacionesmantenmientos.somee.com/api/Trabajadores/${user.id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(user),
        }
      );
      if (response.ok) {
        await fetchUsers();
      } else {
        throw new Error("Error al actualizar el usuario");
      }
    } catch (error) {
      console.error("Error al actualizar usuario:", error);
    }
  };

  const handleEdit = (user: User) => {
    setEditingUser(user);
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
          `https://www.registroreparacionesmantenmientos.somee.com/api/Trabajadores/${id}`,
          {
            method: "DELETE",
          }
        );

        if (response.ok) {
          await fetchUsers();
          Swal.fire("Eliminado", "El trabajador ha sido eliminado.", "success");
        } else {
          throw new Error("Error al eliminar el usuario");
        }
      } catch (error) {
        Swal.fire("Error", "Hubo un problema al eliminar el usuario.", "error");
      }
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const table = useReactTable({
    data,
    columns: [
      { accessorKey: "id", header: "ID" },
      { accessorKey: "nombre", header: "Nombre" },
      { accessorKey: "apellido", header: "Apellido" },
      { accessorKey: "correo", header: "Correo" },
      { accessorKey: "telefono", header: "Teléfono" },
      { accessorKey: "cargo", header: "Cargo" },
      {
        id: "actions",
        header: "Acciones",
        cell: ({ row }) => {
          const user = row.original;
          return (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="h-8 w-8 p-0">
                  <span className="sr-only">Abrir menú</span>
                  <MoreHorizontal className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => handleEdit(user)}>
                  Editar
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => handleDelete(user.id || "")}>
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
        initialValues={editingUser || undefined}
        onClose={() => {
          setIsModalOpen(false);
          setEditingUser(null);
        }}
        onSave={async (user) => {
          if (user.id) {
            await updateUser(user);
          } else {
            await createUser(user);
          }
          setIsModalOpen(false);
          setEditingUser(null);
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
