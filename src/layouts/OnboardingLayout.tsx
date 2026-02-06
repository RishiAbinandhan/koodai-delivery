import React, { useEffect, useState } from "react";
import { Outlet, useLocation, useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { Progress } from "../components/ui/progress";
import { Button } from "../components/ui/button";

export default function OnboardingLayout() {
    const location = useLocation();
    const navigate = useNavigate();
    const [progress, setProgress] = useState(0);

    // Map routes to progress value
    const steps = [
        "/onboarding/step-1", // Basic Info
        "/onboarding/step-2", // Permissions
        "/onboarding/step-3", // KYC
        "/onboarding/step-4", // Vehicle
        "/onboarding/step-5", // Payment
        "/onboarding/step-6", // Review
    ];

    useEffect(() => {
        const currentIndex = steps.findIndex(step => location.pathname === step);
        if (currentIndex !== -1) {
            setProgress(((currentIndex + 1) / steps.length) * 100);
        }
    }, [location]);

    return (
        <div className="flex flex-col min-h-screen bg-background">
            {/* Header */}
            <div className="p-4 border-b border-border flex items-center gap-4 sticky top-0 bg-background z-10">
                <Button variant="ghost" size="icon" onClick={() => navigate(-1)} disabled={location.pathname === steps[0]}>
                    <ArrowLeft className="w-5 h-5" />
                </Button>
                <div className="flex-1">
                    <h2 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">Onboarding</h2>
                    <div className="flex items-center gap-2">
                        <Progress value={progress} className="h-2" />
                        <span className="text-xs font-medium text-foreground min-w-[3ch]">{Math.round(progress)}%</span>
                    </div>
                </div>
            </div>

            {/* Content */}
            <div className="flex-1 p-4 pb-20">
                <Outlet />
            </div>
        </div>
    );
}
