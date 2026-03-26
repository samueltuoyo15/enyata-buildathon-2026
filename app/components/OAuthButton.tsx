"use client";

import { useState } from "react";
import { Loader2 } from "lucide-react";

export default function OAuthButton({ action }: { action: () => Promise<void> }) {
  const [loading, setLoading] = useState(false);

  const handleClick = async () => {
    setLoading(true);
    try {
      await action();
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      type="button"
      onClick={handleClick}
      disabled={loading}
      className="brutal-btn w-full p-4 flex items-center justify-center gap-3"
    >
      {!loading && (
        <svg
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path d="M22.56 12.25C22.56 11.47 22.49 10.72 22.36 10H12V14.26H17.92C17.66 15.63 16.88 16.8 15.71 17.58V20.34H19.28C21.36 18.42 22.56 15.6 22.56 12.25Z" fill="#4285F4"/>
          <path d="M12 23C14.97 23 17.46 22.02 19.28 20.34L15.71 17.58C14.73 18.24 13.48 18.64 12 18.64C9.13 18.64 6.7 16.7 5.84 14.1H2.15V16.96C3.96 20.55 7.68 23 12 23Z" fill="#34A853"/>
          <path d="M5.84 14.1C5.62 13.44 5.5 12.74 5.5 12C5.5 11.26 5.62 10.56 5.84 9.9V7.04H2.15C1.41 8.53 1 10.21 1 12C1 13.79 1.41 15.47 2.15 16.96L5.84 14.1Z" fill="#FBBC05"/>
          <path d="M12 5.38C13.62 5.38 15.06 5.94 16.2 7.02L19.36 3.86C17.46 2.09 14.97 1 12 1C7.68 1 3.96 3.45 2.15 7.04L5.84 9.9C6.7 7.3 9.13 5.38 12 5.38Z" fill="#EA4335"/>
        </svg>
      )}
      <span className="font-semibold flex items-center gap-2">
        {loading && <Loader2 className="animate-spin h-5 w-5" />}
        {loading ? "Processing..." : "Continue with Google"}
      </span>
    </button>
  );
}