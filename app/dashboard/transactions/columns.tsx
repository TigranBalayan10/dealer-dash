"use client"

import { ColumnDef } from "@tanstack/react-table"
import { Transaction, TransactionType, Customer, InventoryItem, FinancialDetails } from "@prisma/client"
import { formatDateShort } from "@/lib/dateFormatter"
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
import { useState } from "react";
import EditTransactionSheet from "@/components/Sheets/EditTransactionSheet";

export const columns: ColumnDef<Transaction & { financialDetails: FinancialDetails | null; customer: Customer | null; inventoryItem: InventoryItem | null }>[] = [
    {
        accessorKey: "customer",
        header: "Customer",
        cell: ({ row }) => {
            const customer = row.getValue("customer") as Customer | null
            if (customer) {
                return (
                    <Link
                        href={`/dashboard/customers/${customer.id}`}
                        className="whitespace-nowrap text-[clamp(0.75rem,2vw,0.875rem)] overflow-hidden text-ellipsis hover:underline"
                    >
                        {customer.firstName} {customer.lastName}
                    </Link>
                );
            }

            return "No customer";
        }

    },
    {
        accessorKey: "inventoryItem",
        header: "Inventory",
        cell: ({ row }) => {
            const inventoryItem = row.getValue("inventoryItem") as InventoryItem | null
            if (inventoryItem) {
                return inventoryItem.year + " " + inventoryItem.make + " " + inventoryItem.model
            }

            return "No item"
        }
    },
    {
        accessorKey: "notes",
        header: "Notes",
        cell: ({ row }) => {
            const notes = row.getValue("notes")
            return notes ? notes : "No notes"
        }
    },
    {
        accessorKey: "type",
        header: "Type",
        cell: ({ row }) => {
            const type = row.getValue("type")
            switch (type) {
                case TransactionType.SALE:
                    return <span className="text-green-500">Sale</span>
                case TransactionType.LEASE:
                    return <span className="text-blue-500">Lease</span>
                case TransactionType.BROKER:
                    return <span className="text-purple-500">Broker</span>
                default:
                    return <span className="text-gray-500">Unknown</span>
            }
        },
    },
    {
        accessorKey: "amount",
        header: "Amount",
        cell: ({ row }) => {
            return (
                <div className="text-left">
                    {new Intl.NumberFormat("en-US", {
                        style: "currency",
                        currency: "USD",
                    }).format(row.original.amount)}
                </div>
            )
        },
    },
    {
        accessorKey: "commission",
        header: "Commission",
    },
    {
        accessorKey: "date",
        header: ({ column }) => {
            return (
                <Button
                    variant="ghost"
                    onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                >
                    Date
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
        cell: ({ row }) => formatDateShort(row.getValue("date") as Date),
    },
    {
        id: "actions",
        cell: ({ row }) => {
            const [isOpen, setIsOpen] = useState(false);
            const transactionItem = row.original;

            return (
                <>
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant="ghost" className="h-8 w-8 p-0">
                                <span className="sr-only">Open menu</span>
                                <Icon icon="mdi:more-horiz" className="h-5 w-5" />
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                            <DropdownMenuLabel>Actions</DropdownMenuLabel>
                            <DropdownMenuItem onSelect={() => setIsOpen(true)}>
                                Edit Transaction
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                    <EditTransactionSheet
                        transactionItem={transactionItem}
                        isOpen={isOpen}
                        onOpenChange={setIsOpen}
                    />
                </>
            )
        },
    },
]
