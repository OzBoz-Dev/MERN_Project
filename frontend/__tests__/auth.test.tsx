// __tests__/Auth.test.tsx

import React from "react";
import "@testing-library/jest-dom";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import Auth from "@/app/auth/auth";

// --- Mocks ---

jest.mock("../constants/constants.ts", () => ({
  API_ENTRYPOINT: "https://api.example.com",
}));

jest.mock("../app/GlobalTheme.ts", () => ({
  designTokens: {
    colors: { glassyBackground: "#000" },
    fonts: { heading: "sans-serif" },
  },
}));

jest.mock("cookies-next/client", () => ({
  setCookie: jest.fn(),
}));

// Mock location
Object.defineProperty(window, "location", {
  value: { assign: jest.fn(), reload: jest.fn() },
  writable: true,
});

jest.mock("../app/auth/PasswordStrength", () => ({
  PasswordStrength: ({ value, onChange, onValidChange }: any) => (
    <input
      data-testid="password-input"
      value={value}
      onChange={(e) => {
        onChange(e);
        onValidChange(e.target.value.length >= 8);
      }}
    />
  ),
}));

jest.mock("../app/auth/ForgotPasswordInput", () => ({
  ForgotPasswordInput: ({ value, onChange, onClick }: any) => (
    <div>
      <input
        data-testid="password-input"
        value={value}
        onChange={onChange}
      />
      <button onClick={onClick}>Forgot Password?</button>
    </div>
  ),
}));

jest.mock("../app/auth/FloatingLabelInput", () => ({
  FloatingLabelInput: ({ label, value, onChange }: any) => (
    <input
      data-testid={`input-${label.toLowerCase().replace(" ", "-")}`}
      placeholder={label}
      value={value}
      onChange={onChange}
    />
  ),
}));

jest.mock("../app/auth/InputValidation", () => ({
  InputValidation: ({ label, value, onChange, onValidChange }: any) => (
    <input
      data-testid={`input-${label.toLowerCase().replace(" ", "-")}`}
      placeholder={label}
      value={value}
      onChange={(e) => {
        onChange(e);
        onValidChange(e.target.value.includes("@"));
      }}
    />
  ),
}));

jest.mock("../app/auth/GradientSegmentedControl", () => ({
  GradientSegmentedControl: ({ value, onChange, data }: any) => (
    <div>
      {data.map((item: string) => (
        <button
          key={item}
          data-testid={`tab-${item.toLowerCase().replace(" ", "-")}`}
          onClick={() => onChange(item)}
          style={{ fontWeight: value === item ? "bold" : "normal" }}
        >
          {item}
        </button>
      ))}
    </div>
  ),
}));

jest.mock("@mantine/core", () => ({
  Container: ({ children }: any) => <div>{children}</div>,
  Box:       ({ children }: any) => <div>{children}</div>,
  Title:     ({ children }: any) => <h1>{children}</h1>,
  Paper:     ({ children }: any) => <div>{children}</div>,
  Button:    ({ children, onClick, disabled, loading }: any) => (
    <button onClick={onClick} disabled={disabled || loading}>{children}</button>
  ),
  Alert:     ({ children, onClose }: any) => (
    <div role="alert">
      {children}
      <button onClick={onClose}>Close</button>
    </div>
  ),
  Text:      ({ children }: any) => <span>{children}</span>,
  Group:     ({ children }: any) => <div>{children}</div>,
  Stack:     ({ children }: any) => <div>{children}</div>,
}));

// --- Helpers ---

const mockFetch = (ok: boolean, payload: object) => {
  global.fetch = jest.fn().mockResolvedValue({
    ok,
    json: jest.fn().mockResolvedValue(payload),
  } as any);
};

const fillLoginForm = () => {
  fireEvent.change(screen.getByTestId("input-email"), {
    target: { value: "user@example.com" },
  });
  fireEvent.change(screen.getByTestId("password-input"), {
    target: { value: "password123" },
  });
};

const switchToSignUp = () => {
  fireEvent.click(screen.getByTestId("tab-sign-up"));
};

const fillSignUpForm = () => {
  fireEvent.change(screen.getByTestId("input-email"), {
    target: { value: "user@example.com" },
  });
  fireEvent.change(screen.getByTestId("input-username"), {
    target: { value: "testuser" },
  });
  fireEvent.change(screen.getByTestId("input-first-name"), {
    target: { value: "John" },
  });
  fireEvent.change(screen.getByTestId("input-last-name"), {
    target: { value: "Doe" },
  });
  fireEvent.change(screen.getByTestId("password-input"), {
    target: { value: "StrongPass1!" },
  });
};

// --- Tests ---

