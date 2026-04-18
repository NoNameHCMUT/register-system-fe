import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { PlusCircle, Users } from "lucide-react";
import { ImagePlus } from "lucide-react";
import { toast } from "sonner";
import { handleApiError } from "@/shared/api";
import { useGetUser } from "@/shared/get-user";

import { createProjectApi, uploadProjectBannerApi } from "../api/project.api";

const COMMON_VOLUNTEER_COUNTS = [20, 50, 100, 150, 200];

const toRfc3339 = (date: string, endOfDay = false) => {
  const time = endOfDay ? "23:59:59" : "00:00:00";
  return `${date}T${time}Z`;
};

function CreateForm() {
  const queryClient = useQueryClient();
  const { data: me, isLoading: isLoadingMe } = useGetUser();
  const [projectName, setProjectName] = useState("");
  const [bannerFile, setBannerFile] = useState<File | null>(null);
  const [bannerUrl, setBannerUrl] = useState("");
  const [bannerFileName, setBannerFileName] = useState("");
  const [description, setDescription] = useState("");
  const [numMax, setNumMax] = useState("");
  const [formStartDay, setFormStartDay] = useState("");
  const [formEndDay, setFormEndDay] = useState("");
  const [projectStartDay, setProjectStartDay] = useState("");
  const [projectEndDay, setProjectEndDay] = useState("");

  const extractProjectId = (response: unknown): number | null => {
    if (!response || typeof response !== "object") {
      return null;
    }

    const candidateResponse = response as {
      data?: { id?: number | string };
      id?: number | string;
    };

    const rawId = candidateResponse.id ?? candidateResponse.data?.id;

    if (typeof rawId === "number" && Number.isFinite(rawId)) {
      return rawId;
    }

    if (typeof rawId === "string") {
      const parsedId = Number(rawId);
      return Number.isFinite(parsedId) ? parsedId : null;
    }

    return null;
  };

  const createProjectMutation = useMutation({
    mutationFn: createProjectApi,
    onSuccess: async (response) => {
      if (!bannerFile) {
        toast.error("Banner image is required.");
        return;
      }

      const projectId = extractProjectId(response);

      if (!projectId) {
        toast.error(
          "Project created but banner upload failed: missing project ID.",
        );
        return;
      }

      try {
        await uploadProjectBannerApi({
          banner: bannerFile,
          projectId,
        });
      } catch (error) {
        handleApiError(error);
        toast.error("Project was created but banner upload failed.");
        return;
      }

      toast.success("Project submitted for approval.");
      queryClient.invalidateQueries({ queryKey: ["community", "projects"] });
      setProjectName("");
      setBannerFile(null);
      setBannerUrl("");
      setBannerFileName("");
      setDescription("");
      setNumMax("");
      setFormStartDay("");
      setFormEndDay("");
      setProjectStartDay("");
      setProjectEndDay("");
    },
    onError: (error) => {
      handleApiError(error);
    },
  });

  const handleSubmit = () => {
    const affiliationId = me?.affiliation?.id;

    if (!affiliationId) {
      toast.error("Affiliation is required.");
      return;
    }

    if (!bannerFile) {
      toast.error("Banner image is required.");
      return;
    }

    if (
      !projectName.trim() ||
      !description.trim() ||
      !numMax.trim() ||
      !formStartDay ||
      !formEndDay ||
      !projectStartDay ||
      !projectEndDay
    ) {
      toast.error("Please fill in all required fields.");
      return;
    }

    createProjectMutation.mutate({
      affiliationId,
      description,
      formEndDay: toRfc3339(formEndDay, true),
      formStartDay: toRfc3339(formStartDay),
      name: projectName,
      numMax: Number(numMax),
      projectEndDay: toRfc3339(projectEndDay, true),
      projectStartDay: toRfc3339(projectStartDay),
    });
  };

  const handleBannerUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];

    if (!file) {
      return;
    }

    if (!file.type.startsWith("image/")) {
      toast.error("Please upload an image file.");
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      const result = reader.result;

      if (typeof result === "string") {
        setBannerFile(file);
        setBannerUrl(result);
        setBannerFileName(file.name);
      }
    };

    reader.readAsDataURL(file);
  };

  return (
    <Card className="lg:col-span-8">
      <CardHeader className="border-b bg-slate-50/50 p-6">
        <div className="flex items-center gap-4">
          <div className="flex size-10 items-center justify-center rounded-lg bg-blue-100 text-[#0056A0]">
            <PlusCircle className="size-6" />
          </div>
          <div>
            <CardTitle className="text-2xl">Create New Campaign</CardTitle>
            <CardDescription>
              Fill in all information to submit for approval
            </CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-6 p-8">
        <div className="space-y-2">
          <Label>CAMPAIGN NAME</Label>
          <Input
            value={projectName}
            onChange={(event) => setProjectName(event.target.value)}
            placeholder="Enter project name (e.g., Green Summer 2024 at Village A)"
          />
        </div>

        <div className="space-y-2">
          <Label>BANNER</Label>
          <div className="flex flex-col gap-3 rounded-xl border border-dashed border-slate-200 bg-slate-50 p-4 md:flex-row md:items-center md:justify-between">
            <div className="flex items-center gap-3">
              <div className="flex size-10 items-center justify-center rounded-lg bg-white text-[#1d63ff] shadow-sm">
                <ImagePlus className="size-5" />
              </div>
              <div>
                <p className="text-sm font-medium text-slate-700">
                  Upload a banner image
                </p>
                <p className="text-xs text-slate-500">JPG, PNG, WEBP...</p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <input
                id="banner-url"
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleBannerUpload}
              />
              <Button
                asChild
                variant="outline"
                size="sm"
                className="rounded-full"
              >
                <label htmlFor="banner-url" className="cursor-pointer">
                  Choose Image
                </label>
              </Button>
              {bannerUrl && (
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="rounded-full cursor-pointer text-slate-500"
                  onClick={() => {
                    setBannerFile(null);
                    setBannerUrl("");
                    setBannerFileName("");
                  }}
                >
                  Remove
                </Button>
              )}
            </div>
          </div>

          {bannerUrl && (
            <div className="overflow-hidden rounded-xl border border-slate-200 bg-white">
              <img
                src={bannerUrl}
                alt={bannerFileName || "Campaign banner preview"}
                className="h-full w-full object-cover"
              />
              <div className="border-t border-slate-100 px-4 py-2 text-xs text-slate-500">
                {bannerFileName || "Selected banner image"}
              </div>
            </div>
          )}
        </div>

        <div className="space-y-2">
          <Label>AFFILIATION</Label>
          <Input
            value={
              isLoadingMe
                ? "Loading affiliation..."
                : me?.affiliation?.std_name || ""
            }
            readOnly
            placeholder="Your affiliation"
          />
        </div>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          <div className="space-y-2">
            <Label>FORM START DAY</Label>
            <Input
              type="date"
              value={formStartDay}
              onChange={(event) => setFormStartDay(event.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label>FORM END DAY</Label>
            <Input
              type="date"
              value={formEndDay}
              onChange={(event) => setFormEndDay(event.target.value)}
            />
          </div>
        </div>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          <div className="space-y-2">
            <Label>CAMPAIGN START DAY</Label>
            <Input
              type="date"
              value={projectStartDay}
              onChange={(event) => setProjectStartDay(event.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label>CAMPAIGN END DAY</Label>
            <Input
              type="date"
              value={projectEndDay}
              onChange={(event) => setProjectEndDay(event.target.value)}
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label>VOLUNTEERS NEEDED</Label>
          <div className="relative">
            <Users className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-slate-400" />
            <Input
              className="pl-10"
              type="number"
              value={numMax}
              onChange={(event) => setNumMax(event.target.value)}
              placeholder="0"
            />
          </div>

          <div className="flex flex-wrap gap-2 pt-1">
            {COMMON_VOLUNTEER_COUNTS.map((count) => (
              <Button
                key={count}
                type="button"
                onClick={() => setNumMax(String(count))}
                variant={numMax === String(count) ? "default" : "outline"}
                size="sm"
                className={`rounded-full ${
                  numMax === String(count)
                    ? "bg-[#1d63ff] text-white hover:bg-[#1a56db]"
                    : "text-slate-600 hover:text-[#1d63ff]"
                }`}
              >
                {count}
              </Button>
            ))}
          </div>
        </div>

        <div className="space-y-2">
          <Label>CAMPAIGN DESCRIPTION</Label>
          <textarea
            value={description}
            onChange={(event) => setDescription(event.target.value)}
            className="min-h-[120px] w-full rounded-xl border border-input bg-[#f2f2f2] p-4 text-sm focus:outline-none focus:ring-2 focus:ring-[#0056A0]/20"
            placeholder="Detailed description of activities, goals..."
          />
        </div>

        <div className="rounded-lg border border-blue-100 bg-blue-50 p-4 text-sm text-[#0056A0]">
          <strong>Note:</strong> After submission, the campaign will be in{" "}
          <span className="font-bold">PENDING APPROVAL</span> status and waiting
          for University approval before going public.
        </div>

        <div className="flex justify-end pt-4">
          <Button
            type="button"
            onClick={handleSubmit}
            className="h-10 cursor-pointer bg-[#1d63ff] px-7 text-sm font-semibold hover:bg-[#1a56db]"
          >
            Submit for Approval
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

export { CreateForm };
