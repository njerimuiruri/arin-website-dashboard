'use client';

import { useEffect, useState } from "react";
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
    FileText, Calendar, Briefcase, Clock, MapPin,
    Bell, Video, Globe, Mail, Loader2, MessageSquare, BarChart2,
} from "lucide-react";
import {
    BarChart, Bar, LineChart, Line, PieChart, Pie, Cell,
    XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
} from "recharts";

const API_URL = (process.env.NEXT_PUBLIC_API_URL || 'https://api.demo.arin-africa.org') + '/api';

// ─── Color palette ───────────────────────────────────────────────────────────
const CHART_COLORS = ['#3b82f6', '#10b981', '#8b5cf6', '#f97316', '#ec4899', '#06b6d4', '#eab308'];

// ─── Types ────────────────────────────────────────────────────────────────────
interface EventItem {
    _id: string; title: string; category: string;
    date: string; time?: string; location?: string; status: string;
}
interface VacancyItem {
    _id: string; positionName: string; employmentType: string;
    datePosted?: string; deadline?: string;
}
interface PublicationItem {
    _id: string; title: string; category: string; date?: string;
}
interface ContactItem {
    _id: string; name: string; subject: string;
    submittedAt?: string; isRead: boolean;
}
interface DashboardStats {
    researchProjects: number; upcomingEvents: number;
    activeVacancies: number; unreadMessages: number;
}
interface TimelinePoint {
    month: string; projects: number; briefs: number; articles: number;
}

// ─── Helpers ──────────────────────────────────────────────────────────────────
function formatDate(d?: string) {
    if (!d) return '—';
    try { return new Date(d).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' }); }
    catch { return d; }
}
function timeAgo(d?: string) {
    if (!d) return '';
    const mins = Math.floor((Date.now() - new Date(d).getTime()) / 60000);
    if (mins < 60) return `${mins}m ago`;
    const hrs = Math.floor(mins / 60);
    if (hrs < 24) return `${hrs}h ago`;
    return `${Math.floor(hrs / 24)}d ago`;
}

/** Returns last N month labels like "Jan '25" */
function lastNMonths(n: number) {
    return Array.from({ length: n }, (_, i) => {
        const d = new Date();
        d.setDate(1);
        d.setMonth(d.getMonth() - (n - 1 - i));
        return d.toLocaleString('default', { month: 'short', year: '2-digit' });
    });
}

/** Count items per month-label using a date field */
function countPerMonth(items: any[], field: string, labels: string[]) {
    const map: Record<string, number> = Object.fromEntries(labels.map(l => [l, 0]));
    for (const item of items) {
        const raw = item[field];
        if (!raw) continue;
        const label = new Date(raw).toLocaleString('default', { month: 'short', year: '2-digit' });
        if (label in map) map[label]++;
    }
    return map;
}

// Custom pie label
const renderPieLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent, name }: any) => {
    if (percent < 0.05) return null;
    const RADIAN = Math.PI / 180;
    const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
    const x = cx + radius * Math.cos(-midAngle * RADIAN);
    const y = cy + radius * Math.sin(-midAngle * RADIAN);
    return (
        <text x={x} y={y} fill="white" textAnchor="middle" dominantBaseline="central" fontSize={12} fontWeight={600}>
            {`${(percent * 100).toFixed(0)}%`}
        </text>
    );
};

