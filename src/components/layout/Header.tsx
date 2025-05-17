
import { SidebarTrigger } from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";
import { Bell } from "lucide-react";

export function Header() {
  return (
    <header className="sticky top-0 z-10 flex h-14 items-center gap-4 border-b bg-background px-4 sm:h-16 sm:px-6">
      <SidebarTrigger className="text-foreground hover:text-primary" />
      <h1 className="text-lg font-semibold text-foreground md:text-xl">EmailAce</h1>
      <div className="ml-auto flex items-center gap-2">
        {/* Placeholder for future actions like notifications or user menu */}
        <Button variant="ghost" size="icon" className="rounded-full">
          <Bell className="h-5 w-5" />
          <span className="sr-only">Notifications</span>
        </Button>
      </div>
    </header>
  );
}
