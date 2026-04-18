import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Download, Plus } from "lucide-react";
import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

import { Footer } from "@/components/Footer";
import { UserHeader } from "@/components/UserHeader";
import { handleLogout } from "@/features/Login/api/logout.api";
import {
  getAffiliationsApi,
} from "@/features/Register/api/register.api";
import { addAffiliationsApi } from "./api/affiliations.api";
import { handleApiError } from "@/shared/api";
import { useGetUser } from "@/shared/get-user";

const ITEMS_PER_PAGE = 4;

type AffiliationRow = {
  description: string;
  id: number;
  name: string;
};

const buildMockDescription = (name: string) => {
  return `${name} partner organization supporting community-driven initiatives.`;
};

function AffiliationsPage() {
  const navigate = useNavigate();
  const { data: me } = useGetUser();
  const queryClient = useQueryClient();
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  const { data: affiliations = [], isLoading } = useQuery({
    queryKey: ["affiliations"],
    queryFn: getAffiliationsApi,
  });

  const rows = useMemo<AffiliationRow[]>(() => {
    return affiliations.map((item: any) => ({
      description: item.description || buildMockDescription(item.std_name),
      id: item.id,
      name: item.std_name,
    }));
  }, [affiliations]);

  const totalPages = Math.max(1, Math.ceil(rows.length / ITEMS_PER_PAGE));
  const safePage = Math.min(currentPage, totalPages);

  const paginatedRows = useMemo(() => {
    const startIndex = (safePage - 1) * ITEMS_PER_PAGE;
    return rows.slice(startIndex, startIndex + ITEMS_PER_PAGE);
  }, [rows, safePage]);

  const onLogout = () => {
    handleLogout();
    toast.success("Logged out successfully.");
    navigate("/logout");
  };

  const onExportCsv = () => {
    if (rows.length === 0) {
      toast.info("No affiliations to export.");
      return;
    }

    const header = ["Name", "Description"];
    const body = rows.map((row) => [row.name, row.description]);
    const csvContent = [header, ...body]
      .map((line) =>
        line.map((cell) => `"${cell.replace(/"/g, '""')}"`).join(","),
      )
      .join("\n");

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement("a");
    anchor.href = url;
    anchor.download = "affiliations.csv";
    anchor.click();
    URL.revokeObjectURL(url);
  };

  const addMutation = useMutation({
    mutationFn: addAffiliationsApi,
    onSuccess: () => {
      toast.success("Affiliation added successfully.");
      queryClient.invalidateQueries({ queryKey: ["affiliations"] });
      setName("");
      setDescription("");
      setCurrentPage(1);
    },
    onError: (error) => {
      handleApiError(error);
    },
  });

  const onAddAffiliation = () => {
    const trimmedName = name.trim();
    const trimmedDescription = description.trim();

    if (!trimmedName) {
      toast.error("Please enter affiliation name.");
      return;
    }

    if (!trimmedDescription) {
      toast.error("Please enter affiliation description.");
      return;
    }

    if (!addMutation.isPending) {
      addMutation.mutate({ std_name: trimmedName, description: trimmedDescription });
    }
  };

  return (
    <div className="flex min-h-svh flex-col bg-[#f1f3f7]">
      <UserHeader role={me?.role} onLogout={onLogout} />

      <main className="mx-auto w-full max-w-[1160px] flex-1 px-4 py-6 md:px-6 md:py-7">
        <section>
          <h1 className="text-3xl font-bold tracking-[-0.03em] text-[#0047AB] md:text-[34px]">
            Affiliations
          </h1>
          <p className="mt-1.5 max-w-5xl text-sm text-slate-500 md:text-base">
            Manage organizational partnerships, university chapters, and
            corporate sponsors that drive the Mua He Xanh movement forward.
          </p>
        </section>

        <section className="mt-5 grid grid-cols-1 gap-4 lg:grid-cols-[2fr_0.9fr]">
          <article className="rounded-2xl bg-white p-4 shadow-[0_1px_0_#e5e9f0] md:p-5">
            <div className="flex flex-wrap items-start justify-between gap-4">
              <div className="text-sm text-[#667085]">
                {rows.length} records
              </div>

              <button
                type="button"
                onClick={onExportCsv}
                className="inline-flex h-9 cursor-pointer items-center gap-2 rounded-xl bg-[#f3f5f9] px-3.5 text-xs font-semibold text-[#455066] transition-colors hover:bg-[#e8ecf4]"
              >
                <Download size={14} />
                Export CSV
              </button>
            </div>

            <div className="mt-3 overflow-x-auto">
              <table className="w-full border-separate border-spacing-y-2">
                <thead>
                  <tr className="text-left text-xs font-semibold uppercase tracking-[0.08em] text-[#8b94a8]">
                    <th className="pb-1 w-1/3">Name</th>
                    <th className="pb-1 w-2/3">Description</th>
                  </tr>
                </thead>

                <tbody>
                  {isLoading ? (
                    <tr>
                      <td className="pt-2 text-sm text-[#667085]" colSpan={2}>
                        Loading affiliations...
                      </td>
                    </tr>
                  ) : paginatedRows.length === 0 ? (
                    <tr>
                      <td className="pt-2 text-sm text-[#667085]" colSpan={2}>
                        No affiliations found.
                      </td>
                    </tr>
                  ) : (
                    paginatedRows.map((row) => (
                      <tr
                        key={row.id}
                        className="align-top text-[13px] text-[#313b50]"
                      >
                        <td className="pt-1.5 pr-4 font-semibold leading-5 text-[#1d2535]">
                          {row.name}
                        </td>
                        <td className="pt-1.5 pr-4 leading-5 text-[#626c80]">
                          {row.description}
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>

            <div className="mt-4 flex items-center justify-center gap-3 text-xs font-semibold text-[#2c3446]">
              <button
                type="button"
                onClick={() => setCurrentPage(Math.max(1, safePage - 1))}
                disabled={safePage === 1}
                className="inline-flex h-8 w-8 items-center justify-center rounded-lg border border-[#e2e7f0] bg-white text-[#6b7384] disabled:cursor-not-allowed disabled:opacity-50"
              >
                &lt;
              </button>

              <span>
                Page {safePage} of {totalPages}
              </span>

              <button
                type="button"
                onClick={() =>
                  setCurrentPage(Math.min(totalPages, safePage + 1))
                }
                disabled={safePage === totalPages}
                className="inline-flex h-8 w-8 items-center justify-center rounded-lg border border-[#e2e7f0] bg-white text-[#6b7384] disabled:cursor-not-allowed disabled:opacity-50"
              >
                &gt;
              </button>
            </div>
          </article>

          <aside className="rounded-xl bg-white p-3 shadow-[0_1px_0_#e5e9f0] md:p-3.5">
            <h2 className="text-lg font-extrabold tracking-[-0.03em] text-[#161e2d] md:text-xl">
              Add New Affiliation
            </h2>
            <p className="mt-0.5 text-[11px] text-[#667085] md:text-xs">
              Register a new partner organization.
            </p>

            <div className="mt-3 space-y-2.5">
              <div>
                <label className="mb-1 block text-[11px] font-bold uppercase tracking-[0.08em] text-[#1c58c9]">
                  Name
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={(event) => setName(event.target.value)}
                  placeholder="Enter affiliation name"
                  className="h-7 w-full rounded-lg border border-[#e2e7f0] bg-white px-2 text-xs text-[#2f394d] placeholder:text-[#a0a9bc] focus:outline-none focus:ring-2 focus:ring-[#2b50da]/20"
                />
              </div>

              <div>
                <label className="mb-1 block text-[11px] font-bold uppercase tracking-[0.08em] text-[#1c58c9]">
                  Description
                </label>
                <textarea
                  value={description}
                  onChange={(event) => setDescription(event.target.value)}
                  placeholder="Provide a brief background or role of this organization..."
                  rows={2}
                  className="w-full rounded-lg border border-[#e2e7f0] bg-white px-2 py-1.5 text-xs text-[#2f394d] placeholder:text-[#a0a9bc] focus:outline-none focus:ring-2 focus:ring-[#2b50da]/20"
                />
              </div>

              <button
                type="button"
                onClick={onAddAffiliation}
                disabled={addMutation.isPending}
                className="inline-flex cursor-pointer h-7 w-full items-center justify-center gap-1 rounded-lg bg-[#1f53d8] text-xs font-semibold text-white transition-colors hover:bg-[#1948bf] disabled:opacity-70 disabled:cursor-not-allowed"
              >
                <Plus size={12} />
                {addMutation.isPending ? "Adding..." : "Add Affiliation"}
              </button>
            </div>

            <div className="mt-3 rounded-lg bg-[#f4f6fa] p-2.5">
              <div className="flex items-start gap-2">
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-[0.08em] text-[#4f5b72]">
                    Admin Tip
                  </p>
                  <p className="mt-0.5 text-[10px] leading-4 text-[#626d84] md:text-xs">
                    Ensure descriptions mention the primary point of contact
                  </p>
                </div>
              </div>
            </div>
          </aside>
        </section>
      </main>

      <Footer />
    </div>
  );
}

export { AffiliationsPage };
