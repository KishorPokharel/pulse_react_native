import { useAuth } from "@/src/hooks/useAuth";
import { Redirect } from "expo-router";
import React from "react";

export default function Screen() {
  let { user } = useAuth();
  user = user!;

  return (
    <Redirect
      href={{ pathname: "/user/[userId]", params: { userId: user.id } }}
    />
  );
}
