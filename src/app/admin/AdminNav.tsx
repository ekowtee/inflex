"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Users,
  FileText,
  Receipt,
  CreditCard,
  Settings,
} from "lucide-react";

const navItems = [
  { name: "Dashboard", href: "/admin", icon: LayoutDashboard, exact: true },
  { name: "Customers", href: "/admin/customers", icon: Users },
  { name: "Quotes", href: "/admin/quotes", icon: FileText },
  { name: "Invoices", href: "/admin/invoices", icon: Receipt },
  { name: "Payments", href: "/admin/payments", icon: CreditCard },
  { name: "Settings", href: "/admin/settings", icon: Settings },
];

export default function AdminNav() {
  const pathname = usePathname();

  return (
    <nav className="flex items-center gap-1 overflow-x-auto">
      {navItems.map((item) => {
        const Icon = item.icon;
        const active = item.exact
          ? pathname === item.href
          : pathname.startsWith(item.href);
        return (
          <Link
            key={item.href}
            href={item.href}
            className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md text-sm whitespace-nowrap transition-colors ${
              active
                ? "bg-white/10 text-white"
                : "text-white/60 hover:text-white hover:bg-white/5"
            }`}
          >
            <Icon className="w-4 h-4" />
            {item.name}
          </Link>
        );
      })}
    </nav>
  );
}
