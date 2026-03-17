import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { AuthProvider, useAuth } from "../context/AuthContext";

// Helper component to expose auth state
function AuthTestConsumer() {
  const { user, isAuthenticated, login, logout } = useAuth();
  return (
    <div>
      <p data-testid="auth-status">{isAuthenticated ? "authenticated" : "unauthenticated"}</p>
      <p data-testid="username">{user?.username ?? "none"}</p>
      <button onClick={() => login("admin", "password123")} data-testid="login-btn">
        Login
      </button>
      <button onClick={() => login("admin", "wrongpass")} data-testid="bad-login-btn">
        Bad Login
      </button>
      <button onClick={logout} data-testid="logout-btn">
        Logout
      </button>
    </div>
  );
}

describe("AuthContext", () => {
  beforeEach(() => {
    localStorage.clear();
    vi.restoreAllMocks();
  });

  it("starts unauthenticated when localStorage is empty", () => {
    render(
      <AuthProvider>
        <AuthTestConsumer />
      </AuthProvider>,
    );
    expect(screen.getByTestId("auth-status")).toHaveTextContent("unauthenticated");
    expect(screen.getByTestId("username")).toHaveTextContent("none");
  });

  it("authenticates with correct credentials", async () => {
    render(
      <AuthProvider>
        <AuthTestConsumer />
      </AuthProvider>,
    );
    const loginBtn = screen.getByTestId("login-btn");
    fireEvent.click(loginBtn);
    await waitFor(() => {
      expect(screen.getByTestId("auth-status")).toHaveTextContent("authenticated");
      expect(screen.getByTestId("username")).toHaveTextContent("admin");
    });
  });

  it("returns false for wrong credentials", async () => {
    render(
      <AuthProvider>
        <AuthTestConsumer />
      </AuthProvider>,
    );
    fireEvent.click(screen.getByTestId("bad-login-btn"));
    await waitFor(() => {
      expect(screen.getByTestId("auth-status")).toHaveTextContent("unauthenticated");
    });
  });

  it("persists auth to localStorage after login", async () => {
    render(
      <AuthProvider>
        <AuthTestConsumer />
      </AuthProvider>,
    );
    fireEvent.click(screen.getByTestId("login-btn"));
    await waitFor(() => {
      expect(localStorage.getItem("auth_user")).not.toBeNull();
      const stored = JSON.parse(localStorage.getItem("auth_user")!);
      expect(stored.username).toBe("admin");
    });
  });

  it("logs out and clears localStorage", async () => {
    render(
      <AuthProvider>
        <AuthTestConsumer />
      </AuthProvider>,
    );
    fireEvent.click(screen.getByTestId("login-btn"));
    await waitFor(() => {
      expect(screen.getByTestId("auth-status")).toHaveTextContent("authenticated");
    });

    fireEvent.click(screen.getByTestId("logout-btn"));
    await waitFor(() => {
      expect(screen.getByTestId("auth-status")).toHaveTextContent("unauthenticated");
      expect(localStorage.getItem("auth_user")).toBeNull();
    });
  });

  it("restores session from localStorage on mount", () => {
    localStorage.setItem("auth_user", JSON.stringify({ username: "admin" }));
    render(
      <AuthProvider>
        <AuthTestConsumer />
      </AuthProvider>,
    );
    expect(screen.getByTestId("auth-status")).toHaveTextContent("authenticated");
    expect(screen.getByTestId("username")).toHaveTextContent("admin");
  });
});
