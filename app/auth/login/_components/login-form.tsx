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

import type { HTMLAttributes } from "react";

interface LoginFormProps extends HTMLAttributes<HTMLDivElement> {
    // Only prop types here
}

export function LoginForm({ className, ...props }: LoginFormProps) {
    const router = useRouter();

    const [isLoading, setIsLoading] = useState(false);
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setIsLoading(true);
        setError("");
        try {
            console.log('📝 Attempting login with email:', email);
            const result = await loginService(email, password);
            console.log('✅ Login service returned:', {
                has_access_token: !!result.access_token,
                has_refresh_token: !!result.refresh_token,
                user: result.user,
            });

            // Give a small moment for tokens to be stored in localStorage
            await new Promise(resolve => setTimeout(resolve, 100));

            console.log('🔄 Redirecting to dashboard...');
            // Token is automatically stored in localStorage by loginService
            // Redirect to dashboard
            router.push("/dashboard/dashboard");
        } catch (err) {
            console.error('❌ Login error:', err);
            if (err instanceof Error) {
                setError(err.message || "Login failed");
            } else {
                setError("Login failed");
            }
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
        </div >
    );
}