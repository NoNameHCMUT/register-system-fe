import { useQuery } from "@tanstack/react-query";
import { useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

import {
  CampaignBrowser,
  type CampaignItem,
} from "@/components/CampaignBrowser";
import { Footer } from "@/components/Footer";
import { UserHeader } from "@/components/UserHeader";
import { getCommunityProjectsApi } from "@/features/Community/Dashboard/api/project.api";
import { handleLogout } from "@/features/Login/api/logout.api";
import { useGetUser } from "@/shared/get-user";
import { globalConfig } from "@/shared/api";

function CommunityHome() {
  const navigate = useNavigate();
  const { data: me, isLoading: isLoadingMe } = useGetUser();
  const { data: projects = [], isLoading: isLoadingProjects } = useQuery({
    queryKey: ["community", "projects"],
    queryFn: getCommunityProjectsApi,
  });

  const campaignItems = useMemo<CampaignItem[]>(() => {
    return projects.map((project) => ({
      affiliationName: project.affiliation.stdName,
      bannerUrl: `${globalConfig}/uploads${project.bannerUrl}`,
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
        introDescription="Track all campaigns created by your community, including pending and approved statuses."
        introTitle="My Campaigns"
        isLoadingAffiliation={isLoadingMe}
        isLoadingProjects={isLoadingProjects}
        projects={campaignItems}
        role={me?.role}
        showHero={false}
      />

      <Footer />
    </div>
  );
}

export { CommunityHome };
