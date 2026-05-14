import React from "react";
import "@/App.css";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import { Toaster } from "@/components/ui/sonner";
import { AuthProvider } from "@/lib/auth";
import GrainOverlay from "@/components/site/GrainOverlay";
import CustomCursor from "@/components/site/CustomCursor";
import Nav from "@/components/site/Nav";
import Footer from "@/components/site/Footer";
import Landing from "@/pages/Landing";
import Apply from "@/pages/Apply";
import ExperiencePage from "@/pages/ExperiencePage";
import AdminLogin from "@/pages/AdminLogin";
import AdminDashboard from "@/pages/AdminDashboard";

function ChromeShell({ children }) {
  const { pathname } = useLocation();
  const hideChrome = pathname.startsWith("/admin");
  return (
    <>
      {!hideChrome && <Nav />}
      {children}
      {!hideChrome && <Footer />}
    </>
  );
}

function App() {
  return (
    <div className="App">
      <AuthProvider>
        <BrowserRouter>
          <GrainOverlay />
          <CustomCursor />
          <ChromeShell>
            <Routes>
              <Route path="/" element={<Landing />} />
              <Route path="/apply" element={<Apply />} />
              <Route path="/experiences/:slug" element={<ExperiencePage />} />
              <Route path="/admin/login" element={<AdminLogin />} />
              <Route path="/admin" element={<AdminDashboard />} />
            </Routes>
          </ChromeShell>
          <Toaster
            theme="dark"
            position="bottom-right"
            toastOptions={{
              style: {
                background: "#131C31",
                border: "1px solid rgba(245,245,244,0.12)",
                color: "#F5F5F4",
                borderRadius: 0,
                fontFamily: "Inter, sans-serif",
              },
            }}
          />
        </BrowserRouter>
      </AuthProvider>
    </div>
  );
}

export default App;
