"use client";

import { useEffect } from "react";
import { useSearchParams } from "next/navigation";

export default function ReferralTracker() {
  const searchParams = useSearchParams();
  const ref = searchParams.get("ref");

  useEffect(() => {
    if (ref) {
      // Store the agent's referral code in localStorage with a 30-day expiry
      const expiry = new Date().getTime() + 30 * 24 * 60 * 60 * 1000;
      localStorage.setItem(
        "zarizo_referral",
        JSON.stringify({ code: ref, expiresAt: expiry })
      );
      console.log("Referral tracking logged:", ref);
    }
  }, [ref]);

  return null; // This component is invisible
}
