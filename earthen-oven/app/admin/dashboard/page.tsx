"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { format } from "date-fns";
import { Calendar } from "@/components/ui/calendar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CalendarIcon, Search, RefreshCw, LogOut } from "lucide-react";
import { cn } from "@/lib/utils";
import { toast, Toaster } from "react-hot-toast";

type Reservation = {
    id: string;
    reservationNumber: string;
    customer: { name: string; phone: string; email: string };
    date: string;
    timeSlot: string;
    numberOfGuests: number;
    status: string;
    specialOccasion?: string;
    specialRequests?: string;
    tableNumber?: number;
    seatingArea?: string;
    adminNotes?: string;
};

export default function AdminDashboard() {
    const router = useRouter();
    const [reservations, setReservations] = useState<Reservation[]>([]);
    const [date, setDate] = useState<Date>(new Date());
    const [filterStatus, setFilterStatus] = useState("All");
    const [loading, setLoading] = useState(true);
    const [stats, setStats] = useState({ total: 0, pending: 0, covers: 0 });

    useEffect(() => {
        const isAuth = localStorage.getItem("adminAuth");
        if (!isAuth) {
            router.push("/admin/login");
        }
        fetchReservations();
    }, [date, filterStatus]);

    const fetchReservations = async () => {
        setLoading(true);
        try {
            const query = new URLSearchParams({
                date: date.toISOString(),
                status: filterStatus
            });
            const res = await fetch(`/api/admin/reservations?${query}`);
            const data = await res.json();
            setReservations(data);
            calculateStats(data);
        } catch (err) {
            toast.error("Failed to load reservations");
        } finally {
            setLoading(false);
        }
    };

    const calculateStats = (data: Reservation[]) => {
        const total = data.length;
        const pending = data.filter(r => r.status === 'PENDING').length;
        const covers = data.reduce((acc, curr) => acc + curr.numberOfGuests, 0);
        setStats({ total, pending, covers });
    };

    const updateStatus = async (id: string, newStatus: string) => {
        try {
            await fetch(`/api/admin/reservations`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ id, status: newStatus })
            });
            toast.success(`Status updated to ${newStatus}`);
            fetchReservations();
        } catch {
            toast.error("Update failed");
        }
    };

    const assignTable = async (id: string, tableNumber: number) => {
        try {
            await fetch(`/api/admin/reservations`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ id, tableNumber })
            });
            toast.success(`Assigned Table ${tableNumber}`);
            fetchReservations();
        } catch {
            toast.error("Failed to assign table");
        }
    };

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'PENDING': return 'bg-yellow-500/20 text-yellow-500 border-yellow-500/50';
            case 'CONFIRMED': return 'bg-green-500/20 text-green-500 border-green-500/50';
            case 'SEATED': return 'bg-blue-500/20 text-blue-500 border-blue-500/50';
            case 'COMPLETED': return 'bg-gray-500/20 text-gray-500 border-gray-500/50';
            case 'CANCELLED': return 'bg-red-500/20 text-red-500 border-red-500/50';
            default: return 'bg-white/10 text-white';
        }
    };

    return (
        <div className="min-h-screen bg-black text-white p-6">
            <Toaster position="top-right" />

            {/* Header */}
            <div className="flex justify-between items-center mb-8 border-b border-white/10 pb-4">
                <div>
                    <h1 className="text-3xl font-heading font-bold text-primary">Admin Dashboard</h1>
                    <p className="text-muted-foreground">Manage reservations for Earthen Oven</p>
                </div>
                <div className="flex items-center gap-4">
                    <Button variant="ghost" onClick={() => fetchReservations()}>
                        <RefreshCw className="w-5 h-5" />
                    </Button>
                    <Button variant="destructive" onClick={() => {
                        localStorage.removeItem("adminAuth");
                        router.push("/");
                    }}>
                        <LogOut className="w-4 h-4 mr-2" />
                        Logout
                    </Button>
                </div>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <Card className="bg-card/50 border-white/10">
                    <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium text-muted-foreground uppercase tracking-wider">Total Reservations</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-4xl font-bold text-white">{stats.total}</div>
                        <p className="text-xs text-muted-foreground mt-1">For selected date</p>
                    </CardContent>
                </Card>
                <Card className="bg-card/50 border-white/10">
                    <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium text-muted-foreground uppercase tracking-wider">Pending Confirmation</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-4xl font-bold text-yellow-500">{stats.pending}</div>
                        <p className="text-xs text-muted-foreground mt-1">Action required</p>
                    </CardContent>
                </Card>
                <Card className="bg-card/50 border-white/10">
                    <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium text-muted-foreground uppercase tracking-wider">Total Guests</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-4xl font-bold text-primary">{stats.covers}</div>
                        <p className="text-xs text-muted-foreground mt-1">Expected covers</p>
                    </CardContent>
                </Card>
            </div>

            {/* Filters */}
            <div className="flex flex-col md:flex-row gap-4 mb-6 bg-card/30 p-4 rounded-lg border border-white/5">
                <div className="flex items-center gap-2">
                    <Popover>
                        <PopoverTrigger asChild>
                            <Button
                                variant={"outline"}
                                className={cn(
                                    "w-[240px] justify-start text-left font-normal bg-black border-white/10",
                                    !date && "text-muted-foreground"
                                )}
                            >
                                <CalendarIcon className="mr-2 h-4 w-4" />
                                {date ? format(date, "PPP") : <span>Pick a date</span>}
                            </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0" align="start">
                            <Calendar
                                mode="single"
                                selected={date}
                                onSelect={(d) => d && setDate(d)}
                                initialFocus
                            />
                        </PopoverContent>
                    </Popover>
                </div>

                <Select value={filterStatus} onValueChange={setFilterStatus}>
                    <SelectTrigger className="w-[180px] bg-black border-white/10">
                        <SelectValue placeholder="Status" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="All">All Status</SelectItem>
                        <SelectItem value="PENDING">Pending</SelectItem>
                        <SelectItem value="CONFIRMED">Confirmed</SelectItem>
                        <SelectItem value="SEATED">Seated</SelectItem>
                        <SelectItem value="COMPLETED">Completed</SelectItem>
                        <SelectItem value="CANCELLED">Cancelled</SelectItem>
                    </SelectContent>
                </Select>

                <div className="relative flex-1">
                    <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input placeholder="Search name or ID..." className="pl-9 bg-black border-white/10" />
                </div>
            </div>

            {/* Table */}
            <div className="rounded-md border border-white/10 overflow-hidden">
                <Table>
                    <TableHeader className="bg-muted/10">
                        <TableRow className="border-white/10 hover:bg-transparent">
                            <TableHead className="text-white">ID</TableHead>
                            <TableHead className="text-white">Customer</TableHead>
                            <TableHead className="text-white">Time</TableHead>
                            <TableHead className="text-white">Guests</TableHead>
                            <TableHead className="text-white">Status</TableHead>
                            <TableHead className="text-white">Table</TableHead>
                            <TableHead className="text-white">Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {loading ? (
                            <TableRow>
                                <TableCell colSpan={7} className="text-center py-8 text-muted-foreground">Loading...</TableCell>
                            </TableRow>
                        ) : reservations.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={7} className="text-center py-8 text-muted-foreground">No reservations found.</TableCell>
                            </TableRow>
                        ) : (
                            reservations.map((res) => (
                                <TableRow key={res.id} className="border-white/10 hover:bg-white/5">
                                    <TableCell className="font-mono text-xs">{res.reservationNumber}</TableCell>
                                    <TableCell>
                                        <div className="font-medium text-primary">{res.customer.name}</div>
                                        <div className="text-xs text-muted-foreground">{res.customer.phone}</div>
                                        {res.specialOccasion && (
                                            <Badge variant="outline" className="mt-1 text-[10px] border-accent text-accent">{res.specialOccasion}</Badge>
                                        )}
                                    </TableCell>
                                    <TableCell>{res.timeSlot}</TableCell>
                                    <TableCell>{res.numberOfGuests}</TableCell>
                                    <TableCell>
                                        <Badge variant="outline" className={cn("rounded-sm border-2", getStatusColor(res.status))}>
                                            {res.status}
                                        </Badge>
                                    </TableCell>
                                    <TableCell>
                                        {res.tableNumber ? (
                                            <Badge variant="secondary" className="bg-white/10">Table {res.tableNumber}</Badge>
                                        ) : (
                                            <Select onValueChange={(val) => assignTable(res.id, parseInt(val))}>
                                                <SelectTrigger className="h-8 w-[80px] text-xs bg-transparent border-white/10">
                                                    <SelectValue placeholder="Assign" />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15].map(n => (
                                                        <SelectItem key={n} value={n.toString()}>T-{n}</SelectItem>
                                                    ))}
                                                </SelectContent>
                                            </Select>
                                        )}
                                    </TableCell>
                                    <TableCell>
                                        <div className="flex gap-2">
                                            {res.status === 'PENDING' && (
                                                <Button size="sm" className="h-8 bg-green-600 hover:bg-green-700" onClick={() => updateStatus(res.id, 'CONFIRMED')}>
                                                    Confirm
                                                </Button>
                                            )}
                                            {res.status === 'CONFIRMED' && (
                                                <Button size="sm" className="h-8 bg-blue-600 hover:bg-blue-700" onClick={() => updateStatus(res.id, 'SEATED')}>
                                                    Seat
                                                </Button>
                                            )}
                                            {(res.status === 'SEATED') && (
                                                <Button size="sm" className="h-8 bg-gray-600 hover:bg-gray-700" onClick={() => updateStatus(res.id, 'COMPLETED')}>
                                                    Done
                                                </Button>
                                            )}
                                            <Select onValueChange={(val) => updateStatus(res.id, val)}>
                                                <SelectTrigger className="h-8 w-[30px] p-0 px-2 bg-transparent border-white/10">
                                                    <span className="sr-only">More</span>
                                                    ...
                                                </SelectTrigger>
                                                <SelectContent>
                                                    <SelectItem value="CANCELLED">Cancel</SelectItem>
                                                    <SelectItem value="NO_SHOW">No Show</SelectItem>
                                                </SelectContent>
                                            </Select>
                                        </div>
                                    </TableCell>
                                </TableRow>
                            ))
                        )}
                    </TableBody>
                </Table>
            </div>
        </div>
    );
}
