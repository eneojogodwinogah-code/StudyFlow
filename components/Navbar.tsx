"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";

export default function Navbar() {
  const pathname = usePathname();

  const [isOpen, setIsOpen] = useState(false);

  const links = [
    { name: "Dashboard", href: "/" },
    { name: "Courses", href: "/courses" },
    { name: "Study Planner", href: "/StudyPlanner" },
    { name: "Assignments", href: "/assignments" },
    { name: "Exams", href: "/exams" },
  ];

  return (
    <nav className="mb-8">
      {/* Top navigation bar */}
      <div className="flex items-center justify-between">
        
        {/* App name */}
        <Link
          href="/"
          className="text-2xl font-bold"
          onClick={() => setIsOpen(false)}
        >
          StudyFlow
        </Link>

        {/* Desktop navigation */}
        <div className="hidden md:flex gap-2">
          {links.map((link) => {
            const isActive = pathname === link.href;

            return (
              <Link
                key={link.href}
                href={link.href}
                className={
                  isActive
                    ? "rounded-lg bg-blue-600 px-4 py-2 font-semibold text-white"
                    : "rounded-lg px-4 py-2 text-blue-600 hover:bg-blue-50"
                }
              >
                {link.name}
              </Link>
            );
          })}
        </div>

        {/* Mobile menu button */}
        <button
  type="button"
  onClick={() => setIsOpen(!isOpen)}
  className="md:hidden rounded-lg border px-3 py-2 text-xl"
  aria-label="Toggle navigation menu"
  aria-expanded={isOpen}
>
  {isOpen ? "✕" : "☰"}
</button>
      </div>

      {/* Mobile navigation */}
      {isOpen && (
        <div className="mt-4 flex flex-col gap-2 md:hidden">
          {links.map((link) => {
            const isActive = pathname === link.href;

            return (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setIsOpen(false)}
                className={
                  isActive
                    ? "rounded-lg bg-blue-600 px-4 py-3 font-semibold text-white"
                    : "rounded-lg px-4 py-3 text-blue-600 hover:bg-blue-50"
                }
              >
                {link.name}
              </Link>
            );
          })}
        </div>
      )}
    </nav>
  );
}