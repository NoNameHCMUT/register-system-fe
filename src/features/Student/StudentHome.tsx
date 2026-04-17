import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Footer } from "@/components/Footer";
import { CampaignBrowser, type CampaignItem } from "@/components/CampaignBrowser";
import { UserHeader } from "@/components/UserHeader";
import { handleLogout } from "../Login/api/logout.api";
import { toast } from "sonner";
import { useGetUser } from "@/shared/get-user";
import {
  applyStudentProjectApi,
  getStudentApplicationsApi,
  getStudentProjectsApi,
  type StudentApplicationStatus,
} from "./api/student.api";

export function StudentHome() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [studentTab, setStudentTab] = useState<"school" | "registered">(
    "school",
  );
  const [applicationStatusTab, setApplicationStatusTab] =
    useState<StudentApplicationStatus>("SCHOOL_PENDING");

  const { data: me, isLoading: isLoadingMe } = useGetUser();
  const { data: projects = [], isLoading: isLoadingProjects } = useQuery({
    queryKey: ["student", "projects"],
    queryFn: getStudentProjectsApi,
  });
  const { data: applications = [], isLoading: isLoadingApplications } = useQuery({
    queryKey: ["student", "applications"],
    queryFn: getStudentApplicationsApi,
  });

  const applyProjectMutation = useMutation({
    mutationFn: applyStudentProjectApi,
    onSuccess: () => {
      toast.success("Registered successfully.");
      queryClient.invalidateQueries({ queryKey: ["student", "projects"] });
      queryClient.invalidateQueries({ queryKey: ["student", "applications"] });
    },
    onError: () => {
      toast.error("Failed to register for this campaign.");
    },
  });

  const campaignItems = useMemo<CampaignItem[]>(() => {
    return projects.map((project) => ({
      affiliationName: project.affiliation.stdName,
      bannerUrl: project.bannerUrl,
      dateApproved: project.dateApproved,
      id: project.id,
      name: project.name,
      numAttending: project.numAttending,
      numMax: project.numMax,
      projectEndDay: project.projectEndDay,
      projectStartDay: project.projectStartDay,
    }));
  }, [projects]);

  const registeredCampaignItems = useMemo<CampaignItem[]>(() => {
    return applications.map((application) => ({
      affiliationName: application.project.affiliation.stdName,
      applicationStatus: application.status,
      bannerUrl: application.project.bannerUrl,
      dateApproved: application.project.dateApproved,
      id: application.project.id,
      name: application.project.name,
      numAttending: application.project.numAttending,
      numMax: application.project.numMax,
      projectEndDay: application.project.projectEndDay,
      projectStartDay: application.project.projectStartDay,
    }));
  }, [applications]);

  const registeredByStatusItems = useMemo(() => {
    return registeredCampaignItems.filter(
      (project) => project.applicationStatus === applicationStatusTab,
    );
  }, [applicationStatusTab, registeredCampaignItems]);

  const displayItems =
    studentTab === "school" ? campaignItems : registeredByStatusItems;
  const isLoadingDisplayProjects =
    studentTab === "school" ? isLoadingProjects : isLoadingApplications;

  const onLogout = () => {
    handleLogout();
    toast.success("Logged out successfully.");
    navigate("/logout");
  };

  const onRegisterCampaign = (project: CampaignItem) => {
    if (applyProjectMutation.isPending) {
      return;
    }

    applyProjectMutation.mutate(project.id);
  };

  return (
    <div className="flex min-h-svh flex-col bg-[#f7f9fc]">
      <UserHeader role={me?.role} onLogout={onLogout} />

      <CampaignBrowser
        actionButtonLabel="View Details"
        emptyText={
          studentTab === "school"
            ? "No school campaigns found."
            : "No registered campaigns in this status."
        }
        affiliationName={me?.affiliation?.std_name}
        isLoadingAffiliation={isLoadingMe}
        isLoadingProjects={isLoadingDisplayProjects}
        headerTabs={
          <div className="inline-flex items-center gap-2">
            <div className="inline-flex rounded-xl border border-[#d9dee7] bg-white p-1">
              <button
                type="button"
                onClick={() => setStudentTab("school")}
                className={`rounded-lg px-3 py-1.5 text-xs font-semibold md:text-sm ${
                  studentTab === "school"
                    ? "bg-[#2b50da] text-white"
                    : "text-[#4f5b70]"
                }`}
              >
                School Campaigns
              </button>
              <button
                type="button"
                onClick={() => setStudentTab("registered")}
                className={`rounded-lg px-3 py-1.5 text-xs font-semibold md:text-sm ${
                  studentTab === "registered"
                    ? "bg-[#2b50da] text-white"
                    : "text-[#4f5b70]"
                }`}
              >
                My Registered
              </button>
            </div>

            {studentTab === "registered" && (
              <div className="inline-flex rounded-xl border border-[#d9dee7] bg-white p-1">
                <button
                  type="button"
                  onClick={() => setApplicationStatusTab("SCHOOL_PENDING")}
                  className={`rounded-lg px-3 py-1.5 text-xs font-semibold md:text-sm ${
                    applicationStatusTab === "SCHOOL_PENDING"
                      ? "bg-[#2b50da] text-white"
                      : "text-[#4f5b70]"
                  }`}
                >
                  Pending
                </button>
                <button
                  type="button"
                  onClick={() => setApplicationStatusTab("SCHOOL_APPROVED")}
                  className={`rounded-lg px-3 py-1.5 text-xs font-semibold md:text-sm ${
                    applicationStatusTab === "SCHOOL_APPROVED"
                      ? "bg-[#2b50da] text-white"
                      : "text-[#4f5b70]"
                  }`}
                >
                  Approved
                </button>
              </div>
            )}
          </div>
        }
        onRegisterClick={studentTab === "school" ? onRegisterCampaign : undefined}
        projects={displayItems}
        registerButtonLabel="Register"
        registerLoadingProjectId={
          applyProjectMutation.isPending ? applyProjectMutation.variables : null
        }
        role={me?.role}
        showStudentRegisterAction={studentTab === "school"}
      />

      <Footer />
    </div>
  );
}
