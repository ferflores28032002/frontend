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
import * as React from "react";

import { format } from "date-fns";
import { ArrowUpDown, MoreHorizontal } from "lucide-react";
import { Badge } from "../ui/badge";
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
  estado: "Activo" | "Inactivo" | "Pendiente";
  fechaCreacion?: Date;
}

const initialData: User[] = [
  {
    id: "1",
    nombre: "Juan",
    apellido: "Pérez",
    correo: "juan.perez@example.com",
    estado: "Activo",
    fechaCreacion: new Date("2023-01-15"),
  },
  {
    id: "2",
    nombre: "María",
    apellido: "González",
    correo: "maria.gonzalez@example.com",
    estado: "Inactivo",
    fechaCreacion: new Date("2023-03-22"),
  },
  {
    id: "3",
    nombre: "Carlos",
    apellido: "Rodríguez",
    correo: "carlos.rodriguez@example.com",
    estado: "Pendiente",
    fechaCreacion: new Date("2023-05-10"),
  },
];

export function DataTable() {
  const [data, setData] = React.useState<User[]>(initialData);
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    []
  );
  const [columnVisibility, setColumnVisibility] =
    React.useState<VisibilityState>({});
  const [rowSelection, setRowSelection] = React.useState({});
  const [isModalOpen, setIsModalOpen] = React.useState(false);
  const [editingUser, setEditingUser] = React.useState<User | null>(null);

  const table = useReactTable({
    data,
    columns: [
      {
        accessorKey: "nombre",
        header: "Nombre",
        cell: ({ row }) => (
          <div className="capitalize">{row.getValue("nombre")}</div>
        ),
      },
      {
        accessorKey: "apellido",
        header: "Apellido",
        cell: ({ row }) => (
          <div className="capitalize">{row.getValue("apellido")}</div>
        ),
      },
      {
        accessorKey: "correo",
        header: ({ column }) => (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            Correo
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        ),
        cell: ({ row }) => <div>{row.getValue("correo")}</div>,
      },
      {
        accessorKey: "estado",
        header: "Estado",
        cell: ({ row }) => {
          const estado = row.getValue("estado") as string;
          return (
            <Badge
              className={
                estado === "Activo"
                  ? "bg-green-500"
                  : estado === "Inactivo"
                  ? "bg-red-500"
                  : "bg-yellow-500"
              }
            >
              {estado}
            </Badge>
          );
        },
      },
      {
        accessorKey: "fechaCreacion",
        header: "Fecha de Creación",
        cell: ({ row }) => {
          const fecha = row.getValue("fechaCreacion") as Date;
          return <div>{format(fecha, "dd/MM/yyyy")}</div>;
        },
      },
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
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      rowSelection,
    },
  });
  const handleEdit = (user: User) => {
    setEditingUser(user);
    setIsModalOpen(true);
  };

  const handleDelete = (id: string) => {
    setData((prevData) => prevData.filter((user) => user.id !== id));
  };

  return (
    <div className="w-full">
      <EntryFormModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setEditingUser(null);
        }}
        initialValues={
          editingUser
            ? {
                apellido: editingUser.apellido,
                correo: editingUser.correo,
                estado: editingUser.estado,
                nombre: editingUser.nombre,
              }
            : undefined
        }
      />

      <div className="flex items-center py-4">
        <Input
          placeholder="Filtrar por correo..."
          value={(table.getColumn("correo")?.getFilterValue() as string) ?? ""}
          onChange={(event) =>
            table.getColumn("correo")?.setFilterValue(event.target.value)
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
    </div>
  );
}
