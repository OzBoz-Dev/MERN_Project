// __tests__/ResetPassword.test.tsx

import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import ResetPassword from "@/app/auth/reset/[token]/page";
import "@testing-library/jest-dom";

// --- Mocks ---

// Mock next/navigation
jest.mock("next/navigation", () => ({
  useParams: () => ({ token: "test-reset-token-123" }),
}));

// Mock constants
jest.mock("../constants/constants.ts", () => ({
  API_ENTRYPOINT: "https://api.example.com",
}));

// Mock PasswordStrength component
jest.mock("../app/auth/PasswordStrength", () => {
    return {
      PasswordStrength: (props: any) => (
    <div>
      <input
        data-testid="password-input"
        value={props.value}
        onChange={(e) => {
          props.onChange(e);
          props.onValidChange(e.target.value.length >= 8);
        }}
      />
    </div>
  )};
});

// Mock Mantine components — keeps tests fast and avoids style/context issues
jest.mock("@mantine/core", () => ({
  Paper: ({ children }: any) => <div>{children}</div>,
  Title: ({ children }: any) => <h1>{children}</h1>,
  Stack: ({ children }: any) => <div>{children}</div>,
  Alert: ({ children, onClose }: any) => (
    <div role="alert">
      {children}
      <button onClick={onClose}>Close</button>
    </div>
  ),
  Button: ({ children, onClick, disabled, loading }: any) => (
    <button onClick={onClick} disabled={disabled || loading}>
      {children}
    </button>
  ),
  Text: ({ children }: any) => <p>{children}</p>,
  Container: ({ children }: any) => <div>{children}</div>,
}));

// Mock GlobalTheme
jest.mock("../app/GlobalTheme", () => ({
  designTokens: {
    colors: { glassyBackground: "#000" },
    fonts: { heading: "sans-serif" },
  },
}));

// --- Helpers ---

const mockFetch = (ok: boolean, payload: object) => {
  global.fetch = jest.fn().mockResolvedValue({
    ok,
    json: jest.fn().mockResolvedValue(payload),
  } as any);
};

// --- Tests ---

describe("ResetPassword page", () => {
  afterEach(() => jest.resetAllMocks());

  it("renders the form", () => {
    mockFetch(true, {});
    render(<ResetPassword />);
    expect(screen.getByText("Reset your password")).toBeInTheDocument();
    expect(screen.getByTestId("password-input")).toBeInTheDocument();
    expect(screen.getByText("Reset Password")).toBeInTheDocument();
  });

  it("keeps Reset Password button disabled when password is too short", () => {
    mockFetch(true, {});
    render(<ResetPassword />);

    fireEvent.change(screen.getByTestId("password-input"), {
      target: { value: "short" },
    });

    expect(screen.getByText("Reset Password")).toBeDisabled();
  });

  it("calls fetch with the correct URL and body on submit", async () => {
    mockFetch(true, { message: "ok" });
    render(<ResetPassword />);

    fireEvent.change(screen.getByTestId("password-input"), {
      target: { value: "validPassword1!" },
    });
    fireEvent.click(screen.getByText("Reset Password"));

    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalledWith(
        "https://api.example.com/auth/recovery/test-reset-token-123",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ password: "validPassword1!" }),
        }
      );
    });
  });

  it("shows success message on successful reset", async () => {
    mockFetch(true, { message: "ok" });
    render(<ResetPassword />);

    fireEvent.change(screen.getByTestId("password-input"), {
      target: { value: "validPassword1!" },
    });
    fireEvent.click(screen.getByText("Reset Password"));

    await waitFor(() => {
      expect(screen.getByText("Password reset successfully!")).toBeInTheDocument();
    });
  });

  it("shows error message when API returns an error", async () => {
    mockFetch(false, { error: "Invalid or expired reset token" });
    render(<ResetPassword />);

    fireEvent.change(screen.getByTestId("password-input"), {
      target: { value: "validPassword1!" },
    });
    fireEvent.click(screen.getByText("Reset Password"));

    await waitFor(() => {
      expect(
        screen.getByText("Invalid or expired reset token")
      ).toBeInTheDocument();
    });
  });

  it("dismisses the error alert when close is clicked", async () => {
    mockFetch(false, { error: "Invalid or expired reset token" });
    render(<ResetPassword />);

    fireEvent.change(screen.getByTestId("password-input"), {
      target: { value: "validPassword1!" },
    });
    fireEvent.click(screen.getByText("Reset Password"));

    await waitFor(() => screen.getByRole("alert"));
    fireEvent.click(screen.getByText("Close"));

    expect(screen.queryByRole("alert")).not.toBeInTheDocument();
  });
});