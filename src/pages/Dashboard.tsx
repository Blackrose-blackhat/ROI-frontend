import React, { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../services/api';
import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Loader2, TrendingUp, Users, Wallet, DollarSign } from 'lucide-react';

const Dashboard = () => {
    const navigate = useNavigate();
    const [stats, setStats] = useState<any>(null);
    const [investments, setInvestments] = useState<any[]>([]);
    const [amount, setAmount] = useState('');
    const [plan, setPlan] = useState('Basic');
    const [loading, setLoading] = useState(true);
    const [investing, setInvesting] = useState(false);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const dashboardRes = await api.get('/user/dashboard');
                const investRes = await api.get('/invest');
                setStats(dashboardRes.data);
                setInvestments(investRes.data);
            } catch (error) {
                console.error('Error fetching data', error);
                navigate('/login');
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [navigate]);

    const handleInvest = async (e: React.FormEvent) => {
        e.preventDefault();
        setInvesting(true);
        try {
            await api.post('/invest', {
                amount: Number(amount),
                plan,
                dailyRoiPercentage: plan === 'Basic' ? 1.5 : 2.5,
            });
            alert('Investment created!');
            window.location.reload();
        } catch (error: any) {
            alert(error.response?.data?.message || 'Investment failed');
        } finally {
            setInvesting(false);
        }
    };

    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('userInfo');
        navigate('/login');
    };

    if (loading) return <div className="flex justify-center items-center h-screen"><Loader2 className="h-8 w-8 animate-spin text-primary" /></div>;

    const pieData = stats ? [
        { name: 'ROI Income', value: stats.user.roiIncome },
        { name: 'Level Income', value: stats.user.levelIncome },
    ] : [];

    const cleanPieData = pieData.filter(d => d.value > 0);
    const COLORS = ['#8884d8', '#82ca9d'];

    return (
        <div className="min-h-screen bg-gray-50/50 dark:bg-slate-950 p-6 md:p-12 font-sans tracking-wide">

            {/* Header Section */}
            <div className="flex flex-col md:flex-row justify-between items-center mb-10 gap-4">
                <div>
                    <h1 className="text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight">Dashboard</h1>
                    <p className="text-slate-500 dark:text-slate-400 mt-1">Manage your investments and track your growth.</p>
                </div>
                <div className="flex items-center gap-6 bg-white dark:bg-slate-900 p-3 px-6 rounded-full shadow-sm border border-slate-100 dark:border-slate-800">
                    <div className="text-right hidden md:block">
                        <p className="text-sm font-medium text-slate-500">Welcome back,</p>
                        <p className="font-bold text-slate-900 dark:text-white">{stats?.user.name}</p>
                    </div>
                    <Button variant="ghost" className="text-red-500 hover:text-red-600 hover:bg-red-50 rounded-full" onClick={handleLogout}>
                        Logout
                    </Button>
                </div>
            </div>

            {/* Stats Overview */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
                <Card className="border-l-4 border-l-blue-500 shadow-sm hover:shadow-md transition-shadow">
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                        <CardTitle className="text-sm font-medium text-slate-500 uppercase tracking-wider">Wallet Balance</CardTitle>
                        <Wallet className="h-5 w-5 text-blue-500" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-3xl font-bold text-slate-900 dark:text-white">${stats?.user.walletBalance.toFixed(2)}</div>
                    </CardContent>
                </Card>
                <Card className="border-l-4 border-l-green-500 shadow-sm hover:shadow-md transition-shadow">
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                        <CardTitle className="text-sm font-medium text-slate-500 uppercase tracking-wider">Total Income</CardTitle>
                        <DollarSign className="h-5 w-5 text-green-500" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-3xl font-bold text-slate-900 dark:text-white">${stats?.user.totalIncome.toFixed(2)}</div>
                    </CardContent>
                </Card>
                <Card className="border-l-4 border-l-purple-500 shadow-sm hover:shadow-md transition-shadow">
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                        <CardTitle className="text-sm font-medium text-slate-500 uppercase tracking-wider">ROI Income</CardTitle>
                        <TrendingUp className="h-5 w-5 text-purple-500" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-3xl font-bold text-slate-900 dark:text-white">${stats?.user.roiIncome.toFixed(2)}</div>
                    </CardContent>
                </Card>
                <Card className="border-l-4 border-l-orange-500 shadow-sm hover:shadow-md transition-shadow">
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                        <CardTitle className="text-sm font-medium text-slate-500 uppercase tracking-wider">Level Income</CardTitle>
                        <Users className="h-5 w-5 text-orange-500" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-3xl font-bold text-slate-900 dark:text-white">${stats?.user.levelIncome.toFixed(2)}</div>
                    </CardContent>
                </Card>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-10">
                {/* Main Action Area: Referral & Investment */}
                <div className="lg:col-span-2 space-y-8">

                    {/* Referral Section */}
                    <Card className="bg-gradient-to-r from-slate-900 to-slate-800 text-white border-none shadow-lg">
                        <CardHeader>
                            <CardTitle className="text-xl">🚀 Invite & Earn</CardTitle>
                            <CardDescription className="text-slate-300">
                                Give your friends this code. When they invest, you earn <strong>5%</strong> of their investment instantly!
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="flex flex-col sm:flex-row items-center gap-4">
                            <div className="bg-white/10 backdrop-blur-sm p-4 rounded-lg font-mono text-xl font-bold tracking-widest border border-white/20 text-center w-full sm:w-auto text-white">
                                {stats?.user.referralCode || '-------'}
                            </div>
                            <Button
                                className="w-full sm:w-auto bg-white text-slate-900 hover:bg-slate-100 font-semibold"
                                onClick={() => {
                                    navigator.clipboard.writeText(stats?.user.referralCode);
                                    alert('Referral code copied!');
                                }}
                            >
                                Copy Code
                            </Button>
                        </CardContent>
                    </Card>

                    {/* Investment Form */}
                    <Card className="shadow-lg border-t-4 border-t-indigo-500">
                        <CardHeader>
                            <CardTitle>Create New Investment</CardTitle>
                            <CardDescription>Choose a plan that suits your financial goals.</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <form onSubmit={handleInvest} className="space-y-6">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="space-y-2">
                                        <Label htmlFor="amount" className="text-md font-semibold text-slate-700">Investment Amount ($)</Label>
                                        <div className="relative">
                                            <span className="absolute left-3 top-2.5 text-slate-500">$</span>
                                            <Input
                                                id="amount"
                                                type="number"
                                                className="pl-7 h-12 text-lg"
                                                placeholder="e.g. 1000"
                                                value={amount}
                                                onChange={(e) => setAmount(e.target.value)}
                                                required
                                                min="10"
                                            />
                                        </div>
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="plan" className="text-md font-semibold text-slate-700">Select Plan</Label>
                                        <Select onValueChange={setPlan} defaultValue={plan}>
                                            <SelectTrigger className="h-12 text-lg">
                                                <SelectValue placeholder="Select a plan" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="Basic">
                                                    <div className="flex flex-col text-left">
                                                        <span className="font-bold">Basic Plan</span>
                                                        <span className="text-xs text-slate-500">1.5% Daily Return</span>
                                                    </div>
                                                </SelectItem>
                                                <SelectItem value="Premium">
                                                    <div className="flex flex-col text-left">
                                                        <span className="font-bold">Premium Plan</span>
                                                        <span className="text-xs text-slate-500">2.5% Daily Return</span>
                                                    </div>
                                                </SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>
                                </div>
                                <Button type="submit" size="lg" className="w-full text-base font-bold bg-indigo-600 hover:bg-indigo-700" disabled={investing}>
                                    {investing ? <><Loader2 className="mr-2 h-5 w-5 animate-spin" /> Processing Investment...</> : "Invest Now"}
                                </Button>
                            </form>
                        </CardContent>
                    </Card>
                </div>

                {/* Right Column: Charts & Links */}
                <div className="space-y-8">
                    <Card className="h-full flex flex-col items-center justify-center p-6 bg-white shadow-md">
                        <CardHeader className="pb-2">
                            <CardTitle className="text-lg text-slate-700 text-center">Income Distribution</CardTitle>
                        </CardHeader>
                        <CardContent className="w-full flex justify-center pb-6">
                            {cleanPieData.length > 0 ? (
                                <div className="w-[200px] h-[200px] md:w-[250px] md:h-[250px]">
                                    <ResponsiveContainer width="100%" height="100%">
                                        <PieChart>
                                            <Pie
                                                data={cleanPieData}
                                                cx="50%"
                                                cy="50%"
                                                innerRadius={60}
                                                outerRadius={80}
                                                fill="#8884d8"
                                                paddingAngle={5}
                                                dataKey="value"
                                                stroke="none"
                                            >
                                                {cleanPieData.map((_, index) => (
                                                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                                ))}
                                            </Pie>
                                            <Tooltip formatter={(value: number | undefined) => `$${(value || 0).toFixed(2)}`} />
                                            <Legend verticalAlign="bottom" height={36} />
                                        </PieChart>
                                    </ResponsiveContainer>
                                </div>
                            ) : (
                                <div className="text-center py-20 text-slate-400">
                                    <p>No income yet.</p>
                                    <p className="text-xs">Invest or refer to see stats!</p>
                                </div>
                            )}
                        </CardContent>
                        <CardFooter className="w-full pt-0">
                            <Button variant="outline" className="w-full text-slate-600 border-slate-300" asChild>
                                <Link to="/referrals">View Full Referral Tree &rarr;</Link>
                            </Button>
                        </CardFooter>
                    </Card>
                </div>
            </div>

            {/* Recent Investments Table */}
            <Card className="shadow-md overflow-hidden">
                <CardHeader className="bg-slate-50 border-b border-slate-100 dark:bg-slate-900/50">
                    <CardTitle className="text-xl">Investment History</CardTitle>
                </CardHeader>
                <CardContent className="p-0">
                    <Table>
                        <TableHeader>
                            <TableRow className="hover:bg-transparent">
                                <TableHead className="pl-6 w-[150px]">Plan Name</TableHead>
                                <TableHead>Amount</TableHead>
                                <TableHead>Daily ROI</TableHead>
                                <TableHead>Start Date</TableHead>
                                <TableHead className="text-right pr-6">Status</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {investments.map((inv: any) => (
                                <TableRow key={inv._id} className="hover:bg-slate-50/50">
                                    <TableCell className="font-semibold pl-6">{inv.plan}</TableCell>
                                    <TableCell className="font-mono text-slate-700">${inv.amount.toFixed(2)}</TableCell>
                                    <TableCell>
                                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                                            {inv.dailyRoiPercentage}% / day
                                        </span>
                                    </TableCell>
                                    <TableCell className="text-slate-500">{new Date(inv.startDate).toLocaleDateString()}</TableCell>
                                    <TableCell className="text-right pr-6">
                                        <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-bold ${inv.status === 'Active' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-700'}`}>
                                            <span className={`w-2 h-2 rounded-full mr-2 ${inv.status === 'Active' ? 'bg-green-500' : 'bg-gray-500'}`}></span>
                                            {inv.status}
                                        </span>
                                    </TableCell>
                                </TableRow>
                            ))}
                            {investments.length === 0 && (
                                <TableRow>
                                    <TableCell colSpan={5} className="text-center py-10 text-slate-500">
                                        You haven't made any investments yet.
                                    </TableCell>
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>
        </div>
    );
};

export default Dashboard;
