// __tests__/profile.test.tsx

import React from "react";
import "@testing-library/jest-dom";
import { render as rtlRender, screen, fireEvent, waitFor, RenderOptions } from "@testing-library/react";
import ProfilePage from "@/app/profile/[username]/profile";

// --- Custom Render Function with MantineProvider ---

const MockMantineProvider = ({ children }: { children: React.ReactNode }) => (
  <div>{children}</div>
);

const render = (
  ui: React.ReactElement,
  options?: Omit<RenderOptions, "wrapper">
) =>
  rtlRender(ui, {
    wrapper: MockMantineProvider,
    ...options,
  });

// --- Mocks ---

jest.mock("../constants/constants", () => ({
  API_ENTRYPOINT: "https://api.example.com",
}));

jest.mock("../app/GlobalTheme", () => ({
  designTokens: {
    colors: { glassyBackground: "#000" },
    fonts: { heading: "sans-serif" },
  },
}));

jest.mock("@mantine/core", () => ({
  Box: ({ children, ...props }: any) => <div {...props}>{children}</div>,
  Container: ({ children, ...props }: any) => <div {...props}>{children}</div>,
  Title: ({ children, ...props }: any) => <h1 {...props}>{children}</h1>,
  Text: ({ children, ...props }: any) => <p {...props}>{children}</p>,
  Group: ({ children, ...props }: any) => <div {...props}>{children}</div>,
  Center: ({ children, ...props }: any) => <div {...props}>{children}</div>,
  Button: ({ children, ...props }: any) => <button {...props}>{children}</button>,
  Paper: ({ children, withBorder, ...props }: any) => <div {...props}>{children}</div>,
  Flex: ({ children, ...props }: any) => <div {...props}>{children}</div>,
  LoadingOverlay: ({ visible, ...props }: any) => visible ? <div {...props}>Loading...</div> : null,
  Loader: (props: any) => <div {...props}>Loading</div>,
  Modal: ({ children, opened, ...props }: any) => opened ? <div {...props}>{children}</div> : null,
  TextInput: (props: any) => <input {...props} />,
  Textarea: (props: any) => <textarea {...props} />,
  Alert: ({ children, ...props }: any) => <div {...props}>{children}</div>,
  Divider: (props: any) => <hr {...props} />,
}));

jest.mock("cookies-next/client", () => ({
  getCookie: jest.fn(),
  setCookie: jest.fn(),
  deleteCookie: jest.fn(),
}));

jest.mock("next/navigation", () => ({
  useParams: jest.fn(),
  notFound: jest.fn(),
}));

jest.mock("../app/profile/ProfileInfoCard", () => {
  return function MockProfileInfoCard(props: any) {
    return (
      <div data-testid="profile-info-card">
        <div data-testid="username">{props.username}</div>
        <div data-testid="firstname">{props.firstName}</div>
        <div data-testid="lastname">{props.lastName}</div>
        <div data-testid="bio">{props.bio}</div>
      </div>
    );
  };
});

jest.mock("../app/profile/EditProfileModal", () => {
  return function MockEditProfileModal(props: any) {
    return (
      <div data-testid="edit-profile-modal" style={{ display: props.isOpen ? "block" : "none" }}>
        <button
          data-testid="save-profile-button"
          onClick={() =>
            props.onSave({
              firstName: "Updated",
              lastName: "Name",
              bio: "Updated bio",
              tags: ["tag1"],
            })
          }
        >
          Save
        </button>
        <button
          data-testid="cancel-edit-button"
          onClick={props.onClose}
        >
          Cancel
        </button>
        <button
          data-testid="delete-account-from-modal-button"
          onClick={props.onOpenDelete}
        >
          Delete Account
        </button>
      </div>
    );
  };
});