describe("Auth component", () => {
  afterEach(() => jest.resetAllMocks());

  // --- Rendering ---

  it("renders the Log In form by default", () => {
    render(<Auth />);
    expect(screen.getByText("Welcome Back")).toBeInTheDocument();
    expect(screen.getByText("Sign In")).toBeInTheDocument();
  });

  it("renders the Sign Up form when tab is switched", () => {
    render(<Auth />);
    switchToSignUp();
    expect(screen.getByRole("button", { name: /create account/i })).toBeInTheDocument();
    expect(screen.getByTestId("input-username")).toBeInTheDocument();
    expect(screen.getByTestId("input-first-name")).toBeInTheDocument();
    expect(screen.getByTestId("input-last-name")).toBeInTheDocument();
  });

  // --- Submit button disabled state ---

  it("disables Sign In button when fields are empty", () => {
    render(<Auth />);
    expect(screen.getByText("Sign In")).toBeDisabled();
  });

  it("enables Sign In button when email and password are filled", () => {
    render(<Auth />);
    fillLoginForm();
    expect(screen.getByText("Sign In")).not.toBeDisabled();
  });

  it("disables Create Account button until all sign up fields are filled", () => {
    render(<Auth />);
    switchToSignUp();
    // Only fill email — button should still be disabled
    fireEvent.change(screen.getByTestId("input-email"), {
      target: { value: "user@example.com" },
    });
    expect(screen.getByRole("button", { name: /create account/i })).toBeDisabled();
  });

  it("enables Create Account button when all sign up fields are filled", () => {
    render(<Auth />);
    switchToSignUp();
    fillSignUpForm();
    expect(screen.getByRole("button", { name: /create account/i })).not.toBeDisabled();
  });

  // --- Login API ---

  it("calls login API with correct payload", async () => {
    mockFetch(true, {
      token: "abc123",
      user: { username: "testuser", firstName: "John", lastName: "Doe" },
    });
    render(<Auth />);
    fillLoginForm();
    fireEvent.click(screen.getByText("Sign In"));

    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalledWith(
        "https://api.example.com/auth/login",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email: "user@example.com", password: "password123" }),
        }
      );
    });
  });

  it("redirects to /feed on successful login", async () => {
    mockFetch(true, {
      token: "abc123",
      user: { username: "testuser", firstName: "John", lastName: "Doe" },
    });
    render(<Auth />);
    fillLoginForm();
    fireEvent.click(screen.getByText("Sign In"));

    await waitFor(() => {
      expect(window.location.assign).toHaveBeenCalledWith("/feed");
    });
  });

  it("shows error message on failed login", async () => {
    mockFetch(false, { error: "Invalid credentials" });
    render(<Auth />);
    fillLoginForm();
    fireEvent.click(screen.getByText("Sign In"));

    await waitFor(() => {
      expect(screen.getByText("Invalid credentials")).toBeInTheDocument();
    });
  });

  // --- Signup API ---

  it("calls signup API with correct payload", async () => {
    mockFetch(true, {});
    render(<Auth />);
    switchToSignUp();
    fillSignUpForm();
    fireEvent.click(screen.getByRole("button", { name: /create account/i }));

    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalledWith(
        "https://api.example.com/auth/signup",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            username: "testuser",
            email: "user@example.com",
            password: "StrongPass1!",
            firstName: "John",
            lastName: "Doe",
          }),
        }
      );
    });
  });

  it("shows verify card after successful signup", async () => {
    mockFetch(true, {});
    render(<Auth />);
    switchToSignUp();
    fillSignUpForm();
    fireEvent.click(screen.getByRole("button", { name: /create account/i }));

    await waitFor(() => {
      expect(screen.getByText("Check your inbox")).toBeInTheDocument();
    });
  });

  it("shows error message on failed signup", async () => {
    mockFetch(false, { error: "Email already in use" });
    render(<Auth />);
    switchToSignUp();
    fillSignUpForm();
    fireEvent.click(screen.getByRole("button", { name: /create account/i }));

    await waitFor(() => {
      expect(screen.getByText("Email already in use")).toBeInTheDocument();
    });
  });

  // --- Reset Password ---

  it("shows reset password card when Forgot Password is clicked", () => {
    render(<Auth />);
    fireEvent.click(screen.getByText("Forgot Password?"));
    expect(screen.getByText("Reset your password")).toBeInTheDocument();
  });

  it("calls reset password API with correct payload", async () => {
    mockFetch(true, {});
    render(<Auth />);
    fireEvent.click(screen.getByText("Forgot Password?"));

    fireEvent.change(screen.getByTestId("input-recovery-email"), {
      target: { value: "user@example.com" },
    });
    fireEvent.click(screen.getByRole("button", { name: /reset password/i }));

    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalledWith(
        "https://api.example.com/auth/reset-password",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email: "user@example.com" }),
        }
      );
    });
  });

  it("shows error on failed password reset", async () => {
    mockFetch(false, { error: "Email not found" });
    render(<Auth />);
    fireEvent.click(screen.getByText("Forgot Password?"));

    fireEvent.change(screen.getByTestId("input-recovery-email"), {
      target: { value: "user@example.com" },
    });
    fireEvent.click(screen.getByRole("button", { name: /reset password/i }));

    await waitFor(() => {
      expect(screen.getByRole("alert")).toBeInTheDocument();
      expect(screen.getByText("Email not found")).toBeInTheDocument();
    });
  });

  // --- Resend Verification ---

  it("calls resend verification API when Resend Email is clicked", async () => {
    // First get to the verify card
    mockFetch(true, {});
    render(<Auth />);
    switchToSignUp();
    fillSignUpForm();
    fireEvent.click(screen.getByRole("button", { name: /create account/i }));
    await waitFor(() => screen.getByText("Check your inbox"));

    // Now click resend
    mockFetch(true, {});
    fireEvent.click(screen.getByText("Resend Email"));

    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalledWith(
        "https://api.example.com/auth/resend-verification",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email: "user@example.com" }),
        }
      );
    });
  });

  it("shows cooldown on resend button after clicking", async () => {
    mockFetch(true, {});
    render(<Auth />);
    switchToSignUp();
    fillSignUpForm();
    fireEvent.click(screen.getByRole("button", { name: /create account/i }));
    await waitFor(() => screen.getByText("Check your inbox"));

    mockFetch(true, {});
    fireEvent.click(screen.getByText("Resend Email"));

    await waitFor(() => {
      expect(screen.getByText(/Resend in \d+s/)).toBeInTheDocument();
    });
  });
});