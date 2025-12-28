import { Card, CardHeader, CardTitle, CardContent, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
    Users,
    FileText,
    Calendar,
    Briefcase,
    TrendingUp,
    Eye,
    Clock,
    MapPin,
    ArrowUpRight,
    Bell,
    CheckCircle2,
    AlertCircle,
    Video,
    Globe
} from "lucide-react";

export default function DashboardPage() {
    const stats = [
        {
            title: "Total Users",
            value: "1,245",
            change: "+12%",
            trend: "up",
            icon: Users,
            color: "text-blue-600"
        },
        {
            title: "Active Projects",
            value: "32",
            change: "+5",
            trend: "up",
            icon: FileText,
            color: "text-emerald-600"
        },
        {
            title: "Pending Tasks",
            value: "87",
            change: "-8",
            trend: "down",
            icon: Clock,
            color: "text-orange-600"
        },
        {
            title: "Total Participants",
            value: "3,420",
            change: "+18%",
            trend: "up",
            icon: TrendingUp,
            color: "text-purple-600"
        },
    ];

    const upcomingEvents = [
        {
            id: 1,
            title: "Climate Finance Summit 2025",
            type: "Conference",
            date: "Jan 15, 2025",
            time: "09:00 AM",
            location: "Nairobi, Kenya",
            attendees: 250,
            status: "Confirmed"
        },
        {
            id: 2,
            title: "Sustainable Agriculture Workshop",
            type: "Webinar",
            date: "Jan 20, 2025",
            time: "02:00 PM",
            location: "Online",
            attendees: 180,
            status: "Registration Open"
        },
        {
            id: 3,
            title: "Youth Climate Leaders Training",
            type: "Event",
            date: "Jan 28, 2025",
            time: "10:00 AM",
            location: "Accra, Ghana",
            attendees: 120,
            status: "Confirmed"
        }
    ];

    const recentVacancies = [
        {
            id: 1,
            title: "Senior Climate Policy Analyst",
            department: "Research & Policy",
            posted: "2 days ago",
            applications: 45,
            status: "Active",
            deadline: "Jan 30, 2025"
        },
        {
            id: 2,
            title: "Project Coordinator - East Africa",
            department: "Programs",
            posted: "5 days ago",
            applications: 67,
            status: "Active",
            deadline: "Feb 5, 2025"
        },
        {
            id: 3,
            title: "Communications Manager",
            department: "Communications",
            posted: "1 week ago",
            applications: 89,
            status: "Reviewing",
            deadline: "Jan 25, 2025"
        }
    ];

    const recentPublications = [
        {
            id: 1,
            title: "State of Adaptation Report 2025",
            category: "Research Report",
            publishedDate: "3 days ago",
            views: 1240,
            downloads: 456
        },
        {
            id: 2,
            title: "Climate Justice Policy Brief",
            category: "Policy Brief",
            publishedDate: "1 week ago",
            views: 890,
            downloads: 234
        },
        {
            id: 3,
            title: "Renewable Energy Transition Analysis",
            category: "Research Paper",
            publishedDate: "2 weeks ago",
            views: 2100,
            downloads: 678
        }
    ];

    const recentActivity = [
        {
            action: "New user registration",
            user: "Dr. Amara Okonkwo",
            time: "5 minutes ago",
            type: "user"
        },
        {
            action: "Project published",
            user: "Climate Adaptation Team",
            time: "1 hour ago",
            type: "project"
        },
        {
            action: "Application submitted",
            user: "45 new applications",
            time: "3 hours ago",
            type: "application"
        },
        {
            action: "Event registered",
            user: "Climate Finance Summit",
            time: "5 hours ago",
            type: "event"
        }
    ];

    const getEventTypeColor = (type) => {
        switch (type) {
            case 'Conference': return 'bg-blue-100 text-blue-800';
            case 'Webinar': return 'bg-purple-100 text-purple-800';
            case 'Event': return 'bg-emerald-100 text-emerald-800';
            default: return 'bg-slate-100 text-slate-800';
        }
    };

    const getStatusColor = (status) => {
        switch (status) {
            case 'Active': return 'bg-emerald-100 text-emerald-800';
            case 'Reviewing': return 'bg-yellow-100 text-yellow-800';
            case 'Confirmed': return 'bg-blue-100 text-blue-800';
            case 'Registration Open': return 'bg-green-100 text-green-800';
            default: return 'bg-slate-100 text-slate-800';
        }
    };

    return (
        <div className="p-8 space-y-8 bg-gradient-to-br from-slate-50 to-blue-50 min-h-screen">
            {/* Header */}
            <div>
                <h1 className="text-4xl font-bold text-slate-900">Dashboard Overview</h1>
                <p className="text-slate-600 mt-2">Welcome back! Here's what's happening today.</p>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {stats.map((stat, idx) => {
                    const Icon = stat.icon;
                    return (
                        <Card key={idx} className="hover:shadow-lg transition-shadow">
                            <CardHeader className="flex flex-row items-center justify-between pb-2">
                                <CardTitle className="text-sm font-medium text-slate-600">
                                    {stat.title}
                                </CardTitle>
                                <Icon className={`h-5 w-5 ${stat.color}`} />
                            </CardHeader>
                            <CardContent>
                                <div className="flex items-baseline justify-between">
                                    <span className="text-3xl font-bold text-slate-900">{stat.value}</span>
                                    <Badge variant="outline" className={stat.trend === 'up' ? 'text-emerald-600 border-emerald-200' : 'text-orange-600 border-orange-200'}>
                                        {stat.change}
                                    </Badge>
                                </div>
                            </CardContent>
                        </Card>
                    );
                })}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Upcoming Events */}
                <Card className="lg:col-span-2">
                    <CardHeader>
                        <div className="flex items-center justify-between">
                            <div>
                                <CardTitle className="flex items-center gap-2">
                                    <Calendar className="h-5 w-5 text-blue-600" />
                                    Upcoming Events
                                </CardTitle>
                                <CardDescription>Conferences, webinars, and training sessions</CardDescription>
                            </div>
                            <Button variant="outline" size="sm">View All</Button>
                        </div>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4">
                            {upcomingEvents.map((event) => (
                                <div key={event.id} className="flex items-start gap-4 p-4 rounded-lg border bg-white hover:shadow-md transition-shadow">
                                    <div className="flex-shrink-0">
                                        <div className="h-12 w-12 rounded-lg bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center">
                                            {event.type === 'Webinar' ? (
                                                <Video className="h-6 w-6 text-white" />
                                            ) : event.type === 'Conference' ? (
                                                <Globe className="h-6 w-6 text-white" />
                                            ) : (
                                                <Calendar className="h-6 w-6 text-white" />
                                            )}
                                        </div>
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-start justify-between gap-2">
                                            <div>
                                                <h4 className="font-semibold text-slate-900">{event.title}</h4>
                                                <div className="flex items-center gap-3 mt-1 text-xs text-slate-600">
                                                    <span className="flex items-center gap-1">
                                                        <Calendar className="h-3 w-3" />
                                                        {event.date}
                                                    </span>
                                                    <span className="flex items-center gap-1">
                                                        <Clock className="h-3 w-3" />
                                                        {event.time}
                                                    </span>
                                                    <span className="flex items-center gap-1">
                                                        <MapPin className="h-3 w-3" />
                                                        {event.location}
                                                    </span>
                                                </div>
                                            </div>
                                            <div className="flex flex-col items-end gap-2">
                                                <Badge className={getEventTypeColor(event.type)}>
                                                    {event.type}
                                                </Badge>
                                                <Badge variant="outline" className={getStatusColor(event.status)}>
                                                    {event.status}
                                                </Badge>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-1 mt-2 text-xs text-slate-600">
                                            <Users className="h-3 w-3" />
                                            <span>{event.attendees} registered</span>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>

                {/* Recent Activity */}
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <Bell className="h-5 w-5 text-orange-600" />
                            Recent Activity
                        </CardTitle>
                        <CardDescription>Latest system updates</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4">
                            {recentActivity.map((activity, idx) => (
                                <div key={idx} className="flex items-start gap-3">
                                    <div className={`h-8 w-8 rounded-full flex items-center justify-center flex-shrink-0 ${activity.type === 'user' ? 'bg-blue-100' :
                                        activity.type === 'project' ? 'bg-emerald-100' :
                                            activity.type === 'application' ? 'bg-purple-100' :
                                                'bg-orange-100'
                                        }`}>
                                        {activity.type === 'user' ? <Users className="h-4 w-4 text-blue-600" /> :
                                            activity.type === 'project' ? <FileText className="h-4 w-4 text-emerald-600" /> :
                                                activity.type === 'application' ? <Briefcase className="h-4 w-4 text-purple-600" /> :
                                                    <Calendar className="h-4 w-4 text-orange-600" />}
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <p className="text-sm text-slate-900 font-medium">{activity.action}</p>
                                        <p className="text-xs text-slate-600">{activity.user}</p>
                                        <p className="text-xs text-slate-400 mt-1">{activity.time}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Recent Vacancies */}
                <Card>
                    <CardHeader>
                        <div className="flex items-center justify-between">
                            <div>
                                <CardTitle className="flex items-center gap-2">
                                    <Briefcase className="h-5 w-5 text-emerald-600" />
                                    Recent Job Vacancies
                                </CardTitle>
                                <CardDescription>Open positions and applications</CardDescription>
                            </div>
                            <Button variant="outline" size="sm">Manage</Button>
                        </div>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-3">
                            {recentVacancies.map((vacancy) => (
                                <div key={vacancy.id} className="p-4 rounded-lg border bg-white hover:shadow-md transition-shadow">
                                    <div className="flex items-start justify-between gap-2">
                                        <div className="flex-1">
                                            <h4 className="font-semibold text-slate-900">{vacancy.title}</h4>
                                            <p className="text-xs text-slate-600 mt-1">{vacancy.department}</p>
                                            <div className="flex items-center gap-3 mt-2 text-xs text-slate-500">
                                                <span>Posted {vacancy.posted}</span>
                                                <span>•</span>
                                                <span className="flex items-center gap-1">
                                                    <Users className="h-3 w-3" />
                                                    {vacancy.applications} applications
                                                </span>
                                            </div>
                                        </div>
                                        <Badge className={getStatusColor(vacancy.status)}>
                                            {vacancy.status}
                                        </Badge>
                                    </div>
                                    <div className="flex items-center justify-between mt-3 pt-3 border-t">
                                        <span className="text-xs text-slate-600">Deadline: {vacancy.deadline}</span>
                                        <Button variant="ghost" size="sm" className="text-emerald-600 hover:text-emerald-700">
                                            View Details
                                            <ArrowUpRight className="h-3 w-3 ml-1" />
                                        </Button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>

                {/* Latest Publications */}
                <Card>
                    <CardHeader>
                        <div className="flex items-center justify-between">
                            <div>
                                <CardTitle className="flex items-center gap-2">
                                    <FileText className="h-5 w-5 text-purple-600" />
                                    Latest Publications
                                </CardTitle>
                                <CardDescription>Recently published content</CardDescription>
                            </div>
                            <Button variant="outline" size="sm">View All</Button>
                        </div>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-3">
                            {recentPublications.map((pub) => (
                                <div key={pub.id} className="p-4 rounded-lg border bg-white hover:shadow-md transition-shadow">
                                    <div className="flex items-start justify-between gap-2">
                                        <div className="flex-1">
                                            <h4 className="font-semibold text-slate-900">{pub.title}</h4>
                                            <div className="flex items-center gap-2 mt-1">
                                                <Badge variant="outline" className="text-xs">
                                                    {pub.category}
                                                </Badge>
                                                <span className="text-xs text-slate-500">{pub.publishedDate}</span>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-4 mt-3 text-xs text-slate-600">
                                        <span className="flex items-center gap-1">
                                            <Eye className="h-3 w-3" />
                                            {pub.views} views
                                        </span>
                                        <span className="flex items-center gap-1">
                                            <TrendingUp className="h-3 w-3" />
                                            {pub.downloads} downloads
                                        </span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}