jest.mock("../app/profile/DeleteAccountModal", () => {
  return function MockDeleteAccountModal(props: any) {
    return (
      <div data-testid="delete-account-modal" style={{ display: props.opened ? "block" : "none" }}>
        <input
          data-testid="delete-password-input"
          value={props.passwordValue}
          onChange={(e) => props.onPasswordChange(e.target.value)}
          placeholder="Enter password"
        />
        <button
          data-testid="confirm-delete-button"
          onClick={props.onConfirm}
          disabled={props.loading}
        >
          {props.loading ? "Deleting..." : "Confirm Delete"}
        </button>
        <button
          data-testid="cancel-delete-button"
          onClick={props.onClose}
        >
          Cancel
        </button>
        {props.error && <div data-testid="delete-error">{props.error}</div>}
        {props.success && <div data-testid="delete-success">{props.success}</div>}
      </div>
    );
  };
});

jest.mock("../app/profile/ProfileActions", () => {
  return function MockProfileActions(props: any) {
    return (
      <div data-testid="profile-actions">
        <button
          data-testid="edit-profile-button"
          onClick={props.onEditProfile}
        >
          Edit Profile
        </button>
        <button
          data-testid="logout-button"
          onClick={props.onLogout}
        >
          Logout
        </button>
      </div>
    );
  };
});

// --- Mock Data ---

const mockUserProfile = {
  username: "johndoe",
  firstName: "John",
  lastName: "Doe",
  bio: "Software developer",
  tags: ["javascript", "react"],
  profilePicture: "#3b82f6",
};

const mockOtherUserProfile = {
  username: "janedoe",
  firstName: "Jane",
  lastName: "Doe",
  bio: "Designer",
  tags: ["design", "ui"],
  profilePicture: "#10b981",
};

// --- Tests ---

