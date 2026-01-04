"use client";

import { useRouter } from "next/navigation";
import { logout, getCurrentUser } from "@/services/authService";
import { Button } from "@/components/ui/button";
import { useState, useEffect } from "react";

export function DashboardHeader() {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [email, setEmail] = useState<string | null>(null);

    useEffect(() => {
        getCurrentUser().then(user => {
            setEmail(user?.email || null);
        });
    }, []);

    const handleLogout = async () => {
        setLoading(true);
        try {
            await logout();
            router.push("/auth/login");
        } catch {
            // Optionally show error
        } finally {
            setLoading(false);
        }
    };

    return (
        <header className="mb-8 flex items-center justify-between">
            <div>
                <h1 className="text-3xl font-bold">Welcome to Arin Dashboard</h1>
                <p className="text-muted-foreground">Your central hub for stats and insights.</p>
                {email && (
                    <span className="text-sm text-gray-500">Logged in as: <b>{email}</b></span>
                )}
            </div>
            <Button onClick={handleLogout} disabled={loading} variant="outline">
                {loading ? "Logging out..." : "Logout"}
            </Button>
        </header>
    );
}
