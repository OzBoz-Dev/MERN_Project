import Auth from "./auth";
import { Metadata } from "next";

// Metadata
export const metadata: Metadata = {
  title: 'Login',
};

export default function AuthPage() {
  return <Auth />;
}