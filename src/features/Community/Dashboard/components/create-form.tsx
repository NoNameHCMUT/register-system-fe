import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { PlusCircle, MapPin, Users} from "lucide-react";

function CreateForm() {
    return (
        <Card className="lg:col-span-8">
            <CardHeader className="border-b bg-slate-50/50 p-6">
            <div className="flex items-center gap-4">
                <div className="flex size-10 items-center justify-center rounded-lg bg-blue-100 text-[#0056A0]">
                <PlusCircle className="size-6" />
                </div>
                <div>
                <CardTitle className="text-2xl">Create New Project</CardTitle>
                <CardDescription>Fill in all information to submit for approval</CardDescription>
                </div>
            </div>
            </CardHeader>
            <CardContent className="space-y-6 p-8">
            <div className="space-y-2">
                <Label>PROJECT NAME</Label>
                <Input placeholder="Enter project name (e.g., Green Summer 2024 at Village A)" />
            </div>

            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                <div className="space-y-2">
                <Label>LOCATION</Label>
                <div className="relative">
                    <MapPin className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-slate-400" />
                    <Input className="pl-10" placeholder="City, District, Commune..." />
                </div>
                </div>
                <div className="space-y-2">
                <Label>VOLUNTEERS NEEDED</Label>
                <div className="relative">
                    <Users className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-slate-400" />
                    <Input className="pl-10" type="number" placeholder="0" />
                </div>
                </div>
            </div>

            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                <div className="space-y-2">
                <Label>START DATE</Label>
                <Input type="date" />
                </div>
                <div className="space-y-2">
                <Label>END DATE</Label>
                <Input type="date" />
                </div>
            </div>

            <div className="space-y-2">
                <Label>PROJECT DESCRIPTION</Label>
                <textarea className="min-h-[120px] w-full rounded-xl border border-input bg-[#f2f2f2] p-4 text-sm focus:outline-none focus:ring-2 focus:ring-[#0056A0]/20" placeholder="Detailed description of activities, goals..." />
            </div>

            <div className="rounded-lg border border-blue-100 bg-blue-50 p-4 text-sm text-[#0056A0]">
                <strong>Note:</strong> After submission, the project will be in <span className="font-bold">PENDING APPROVAL</span> status and waiting for University approval before going public.
            </div>

            <div className="flex justify-end pt-4">
                <Button className="h-12 bg-[#1d63ff] px-10 text-lg font-semibold hover:bg-[#1a56db]">Submit for Approval</Button>
            </div>
            </CardContent>
        </Card>
    );
}

export { CreateForm };