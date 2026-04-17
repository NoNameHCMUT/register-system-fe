import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useParams } from "react-router-dom";
import { toast } from "sonner";
import { MapPin, Calendar, Info } from "lucide-react";

import { Card, CardContent } from "@/components/ui/card";
import { Footer } from "@/components/Footer";
import { Badge } from "@/components/ui/badge";
import { Header } from "./components/navbar";
import { PendingList } from "./components/pendingList";
import { ApproveList } from "./components/approveList";

import { getApplicantsApi, batchApplicantActionApi } from "./api/prjDetail.api";
import { handleApiError } from "@/shared/api";

export function ProjectDetail() {
    const { id } = useParams();
    const queryClient = useQueryClient();

    const { data: applicants = [], isLoading } = useQuery({
        queryKey: ["project-applicants", id],
        queryFn: () => getApplicantsApi(id!),
        enabled: !!id,
    });

    const pendingStudents = applicants.filter(a => a.status === 'pending');
    const approvedStudents = applicants.filter(a => a.status === 'accepted');

    const actionMutation = useMutation({
        mutationFn: batchApplicantActionApi,
        onSuccess: (_, variables) => {
        const msg = variables.action === 'accept' ? "Đã duyệt thành công" : "Đã từ chối/gỡ sinh viên";
        toast.success(msg);
        queryClient.invalidateQueries({ queryKey: ["project-applicants", id] });
        },
        onError: (error) => handleApiError(error),
    });

    const handleAction = (studentId: number, action: 'accept' | 'reject') => {
        actionMutation.mutate({ userIds: [studentId], action });
    };

    if (isLoading) return <div className="p-8 text-center">Loading...</div>;

    return (
        <div className="flex flex-col min-h-screen bg-[#f8fafc]">
        <Header />
        
        <main className="flex-1 w-full max-w-full mx-auto p-6 md:p-8 space-y-8">
            <nav className="text-xs font-bold text-slate-400 uppercase tracking-widest">
            PROJECTS &gt; <span className="text-blue-600">APPROVAL QUEUE</span>
            </nav>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            <div className="lg:col-span-8 space-y-8">
                <div className="relative h-48 rounded-3xl bg-slate-900 p-8 text-white overflow-hidden shadow-xl">
                <Badge className="bg-blue-500/20 text-blue-300 border-none mb-4">PENDING_UNI_APPROVAL</Badge>
                <h1 className="text-3xl font-bold">Green Summer Campaign 2024 - Binh Phuoc Province</h1>
                </div>

                <Card className="border-none shadow-sm">
                <CardContent className="p-8">
                    <div className="flex items-center justify-between mb-6 text-slate-800">
                    <h2 className="text-xl font-bold">Mission Overview</h2>
                    <Info className="text-slate-300 size-5" />
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
                    <div className="flex gap-3 text-sm">
                        <div className="p-2 bg-blue-50 rounded-lg text-blue-600 h-fit shrink-0"><MapPin size={20}/></div>
                        <div>
                        <p className="text-[10px] font-bold text-slate-400 uppercase">Location</p>
                        <p className="font-semibold text-slate-700">Hon Quan District, Binh Phuoc</p>
                        </div>
                    </div>
                    <div className="flex gap-3 text-sm">
                        <div className="p-2 bg-blue-50 rounded-lg text-blue-600 h-fit shrink-0"><Calendar size={20}/></div>
                        <div>
                        <p className="text-[10px] font-bold text-slate-400 uppercase">Timeline</p>
                        <p className="font-semibold text-slate-700">July 15 - Aug 10, 2024</p>
                        </div>
                    </div>
                    </div>
                </CardContent>
                </Card>

                <ApproveList students={approvedStudents} onAction={(sid) => handleAction(sid, 'reject')} />
            </div>

            <div className="lg:col-span-4 space-y-8">
                <PendingList students={pendingStudents} onAction={handleAction} />
            </div>
            </div>

        </main>        
        <Footer />
        </div>
    );
}