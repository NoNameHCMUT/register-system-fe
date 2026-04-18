import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { MapPin, Calendar, Info, X } from "lucide-react";

import { Card, CardContent } from "@/components/ui/card";
import { Footer } from "@/components/Footer";
import { Badge } from "@/components/ui/badge";
import { PendingList } from "./components/pendingList";
import { ApproveList } from "./components/approveList";

import { UserHeader } from "@/components/UserHeader";
import { handleLogout } from "@/features/Login/api/logout.api";
import { useGetUser } from "@/shared/get-user";
import type { CampaignItem } from "@/components/CampaignBrowser";
import { getSchoolApplicantsApi, getCommunityApplicantsApi, batchSchoolApplicantActionApi, batchCommunityApplicantActionApi } from "./api/prjDetail.api";
import { handleApiError } from "@/shared/api";

export function ProjectDetail() {
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const location = useLocation();

  const project = location.state?.project as CampaignItem | undefined;
  const { data: me } = useGetUser();
  const showApprovalQueue = me?.role === "school" || me?.role === "community";
  const [viewingUser, setViewingUser] = useState<any>(null);
  console.log(me?.role);
  const { data: applicants = [], isLoading } = useQuery({
    queryKey: ["project-applicants", project?.id],
    queryFn: () => me?.role === "school"
      ? getSchoolApplicantsApi(project!.id.toString())
      : getCommunityApplicantsApi(project!.id.toString()),
    enabled: !!project?.id && showApprovalQueue,
  });

  const onLogout = () => {
    handleLogout();
    toast.success("Logged out successfully.");
    navigate("/logout");
  };

  const pendingStudents = applicants.filter((a: any) =>
    me?.role === "school"
      ? a.status === "SCHOOL_PENDING"
      : a.status === "COMMUNITY_PENDING"
  );
  const approvedStudents = applicants.filter((a: any) =>
    me?.role === "community" && a.status === "APPROVED"
  );

  const schoolActionMutation = useMutation({
    mutationFn: batchSchoolApplicantActionApi,
    onSuccess: (_, variables) => {
      const msg =
        variables.action === "approve"
          ? "Đã duyệt thành công"
          : "Đã từ chối/gỡ sinh viên";
      toast.success(msg);
      if (project?.id) {
        queryClient.invalidateQueries({ queryKey: ["project-applicants", project.id] });
        queryClient.invalidateQueries({ queryKey: ["project-applicants", String(project.id)] });
      }
    },
    onError: (error) => handleApiError(error),
  });


  const communityActionMutation = useMutation({
    mutationFn: batchCommunityApplicantActionApi,
    onSuccess: (_, variables) => {
      const msg =
        variables.action === "approve"
          ? "Đã duyệt thành công"
          : "Đã từ chối/gỡ sinh viên";
      toast.success(msg);
      if (project?.id) {
        queryClient.invalidateQueries({ queryKey: ["project-applicants", project.id] });
        queryClient.invalidateQueries({ queryKey: ["project-applicants", String(project.id)] });
      }
    },
    onError: (error) => handleApiError(error),
  });

  const handleSchoolAction = (applicationId: number, action: "approve" | "reject") => {
    schoolActionMutation.mutate({ applicationIds: [applicationId], action });
  };

  const handleCommunityAction = (applicationId: number, action: "approve" | "reject") => {
    communityActionMutation.mutate({ applicationIds: [applicationId], action });
  };

  const handleAction = (applicationId: number, action: "approve" | "reject") => {
    console.log(me?.role);
    if (me?.role === "school") {
      handleSchoolAction(applicationId, action);
    } else {
      handleCommunityAction(applicationId, action);
    }
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
                  {(project as any).dateApproved ? "APPROVED" : "PENDING APPROVAL"}
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
                onView={(user) => setViewingUser(user)}
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

      {viewingUser && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-xl">
            <div className="flex items-center justify-between border-b pb-4">
              <h3 className="text-lg font-bold text-slate-800">User Details</h3>
              <button onClick={() => setViewingUser(null)} className="text-slate-400 hover:text-slate-600">
                <X className="size-5" />
              </button>
            </div>
            <div className="mt-6 flex flex-col items-center gap-4">
              <div className="text-center">
                <div className="text-xl font-bold text-slate-900">{viewingUser.full_name}</div>
                <div className="text-sm font-semibold text-blue-600 mt-1">{viewingUser.student_id}</div>
              </div>
            </div>
            <div className="mt-6 space-y-4">
              <div className="grid grid-cols-2 gap-1">
                <div>
                  <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Username</div>
                  <div className="font-medium text-[15px] text-slate-700">{viewingUser.username}</div>
                </div>
                <div>
                  <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Role</div>
                  <div className="font-medium text-[15px] text-slate-700 uppercase">{viewingUser.role}</div>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-1">
                <div>
                  <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Email</div>
                  <div className="font-medium text-[15px] text-slate-700 break-all">{viewingUser.email}</div>
                </div>
                <div>
                  <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Status</div>
                  <div className="font-medium text-slate-700">
                    <span className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ${viewingUser.is_active ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                      {viewingUser.is_active ? 'Active' : 'Inactive'}
                    </span>
                  </div>
                </div>
              </div>
            </div>
            <div className="mt-8 flex justify-end">
              <button onClick={() => setViewingUser(null)} className="rounded-xl bg-slate-100 px-6 py-2 text-sm font-bold text-slate-700 hover:bg-slate-200">
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
