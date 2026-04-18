import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CheckCircle2, XCircle } from "lucide-react";

export function PendingList({ students, onAction }: { students: any[], onAction: any }) {
  return (
    <Card className="border-none shadow-sm overflow-hidden">
      <div className="flex items-center justify-between border-b bg-slate-50/50 px-8 py-4">
        <h2 className="font-bold text-slate-800">Pending Approval</h2>
        <Badge className="bg-blue-50 text-blue-600">{students.length} PENDING</Badge>
      </div>
      <table className="w-full text-left text-sm">
        <thead className="text-[10px] font-bold uppercase tracking-widest text-slate-300 border-b">
          <tr>
            <th className="px-8 py-4">Student Name</th>
            <th className="py-4 text-center">Student ID</th>
            <th className="px-8 py-4 text-right">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y">
          {students.map((s) => (
            <tr key={s.id} className="hover:bg-slate-50/50">
              <td className="px-8 py-4 font-semibold text-slate-700">{s.user?.full_name}</td>
              <td className="py-4 text-center text-slate-500">{s.user?.student_id}</td>
              <td className="px-8 py-4 text-right">
                <div className="flex justify-end gap-3">
                  <CheckCircle2 onClick={() => onAction(s.application_id, 'approve')} className="size-5 text-blue-500 cursor-pointer" />
                  <XCircle onClick={() => onAction(s.application_id, 'reject')} className="size-5 text-red-400 cursor-pointer" />
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </Card>
  );
}