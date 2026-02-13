"use client";

import { LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import { signOut } from "@/actions/auth";

export function SignOutButton() {
  return (
    <form action={signOut}>
      <Button variant="ghost" size="sm" className="gap-1.5 text-muted-foreground">
        <LogOut className="h-4 w-4" />
        Sign out
      </Button>
    </form>
  );
}
