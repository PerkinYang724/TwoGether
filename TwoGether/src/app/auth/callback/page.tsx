"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase-client";

export default function AuthCallback() {
    const router = useRouter();
    const supabase = createClient();

    useEffect(() => {
        const handleAuthCallback = async () => {
            try {
                const { data, error } = await supabase.auth.getSession();

                if (error) {
                    console.error("Auth error:", error);
                    router.push("/auth/login");
                    return;
                }

                if (data.session) {
                    // Check if user has a profile
                    const { data: profile } = await supabase
                        .from("profiles")
                        .select("id")
                        .eq("id", data.session.user.id)
                        .single();

                    if (!profile) {
                        // Redirect to profile setup
                        router.push("/auth/setup");
                    } else {
                        // Redirect to home
                        router.push("/");
                    }
                } else {
                    router.push("/auth/login");
                }
            } catch (error) {
                console.error("Callback error:", error);
                router.push("/auth/login");
            }
        };

        handleAuthCallback();
    }, [router, supabase]);

    return (
        <div className="min-h-screen bg-background flex items-center justify-center">
            <div className="text-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
                <p className="text-muted-foreground">Completing sign in...</p>
            </div>
        </div>
    );
}
