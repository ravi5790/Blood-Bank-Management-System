import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { Droplet, LogOut, User } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { Button } from "./ui/button";

export const Navbar = () => {
  const { user, logout } = useAuth();
  const nav = useNavigate();

  const dashPath = user && user.role
    ? `/dashboard/${user.role}`
    : "/login";

  return (
    <header className="border-b border-[var(--line)] bg-white/85 backdrop-blur sticky top-0 z-30" data-testid="app-navbar">
      <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2 group" data-testid="brand-link">
          <div className="w-8 h-8 rounded-lg bg-[var(--crimson)] flex items-center justify-center text-white shadow-sm group-hover:rotate-6 transition-transform">
            <Droplet className="w-4 h-4" fill="white" />
          </div>
          <span className="font-display text-xl font-bold tracking-tight">BloodLink</span>
        </Link>

        <nav className="hidden md:flex items-center gap-7 text-sm font-medium text-neutral-600">
          <Link to="/" className="hover:text-[var(--crimson)]" data-testid="nav-home">Home</Link>
          <Link to="/search" className="hover:text-[var(--crimson)]" data-testid="nav-search">Find Blood</Link>
          {user && user.role && (
            <Link to={dashPath} className="hover:text-[var(--crimson)]" data-testid="nav-dashboard">Dashboard</Link>
          )}
        </nav>

        <div className="flex items-center gap-3">
          {!user || user === false ? (
            <>
              <Link to="/login"><Button variant="ghost" data-testid="login-btn">Sign in</Button></Link>
              <Link to="/register">
                <Button className="bg-[var(--crimson)] hover:bg-[var(--crimson-dark)] text-white rounded-full px-5" data-testid="register-btn">
                  Join now
                </Button>
              </Link>
            </>
          ) : (
            <div className="flex items-center gap-3">
              <Link to={dashPath} className="flex items-center gap-2 text-sm">
                <div className="w-7 h-7 rounded-full bg-neutral-100 flex items-center justify-center">
                  <User className="w-4 h-4" />
                </div>
                <span className="font-medium hidden sm:inline" data-testid="user-name">{user.name}</span>
              </Link>
              <Button variant="ghost" size="sm" onClick={async () => { await logout(); nav("/"); }} data-testid="logout-btn">
                <LogOut className="w-4 h-4" />
              </Button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
