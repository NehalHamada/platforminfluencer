import { Route, Routes } from "react-router-dom";

import AuthLayout from "@/layouts/AuthLayout";
import MainLayout from "@/layouts/MainLayout";
import DashboardLayout from "@/layouts/DashboardLayout";

import ProtectedRoute from "@/guards/ProtectedRoute";
import RoleGuard from "@/guards/RoleGuard";

import Landing from "@/pages/public/Landing";
import Login from "@/pages/auth/Login";
import Register from "@/pages/auth/Register";
import ForgotPassword from "@/pages/auth/ForgotPassword";
import VerifyOtp from "@/pages/auth/VerifyOtp";
import ResetPassword from "@/pages/auth/ResetPassword";

import CompanyForm from "@/pages/auth/register/CompanyForm";
import CompleteCompanyProfile from "@/pages/auth/register/CompleteCompanyProfile";
import InfluencerForm from "@/pages/auth/register/InfluencerForm";
import CompleteInfluencerProfile from "@/pages/auth/register/CompleteInfluencerProfile";
import CompleteInfluencerPayment from "@/pages/auth/register/CompleteInfluencerPayment";
import InfluencerProfile from "@/pages/influencers/InfluencerProfile";
import Campaigns from "@/pages/dashboard/company/Campaigns";
import ExploreInfluencers from "@/pages/dashboard/company/ExploreInfluencers";
import CreateCampaign from "@/pages/dashboard/company/CreateCampaign";
import ContactInfluencer from "@/pages/dashboard/company/ContactInfluencer";
import Earnings from "@/pages/dashboard/influencer/Earnings";
import Offers from "@/pages/dashboard/influencer/Offers";
import Cooperation from "@/pages/dashboard/influencer/Cooperation";
import CompanyDashboard from "@/pages/dashboard/CompanyDashboard";
import CampaignsRequests from "@/pages/dashboard/company/CampaignsRequests";

import InfluencerDashboard from "@/pages/dashboard/InfluencerDashboard";
import CampaignsInf from "@/pages/dashboard/influencer/CampaignsInf";
import Unauthorized from "@/pages/errors/Unauthorized";
import NotFound from "@/pages/errors/NotFound";
import Message from "@/pages/dashboard/company/Message";
import Messages from "@/pages/dashboard/influencer/Messages";
import ContactUs from "@/pages/info/ContactUs";
import WhoUs from "@/pages/info/WhoUs";

function AppRoutes() {
  return (
    <Routes>
      <Route element={<MainLayout />}>
        <Route path="/" element={<Landing />} />
        <Route path="/influencer-profile/:id" element={<InfluencerProfile />} />
        <Route path="/contact" element={<ContactUs />} />
        <Route path="/about" element={<WhoUs />} />
      </Route>

      <Route element={<AuthLayout />}>
        <Route path="/login" element={<Login />} />

        <Route path="/register" element={<Register />}>
          <Route path="company" element={<CompanyForm />} />
          <Route path="company/complete" element={<CompleteCompanyProfile />} />

          <Route path="influencer" element={<InfluencerForm />} />
          <Route
            path="influencer/complete"
            element={<CompleteInfluencerProfile />}
          />
          <Route
            path="influencer/payment"
            element={<CompleteInfluencerPayment />}
          />
        </Route>

        <Route path="/forget-password" element={<ForgotPassword />} />
        <Route path="/verify-otp" element={<VerifyOtp />} />
        <Route path="/reset-password" element={<ResetPassword />} />
      </Route>

      <Route element={<ProtectedRoute />}>
        <Route element={<DashboardLayout />}>
          <Route element={<RoleGuard allowedRoles={["company"]} />}>
            <Route path="/dashboard/company" element={<CompanyDashboard />} />
            <Route
              path="/dashboard/company/campaigns"
              element={<Campaigns />}
            />
            <Route
              path="/dashboard/company/campaign-requests"
              element={<CampaignsRequests />}
            />
            <Route
              path="/dashboard/company/explore"
              element={<ExploreInfluencers />}
            />
            <Route
              path="/dashboard/company/create"
              element={<CreateCampaign />}
            />
            <Route
              path="/dashboard/company/contact"
              element={<ContactInfluencer />}
            />
            <Route path="/dashboard/company/messages" element={<Message />} />
          </Route>

          <Route element={<RoleGuard allowedRoles={["influencer"]} />}>
            <Route
              path="/dashboard/influencer"
              element={<InfluencerDashboard />}
            />
            <Route
              path="/dashboard/influencer/campaigns"
              element={<CampaignsInf />}
            />

            <Route
              path="/dashboard/influencer/earnings"
              element={<Earnings />}
            />
            <Route path="/dashboard/influencer/offers" element={<Offers />} />
            <Route
              path="/dashboard/influencer/:campaignId/offers"
              element={<Offers />}
            />
            <Route
              path="/dashboard/influencer/cooperation"
              element={<Cooperation />}
            />
            <Route
              path="/dashboard/influencer/messages"
              element={<Messages />}
            />
          </Route>
        </Route>
      </Route>

      <Route path="/unauthorized" element={<Unauthorized />} />
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}

export default AppRoutes;
