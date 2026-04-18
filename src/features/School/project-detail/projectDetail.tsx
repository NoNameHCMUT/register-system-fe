import { useLocation, useNavigate } from "react-router-dom";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { MapPin, Calendar, Info } from "lucide-react";

import { Card, CardContent } from "@/components/ui/card";
import { Footer } from "@/components/Footer";
import { Badge } from "@/components/ui/badge";
import { PendingList } from "./components/pendingList";
import { ApproveList } from "./components/approveList";

import { UserHeader } from "@/components/UserHeader";
import { handleLogout } from "@/features/Login/api/logout.api";
import { useGetUser } from "@/shared/get-user";
import type { CampaignItem } from "@/components/CampaignBrowser";
import { getApplicantsApi, batchApplicantActionApi } from "./api/prjDetail.api";
import { handleApiError } from "@/shared/api";

export function ProjectDetail() {
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const location = useLocation();

  const project = location.state?.project as CampaignItem | undefined;
  const { data: me } = useGetUser();
  console.log(project)
  const showApprovalQueue = me?.role === "school";

  const { data: applicants = [], isLoading } = useQuery({
    queryKey: ["project-applicants", project?.id],
    queryFn: () => getApplicantsApi(project!.id.toString()),
    enabled: !!project?.id && showApprovalQueue,
  });

  const onLogout = () => {
    handleLogout();
    toast.success("Logged out successfully.");
    navigate("/logout");
  };

  const pendingStudents = applicants.filter((a: any) => a.status === "SCHOOL_PENDING");
  const approvedStudents = applicants.filter((a: any) => a.status === "SCHOOL_APPROVED");

  const actionMutation = useMutation({
    mutationFn: batchApplicantActionApi,
    onSuccess: (_, variables) => {
      const msg =
        variables.action === "approve"
          ? "Đã duyệt thành công"
          : "Đã từ chối/gỡ sinh viên";
      toast.success(msg);
      // Invalidate both broad and specific query keys to ensure refetch
      queryClient.invalidateQueries({ queryKey: ["project-applicants"] });
      if (project?.id) {
        queryClient.invalidateQueries({ queryKey: ["project-applicants", project.id] });
        queryClient.invalidateQueries({ queryKey: ["project-applicants", String(project.id)] });
      }
    },
    onError: (error) => handleApiError(error),
  });

  const handleAction = (applicationId: number, action: "approve" | "reject") => {
    actionMutation.mutate({ applicationIds: [applicationId], action });
  };

  if (!project)
    return <div className="p-8 text-center">No project data available.</div>;

  const affiliationName = (project as any).affiliation?.stdName || project.affiliationName || "Unknown Affiliation";
  const bannerUrl = project.bannerUrl || "/assets/campaigns/education_campaign_1775894477648.png";
  const description = (project as any).description;

  return (
    <div className="flex flex-col min-h-screen bg-[#f8fafc]">
      <UserHeader role={me?.role} onLogout={onLogout} />
      <main className="flex-1 w-full max-w-full mx-auto p-6 md:p-8 space-y-8">
        <nav className="text-xs font-bold text-slate-400 uppercase tracking-widest">
          CAMPAIGNS &gt; <span className="text-blue-600">{showApprovalQueue ? "APPROVAL QUEUE" : "DETAIL"}</span>
        </nav>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          <div className={`space-y-8 ${showApprovalQueue ? "lg:col-span-8" : "lg:col-span-12"}`}>
            <div className="rounded-3xl bg-white overflow-hidden shadow-xl flex flex-col">
              <div className="relative w-full h-64 md:h-80 bg-slate-100 flex items-center justify-center p-4">
                <img
                  src={bannerUrl}
                  alt={project.name}
                  className="max-w-full max-h-full object-contain rounded-xl"
                />
              </div>
              <div className="p-8 bg-white">
                <Badge className="bg-blue-100 text-blue-700 border-none mb-4">
                  {(project as any).dateApproved ? "APPROVED" : "PENDING_UNI_APPROVAL"}
                </Badge>
                <h1 className="text-3xl font-bold text-slate-900">{project.name}</h1>
                {description && <p className="mt-2 max-w-3xl text-sm text-slate-600">{description}</p>}
              </div>
            </div>

            <Card className="border-none shadow-sm">
              <CardContent className="p-8">
                <div className="flex items-center justify-between mb-6 text-slate-800">
                  <h2 className="text-xl font-bold">Campaign Overview</h2>
                  <Info className="text-slate-300 size-5" />
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
                  <div className="flex gap-3 text-sm">
                    <div className="p-2 bg-blue-50 rounded-lg text-blue-600 h-fit shrink-0">
                      <MapPin size={20} />
                    </div>
                    <div>
                      <p className="text-[10px] font-bold text-slate-400 uppercase">
                        Affiliation
                      </p>
                      <p className="font-semibold text-slate-700">
                        {affiliationName}
                      </p>
                    </div>
                  </div>
                  <div className="flex gap-3 text-sm">
                    <div className="p-2 bg-blue-50 rounded-lg text-blue-600 h-fit shrink-0">
                      <Calendar size={20} />
                    </div>
                    <div>
                      <p className="text-[10px] font-bold text-slate-400 uppercase">
                        Campaign Timeline
                      </p>
                      <p className="font-semibold text-slate-700">
                        {new Date(project.projectStartDay).toLocaleDateString("en-GB")} - {new Date(project.projectEndDay).toLocaleDateString("en-GB")}
                      </p>
                    </div>
                  </div>
                  {((project as any).formStartDay || (project as any).formEndDay) && (
                    <div className="flex gap-3 text-sm">
                      <div className="p-2 bg-blue-50 rounded-lg text-blue-600 h-fit shrink-0">
                        <Calendar size={20} />
                      </div>
                      <div>
                        <p className="text-[10px] font-bold text-slate-400 uppercase">
                          Registration Timeline
                        </p>
                        <p className="font-semibold text-slate-700">
                          {(project as any).formStartDay && new Date((project as any).formStartDay).toLocaleDateString("en-GB")} - {(project as any).formEndDay && new Date((project as any).formEndDay).toLocaleDateString("en-GB")}
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            {showApprovalQueue && (
              <ApproveList
                students={approvedStudents}
                onAction={(sid) => handleAction(sid, "reject")}
              />
            )}
          </div>

          {showApprovalQueue && (
            <div className="lg:col-span-4 space-y-8">
              <PendingList students={pendingStudents} onAction={handleAction} />
            </div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
}
