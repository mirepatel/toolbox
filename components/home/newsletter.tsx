"use client";

import { useState } from "react";
import { Mail } from "lucide-react";
import { toast } from "sonner";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export function Newsletter() {
  const [email, setEmail] = useState("");

  function subscribe() {
    if (!email.trim() || !email.includes("@")) {
      toast.error("Enter a valid email");
      return;
    }
    toast.success("Subscribed — look out for new tools");
    setEmail("");
  }

  return (
    <section className="flex flex-col items-center gap-4 rounded-2xl border border-border bg-panel px-8 py-12 text-center">
      <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-accent/10 text-accent">
        <Mail size={17} />
      </span>
      <div>
        <h3 className="text-lg font-semibold tracking-tight">Get new tools first</h3>
        <p className="mt-1 text-sm text-muted-foreground">One email a month, only when something new ships.</p>
      </div>
      <div className="mt-1 flex w-full max-w-sm flex-col gap-2 sm:flex-row">
        <Input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && subscribe()}
          placeholder="you@example.com"
        />
        <Button onClick={subscribe} className="shrink-0">
          Subscribe
        </Button>
      </div>
    </section>
  );
}
