import { describe, it, expect, beforeEach, afterEach, vi } from "vitest";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { MemoryRouter } from "react-router";
import PageLogin from "../modules/auth/PageLogin";
import { AuthProvider } from "../context/AuthContext";

// Wrap with Router since PageLogin uses useNavigate/useLocation
function renderLoginPage() {
  return render(
    <MemoryRouter initialEntries={["/login"]}>
      <AuthProvider>
        <PageLogin />
      </AuthProvider>
    </MemoryRouter>,
  );
}

describe("PageLogin", () => {
  beforeEach(() => {
    localStorage.clear();
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it("renders the login form", () => {
    renderLoginPage();
    expect(screen.getByLabelText(/username/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/password/i)).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /sign in/i })).toBeInTheDocument();
  });

  it("shows demo credentials hint", () => {
    renderLoginPage();
    expect(screen.getByText(/demo credentials/i)).toBeInTheDocument();
    expect(screen.getByText("admin")).toBeInTheDocument();
  });

  it("updates username input on change", () => {
    renderLoginPage();
    const usernameInput = screen.getByLabelText(/username/i);
    fireEvent.change(usernameInput, { target: { value: "admin" } });
    expect(usernameInput).toHaveValue("admin");
  });

  it("shows error message on wrong credentials", async () => {
    vi.useRealTimers(); // avoid fake timer conflicts with waitFor
    renderLoginPage();
    const usernameInput = screen.getByLabelText(/username/i);
    const passwordInput = screen.getByLabelText(/password/i);
    const submitBtn = screen.getByRole("button", { name: /sign in/i });

    fireEvent.change(usernameInput, { target: { value: "wrong" } });
    fireEvent.change(passwordInput, { target: { value: "wrong" } });
    fireEvent.click(submitBtn);

    await waitFor(
      () => {
        expect(screen.getByText(/invalid username or password/i)).toBeInTheDocument();
      },
      { timeout: 2000 },
    );
  });

  it("button is disabled while loading", () => {
    renderLoginPage();
    const usernameInput = screen.getByLabelText(/username/i);
    const passwordInput = screen.getByLabelText(/password/i);
    const submitBtn = screen.getByRole("button", { name: /sign in/i });

    fireEvent.change(usernameInput, { target: { value: "admin" } });
    fireEvent.change(passwordInput, { target: { value: "password123" } });
    fireEvent.click(submitBtn);

    // During the loading delay the button should be disabled
    expect(submitBtn).toBeDisabled();
  });
});
