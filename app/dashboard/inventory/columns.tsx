"use client"

import { ColumnDef } from "@tanstack/react-table"
import { InventoryItem, Status } from "@prisma/client"
import { formatDate } from "@/lib/dateFormatter"


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
        header: "Price",
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
]
