import React from 'react';
import Link from 'next/link';
import { Icon } from '@iconify/react';
import { cn } from "@/lib/utils";

interface SidebarProps extends React.HTMLAttributes<HTMLDivElement> {}

const Sidebar: React.FC<SidebarProps> = ({ className }) => {
  return (
    <div className={cn("pb-12 w-64 bg-primary text-secondary", className)}>
      <div className="space-y-4 py-4">
        <div className="px-3 py-2">
          <h2 className="mb-2 px-4 text-lg font-semibold tracking-tight">
            Dashboard
          </h2>
          <div className="space-y-1">
            <Link href="/dashboard" className="flex items-center rounded-lg px-3 py-2 text-secondary hover:bg-secondary hover:text-primary">
              <Icon icon="mdi:view-dashboard" className="mr-2 h-4 w-4" />
              Dashboard
            </Link>
            <Link href="/inventory" className="flex items-center rounded-lg px-3 py-2 text-secondary hover:bg-secondary hover:text-primary">
              <Icon icon="mdi:package-variant-closed" className="mr-2 h-4 w-4" />
              Inventory
            </Link>
            <Link href="/customers" className="flex items-center rounded-lg px-3 py-2 text-secondary hover:bg-secondary hover:text-primary">
              <Icon icon="mdi:account-group" className="mr-2 h-4 w-4" />
              Customers
            </Link>
            <Link href="/finances" className="flex items-center rounded-lg px-3 py-2 text-secondary hover:bg-secondary hover:text-primary">
              <Icon icon="mdi:cash" className="mr-2 h-4 w-4" />
              Finances
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
