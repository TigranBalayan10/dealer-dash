"use client"

import { ColumnDef } from "@tanstack/react-table"
import { Customer } from "@prisma/client"
import { formatDate, formatDateShort } from "@/lib/dateFormatter"
import { Icon } from '@iconify/react';
import { Button } from "@/components/ui/button"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import Link from "next/link";

export const columns: ColumnDef<Customer>[] = [
    {
        accessorKey: "firstName",
        header: ({ column }) => {
            return (
                <Button
                    variant="ghost"
                    onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                >
                    First Name
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
    },
    {
        accessorKey: "lastName",
        header: "Last Name",
    },
    {
        accessorKey: "email",
        header: "Email",
    },
    {
        accessorKey: "phone",
        header: "Phone",
    },
    {
        accessorKey: "address",
        header: "Address",
    },
    {
        accessorKey: "city",
        header: "City",
    },
    {
        accessorKey: "state",
        header: "State",
    },
    {
        accessorKey: "zipCode",
        header: "Zip Code",
    },
    {
        accessorKey: "ssn",
        header: "SSN",
    },
    {
        accessorKey: "dateOfBirth",
        header: "Date of Birth",
        cell: ({ row }) => {
            const date = row.getValue("createdAt") as Date;
            return formatDateShort(date);
        }
    },
    {
        accessorKey: "licenseNumber",
        header: "DL Number",
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
            const customer = row.original

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
                        <DropdownMenuItem>
                            <Link href={`/dashboard/customers/${customer.id}`}>
                                View customer
                            </Link>
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            )
        },
    },
]
