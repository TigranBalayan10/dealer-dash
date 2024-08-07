"use client"

import { ColumnDef } from "@tanstack/react-table"
import { InventoryItem, Status } from "@prisma/client"
import { formatDate } from "@/lib/dateFormatter"
import { Icon } from '@iconify/react';
import { Button } from "@/components/ui/button"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

export const columns: ColumnDef<InventoryItem>[] = [
    {
        accessorKey: "make",
        header: "Make",
    },
    {
        accessorKey: "model",
        header: "Model",
    },
    {
        accessorKey: "year",
        header: "Year",
    },
    {
        accessorKey: "price",
        header: ({ column }) => {
            return (
                <Button
                    variant="ghost"
                    onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                >
                    Price
                    {column.getIsSorted() ? (
                        <Icon
                            icon={
                                column.getIsSorted() === "asc"
                                    ? "mdi:arrow-up"
                                    : "mdi:arrow-down"
                            }
                            className="h-4 w-4"
                        />
                    ) : <Icon icon="mdi:arrow-up-down" className="h-4 w-4" />}
                </Button>
            )
        },
        cell: ({ row }) => {
            return (
                <div className="text-left">
                    {new Intl.NumberFormat("en-US", {
                        style: "currency",
                        currency: "USD",
                    }).format(row.original.price)}
                </div>
            )
        },
    },
    {
        accessorKey: "description",
        header: "Description",
    },
    {
        accessorKey: "status",
        header: "Status",
        cell: ({ row }) => {
            const status = row.getValue("status") as Status;
            return status === Status.SOLD ? (
                <span className="bg-red-500 text-secondary p-1 rounded-sm">SOLD</span>
            ) : (
                <span className="bg-green-600 text-secondary p-1 rounded-sm">AVAILABLE</span>
            );
        },
    },
    {
        accessorKey: "vin",
        header: "VIN",
    },
    {
        accessorKey: "createdAt",
        header: "Created At",
        cell: ({ row }) => {
            const date = row.getValue("createdAt") as Date;
            return formatDate(date);
        }
    },
    {
        id: "actions",
        cell: ({ row }) => {
            const InventoryItem = row.original

            return (
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="h-8 w-8 p-0">
                            <span className="sr-only">Open menu</span>
                            <Icon icon="mdi:more-horiz" className="h-5 w-5" />
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                        <DropdownMenuLabel>Actions</DropdownMenuLabel>
                        <DropdownMenuItem
                            onClick={() => navigator.clipboard.writeText(InventoryItem.id)}
                        >
                            Copy payment ID
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem>View customer</DropdownMenuItem>
                        <DropdownMenuItem>View payment details</DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            )
        },
    },
]
