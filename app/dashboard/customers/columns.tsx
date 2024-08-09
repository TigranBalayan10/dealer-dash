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
                    Name
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
            const customer = row.original
            return (
                <Link
                    href={`/dashboard/customers/${customer.id}`}
                    className="whitespace-nowrap text-[clamp(0.75rem,2vw,0.875rem)] overflow-hidden text-ellipsis hover:underline"
                >
                    {customer.firstName} {customer.lastName}
                </Link>
            );
        }
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
        cell: ({ row }) => {
            const customer = row.original
            return (
                <p>{customer.address}<br />{customer.city}, {customer.state} {customer.zipCode}</p>
            )
        }
    },
    {
        accessorKey: "ssn",
        header: "SSN",
    },
    {
        accessorKey: "dateOfBirth",
        header: "DOB",
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
