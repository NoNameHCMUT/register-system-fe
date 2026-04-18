import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Eye } from "lucide-react";

export function ApproveList({ students, onView }: { students: any[], onView: (user: any) => void }) {
  return (
    <Card className="border-none shadow-sm overflow-hidden">
      <div className="flex items-center justify-between border-b bg-slate-50/50 px-8 py-4">
        <h2 className="font-bold text-slate-800">Accepted Volunteers</h2>
        <Badge className="bg-slate-100 text-slate-600">{students.length} CONFIRMED</Badge>
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
                <Button variant="ghost" size="sm" onClick={() => onView(s.user)} className="text-blue-500">
                  <Eye className="size-4 mr-2" /> View
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </Card>
  );
}