"use client";

import { hasCookie } from "cookies-next/client";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function globalRedirect() {
  const router = useRouter();

  useEffect(() => {
    if (hasCookie('token')) {
      router.push("/feed");
    } else {
      router.push("/auth");
    }
  }, [router]);
  return null;
}
