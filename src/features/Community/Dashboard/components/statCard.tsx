import { Card } from "@/components/ui/card";
import React from "react";

type IStatCardProps = {
  icon: React.ReactElement<{ className?: string }>;
  title: string;
  value: string;
  color: string;
};

function StatCard({ icon, title, value, color }: IStatCardProps) {
  return (
    <Card className="p-6 transition-transform hover:scale-[1.02]">
      <div className="flex items-center gap-4">
        <div
          className={`flex size-12 items-center justify-center rounded-xl ${color}`}
        >
          {React.cloneElement(icon, { className: "size-6" })}
        </div>
        <div>
          <p className="text-xs font-bold uppercase tracking-wider text-slate-400">
            {title}
          </p>
          <p className="text-3xl font-bold text-slate-800">{value}</p>
        </div>
      </div>
    </Card>
  );
}

export { StatCard };
