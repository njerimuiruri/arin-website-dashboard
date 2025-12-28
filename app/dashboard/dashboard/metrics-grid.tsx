import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

export function MetricsGrid() {
    const stats = [
        { title: "Total Users", value: "1,245" },
        { title: "Active Projects", value: "32" },
        { title: "Pending Tasks", value: "87" },
        { title: "Revenue", value: "$12,400" },
    ];

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {stats.map((stat, idx) => (
                <Card key={idx}>
                    <CardHeader>
                        <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <span className="text-3xl font-bold">{stat.value}</span>
                    </CardContent>
                </Card>
            ))}
        </div>
    );
}