describe("ProfilePage Component", () => {
  let mockFetch: jest.Mock;
  let mockUseParams: jest.Mock;
  let mockGetCookie: jest.Mock;
  let mockSetCookie: jest.Mock;
  let mockDeleteCookie: jest.Mock;

  beforeEach(() => {
    // Reset all mocks before each test
    jest.clearAllMocks();

    // Setup fetch mock
    mockFetch = global.fetch as jest.Mock || jest.fn();
    global.fetch = jest.fn();

    // Setup navigation mock
    const { useParams } = require("next/navigation");
    mockUseParams = useParams;
    mockUseParams.mockReturnValue({ username: "johndoe" });

    // Setup cookies mock
    const { getCookie, setCookie, deleteCookie } = require("cookies-next/client");
    mockGetCookie = getCookie;
    mockSetCookie = setCookie;
    mockDeleteCookie = deleteCookie;

    // Default mock for getCookie
    mockGetCookie.mockImplementation((key: string) => {
      if (key === "username") return "johndoe";
      if (key === "token") return "mock-token";
      return null;
    });

  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  describe("Rendering Logic", () => {
    it("should render loading state initially", () => {
      mockUseParams.mockReturnValue({ username: "johndoe" });
      (global.fetch as jest.Mock).mockImplementationOnce(
        () =>
          new Promise((resolve) =>
            setTimeout(() => resolve({ ok: true, json: async () => mockUserProfile }), 100)
          )
      );

      render(<ProfilePage />);

      // Loading should be visible
      expect(screen.queryByTestId("profile-info-card")).not.toBeInTheDocument();
    });

    it("should render profile data after fetch success", async () => {
      mockUseParams.mockReturnValue({ username: "johndoe" });
      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: async () => mockUserProfile,
      });

      render(<ProfilePage />);

      await waitFor(() => {
        expect(screen.getByTestId("profile-info-card")).toBeInTheDocument();
      });

      expect(screen.getByTestId("username")).toHaveTextContent("johndoe");
      expect(screen.getByTestId("firstname")).toHaveTextContent("John");
      expect(screen.getByTestId("lastname")).toHaveTextContent("Doe");
      expect(screen.getByTestId("bio")).toHaveTextContent("Software developer");
    });

    it("should show profile actions for own profile", async () => {
      mockUseParams.mockReturnValue({ username: "johndoe" });
      mockGetCookie.mockImplementation((key: string) => {
        if (key === "username") return "johndoe";
        if (key === "token") return "mock-token";
        return null;
      });

      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: async () => mockUserProfile,
      });

      render(<ProfilePage />);

      await waitFor(() => {
        expect(screen.getByTestId("profile-actions")).toBeInTheDocument();
      });

      expect(screen.getByTestId("edit-profile-button")).toBeInTheDocument();
      expect(screen.getByTestId("logout-button")).toBeInTheDocument();
    });

    it("should not show profile actions for other user's profile", async () => {
      mockUseParams.mockReturnValue({ username: "janedoe" });
      mockGetCookie.mockImplementation((key: string) => {
        if (key === "username") return "johndoe"; // Current user
        if (key === "token") return "mock-token";
        return null;
      });

      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: async () => mockOtherUserProfile,
      });

      render(<ProfilePage />);

      await waitFor(() => {
        expect(screen.getByTestId("profile-info-card")).toBeInTheDocument();
      });

      expect(screen.queryByTestId("profile-actions")).not.toBeInTheDocument();
    });
  });

  describe("API Calls - getProfile", () => {
    it("should fetch profile data on component mount", async () => {
      mockUseParams.mockReturnValue({ username: "johndoe" });
      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: async () => mockUserProfile,
      });

      render(<ProfilePage />);

      await waitFor(() => {
        expect(global.fetch).toHaveBeenCalledWith(
          "https://api.example.com/profile/johndoe",
          {
            cache: "no-store",
          }
        );
      });
    });

    it("should handle fetch error gracefully", async () => {
      mockUseParams.mockReturnValue({ username: "johndoe" });
      const consoleErrorSpy = jest.spyOn(console, "error").mockImplementation();
      (global.fetch as jest.Mock).mockRejectedValueOnce(new Error("Network error"));

      render(<ProfilePage />);

      await waitFor(() => {
        expect(consoleErrorSpy).toHaveBeenCalledWith(
          "Failed to fetch profile:",
          expect.any(Error)
        );
      });

      consoleErrorSpy.mockRestore();
    });
  });

  describe("Profile Edit", () => {
    it("should open edit modal when edit button is clicked", async () => {
      mockUseParams.mockReturnValue({ username: "johndoe" });
      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: async () => mockUserProfile,
      });

      render(<ProfilePage />);

      await waitFor(() => {
        expect(screen.getByTestId("edit-profile-button")).toBeInTheDocument();
      });

      fireEvent.click(screen.getByTestId("edit-profile-button"));

      expect(screen.getByTestId("edit-profile-modal")).toHaveStyle({ display: "block" });
    });

    it("should save profile changes and update display", async () => {
      mockUseParams.mockReturnValue({ username: "johndoe" });
      (global.fetch as jest.Mock)
        .mockResolvedValueOnce({
          ok: true,
          json: async () => mockUserProfile,
        })
        .mockResolvedValueOnce({
          ok: true,
          json: async () => ({
            ...mockUserProfile,
            firstName: "Updated",
            lastName: "Name",
            bio: "Updated bio",
          }),
        });

      render(<ProfilePage />);

      await waitFor(() => {
        expect(screen.getByTestId("edit-profile-button")).toBeInTheDocument();
      });

      // Open edit modal
      fireEvent.click(screen.getByTestId("edit-profile-button"));

      // Click save
      fireEvent.click(screen.getByTestId("save-profile-button"));

      await waitFor(() => {
        expect(global.fetch).toHaveBeenCalledWith(
          "https://api.example.com/profile/johndoe",
          expect.objectContaining({
            method: "PUT",
            headers: expect.objectContaining({
              Authorization: "Bearer mock-token",
              "Content-Type": "application/json",
            }),
          })
        );
      });

      // Verify cookies were updated
      expect(mockSetCookie).toHaveBeenCalledWith("firstName", "Updated");
      expect(mockSetCookie).toHaveBeenCalledWith("lastName", "Name");
    });

    it("should close edit modal when cancel is clicked", async () => {
      mockUseParams.mockReturnValue({ username: "johndoe" });
      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: async () => mockUserProfile,
      });

      render(<ProfilePage />);

      await waitFor(() => {
        expect(screen.getByTestId("edit-profile-button")).toBeInTheDocument();
      });

      // Open edit modal
      fireEvent.click(screen.getByTestId("edit-profile-button"));
      expect(screen.getByTestId("edit-profile-modal")).toHaveStyle({ display: "block" });

      // Close edit modal
      fireEvent.click(screen.getByTestId("cancel-edit-button"));
      expect(screen.getByTestId("edit-profile-modal")).toHaveStyle({ display: "none" });
    });

    it("should handle save profile error", async () => {
      mockUseParams.mockReturnValue({ username: "johndoe" });
      const alertSpy = jest.spyOn(window, "alert").mockImplementation();

      (global.fetch as jest.Mock)
        .mockResolvedValueOnce({
          ok: true,
          json: async () => mockUserProfile,
        })
        .mockResolvedValueOnce({
          ok: false,
          status: 500,
        });

      render(<ProfilePage />);

      await waitFor(() => {
        expect(screen.getByTestId("edit-profile-button")).toBeInTheDocument();
      });

      // Open edit modal
      fireEvent.click(screen.getByTestId("edit-profile-button"));

      // Click save
      fireEvent.click(screen.getByTestId("save-profile-button"));

      await waitFor(() => {
        expect(alertSpy).toHaveBeenCalledWith(
          expect.stringContaining("Could not save profile")
        );
      });

      alertSpy.mockRestore();
    });
  });

  describe("Profile Delete", () => {
    it("should open delete modal when delete button is clicked from edit modal", async () => {
      mockUseParams.mockReturnValue({ username: "johndoe" });
      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: async () => mockUserProfile,
      });

      render(<ProfilePage />);

      await waitFor(() => {
        expect(screen.getByTestId("edit-profile-button")).toBeInTheDocument();
      });

      // Open edit modal
      fireEvent.click(screen.getByTestId("edit-profile-button"));

      // Click delete account button
      fireEvent.click(screen.getByTestId("delete-account-from-modal-button"));

      expect(screen.getByTestId("delete-account-modal")).toHaveStyle({ display: "block" });
    });

    it("should delete account with password confirmation", async () => {
      mockUseParams.mockReturnValue({ username: "johndoe" });
      const confirmSpy = jest.spyOn(window, "confirm").mockReturnValueOnce(true);

      (global.fetch as jest.Mock)
        .mockResolvedValueOnce({
          ok: true,
          json: async () => mockUserProfile,
        })
        .mockResolvedValueOnce({
          ok: true,
          json: async () => ({}),
        });

      render(<ProfilePage />);

      await waitFor(() => {
        expect(screen.getByTestId("edit-profile-button")).toBeInTheDocument();
      });

      // Set password and confirm delete
      const passwordInput = screen.getByTestId("delete-password-input");
      fireEvent.change(passwordInput, { target: { value: "password123" } });

      fireEvent.click(screen.getByTestId("confirm-delete-button"));

      await waitFor(() => {
        expect(global.fetch).toHaveBeenCalledWith(
          "https://api.example.com/profile/johndoe",
          expect.objectContaining({
            method: "DELETE",
            headers: expect.objectContaining({
              Authorization: "Bearer mock-token",
              "Content-Type": "application/json",
            }),
            body: JSON.stringify({ password: "password123" }),
          })
        );
      });

      // Verify cookies were deleted
      expect(mockDeleteCookie).toHaveBeenCalledWith("token");
      expect(mockDeleteCookie).toHaveBeenCalledWith("firstName");
      expect(mockDeleteCookie).toHaveBeenCalledWith("lastName");
      expect(mockDeleteCookie).toHaveBeenCalledWith("username");
    });

    it("should require password for account deletion", async () => {
      mockUseParams.mockReturnValue({ username: "johndoe" });
      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: async () => mockUserProfile,
      });

      render(<ProfilePage />);

      await waitFor(() => {
        expect(screen.getByTestId("delete-password-input")).toBeInTheDocument();
      });

      // Try to delete without password
      fireEvent.click(screen.getByTestId("confirm-delete-button"));

      await waitFor(() => {
        expect(screen.getByTestId("delete-error")).toHaveTextContent("Please enter your password");
      });

      // Verify delete endpoint was not called
      expect(global.fetch).toHaveBeenCalledTimes(1); // Only initial profile fetch
    });

    it("should handle delete account error", async () => {
      mockUseParams.mockReturnValue({ username: "johndoe" });
      (global.fetch as jest.Mock)
        .mockResolvedValueOnce({
          ok: true,
          json: async () => mockUserProfile,
        })
        .mockResolvedValueOnce({
          ok: false,
          status: 401,
          json: async () => ({ error: "Invalid password" }),
        });

      render(<ProfilePage />);

      await waitFor(() => {
        expect(screen.getByTestId("delete-password-input")).toBeInTheDocument();
      });

      // Enter password and try delete
      const passwordInput = screen.getByTestId("delete-password-input");
      fireEvent.change(passwordInput, { target: { value: "wrongpassword" } });

      fireEvent.click(screen.getByTestId("confirm-delete-button"));

      await waitFor(() => {
        expect(screen.getByTestId("delete-error")).toHaveTextContent("Invalid password");
      });
    });

    it("should close delete modal when cancel is clicked", async () => {
      mockUseParams.mockReturnValue({ username: "johndoe" });
      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: async () => mockUserProfile,
      });

      render(<ProfilePage />);

      await waitFor(() => {
        expect(screen.getByTestId("delete-password-input")).toBeInTheDocument();
      });

      // Open delete modal by entering password and clicking confirm (which will fail due to no real endpoint)
      const passwordInput = screen.getByTestId("delete-password-input");
      fireEvent.change(passwordInput, { target: { value: "test" } });

      // Click cancel
      fireEvent.click(screen.getByTestId("cancel-delete-button"));

      expect(screen.getByTestId("delete-account-modal")).toHaveStyle({ display: "none" });
    });
  });

  describe("Logout", () => {
    it("should logout and redirect to auth", async () => {
      mockUseParams.mockReturnValue({ username: "johndoe" });
      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: async () => mockUserProfile,
      });

      render(<ProfilePage />);

      await waitFor(() => {
        expect(screen.getByTestId("logout-button")).toBeInTheDocument();
      });

      fireEvent.click(screen.getByTestId("logout-button"));

      // Verify all cookies deleted
      expect(mockDeleteCookie).toHaveBeenCalledWith("token");
      expect(mockDeleteCookie).toHaveBeenCalledWith("firstName");
      expect(mockDeleteCookie).toHaveBeenCalledWith("lastName");
      expect(mockDeleteCookie).toHaveBeenCalledWith("username");
    });
  });

  describe("Edge Cases", () => {
    it("should handle empty username from params", async () => {
      mockUseParams.mockReturnValue({ username: undefined });

      render(<ProfilePage />);

      await waitFor(() => {
        // Should not make any fetch calls
        expect(global.fetch).not.toHaveBeenCalled();
      });
    });

    it("should refetch profile when username changes", async () => {
      const { rerender } = render(<ProfilePage />);

      mockUseParams.mockReturnValue({ username: "johndoe" });
      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: async () => mockUserProfile,
      });

      rerender(<ProfilePage />);

      await waitFor(() => {
        expect(global.fetch).toHaveBeenCalledWith(
          "https://api.example.com/profile/johndoe",
          { cache: "no-store" }
        );
      });
    });
  });
});
