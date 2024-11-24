import {
  BarElement,
  CategoryScale,
  Chart as ChartJS,
  Legend,
  LinearScale,
  LineElement,
  PointElement,
  Tooltip,
} from "chart.js";
import { CheckCircle, Clock, Package, Users } from "lucide-react";
import { useEffect, useState } from "react";
import { Bar, Line } from "react-chartjs-2";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../components/ui/card";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  BarElement,
  LineElement,
  Tooltip,
  Legend
);

export default function Dashboard() {
  const [trabajadores, setTrabajadores] = useState<number>(0);
  const [equipos, setEquipos] = useState<number>(0);
  const [mantenimientos, setMantenimientos] = useState<number>(0);
  const [reparaciones, setReparaciones] = useState<number>(0);
  const [reparacionesData, setReparacionesData] = useState<number[]>([]);
  const [mantenimientosData, setMantenimientosData] = useState<number[]>([]);
  const [reparacionesCompletadas, setReparacionesCompletadas] =
    useState<number>(0);
  const [reparacionesPendientes, setReparacionesPendientes] =
    useState<number>(0);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [
          trabajadoresRes,
          equiposRes,
          mantenimientosRes,
          reparacionesRes,
        ] = await Promise.all([
          fetch(
            "https://www.registroreparacionesmantenmientos.somee.com/api/Trabajadores"
          ).then((res) => res.json()),
          fetch(
            "https://www.registroreparacionesmantenmientos.somee.com/api/Equipo"
          ).then((res) => res.json()),
          fetch(
            "https://www.registroreparacionesmantenmientos.somee.com/api/Mantenimiento"
          ).then((res) => res.json()),
          fetch(
            "https://www.registroreparacionesmantenmientos.somee.com/api/Reparaciones"
          ).then((res) => res.json()),
        ]);

        setTrabajadores(trabajadoresRes.length);
        setEquipos(equiposRes.length);
        setMantenimientos(mantenimientosRes.length);
        setReparaciones(reparacionesRes.length);

        // Procesar datos para gráficos y estados adicionales
        const reparacionesActivasPorDia = new Array(7).fill(0);
        const mantenimientosPorMes = new Array(12).fill(0);
        let completadas = 0;
        let pendientes = 0;

        reparacionesRes.forEach((reparacion: any) => {
          const dia = new Date(reparacion.fechaInicio).getDay();
          reparacionesActivasPorDia[dia]++;
          if (reparacion.estadoId === 2) completadas++;
          else pendientes++;
        });

        mantenimientosRes.forEach((mantenimiento: any) => {
          const mes = new Date(mantenimiento.fechaInicio).getMonth();
          mantenimientosPorMes[mes]++;
        });

        setReparacionesData(reparacionesActivasPorDia);
        setMantenimientosData(mantenimientosPorMes);
        setReparacionesCompletadas(completadas);
        setReparacionesPendientes(pendientes);
      } catch (error) {
        console.error("Error al cargar los datos:", error);
      }
    };

    fetchData();
  }, []);

  // Configuración de datos para gráficos
  const reparacionesChartData = {
    labels: [
      "Domingo",
      "Lunes",
      "Martes",
      "Miércoles",
      "Jueves",
      "Viernes",
      "Sábado",
    ],
    datasets: [
      {
        label: "Reparaciones Activas",
        data: reparacionesData,
        borderColor: "rgba(234, 88, 12, 1)",
        backgroundColor: "rgba(234, 88, 12, 0.2)",
        tension: 0.4,
        fill: true,
      },
    ],
  };

  const mantenimientosChartData = {
    labels: [
      "Enero",
      "Febrero",
      "Marzo",
      "Abril",
      "Mayo",
      "Junio",
      "Julio",
      "Agosto",
      "Septiembre",
      "Octubre",
      "Noviembre",
      "Diciembre",
    ],
    datasets: [
      {
        label: "Mantenimientos Realizados",
        data: mantenimientosData,
        borderColor: "rgba(59, 130, 246, 1)",
        backgroundColor: "rgba(59, 130, 246, 0.2)",
        tension: 0.4,
        fill: true,
      },
    ],
  };

  const reparacionesEstadoChartData = {
    labels: ["Completadas", "Pendientes"],
    datasets: [
      {
        label: "Estado de Reparaciones",
        data: [reparacionesCompletadas, reparacionesPendientes],
        backgroundColor: ["rgba(34, 197, 94, 0.8)", "rgba(234, 88, 12, 0.8)"],
      },
    ],
  };

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Panel de Control de Mantenimiento</h1>

      {/* Resumen General */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Trabajadores</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{trabajadores}</div>
            <p className="text-xs text-muted-foreground">
              Personal registrado en el sistema
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Equipos</CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{equipos}</div>
            <p className="text-xs text-muted-foreground">
              Equipos registrados en el inventario
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Mantenimientos
            </CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{mantenimientos}</div>
            <p className="text-xs text-muted-foreground">
              Total de mantenimientos realizados
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Reparaciones</CardTitle>
            <CheckCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{reparaciones}</div>
            <p className="text-xs text-muted-foreground">
              Total de reparaciones activas
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Gráficos */}
      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Reparaciones Activas por Día</CardTitle>
          </CardHeader>
          <CardContent>
            <Line data={reparacionesChartData} />
            <p className="mt-4 text-sm text-muted-foreground">
              Este gráfico muestra las reparaciones activas distribuidas por día
              de la semana.
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Mantenimientos por Mes</CardTitle>
          </CardHeader>
          <CardContent>
            <Line data={mantenimientosChartData} />
            <p className="mt-4 text-sm text-muted-foreground">
              Este gráfico muestra los mantenimientos realizados durante los
              últimos meses.
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Gráfico de Estado */}
      <div className="grid gap-6 lg:grid-cols-1">
        <Card>
          <CardHeader>
            <CardTitle>Estado de Reparaciones</CardTitle>
          </CardHeader>
          <CardContent>
            <Bar data={reparacionesEstadoChartData} />
            <p className="mt-4 text-sm text-muted-foreground">
              Compara la cantidad de reparaciones completadas frente a las
              pendientes.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
