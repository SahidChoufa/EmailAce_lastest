
import { Rocket } from 'lucide-react';
import Link from 'next/link';

export function AppLogo() {
  return (
    <Link href="/" className="flex items-center gap-2 px-2 group-data-[collapsible=icon]:justify-center">
      <Rocket className="h-6 w-6 text-primary group-data-[collapsible=icon]:h-7 group-data-[collapsible=icon]:w-7" />
      <span className="font-semibold text-lg text-sidebar-foreground group-data-[collapsible=icon]:hidden">
        EmailAce
      </span>
    </Link>
  );
}
