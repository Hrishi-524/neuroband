"use client";

import { useState } from "react";
import { Student } from "@/lib/types";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { Eye } from "lucide-react";
import { cn } from "@/lib/utils";
import { StudentDetailModal } from "./StudentDetailModel";

interface StudentTableProps {
    students: Student[];
}

function getStatusInfo(concentration: number) {
    if (concentration > 70)
        return { label: "Focused", className: "bg-emerald-500/15 text-emerald-400 border-emerald-500/30", barColor: "bg-emerald-500" };
    if (concentration > 40)
        return { label: "Moderate", className: "bg-amber-500/15 text-amber-400 border-amber-500/30", barColor: "bg-amber-500" };
    return { label: "Distracted", className: "bg-rose-500/15 text-rose-400 border-rose-500/30", barColor: "bg-rose-500" };
}

export function StudentTable({ students }: StudentTableProps) {
    const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);

    return (
        <>
            <div className="rounded-2xl border border-border/50 bg-card/60 backdrop-blur-xl overflow-hidden">
                <Table>
                    <TableHeader>
                        <TableRow className="border-border/50 hover:bg-transparent">
                            <TableHead className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                                Name
                            </TableHead>
                            <TableHead className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                                Current Focus
                            </TableHead>
                            <TableHead className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                                Status
                            </TableHead>
                            <TableHead className="text-right text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                                Action
                            </TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {students.map((student) => {
                            const status = getStatusInfo(student.concentration);
                            return (
                                <TableRow
                                    key={student.id}
                                    className="group border-border/30 transition-all duration-200 hover:bg-cyan-500/5 cursor-pointer"
                                    onClick={() => setSelectedStudent(student)}
                                >
                                    <TableCell className="font-medium">{student.name}</TableCell>
                                    <TableCell>
                                        <div className="flex items-center gap-3 min-w-[140px]">
                                            <span className="tabular-nums font-semibold text-sm w-10">
                                                {student.concentration}%
                                            </span>
                                            <div className="flex-1 h-1.5 rounded-full bg-muted/30 overflow-hidden">
                                                <div
                                                    className={cn(
                                                        "h-full rounded-full transition-all duration-700",
                                                        status.barColor
                                                    )}
                                                    style={{ width: `${student.concentration}%` }}
                                                />
                                            </div>
                                        </div>
                                    </TableCell>
                                    <TableCell>
                                        <Badge
                                            variant="outline"
                                            className={status.className}
                                        >
                                            {status.label}
                                        </Badge>
                                    </TableCell>
                                    <TableCell className="text-right">
                                        <Button
                                            variant="ghost"
                                            size="sm"
                                            className="h-8 gap-1.5 text-cyan-400 hover:text-cyan-300 hover:bg-cyan-500/10 opacity-70 group-hover:opacity-100 transition-opacity"
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                setSelectedStudent(student);
                                            }}
                                        >
                                            <Eye className="h-3.5 w-3.5" />
                                            View
                                        </Button>
                                    </TableCell>
                                </TableRow>
                            );
                        })}
                    </TableBody>
                </Table>
            </div>

            <StudentDetailModal
                student={selectedStudent}
                open={!!selectedStudent}
                onClose={() => setSelectedStudent(null)}
            />
        </>
    );
}
