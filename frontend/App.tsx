
import React from 'react';
import { HashRouter, Routes, Route, useLocation, Outlet } from 'react-router-dom';
import Header from './components/Header';
import Footer from './components/Footer';
import HomePage from './pages/HomePage';
import ListingsPage from './pages/ListingsPage';
import PropertyDetailPage from './pages/PropertyDetailPage';
import AboutPage from './pages/AboutPage';
import ContactPage from './pages/ContactPage';
import BlogPage from './pages/BlogPage';
import BlogPostPage from './pages/BlogPostPage';
import FloatingChatWidget from './components/FloatingChatWidget';
import LoginPage from './pages/admin/LoginPage';
import DashboardPage from './pages/admin/DashboardPage';
import SettingsPage from './pages/admin/SettingsPage';
import AdminLayout from './components/admin/AdminLayout';
import PropertiesPage from './pages/admin/PropertiesPage';
import BlogsPage from './pages/admin/BlogsPage';
import SubscribersPage from './pages/admin/SubscribersPage';
import CookieConsentBanner from './components/CookieConsentBanner';
import ScrollToTop from './components/ScrollToTop';
import RentInquiriesPage from './pages/admin/RentInquiriesPage';

const AppContent: React.FC = () => {
  const location = useLocation();
  const isAdminRoute = location.pathname.startsWith('/admin');

  return (
    <div className="min-h-screen flex flex-col" style={{ backgroundColor: isAdminRoute ? '#f0f2f5' : 'var(--color-bg)' }}>
      {!isAdminRoute && <Header />}
      <main className="flex-grow">
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<HomePage />} />
          <Route path="/properties" element={<ListingsPage />} />
          <Route path="/property/:id" element={<PropertyDetailPage />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/contact" element={<ContactPage />} />
          <Route path="/blog" element={<BlogPage />} />
          <Route path="/blog/:slug" element={<BlogPostPage />} />

          {/* Admin Routes */}
          <Route path="/admin/login" element={<LoginPage />} />
          
          <Route element={<AdminLayout />}>
            <Route path="/admin/dashboard" element={<DashboardPage />} />
            <Route path="/admin/properties" element={<PropertiesPage />} />
            <Route path="/admin/blogs" element={<BlogsPage />} />
            <Route path="/admin/rent-inquiries" element={<RentInquiriesPage />} />
            <Route path="/admin/subscribers" element={<SubscribersPage />} />
            <Route path="/admin/settings" element={<SettingsPage />} />
          </Route>
        </Routes>
      </main>
      {!isAdminRoute && <Footer />}
      {!isAdminRoute && <FloatingChatWidget />}
      {!isAdminRoute && <CookieConsentBanner />}
    </div>
  );
};


const App: React.FC = () => {
  return (
    <HashRouter>
      <ScrollToTop />
      <AppContent />
    </HashRouter>
  );
};

export default App;