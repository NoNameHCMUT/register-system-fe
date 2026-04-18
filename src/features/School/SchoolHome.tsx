import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

import {
  CampaignBrowser,
  type CampaignItem,
} from "@/components/CampaignBrowser";
import { Footer } from "@/components/Footer";
import { UserHeader } from "@/components/UserHeader";
import { handleLogout } from "@/features/Login/api/logout.api";
import { useGetUser } from "@/shared/get-user";

import {
  approveSchoolCampaignApi,
  getSchoolCampaignApi,
} from "./api/school.api";

function SchoolHome() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [approvingProjectId, setApprovingProjectId] = useState<number | null>(
    null,
  );

  const { data: me } = useGetUser();
  const { data: projects = [], isLoading: isLoadingProjects } = useQuery({
    queryKey: ["school", "projects"],
    queryFn: getSchoolCampaignApi,
  });

  const approveCampaignMutation = useMutation({
    mutationFn: approveSchoolCampaignApi,
    onSuccess: () => {
      toast.success("Campaign approved successfully.");
      queryClient.invalidateQueries({ queryKey: ["school", "projects"] });
    },
  });

  const onApproveCampaign = async (project: CampaignItem) => {
    if (project.dateApproved || approveCampaignMutation.isPending) {
      return;
    }

    try {
      setApprovingProjectId(project.id);
      await approveCampaignMutation.mutateAsync(project.id);
    } catch {
      toast.error("Failed to approve campaign.");
    } finally {
      setApprovingProjectId(null);
    }
  };

  const onLogout = () => {
    handleLogout();
    toast.success("Logged out successfully.");
    navigate("/logout");
  };

  return (
    <div className="flex min-h-svh flex-col bg-[#f7f9fc]">
      <UserHeader role={me?.role} onLogout={onLogout} />

      <CampaignBrowser
        actionVariant="approve"
        actionButtonLabel="Approve Campaign"
        actionLoadingProjectId={approvingProjectId}
        affiliationName={me?.affiliation?.std_name}
        introDescription="Review and approve campaigns submitted by communities."
        introTitle="Welcome back, School Representative"
        isLoadingProjects={isLoadingProjects}
        onActionClick={onApproveCampaign}
        projects={projects}
        role={me?.role}
        showHero={false}
        showActionButton
      />

      <Footer />
    </div>
  );
}

export { SchoolHome };
