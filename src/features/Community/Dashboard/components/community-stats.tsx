import { StatCard } from "./statCard";
import { Folder, Clock, Megaphone, Heart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useQuery } from "@tanstack/react-query";
import {
  getCommunityProjectsApi,
  type CommunityProject,
} from "../api/project.api";

const formatCount = (count: number) => count.toString();

export function CommunityStats() {
  const { data: projects = [], isLoading } = useQuery<CommunityProject[]>({
    queryKey: ["community", "projects"],
    queryFn: getCommunityProjectsApi,
  });

  const totalProjects = projects.length;
  const pendingApproval = projects.filter(
    (project) => !project.dateApproved,
  ).length;
  const activeCampaigns = projects.filter((project) =>
    Boolean(project.dateApproved),
  ).length;

  return (
    <div className="space-y-6 lg:col-span-4">
      <StatCard
        icon={<Folder />}
        title="TOTAL PROJECTS"
        value={isLoading ? "--" : formatCount(totalProjects)}
        color="bg-blue-50 text-blue-600"
      />
      <StatCard
        icon={<Clock />}
        title="PENDING APPROVAL"
        value={isLoading ? "--" : formatCount(pendingApproval)}
        color="bg-yellow-50 text-yellow-600"
      />
      <StatCard
        icon={<Megaphone />}
        title="ACTIVE CAMPAIGNS"
        value={isLoading ? "--" : formatCount(activeCampaigns)}
        color="bg-green-50 text-green-600"
      />

      {/* Promo Card */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-[#4facfe] to-[#0056A0] p-8 text-white shadow-lg">
        <div className="relative z-10">
          <div className="mb-4 flex size-12 items-center justify-center rounded-full bg-white/20 backdrop-blur-sm">
            <Heart className="fill-white" />
          </div>
          <h3 className="mb-2 text-xl font-bold">
            Building a green future for the village
          </h3>
          <Button className="mt-4 bg-white text-[#0056A0] hover:bg-slate-100">
            Get Inspired
          </Button>
        </div>
        <div className="absolute -right-10 -bottom-10 size-40 rounded-full bg-white/10" />
      </div>
    </div>
  );
}
