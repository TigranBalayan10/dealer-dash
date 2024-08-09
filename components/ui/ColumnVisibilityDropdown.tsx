// components/ui/ColumnVisibilityDropdown.tsx
import React from 'react';
import { Table } from '@tanstack/react-table';
import { Button } from './button';
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuCheckboxItem,
} from './dropdown-menu';

interface ColumnVisibilityDropdownProps<T> {
  table: Table<T>;
  visibleColumns?: string[]; // Optional array of column IDs to include
}

export function ColumnVisibilityDropdown<T>({
  table,
  visibleColumns,
}: ColumnVisibilityDropdownProps<T>) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" className="ml-auto">
          Columns
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        {table
          .getAllColumns()
          .filter((column) => 
            column.getCanHide() && 
            (visibleColumns === undefined || visibleColumns.includes(column.id))
          )
          .map((column) => {
            return (
              <DropdownMenuCheckboxItem
                key={column.id}
                className="capitalize"
                checked={column.getIsVisible()}
                onCheckedChange={(value) =>
                  column.toggleVisibility(!!value)
                }
              >
                {column.id}
              </DropdownMenuCheckboxItem>
            );
          })}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
