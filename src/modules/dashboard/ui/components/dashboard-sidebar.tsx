"use client";

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { VideoIcon, BotIcon, StarIcon, LogOut } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";
import { usePathname } from "next/navigation";
import { DashboardUserButton } from "./dashboard-user-button";
import { authClient } from "@/lib/auth-client";

const firstSection = [
  { icon: VideoIcon, label: "Meetings", href: "/meetings" },
  { icon: BotIcon, label: "Agents", href: "/agents" },
];

const secondSection = [{ icon: StarIcon, label: "Upgrade", href: "/upgrade" }];

export const DashboardSidebar = () => {
  const pathname = usePathname();

  return (
    <Sidebar>
      {/* HEADER */}
      <SidebarHeader className="text-sidebar-accent-foreground">
        <Link href="/" className="flex items-center gap-2 px-2 pt-2">
          <Image src="/logo.svg" height={36} width={36} alt="SolAI" />
          <p className="text-2xl font-semibold">SoLAI</p>
        </Link>
      </SidebarHeader>

      <div className="px-4 py-2">
        <Separator className="opacity-100 text-[#5D6B68]" />
      </div>

      {/* CONTENT */}
      <SidebarContent>
        {/* First Section */}
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              {firstSection.map((item) => (
                <SidebarMenuItem key={item.href}>
                  <SidebarMenuButton
                    asChild
                    className={cn(
                      "h-10 border border-transparent",
                      "hover:border-[#5D6B68]/10",
                      "hover:bg-gradient-to-r/oklch",
                      "from-sidebar-accent from-[5%]",
                      "via-sidebar/50 via-[30%]",
                      "to-sidebar/50",
                      pathname === item.href &&
                        "bg-gradient-to-r/oklch from-sidebar-accent from-[5%] via-sidebar/50 via-[30%] to-sidebar/50 border-[#5D6B68]/10"
                    )}
                  >
                    <Link href={item.href}>
                      <item.icon className="size-5" />
                      <span className="text-sm font-medium tracking-tight">
                        {item.label}
                      </span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <div className="px-4 py-2">
          <Separator className="opacity-100 text-[#5D6B68]" />
        </div>

        {/* Second Section */}
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              {secondSection.map((item) => (
                <SidebarMenuItem key={item.href}>
                  <SidebarMenuButton
                    asChild
                    className={cn(
                      "h-10 border border-transparent",
                      "hover:border-[#5D6B68]/10",
                      "hover:bg-gradient-to-r/oklch",
                      "from-sidebar-accent from-[5%]",
                      "via-sidebar/50 via-[30%]",
                      "to-sidebar/50",
                      pathname === item.href &&
                        "bg-gradient-to-r/oklch from-sidebar-accent from-[5%] via-sidebar/50 via-[30%] to-sidebar/50 border-[#5D6B68]/10"
                    )}
                  >
                    <Link href={item.href}>
                      <item.icon className="size-5" />
                      <span className="text-sm font-medium tracking-tight">
                        {item.label}
                      </span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      {/* FOOTER */}
      <SidebarFooter className="flex flex-col gap-2">
        <DashboardUserButton />
        
      </SidebarFooter>
    </Sidebar>
  );
};