// ─── Component ────────────────────────────────────────────────────────────────
export default function DashboardPage() {
    const [loading, setLoading] = useState(true);
    const [stats, setStats] = useState<DashboardStats>({ researchProjects: 0, upcomingEvents: 0, activeVacancies: 0, unreadMessages: 0 });
    const [upcomingEvents, setUpcomingEvents] = useState<EventItem[]>([]);
    const [recentVacancies, setRecentVacancies] = useState<VacancyItem[]>([]);
    const [recentPublications, setRecentPublications] = useState<PublicationItem[]>([]);
    const [recentContacts, setRecentContacts] = useState<ContactItem[]>([]);
    const [hasAuth, setHasAuth] = useState(false);

    // Chart data
    const [contentOverview, setContentOverview] = useState<{ name: string; count: number }[]>([]);
    const [eventsByCategory, setEventsByCategory] = useState<{ name: string; value: number }[]>([]);
    const [eventsStatus, setEventsStatus] = useState<{ name: string; count: number }[]>([]);
    const [publicationsTimeline, setPublicationsTimeline] = useState<TimelinePoint[]>([]);

    useEffect(() => { fetchDashboardData(); }, []);

    async function fetchDashboardData() {
        try {
            const months = lastNMonths(6);

            const [eventsRes, vacanciesRes, projectsRes, policyBriefsRes, journalArticlesRes, conferencesRes, blogsRes] =
                await Promise.allSettled([
                    fetch(`${API_URL}/events`).then(r => r.ok ? r.json() : []),
                    fetch(`${API_URL}/vacancies`).then(r => r.ok ? r.json() : []),
                    fetch(`${API_URL}/research-projects`).then(r => r.ok ? r.json() : []),
                    fetch(`${API_URL}/policy-briefs`).then(r => r.ok ? r.json() : []),
                    fetch(`${API_URL}/journal-articles`).then(r => r.ok ? r.json() : []),
                    fetch(`${API_URL}/conferences`).then(r => r.ok ? r.json() : []),
                    fetch(`${API_URL}/blogs`).then(r => r.ok ? r.json() : []),
                ]);

            const events: EventItem[]     = eventsRes.status        === 'fulfilled' ? (eventsRes.value        || []) : [];
            const vacancies: VacancyItem[] = vacanciesRes.status     === 'fulfilled' ? (vacanciesRes.value     || []) : [];
            const projects: any[]          = projectsRes.status      === 'fulfilled' ? (projectsRes.value      || []) : [];
            const briefs: any[]            = policyBriefsRes.status  === 'fulfilled' ? (policyBriefsRes.value  || []) : [];
            const articles: any[]          = journalArticlesRes.status === 'fulfilled' ? (journalArticlesRes.value || []) : [];
            const conferences: any[]       = conferencesRes.status   === 'fulfilled' ? (conferencesRes.value   || []) : [];
            const blogs: any[]             = blogsRes.status         === 'fulfilled' ? (blogsRes.value         || []) : [];

            // ── Stats ──
            const upcoming = events.filter(e => e.status === 'Upcoming');
            setStats(s => ({ ...s, upcomingEvents: upcoming.length, activeVacancies: vacancies.length, researchProjects: projects.length }));

            // ── Upcoming events card ──
            setUpcomingEvents(upcoming.slice(0, 3));

            // ── Vacancies card ──
            setRecentVacancies(vacancies.slice(0, 3));

            // ── Publications card ──
            const allPubs: PublicationItem[] = [
                ...projects.map((p: any) => ({ _id: p._id, title: p.title, category: 'Research Project', date: p.date || p.createdAt })),
                ...briefs.map((b: any)   => ({ _id: b._id, title: b.title, category: 'Policy Brief',     date: b.datePosted || b.createdAt })),
                ...articles.map((a: any) => ({ _id: a._id, title: a.title, category: 'Journal Article',  date: a.datePosted || a.date || a.createdAt })),
            ].sort((a, b) => new Date(b.date || 0).getTime() - new Date(a.date || 0).getTime());
            setRecentPublications(allPubs.slice(0, 3));

            // ── Content overview bar chart ──
            setContentOverview([
                { name: 'Research Projects', count: projects.length },
                { name: 'Policy Briefs',     count: briefs.length },
                { name: 'Journal Articles',  count: articles.length },
                { name: 'Events',            count: events.length },
                { name: 'Conferences',       count: conferences.length },
                { name: 'Vacancies',         count: vacancies.length },
                { name: 'Blogs',             count: blogs.length },
            ]);

            // ── Events by category pie chart ──
            const catMap: Record<string, number> = {};
            for (const e of events) {
                catMap[e.category] = (catMap[e.category] || 0) + 1;
            }
            setEventsByCategory(Object.entries(catMap).map(([name, value]) => ({ name, value })));

            // ── Events status bar chart ──
            setEventsStatus([
                { name: 'Upcoming', count: events.filter(e => e.status === 'Upcoming').length },
                { name: 'Past',     count: events.filter(e => e.status === 'Past').length },
            ]);

            // ── Publications timeline multi-line chart ──
            const projCounts    = countPerMonth(projects, 'createdAt', months);
            const briefCounts   = countPerMonth(briefs,   'createdAt', months);
            const articleCounts = countPerMonth(articles, 'createdAt', months);
            setPublicationsTimeline(months.map(month => ({
                month,
                projects:  projCounts[month],
                briefs:    briefCounts[month],
                articles:  articleCounts[month],
            })));

            // ── Auth endpoints ──
            const token = typeof window !== 'undefined' ? localStorage.getItem('arin_access_token') : null;
            if (token) {
                setHasAuth(true);
                const authH = { Authorization: `Bearer ${token}` };
                const [unreadRes, contactsRes] = await Promise.allSettled([
                    fetch(`${API_URL}/contacts/unread-count`, { headers: authH }).then(r => r.ok ? r.json() : null),
                    fetch(`${API_URL}/contacts?page=1&limit=4`, { headers: authH }).then(r => r.ok ? r.json() : null),
                ]);
                if (unreadRes.status === 'fulfilled' && unreadRes.value)
                    setStats(s => ({ ...s, unreadMessages: unreadRes.value.count ?? 0 }));
                if (contactsRes.status === 'fulfilled' && contactsRes.value) {
                    const d = contactsRes.value;
                    setRecentContacts((Array.isArray(d) ? d : d.data || []).slice(0, 4));
                }
            }
        } catch (err) {
            console.error('Dashboard fetch error:', err);
        } finally {
            setLoading(false);
        }
    }

    // ── Stat cards config ──────────────────────────────────────────────────────
    const statCards = [
        { title: 'Research Projects', value: stats.researchProjects, icon: FileText,  color: 'text-blue-600',   bg: 'bg-blue-50' },
        { title: 'Upcoming Events',   value: stats.upcomingEvents,   icon: Calendar,  color: 'text-emerald-600', bg: 'bg-emerald-50' },
        { title: 'Active Vacancies',  value: stats.activeVacancies,  icon: Briefcase, color: 'text-orange-600',  bg: 'bg-orange-50' },
        { title: 'Unread Messages',   value: stats.unreadMessages,   icon: Mail,      color: 'text-purple-600',  bg: 'bg-purple-50' },
    ];

    // ── Badge helpers ──────────────────────────────────────────────────────────
    const categoryBadge = (c: string) => ({
        Conference: 'bg-blue-100 text-blue-800', Webinar: 'bg-purple-100 text-purple-800',
        Workshop: 'bg-emerald-100 text-emerald-800', Dialogue: 'bg-yellow-100 text-yellow-800',
        'Friday Reviews': 'bg-pink-100 text-pink-800',
    }[c] ?? 'bg-slate-100 text-slate-800');

    const pubBadge = (c: string) => ({
        'Research Project': 'bg-blue-100 text-blue-800',
        'Policy Brief':     'bg-emerald-100 text-emerald-800',
        'Journal Article':  'bg-purple-100 text-purple-800',
    }[c] ?? 'bg-slate-100 text-slate-800');

    const empBadge = (t: string) => ({
        'Full-time': 'bg-emerald-100 text-emerald-800', 'Part-time': 'bg-blue-100 text-blue-800',
    }[t] ?? 'bg-slate-100 text-slate-800');

    // ─────────────────────────────────────────────────────────────────────────
    return (
        <div className="p-8 space-y-8 bg-linear-to-br from-slate-50 to-blue-50 min-h-screen">

            {/* ── Header ── */}
            <div>
                <h1 className="text-4xl font-bold text-slate-900">Dashboard Overview</h1>
                <p className="text-slate-600 mt-2">Welcome back! Here&apos;s a live summary of your content.</p>
            </div>

            {/* ── Stats Grid ── */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {statCards.map((stat, idx) => {
                    const Icon = stat.icon;
                    return (
                        <Card key={idx} className="hover:shadow-lg transition-shadow">
                            <CardHeader className="flex flex-row items-center justify-between pb-2">
                                <CardTitle className="text-sm font-medium text-slate-600">{stat.title}</CardTitle>
                                <div className={`h-9 w-9 rounded-lg ${stat.bg} flex items-center justify-center`}>
                                    <Icon className={`h-5 w-5 ${stat.color}`} />
                                </div>
                            </CardHeader>
                            <CardContent>
                                {loading
                                    ? <Loader2 className="h-6 w-6 animate-spin text-slate-400" />
                                    : <span className="text-3xl font-bold text-slate-900">{stat.value}</span>
                                }
                            </CardContent>
                        </Card>
                    );
                })}
            </div>

            {/* ── Upcoming Events + Recent Messages ── */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <Card className="lg:col-span-2">
                    <CardHeader>
                        <div className="flex items-center justify-between">
                            <div>
                                <CardTitle className="flex items-center gap-2"><Calendar className="h-5 w-5 text-blue-600" />Upcoming Events</CardTitle>
                                <CardDescription>Conferences, workshops, webinars and dialogues</CardDescription>
                            </div>
                            <Button variant="outline" size="sm" asChild><a href="/dashboard/convening-platforms/events">View All</a></Button>
                        </div>
                    </CardHeader>
                    <CardContent>
                        {loading ? <div className="flex justify-center py-8"><Loader2 className="h-6 w-6 animate-spin text-slate-400" /></div>
                            : upcomingEvents.length === 0 ? <p className="text-sm text-slate-500 py-6 text-center">No upcoming events found.</p>
                                : (
                                    <div className="space-y-4">
                                        {upcomingEvents.map(event => (
                                            <div key={event._id} className="flex items-start gap-4 p-4 rounded-lg border bg-white hover:shadow-md transition-shadow">
                                                <div className="shrink-0">
                                                    <div className="h-12 w-12 rounded-lg bg-linear-to-br from-blue-500 to-purple-500 flex items-center justify-center">
                                                        {event.category === 'Webinar' ? <Video className="h-6 w-6 text-white" />
                                                            : event.category === 'Conference' ? <Globe className="h-6 w-6 text-white" />
                                                                : <Calendar className="h-6 w-6 text-white" />}
                                                    </div>
                                                </div>
                                                <div className="flex-1 min-w-0">
                                                    <div className="flex items-start justify-between gap-2">
                                                        <div>
                                                            <h4 className="font-semibold text-slate-900">{event.title}</h4>
                                                            <div className="flex items-center gap-3 mt-1 text-xs text-slate-600 flex-wrap">
                                                                {event.date && <span className="flex items-center gap-1"><Calendar className="h-3 w-3" />{formatDate(event.date)}</span>}
                                                                {event.time && <span className="flex items-center gap-1"><Clock className="h-3 w-3" />{event.time}</span>}
                                                                {event.location && <span className="flex items-center gap-1"><MapPin className="h-3 w-3" />{event.location}</span>}
                                                            </div>
                                                        </div>
                                                        <Badge className={categoryBadge(event.category)}>{event.category}</Badge>
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                )}
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2"><Bell className="h-5 w-5 text-orange-600" />Recent Messages</CardTitle>
                        <CardDescription>Latest contact submissions</CardDescription>
                    </CardHeader>
                    <CardContent>
                        {loading ? <div className="flex justify-center py-8"><Loader2 className="h-6 w-6 animate-spin text-slate-400" /></div>
                            : !hasAuth ? (
                                <div className="flex flex-col items-center gap-2 py-6 text-center">
                                    <MessageSquare className="h-8 w-8 text-slate-300" />
                                    <p className="text-sm text-slate-500">Sign in to view recent messages.</p>
                                </div>
                            ) : recentContacts.length === 0 ? <p className="text-sm text-slate-500 py-6 text-center">No messages yet.</p>
                                : (
                                    <div className="space-y-4">
                                        {recentContacts.map(c => (
                                            <div key={c._id} className="flex items-start gap-3">
                                                <div className={`h-8 w-8 rounded-full flex items-center justify-center shrink-0 ${c.isRead ? 'bg-slate-100' : 'bg-orange-100'}`}>
                                                    <Mail className={`h-4 w-4 ${c.isRead ? 'text-slate-500' : 'text-orange-600'}`} />
                                                </div>
                                                <div className="flex-1 min-w-0">
                                                    <p className="text-sm font-medium text-slate-900 truncate">{c.name}</p>
                                                    <p className="text-xs text-slate-600 truncate">{c.subject}</p>
                                                    <p className="text-xs text-slate-400 mt-1">{timeAgo(c.submittedAt)}</p>
                                                </div>
                                                {!c.isRead && <span className="h-2 w-2 rounded-full bg-orange-500 mt-1 shrink-0" />}
                                            </div>
                                        ))}
                                    </div>
                                )}
                    </CardContent>
                </Card>
            </div>

            {/* ── Vacancies + Publications ── */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card>
                    <CardHeader>
                        <div className="flex items-center justify-between">
                            <div>
                                <CardTitle className="flex items-center gap-2"><Briefcase className="h-5 w-5 text-emerald-600" />Recent Job Vacancies</CardTitle>
                                <CardDescription>Open positions</CardDescription>
                            </div>
                            <Button variant="outline" size="sm" asChild><a href="/dashboard/opportunities/vacancies">Manage</a></Button>
                        </div>
                    </CardHeader>
                    <CardContent>
                        {loading ? <div className="flex justify-center py-8"><Loader2 className="h-6 w-6 animate-spin text-slate-400" /></div>
                            : recentVacancies.length === 0 ? <p className="text-sm text-slate-500 py-6 text-center">No vacancies found.</p>
                                : (
                                    <div className="space-y-3">
                                        {recentVacancies.map(v => (
                                            <div key={v._id} className="p-4 rounded-lg border bg-white hover:shadow-md transition-shadow">
                                                <div className="flex items-start justify-between gap-2">
                                                    <div className="flex-1">
                                                        <h4 className="font-semibold text-slate-900">{v.positionName}</h4>
                                                        {v.datePosted && <p className="text-xs text-slate-500 mt-1">Posted: {formatDate(v.datePosted)}</p>}
                                                    </div>
                                                    {v.employmentType && <Badge className={empBadge(v.employmentType)}>{v.employmentType}</Badge>}
                                                </div>
                                                {v.deadline && (
                                                    <div className="mt-3 pt-3 border-t">
                                                        <span className="text-xs text-slate-600">Deadline: {formatDate(v.deadline)}</span>
                                                    </div>
                                                )}
                                            </div>
                                        ))}
                                    </div>
                                )}
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <div className="flex items-center justify-between">
                            <div>
                                <CardTitle className="flex items-center gap-2"><FileText className="h-5 w-5 text-purple-600" />Latest Publications</CardTitle>
                                <CardDescription>Recently published content across all categories</CardDescription>
                            </div>
                            <Button variant="outline" size="sm" asChild><a href="/dashboard/press/policy-briefs">View All</a></Button>
                        </div>
                    </CardHeader>
                    <CardContent>
                        {loading ? <div className="flex justify-center py-8"><Loader2 className="h-6 w-6 animate-spin text-slate-400" /></div>
                            : recentPublications.length === 0 ? <p className="text-sm text-slate-500 py-6 text-center">No publications found.</p>
                                : (
                                    <div className="space-y-3">
                                        {recentPublications.map(pub => (
                                            <div key={pub._id} className="p-4 rounded-lg border bg-white hover:shadow-md transition-shadow">
                                                <h4 className="font-semibold text-slate-900 line-clamp-2">{pub.title}</h4>
                                                <div className="flex items-center gap-2 mt-2">
                                                    <Badge className={pubBadge(pub.category)}>{pub.category}</Badge>
                                                    {pub.date && <span className="text-xs text-slate-500">{formatDate(pub.date)}</span>}
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                )}
                    </CardContent>
                </Card>
            </div>

            {/* ══════════════════════════════════════════════════════════════
                Analytics & Reports
            ══════════════════════════════════════════════════════════════ */}
            <div>
                <div className="flex items-center gap-2 mb-6">
                    <BarChart2 className="h-6 w-6 text-blue-600" />
                    <h2 className="text-2xl font-bold text-slate-900">Analytics &amp; Reports</h2>
                </div>

                {/* ── Row 1: Content Inventory + Events by Category ── */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">

                    {/* Content Inventory – Horizontal Bar Chart */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="text-base">Content Inventory</CardTitle>
                            <CardDescription>Total items per content type</CardDescription>
                        </CardHeader>
                        <CardContent>
                            {loading ? <div className="flex justify-center py-12"><Loader2 className="h-6 w-6 animate-spin text-slate-400" /></div>
                                : (
                                    <ResponsiveContainer width="100%" height={300}>
                                        <BarChart data={contentOverview} layout="vertical" margin={{ top: 0, right: 20, left: 90, bottom: 0 }}>
                                            <CartesianGrid strokeDasharray="3 3" horizontal={false} />
                                            <XAxis type="number" allowDecimals={false} tick={{ fontSize: 12 }} />
                                            <YAxis type="category" dataKey="name" tick={{ fontSize: 12 }} width={90} />
                                            <Tooltip
                                                contentStyle={{ borderRadius: 8, fontSize: 13 }}
                                                formatter={(v: number) => [v, 'Total']}
                                            />
                                            <Bar dataKey="count" radius={[0, 6, 6, 0]}>
                                                {contentOverview.map((_, i) => (
                                                    <Cell key={i} fill={CHART_COLORS[i % CHART_COLORS.length]} />
                                                ))}
                                            </Bar>
                                        </BarChart>
                                    </ResponsiveContainer>
                                )}
                        </CardContent>
                    </Card>

                    {/* Events by Category – Pie Chart */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="text-base">Events by Category</CardTitle>
                            <CardDescription>Distribution of all event types</CardDescription>
                        </CardHeader>
                        <CardContent>
                            {loading ? <div className="flex justify-center py-12"><Loader2 className="h-6 w-6 animate-spin text-slate-400" /></div>
                                : eventsByCategory.length === 0
                                    ? <p className="text-sm text-slate-500 py-12 text-center">No event data available.</p>
                                    : (
                                        <ResponsiveContainer width="100%" height={300}>
                                            <PieChart>
                                                <Pie
                                                    data={eventsByCategory}
                                                    dataKey="value"
                                                    nameKey="name"
                                                    cx="50%"
                                                    cy="50%"
                                                    outerRadius={110}
                                                    labelLine={false}
                                                    label={renderPieLabel}
                                                >
                                                    {eventsByCategory.map((_, i) => (
                                                        <Cell key={i} fill={CHART_COLORS[i % CHART_COLORS.length]} />
                                                    ))}
                                                </Pie>
                                                <Tooltip contentStyle={{ borderRadius: 8, fontSize: 13 }} />
                                                <Legend iconType="circle" iconSize={10} wrapperStyle={{ fontSize: 13 }} />
                                            </PieChart>
                                        </ResponsiveContainer>
                                    )}
                        </CardContent>
                    </Card>
                </div>

                {/* ── Row 2: Publications Timeline (Multi-Line) + Events Status (Bar) ── */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

                    {/* Publications Timeline – Multi-Line Chart (wider) */}
                    <Card className="lg:col-span-2">
                        <CardHeader>
                            <CardTitle className="text-base">Publications Over Time</CardTitle>
                            <CardDescription>Monthly publications added — last 6 months</CardDescription>
                        </CardHeader>
                        <CardContent>
                            {loading ? <div className="flex justify-center py-12"><Loader2 className="h-6 w-6 animate-spin text-slate-400" /></div>
                                : (
                                    <ResponsiveContainer width="100%" height={280}>
                                        <LineChart data={publicationsTimeline} margin={{ top: 8, right: 16, left: 0, bottom: 0 }}>
                                            <CartesianGrid strokeDasharray="3 3" />
                                            <XAxis dataKey="month" tick={{ fontSize: 12 }} />
                                            <YAxis allowDecimals={false} tick={{ fontSize: 12 }} />
                                            <Tooltip contentStyle={{ borderRadius: 8, fontSize: 13 }} />
                                            <Legend iconType="circle" iconSize={10} wrapperStyle={{ fontSize: 13 }} />
                                            <Line type="monotone" dataKey="projects" name="Research Projects" stroke="#3b82f6" strokeWidth={2} dot={{ r: 4 }} activeDot={{ r: 6 }} />
                                            <Line type="monotone" dataKey="briefs"   name="Policy Briefs"     stroke="#10b981" strokeWidth={2} dot={{ r: 4 }} activeDot={{ r: 6 }} />
                                            <Line type="monotone" dataKey="articles" name="Journal Articles"  stroke="#8b5cf6" strokeWidth={2} dot={{ r: 4 }} activeDot={{ r: 6 }} />
                                        </LineChart>
                                    </ResponsiveContainer>
                                )}
                        </CardContent>
                    </Card>

                    {/* Events Status – Bar Chart */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="text-base">Events Status</CardTitle>
                            <CardDescription>Upcoming vs Past events</CardDescription>
                        </CardHeader>
                        <CardContent>
                            {loading ? <div className="flex justify-center py-12"><Loader2 className="h-6 w-6 animate-spin text-slate-400" /></div>
                                : eventsStatus.every(e => e.count === 0)
                                    ? <p className="text-sm text-slate-500 py-12 text-center">No event data available.</p>
                                    : (
                                        <ResponsiveContainer width="100%" height={280}>
                                            <BarChart data={eventsStatus} margin={{ top: 8, right: 16, left: 0, bottom: 0 }}>
                                                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                                                <XAxis dataKey="name" tick={{ fontSize: 13 }} />
                                                <YAxis allowDecimals={false} tick={{ fontSize: 12 }} />
                                                <Tooltip contentStyle={{ borderRadius: 8, fontSize: 13 }} />
                                                <Bar dataKey="count" name="Events" radius={[6, 6, 0, 0]}>
                                                    <Cell fill="#10b981" />
                                                    <Cell fill="#94a3b8" />
                                                </Bar>
                                            </BarChart>
                                        </ResponsiveContainer>
                                    )}
                        </CardContent>
                    </Card>
                </div>
            </div>

        </div>
    );
}
