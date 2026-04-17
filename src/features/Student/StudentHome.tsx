import { useQuery } from "@tanstack/react-query";
import { useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { Footer } from "@/components/Footer";
import { CampaignBrowser, type CampaignItem } from "@/components/CampaignBrowser";
import { UserHeader } from "@/components/UserHeader";
import { handleLogout } from "../Login/api/logout.api";
import { toast } from "sonner";
import { useGetUser } from "@/shared/get-user";
import { getStudentProjectsApi } from "./api/student.api";

export function StudentHome() {
  const navigate = useNavigate();

  const { data: me, isLoading: isLoadingMe } = useGetUser();
  const { data: projects = [], isLoading: isLoadingProjects } = useQuery({
    queryKey: ["student", "projects"],
    queryFn: getStudentProjectsApi,
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

  const onLogout = () => {
    handleLogout();
    toast.success("Logged out successfully.");
    navigate("/logout");
  };

  return (
    <div className="flex min-h-svh flex-col bg-[#f7f9fc]">
      <UserHeader role={me?.role} onLogout={onLogout} />

      <CampaignBrowser
        affiliationName={me?.affiliation?.std_name}
        isLoadingAffiliation={isLoadingMe}
        isLoadingProjects={isLoadingProjects}
        projects={campaignItems}
        role={me?.role}
      />

      <Footer />
    </div>
  );
}
