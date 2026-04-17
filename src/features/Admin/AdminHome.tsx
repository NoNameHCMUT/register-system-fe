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
import { getAffiliationsApi } from "@/features/Register/api/register.api";
import { useGetUser } from "@/shared/get-user";

function AdminHome() {
  const navigate = useNavigate();
  const { data: me, isLoading: isLoadingMe } = useGetUser();
  const { data: projects = [], isLoading: isLoadingProjects } = useQuery({
    queryKey: ["community", "projects"],
    queryFn: getCommunityProjectsApi,
  });
  const { data: affiliations = [], isLoading: isLoadingAffiliations } = useQuery(
    {
      queryKey: ["affiliations"],
      queryFn: getAffiliationsApi,
    },
  );

  const affiliationNames = useMemo(() => {
    return affiliations.map((item) => item.std_name);
  }, [affiliations]);

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
        affiliations={affiliationNames}
        introDescription="Review and monitor all campaigns across the system from one place."
        introTitle="Welcome back, Admin"
        isLoadingAffiliation={isLoadingMe || isLoadingAffiliations}
        isLoadingProjects={isLoadingProjects}
        projects={campaignItems}
        role={me?.role}
        showHero={false}
        showActionButton={false}
      />

      <Footer />
    </div>
  );
}

export { AdminHome };
