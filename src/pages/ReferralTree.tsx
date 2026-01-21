import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../services/api';
import { ChevronRight, ChevronDown, User, Network } from 'lucide-react';
import { Button } from "@/components/ui/button"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge" // Wait, I didn't install badge. I'll use simple style if fails.

// Simple Badge mock if not installed or I can rely on Tailwind
const SimpleBadge = ({ children, className }: any) => (
    <span className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 border-transparent bg-primary text-primary-foreground hover:bg-primary/80 ${className}`}>
        {children}
    </span>
);


interface TreeNodeProps {
    node: any;
}

const TreeNode: React.FC<TreeNodeProps> = ({ node }) => {
    const [isOpen, setIsOpen] = useState(true);
    const hasChildren = node.children && node.children.length > 0;

    return (
        <div className="ml-6 border-l-2 pl-4 border-slate-200 dark:border-slate-700 transition-all duration-300">
            <div className="flex items-center p-3 hover:bg-white dark:hover:bg-slate-800 rounded-lg cursor-pointer transition-all border border-transparent hover:border-slate-200 dark:hover:border-slate-700 hover:shadow-sm" onClick={() => setIsOpen(!isOpen)}>
                {hasChildren ? (
                    isOpen ? <ChevronDown size={18} className="text-slate-400 mr-2" /> : <ChevronRight size={18} className="text-slate-400 mr-2" />
                ) : (
                    <span className="w-[18px] mr-2"></span>
                )}
                <div className="bg-indigo-100 dark:bg-indigo-900/50 p-1.5 rounded-full mr-3">
                    <User size={16} className="text-indigo-600 dark:text-indigo-400" />
                </div>
                <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-4">
                    <span className="font-bold text-slate-800 dark:text-slate-200">{node.name}</span>
                    <span className="text-xs text-slate-500 font-mono">{node.email}</span>
                    <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-green-100 text-green-800">
                        Total Income: ${node.totalIncome.toFixed(2)}
                    </span>
                </div>
            </div>
            {isOpen && hasChildren && (
                <div className="mt-2">
                    {node.children.map((child: any) => (
                        <TreeNode key={child._id} node={child} />
                    ))}
                </div>
            )}
        </div>
    );
};

const ReferralTree = () => {
    const [tree, setTree] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchTree = async () => {
            try {
                const { data } = await api.get('/user/referrals');
                setTree(data);
            } catch (error) {
                console.error(error);
            } finally {
                setLoading(false);
            }
        };
        fetchTree();
    }, []);

    return (
        <div className="min-h-screen bg-gray-50/50 dark:bg-slate-950 p-6 md:p-12 font-sans">
            <div className="max-w-5xl mx-auto space-y-8">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">Referral Network</h1>
                        <p className="text-slate-500 mt-1">Visualize your team structure and growth.</p>
                    </div>
                    <Button variant="outline" asChild className="border-slate-200 hover:bg-white hover:text-indigo-600">
                        <Link to="/dashboard">&larr; Back to Dashboard</Link>
                    </Button>
                </div>

                <Card className="shadow-md border-none ring-1 ring-slate-900/5 bg-white">
                    <CardHeader className="border-b border-slate-100 bg-slate-50/50">
                        <div className="flex items-center gap-2">
                            <Network className="h-5 w-5 text-indigo-500" />
                            <CardTitle className="text-lg text-slate-700">My Network Tree</CardTitle>
                        </div>
                    </CardHeader>
                    <CardContent className="min-h-[500px] p-6">
                        {loading ? (
                            <div className="flex justify-center p-12 text-slate-400">Loading network data...</div>
                        ) : tree.length > 0 ? (
                            <div className="pl-2">
                                {tree.map((node) => <TreeNode key={node._id} node={node} />)}
                            </div>
                        ) : (
                            <div className="flex flex-col items-center justify-center py-20 text-slate-400 space-y-4">
                                <Network className="h-16 w-16 opacity-20" />
                                <p className="text-lg font-medium">No referrals yet.</p>
                                <p className="text-sm">Share your code from the dashboard to start building your team!</p>
                            </div>
                        )}
                    </CardContent>
                </Card>
            </div>
        </div>
    );
};

export default ReferralTree;
