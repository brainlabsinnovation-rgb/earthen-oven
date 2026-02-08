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
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
    DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
    CalendarIcon,
    Search,
    RefreshCw,
    LogOut,
    MoreVertical,
    CheckCircle,
    Clock,
    UserCheck,
    XCircle,
    Check
} from "lucide-react";
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
    const [searchTerm, setSearchTerm] = useState("");
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
                date: format(date, "yyyy-MM-dd"),
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

    const filteredReservations = reservations.filter(res =>
        res.customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        res.reservationNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
        res.customer.phone.includes(searchTerm)
    );

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
                                    "w-[240px] justify-start text-left font-normal bg-black border-white/10 hover:border-accent/50 transition-colors",
                                    !date && "text-muted-foreground"
                                )}
                            >
                                <CalendarIcon className="mr-2 h-4 w-4 text-accent" />
                                {date ? format(date, "PPP") : <span>Pick a date</span>}
                            </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0 bg-[#1A1A1A] border-white/10 shadow-2xl" align="start">
                            <Calendar
                                mode="single"
                                selected={date}
                                onSelect={(d) => d && setDate(d)}
                                initialFocus
                                className="bg-[#1A1A1A] text-white"
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
                    <Input
                        placeholder="Search name, phone or ID..."
                        className="pl-9 bg-black border-white/10"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
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
                        ) : filteredReservations.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={7} className="text-center py-8 text-muted-foreground">No reservations found.</TableCell>
                            </TableRow>
                        ) : (
                            filteredReservations.map((res) => (
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
                                        <div className="flex items-center gap-2">
                                            {res.status === 'PENDING' && (
                                                <Button
                                                    size="sm"
                                                    className="h-8 bg-green-600 hover:bg-green-700 text-white gap-1 px-3"
                                                    onClick={() => updateStatus(res.id, 'CONFIRMED')}
                                                >
                                                    <CheckCircle className="w-3.5 h-3.5" />
                                                    Confirm
                                                </Button>
                                            )}
                                            {res.status === 'CONFIRMED' && (
                                                <Button
                                                    size="sm"
                                                    className="h-8 bg-blue-600 hover:bg-blue-700 text-white gap-1 px-3"
                                                    onClick={() => updateStatus(res.id, 'SEATED')}
                                                >
                                                    <UserCheck className="w-3.5 h-3.5" />
                                                    Seat
                                                </Button>
                                            )}
                                            {(res.status === 'SEATED') && (
                                                <Button
                                                    size="sm"
                                                    className="h-8 bg-gray-600 hover:bg-gray-700 text-white gap-1 px-3"
                                                    onClick={() => updateStatus(res.id, 'COMPLETED')}
                                                >
                                                    <Check className="w-3.5 h-3.5" />
                                                    Done
                                                </Button>
                                            )}

                                            <DropdownMenu>
                                                <DropdownMenuTrigger asChild>
                                                    <Button variant="ghost" size="sm" className="h-8 w-8 p-0 border border-white/10 hover:bg-white/10">
                                                        <MoreVertical className="h-4 w-4" />
                                                        <span className="sr-only">Open menu</span>
                                                    </Button>
                                                </DropdownMenuTrigger>
                                                <DropdownMenuContent align="end" className="bg-[#1A1A1A] border-white/10 text-white">
                                                    <DropdownMenuItem onClick={() => updateStatus(res.id, 'CONFIRMED')} className="gap-2 cursor-pointer focus:bg-white/10">
                                                        <CheckCircle className="w-4 h-4 text-green-500" /> Confirm
                                                    </DropdownMenuItem>
                                                    <DropdownMenuItem onClick={() => updateStatus(res.id, 'SEATED')} className="gap-2 cursor-pointer focus:bg-white/10">
                                                        <UserCheck className="w-4 h-4 text-blue-500" /> Seat Customer
                                                    </DropdownMenuItem>
                                                    <DropdownMenuItem onClick={() => updateStatus(res.id, 'COMPLETED')} className="gap-2 cursor-pointer focus:bg-white/10">
                                                        <Check className="w-4 h-4 text-gray-400" /> Mark Completed
                                                    </DropdownMenuItem>
                                                    <DropdownMenuSeparator className="bg-white/10" />
                                                    <DropdownMenuItem onClick={() => updateStatus(res.id, 'CANCELLED')} className="gap-2 text-red-500 cursor-pointer focus:bg-red-500/10">
                                                        <XCircle className="w-4 h-4" /> Cancel Reservation
                                                    </DropdownMenuItem>
                                                    <DropdownMenuItem onClick={() => updateStatus(res.id, 'NO_SHOW')} className="gap-2 text-orange-500 cursor-pointer focus:bg-orange-500/10">
                                                        <Clock className="w-4 h-4" /> Mark No Show
                                                    </DropdownMenuItem>
                                                </DropdownMenuContent>
                                            </DropdownMenu>
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
