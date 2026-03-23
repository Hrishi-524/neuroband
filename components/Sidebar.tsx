"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, Users, Brain } from "lucide-react";
import { cn } from "@/lib/utils";

const NAV_ITEMS = [
    { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
    { href: "/students", label: "Students", icon: Users },
];

export function Sidebar() {
    const pathname = usePathname();

    return (
        <aside className="fixed inset-y-0 left-0 z-40 flex w-64 flex-col border-r border-border/50 bg-card/40 backdrop-blur-2xl">
            {/* Logo */}
            <div className="flex h-16 items-center gap-3 px-6 border-b border-border/50">
                <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-cyan-500 to-blue-600 shadow-lg shadow-cyan-500/25">
                    <Brain className="h-5 w-5 text-white" />
                </div>
                <div>
                    <h1 className="text-sm font-bold tracking-tight">NeuroBand</h1>
                    <p className="text-[10px] text-muted-foreground leading-none">Cognitive Analytics</p>
                </div>
            </div>

            {/* Nav */}
            <nav className="flex-1 px-3 py-4 space-y-1">
                {NAV_ITEMS.map((item) => {
                    const isActive = pathname === item.href;
                    return (
                        <Link
                            key={item.href}
                            href={item.href}
                            className={cn(
                                "flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-all duration-200",
                                isActive
                                    ? "bg-primary/15 text-primary shadow-sm shadow-primary/10"
                                    : "text-muted-foreground hover:bg-muted/50 hover:text-foreground"
                            )}
                        >
                            <item.icon className={cn("h-4 w-4", isActive && "text-cyan-400")} />
                            {item.label}
                        </Link>
                    );
                })}
            </nav>

            {/* Footer */}
            <div className="border-t border-border/50 px-6 py-4">
                <p className="text-[10px] text-muted-foreground/60">
                    © 2026 NeuroBand · v1.0
                </p>
            </div>
        </aside>
    );
}
