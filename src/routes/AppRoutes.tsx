import { Routes, Route, Navigate } from "react-router-dom";

import MainLayout from "../layouts/MainLayout";
import DashboardLayout from "../layouts/DashboardLayout";
import OnboardingLayout from "../layouts/OnboardingLayout";

// public
import Welcome from "../pages/auth/Welcome";
import Login from "../pages/auth/Login";

// onboarding
import Step1BasicInfo from "../pages/onboarding/Step1BasicInfo";
import Step2Permissions from "../pages/onboarding/Step2Permissions";
import Step3KYC from "../pages/onboarding/Step3KYC";
import Step4Vehicle from "../pages/onboarding/Step4Vehicle";
import Step5Payment from "../pages/onboarding/Step5Payment";
import Step6Review from "../pages/onboarding/Step6Review";

// dashboard
import Home from "../pages/dashboard/Home";
import Orders from "../pages/dashboard/Orders";
import Earnings from "../pages/dashboard/Earnings";
import Profile from "../pages/dashboard/Profile";
import AppSettings from "../pages/dashboard/AppSettings";

export default function AppRoutes() {
  return (
    <Routes>
      {/* Public / Main */}
      <Route element={<MainLayout />}>
        <Route path="/" element={<Welcome />} />
        <Route path="/login" element={<Login />} />
      </Route>

      {/* Onboarding */}
      <Route path="/onboarding" element={<OnboardingLayout />}>
        <Route index element={<Navigate to="step-1" replace />} />
        <Route path="step-1" element={<Step1BasicInfo />} />
        <Route path="step-2" element={<Step2Permissions />} />
        <Route path="step-3" element={<Step3KYC />} />
        <Route path="step-4" element={<Step4Vehicle />} />
        <Route path="step-5" element={<Step5Payment />} />
        <Route path="step-6" element={<Step6Review />} />
      </Route>

      {/* Dashboard */}
      <Route path="/dashboard" element={<DashboardLayout />}>
        <Route index element={<Home />} />
        <Route path="orders" element={<Orders />} />
        <Route path="earnings" element={<Earnings />} />
        <Route path="profile" element={<Profile />} />
        <Route path="settings" element={<AppSettings />} />
      </Route>

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}