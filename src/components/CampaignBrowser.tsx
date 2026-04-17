import { Calendar, ChevronDown } from "lucide-react";
import { useMemo, useState } from "react";

const CAMPAIGNS_PER_PAGE = 6;

type CampaignItem = {
  affiliationName: string;
  bannerUrl?: string;
  dateApproved?: string | null;
  id: number;
  name: string;
  numAttending: number;
  numMax: number;
  projectEndDay: string;
  projectStartDay: string;
};

type CampaignBrowserProps = {
  affiliationName?: string;
  affiliations?: string[];
  emptyText?: string;
  introDescription?: string;
  introTitle?: string;
  isLoadingAffiliation?: boolean;
  isLoadingProjects: boolean;
  projects: CampaignItem[];
  role?: string;
  showHero?: boolean;
  showActionButton?: boolean;
};

const formatDate = (value: string) => {
  const parsedDate = new Date(value);

  if (Number.isNaN(parsedDate.getTime())) {
    return value;
  }

  return parsedDate.toLocaleDateString("en-GB");
};

function CampaignBrowser({
  affiliationName,
  affiliations,
  emptyText = "No projects found.",
  introDescription,
  introTitle,
  isLoadingAffiliation,
  isLoadingProjects,
  projects,
  role,
  showHero = true,
  showActionButton = true,
}: CampaignBrowserProps) {
  const [searchValue, setSearchValue] = useState("");
  const [appliedSearchValue, setAppliedSearchValue] = useState("");
  const [selectedAffiliation, setSelectedAffiliation] = useState("all");
  const [selectedApprovalTab, setSelectedApprovalTab] = useState<
    "pending" | "approved"
  >("approved");
  const [currentPage, setCurrentPage] = useState(1);

  const canUseApprovalTabs = role === "admin" || role === "school";

  const availableAffiliations = useMemo(() => {
    if (affiliations && affiliations.length > 0) {
      return affiliations;
    }

    return Array.from(
      new Set(projects.map((project) => project.affiliationName)),
    ).sort((first, second) => first.localeCompare(second));
  }, [affiliations, projects]);

  const filteredProjects = useMemo(() => {
    const keyword = appliedSearchValue.trim().toLowerCase();

    return projects.filter((project) => {
      const matchesKeyword =
        !keyword ||
        project.name.toLowerCase().includes(keyword) ||
        project.affiliationName.toLowerCase().includes(keyword);

      const matchesAffiliation =
        selectedAffiliation === "all" ||
        project.affiliationName === selectedAffiliation;

      return matchesKeyword && matchesAffiliation;
    });
  }, [appliedSearchValue, projects, selectedAffiliation]);

  const displayProjects = useMemo(() => {
    if (!canUseApprovalTabs) {
      return filteredProjects;
    }

    return filteredProjects.filter((project) => {
      if (selectedApprovalTab === "pending") {
        return !project.dateApproved;
      }

      return Boolean(project.dateApproved);
    });
  }, [canUseApprovalTabs, filteredProjects, selectedApprovalTab]);

  const totalPages = Math.max(
    1,
    Math.ceil(displayProjects.length / CAMPAIGNS_PER_PAGE),
  );
  const safeCurrentPage = Math.min(currentPage, totalPages);

  const paginatedProjects = useMemo(() => {
    const startIndex = (safeCurrentPage - 1) * CAMPAIGNS_PER_PAGE;
    return displayProjects.slice(startIndex, startIndex + CAMPAIGNS_PER_PAGE);
  }, [displayProjects, safeCurrentPage]);

  const onApplyFilters = () => {
    setAppliedSearchValue(searchValue);
    setCurrentPage(1);
  };

  return (
    <>
      {showHero && (
        <section className="relative overflow-hidden bg-[#2890d4] px-4 py-12 text-white">
          <div className="mx-auto w-full max-w-[860px] text-center">
            <h1 className="text-[38px] font-extrabold leading-[1.08] tracking-[-0.03em] text-white md:text-[56px]">
              Ignite Change,
              <br className="hidden md:block" />
              <span className="text-white">One Project at a Time.</span>
            </h1>

            <p className="mx-auto mt-3 max-w-3xl text-sm font-medium text-white/90 md:text-base">
              Explore campaigns and discover opportunities that match your
              passion for community service.
            </p>
          </div>
        </section>
      )}

      {!showHero && (introTitle || introDescription) && (
        <section className="mx-auto w-full max-w-[1200px] px-4 py-6 md:px-6 md:py-8">
          <div className="mb-2 flex items-center justify-between">
            <div>
              {introTitle && (
                <h1 className="text-3xl font-bold tracking-[-0.03em] text-[#0047AB] md:text-[34px]">
                  {introTitle}
                </h1>
              )}
              {introDescription && (
                <p className="mt-1.5 max-w-2xl text-sm text-slate-500 md:text-base">
                  {introDescription}
                </p>
              )}
            </div>
          </div>
        </section>
      )}

      <section
        className={
          showHero ? "relative z-10 -mt-8 px-4 md:px-6" : "px-4 pb-2 md:px-6"
        }
      >
        <div className="mx-auto w-full max-w-[1160px] rounded-3xl bg-[#e7eaef] p-4">
          <div className="grid grid-cols-1 items-end gap-2.5 md:grid-cols-[260px_0.95fr_0.75fr_0.08fr_0.75fr_auto]">
            <div className="space-y-1.5">
              <label className="block text-[10px] font-semibold uppercase tracking-[0.06em] text-[#0f4ec6]">
                Search Campaign
              </label>
              <input
                type="text"
                placeholder="Campaign name..."
                value={searchValue}
                onChange={(event) => setSearchValue(event.target.value)}
                onKeyDown={(event) => {
                  if (event.key === "Enter") {
                    event.preventDefault();
                    onApplyFilters();
                  }
                }}
                className="h-11 w-full rounded-xl border border-transparent bg-[#f8f9fb] px-4 text-sm text-[#2e3a50] placeholder:text-[#9aa4b6] focus:outline-none focus:ring-2 focus:ring-[#0f4ec6]/20"
              />
            </div>

            <div className="space-y-1.5">
              <label className="block text-[10px] font-semibold uppercase tracking-[0.06em] text-[#0f4ec6]">
                Affiliation
              </label>
              {role === "student" ? (
                <div className="flex h-11 w-full items-center rounded-xl border border-transparent bg-[#f8f9fb] px-4 text-sm font-bold text-[#4f5b70]">
                  {isLoadingAffiliation
                    ? "Loading affiliation..."
                    : affiliationName || "[Current affiliation]"}
                </div>
              ) : (
                <div className="relative">
                  <select
                    value={selectedAffiliation}
                    onChange={(event) => {
                      setSelectedAffiliation(event.target.value);
                      setCurrentPage(1);
                    }}
                    className="h-11 w-full appearance-none rounded-xl border border-transparent bg-[#f8f9fb] px-4 pr-9 text-sm font-bold text-[#4f5b70] focus:outline-none focus:ring-2 focus:ring-[#0f4ec6]/20"
                  >
                    <option value="all">
                      {isLoadingAffiliation
                        ? "Loading affiliation..."
                        : "All affiliations"}
                    </option>
                    {availableAffiliations.map((item) => (
                      <option key={item} value={item}>
                        {item}
                      </option>
                    ))}
                  </select>
                  <ChevronDown className="pointer-events-none absolute right-3 top-1/2 size-4 -translate-y-1/2 text-[#6f7b8f]" />
                </div>
              )}
            </div>

            <div className="space-y-1.5">
              <label className="block text-[10px] font-semibold uppercase tracking-[0.06em] text-[#0f4ec6]">
                Start Date
              </label>
              <input
                type="date"
                className="h-11 w-full rounded-xl border border-transparent bg-[#f8f9fb] px-4 text-sm text-[#2e3a50] focus:outline-none focus:ring-2 focus:ring-[#0f4ec6]/20"
              />
            </div>

            <div className="hidden h-11 items-center justify-center text-[#afb7c6] md:flex">
              -
            </div>

            <div className="space-y-1.5">
              <label className="block text-[10px] font-semibold uppercase tracking-[0.06em] text-[#0f4ec6]">
                End Date
              </label>
              <input
                type="date"
                className="h-11 w-full rounded-xl border border-transparent bg-[#f8f9fb] px-4 text-sm text-[#2e3a50] focus:outline-none focus:ring-2 focus:ring-[#0f4ec6]/20"
              />
            </div>

            <button
              type="button"
              onClick={onApplyFilters}
              className="h-11 cursor-pointer rounded-xl bg-[#2b50da] px-7 text-sm font-semibold text-white transition-colors hover:bg-[#2345c4]"
            >
              Filter
            </button>
          </div>
        </div>
      </section>

      <main className="mx-auto mb-12 mt-8 w-full max-w-[1160px] flex-1 px-4 md:px-6">
        <div className="mb-5 flex items-end justify-between">
          <div className="flex items-center gap-3">
            <h2 className="text-[34px] font-extrabold tracking-[-0.03em] text-[#161e2d] md:text-[36px]">
              Active Campaigns
            </h2>
            {canUseApprovalTabs && (
              <div className="inline-flex rounded-xl border border-[#d9dee7] bg-white p-1">
                <button
                  type="button"
                  onClick={() => {
                    setSelectedApprovalTab("pending");
                    setCurrentPage(1);
                  }}
                  className={`rounded-lg px-3 py-1.5 text-xs font-semibold md:text-sm ${
                    selectedApprovalTab === "pending"
                      ? "bg-[#2b50da] text-white"
                      : "text-[#4f5b70]"
                  }`}
                >
                  Pending approval
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setSelectedApprovalTab("approved");
                    setCurrentPage(1);
                  }}
                  className={`rounded-lg px-3 py-1.5 text-xs font-semibold md:text-sm ${
                    selectedApprovalTab === "approved"
                      ? "bg-[#2b50da] text-white"
                      : "text-[#4f5b70]"
                  }`}
                >
                  Approved
                </button>
              </div>
            )}
          </div>
          <p className="text-sm font-medium text-[#667186]">
            {displayProjects.length} campaign
            {displayProjects.length === 1 ? "" : "s"}
          </p>
        </div>

        <div className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-3">
          {isLoadingProjects ? (
            <p className="col-span-full text-sm text-[#667186]">
              Loading projects...
            </p>
          ) : displayProjects.length === 0 ? (
            <p className="col-span-full text-sm text-[#667186]">{emptyText}</p>
          ) : (
            paginatedProjects.map((project) => {
              const slotValue =
                project.numMax > 0
                  ? Math.min(
                      100,
                      Math.round((project.numAttending / project.numMax) * 100),
                    )
                  : 0;

              return (
                <div
                  key={project.id}
                  className="overflow-hidden rounded-2xl border border-[#d9dee7] bg-white shadow-sm transition-shadow hover:shadow-md"
                >
                  <div className="relative h-[180px] w-full">
                    <img
                      src={
                        project.bannerUrl ||
                        "/assets/campaigns/education_campaign_1775894477648.png"
                      }
                      alt={project.name}
                      className="absolute inset-0 h-full w-full object-cover"
                    />
                  </div>

                  <div className="p-4">
                    <div>
                      <h4 className="mb-2 text-[11px] font-semibold uppercase tracking-[0.05em] text-[#667186]">
                        {project.affiliationName}
                      </h4>
                      <h3 className="mb-3 text-2xl font-extrabold leading-[1.15] tracking-[-0.02em] text-[#141b28] md:text-[28px]">
                        {project.name}
                      </h3>
                      <div className="mb-4 flex items-center text-sm text-[#515e74]">
                        <Calendar size={13} className="mr-1.5" />
                        <span>
                          {formatDate(project.projectStartDay)} -{" "}
                          {formatDate(project.projectEndDay)}
                        </span>
                      </div>
                    </div>

                    <div>
                      <div className="mb-1.5 flex items-center justify-between text-xs font-semibold">
                        <span className="text-[#0f4ec6]">
                          {project.numAttending}/{project.numMax} Filled
                        </span>
                        <span className="text-[#6f7b8f]">
                          {slotValue}% Complete
                        </span>
                      </div>
                      <div className="mb-4 h-1.5 w-full rounded-full bg-[#d7dce5]">
                        <div
                          className="h-1.5 rounded-full bg-[#0f4ec6]"
                          style={{ width: `${slotValue}%` }}
                        />
                      </div>

                      {showActionButton && (
                        <button
                          type="button"
                          className="h-11 w-full rounded-xl bg-[#eceff4] text-sm font-semibold text-[#0f4ec6] transition-colors hover:bg-[#dfe4ec]"
                        >
                          View Details
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {!isLoadingProjects && displayProjects.length > CAMPAIGNS_PER_PAGE && (
          <div className="mt-6 flex items-center justify-center gap-2">
            <button
              type="button"
              onClick={() => setCurrentPage(Math.max(1, safeCurrentPage - 1))}
              disabled={safeCurrentPage === 1}
              className="rounded-lg border border-[#d9dee7] bg-white px-3 py-1.5 text-sm text-[#4f5b70] disabled:cursor-not-allowed disabled:opacity-50"
            >
              Prev
            </button>

            {Array.from({ length: totalPages }, (_, index) => index + 1).map(
              (page) => (
                <button
                  key={page}
                  type="button"
                  onClick={() => setCurrentPage(page)}
                  className={`rounded-lg px-3 py-1.5 text-sm font-semibold ${
                    page === safeCurrentPage
                      ? "bg-[#2b50da] text-white"
                      : "border border-[#d9dee7] bg-white text-[#4f5b70]"
                  }`}
                >
                  {page}
                </button>
              ),
            )}

            <button
              type="button"
              onClick={() =>
                setCurrentPage(Math.min(totalPages, safeCurrentPage + 1))
              }
              disabled={safeCurrentPage === totalPages}
              className="rounded-lg border border-[#d9dee7] bg-white px-3 py-1.5 text-sm text-[#4f5b70] disabled:cursor-not-allowed disabled:opacity-50"
            >
              Next
            </button>
          </div>
        )}
      </main>
    </>
  );
}

export type { CampaignItem };
export { CampaignBrowser };
