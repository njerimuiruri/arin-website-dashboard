"use client";


import { useState } from "react";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import {
    Field,
    FieldDescription,
    FieldGroup,
    FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { login as loginService } from "@/services/authService";

export function LoginForm({ className, ...props }) {
    const router = useRouter();

    const [isLoading, setIsLoading] = useState(false);
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        setError("");
        try {
            await loginService(email, password);
            // Wait a moment for cookie to be set before redirecting
            setTimeout(() => {
                router.push("/dashboard/dashboard");
            }, 100);
        } catch (err) {
            setError(err.message || "Login failed");
            setIsLoading(false);
        }
    };

    return (
        <div className={cn("flex items-center justify-center min-h-screen bg-muted", className)} {...props}>
            <Card className="w-full max-w-md mx-auto shadow-lg">
                <CardHeader>
                    <CardTitle>Login to your account</CardTitle>
                    <CardDescription>
                        Enter your email below to login to your account
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleSubmit} className="space-y-6">
                        <FieldGroup>
                            <Field>
                                <FieldLabel htmlFor="email">Email</FieldLabel>
                                <Input
                                    id="email"
                                    type="email"
                                    placeholder="m@example.com"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    required
                                />
                            </Field>
                            <Field>
                                <div className="flex items-center">
                                    <FieldLabel htmlFor="password">Password</FieldLabel>
                                    <a
                                        href="#"
                                        className="ml-auto inline-block text-sm underline-offset-4 hover:underline"
                                    >
                                        Forgot your password?
                                    </a>
                                </div>
                                <Input
                                    id="password"
                                    type="password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    required
                                />
                            </Field>
                            {error && (
                                <div className="text-red-500 text-sm text-center">{error}</div>
                            )}
                            <Field>
                                <Button type="submit" disabled={isLoading} className="w-full">
                                    {isLoading ? "Logging in..." : "Login"}
                                </Button>
                                <Button variant="outline" type="button" className="w-full mt-2">
                                    Login with Google
                                </Button>
                                <FieldDescription className="text-center mt-4">
                                    Don&apos;t have an account? <a href="/signup" className="underline">Sign up</a>
                                </FieldDescription>
                            </Field>
                        </FieldGroup>
                    </form>
                </CardContent>
            </Card>
        </div>
    );
}
