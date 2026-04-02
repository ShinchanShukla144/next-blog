"use client";

import { cn } from "@/lib/utils";
import Link from "next/link";
import { Button } from "../ui/button";
import { useSession } from "@/lib/auth-client";
import UserMenu from "../auth/user-menu";
import { useRouter } from "next/navigation";
import ThemeToggle from "../theme/theme-toggle";

function Header() {
  const { data: session, isPending } = useSession();
  const router = useRouter();
  const navList = [
    {
      label: "Home",
      href: "/",
    },
    {
      label: "Create",
      href: "/post/create",
    },
  ];

  return (
    <header className="border-b bg-background sticky top-0 z-10">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        <div className="flex items-center gap-6">
          <Link href="/" className="font-bold text-xl">
            Blog
          </Link>
          <nav className="hidden md:flex items-center gap-6">
            {navList.map((nav) => (
              <Link
                key={nav.href}
                href={nav.href}
                className={cn(
                  "text-sm font-medium transition-colors hover:text-primary",
                )}
              >
                {nav.label}
              </Link>
            ))}
          </nav>
        </div>
        <div className="flex items-center gap-6">
          <div className="hidden md:block"></div>
          <ThemeToggle />
          <div className="flex items-center gap-2">
            {isPending ? null : session?.user ? (
              <UserMenu user={session?.user} />
            ) : (
              <Button
                className="cursor-pointer"
                onClick={() => router.push("/auth")}
              >
                Login
                {/* 👉 asChild = "button ka style, link ka behavior" */}
              </Button>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}

export default Header;
