'use client';

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useEffect, useState } from "react";

export default function UserAvatar() {
  const [avatarUrl, setAvatarUrl] = useState("");
  const [userName, setUserName] = useState("");

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      try {
        const parsed = JSON.parse(storedUser);
        if (parsed?.avatar) {
          setAvatarUrl(parsed.avatar);
          setUserName(parsed.name || "User");
        } else {
          // Fallback if avatar not available
          setUserName(parsed?.name || "User");
        }
      } catch (error) {
        console.error("Invalid user data:", error);
      }
    }
  }, []);

  const fallbackInitial = userName?.charAt(0)?.toUpperCase() || "U";

  return (
    <Avatar>
      {avatarUrl && <AvatarImage src={avatarUrl} alt={userName} />}
      <AvatarFallback>{fallbackInitial}</AvatarFallback>
    </Avatar>
  );
}
