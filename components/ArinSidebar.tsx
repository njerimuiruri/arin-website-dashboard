"use client";
import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarHeader,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
    SidebarMenuSub,
    SidebarMenuSubButton,
} from "@/components/ui/sidebar";
import { useEffect, useState } from "react";
import { getCurrentUser } from "@/services/authService";

export function ArinSidebar() {
    const [user, setUser] = useState<{ email?: string } | null>(null);

    useEffect(() => {
        getCurrentUser().then(setUser);
    }, []);

    const avatarLetter = user?.email ? user.email.charAt(0).toUpperCase() : 'A';

    return (
        <Sidebar>
            <SidebarHeader>
                <span className="font-bold text-lg">The Secretariat</span>
            </SidebarHeader>
            <SidebarContent>
                <SidebarMenu>
                    {/* ...existing menu code... */}
                    <SidebarMenuItem>
                        <SidebarMenuButton href="/dashboard/dashboard">Dashboard</SidebarMenuButton>
                    </SidebarMenuItem>
                    <SidebarMenuItem>
                        <SidebarMenuButton href="/dashboard/programs">Programs</SidebarMenuButton>
                        <SidebarMenuSub>
                            <SidebarMenuSubButton href="/dashboard/programs/research-projects">Research Projects</SidebarMenuSubButton>
                            <SidebarMenuSubButton href="/dashboard/programs/capacity-building">Capacity Building</SidebarMenuSubButton>
                        </SidebarMenuSub>
                    </SidebarMenuItem>
                    <SidebarMenuItem>
                        <SidebarMenuButton href="/dashboard/convening-platforms">Convening Platforms</SidebarMenuButton>
                        <SidebarMenuSub>
                            <SidebarMenuSubButton href="/dashboard/convening-platforms/policy-dialogues">Policy Dialogues</SidebarMenuSubButton>
                            <SidebarMenuSubButton href="/dashboard/convening-platforms/events">Events</SidebarMenuSubButton>
                            <SidebarMenuSubButton href="/dashboard/convening-platforms/conferences">Conferences</SidebarMenuSubButton>
                            <SidebarMenuSubButton href="/dashboard/convening-platforms/cop">COP</SidebarMenuSubButton>
                        </SidebarMenuSub>
                    </SidebarMenuItem>
                    <SidebarMenuItem>
                        <SidebarMenuButton href="/opportunities">Opportunities</SidebarMenuButton>
                        <SidebarMenuSub>
                            <SidebarMenuSubButton href="/dashboard/opportunities/vacancies">Vacancies</SidebarMenuSubButton>
                            <SidebarMenuSubButton href="/dashboard/opportunities/csr">CSR</SidebarMenuSubButton>
                        </SidebarMenuSub>
                    </SidebarMenuItem>
                    <SidebarMenuItem>
                        <SidebarMenuButton href="/dashboard/press">ARIN Press</SidebarMenuButton>
                        <SidebarMenuSub>
                            <SidebarMenuSubButton href="/dashboard/press/about">About ARIN Press</SidebarMenuSubButton>
                            <SidebarMenuSubButton href="/dashboard/press/publishing-academy">Publishing Academy</SidebarMenuSubButton>
                            <SidebarMenuSubButton href="/dashboard/press/annual-reports">Annual Reports</SidebarMenuSubButton>
                            <SidebarMenuSubButton href="/dashboard/press/books">Books</SidebarMenuSubButton>
                            <SidebarMenuSubButton href="/dashboard/press/journal-articles">Journal Articles</SidebarMenuSubButton>
                            <SidebarMenuSubButton href="/dashboard/press/policy-briefs">Policy Briefs</SidebarMenuSubButton>
                            <SidebarMenuSubButton href="/dashboard/press/news-briefs">News Briefs</SidebarMenuSubButton>
                            <SidebarMenuSubButton href="/dashboard/press/technical-reports">Technical Reports</SidebarMenuSubButton>
                            <SidebarMenuSubButton href="/dashboard/press/newsletters">Newsletters</SidebarMenuSubButton>
                            <SidebarMenuSubButton href="/dashboard/press/call-for-chapters">Call for Book Chapters</SidebarMenuSubButton>
                            <SidebarMenuSubButton href="/dashboard/press/blog">Blog</SidebarMenuSubButton>
                            <SidebarMenuSubButton href="/dashboard/press/working-papers">Working Paper Series</SidebarMenuSubButton>
                            <SidebarMenuSubButton href="/dashboard/press/impact-stories">Impact Stories</SidebarMenuSubButton>
                            <SidebarMenuSubButton href="/dashboard/press/photo-gallery">Photo Gallery</SidebarMenuSubButton>
                            <SidebarMenuSubButton href="/dashboard/press/video-gallery">Video Gallery</SidebarMenuSubButton>
                        </SidebarMenuSub>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarContent>
            <SidebarFooter>
                <div className="flex items-center gap-3 p-2 rounded-md bg-muted/60 mb-2">
                    <div className="h-9 w-9 rounded-full bg-blue-200 flex items-center justify-center font-bold text-blue-700">{avatarLetter}</div>
                    <div className="flex-1">
                        {user?.email ? (
                            <>
                                <div className="font-semibold text-sm">{user.email}</div>
                                <div className="text-xs text-muted-foreground">{user.email}</div>
                            </>
                        ) : (
                            <div className="font-semibold text-sm">Admin</div>
                        )}
                    </div>
                    <a href="/dashboard/account" className="text-xs text-blue-600 hover:underline">My Account</a>
                </div>
                <a
                    href="/auth/login"
                    className="w-full flex items-center gap-2 px-3 py-2 rounded-md text-sm font-medium text-red-600 hover:bg-red-50 transition"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a2 2 0 01-2 2H7a2 2 0 01-2-2V7a2 2 0 012-2h4a2 2 0 012 2v1" /></svg>
                    Logout
                </a>
            </SidebarFooter>
        </Sidebar>
    );
}