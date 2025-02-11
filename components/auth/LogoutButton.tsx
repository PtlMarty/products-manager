"use client";

import { Button } from "@/components/ui/atoms/button";
import { signOut } from "next-auth/react";

export const LogoutButton = () => {
  const handleLogout = async () => {
    await signOut({ callbackUrl: "/sign-in" });
  };

  return (
    <Button
      onClick={handleLogout}
      variant="ghost"
      className="text-gray-200 hover:text-white font-medium"
    >
      Logout
    </Button>
  );
};
