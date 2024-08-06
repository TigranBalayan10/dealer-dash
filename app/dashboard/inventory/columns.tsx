"use client"

import { ColumnDef } from "@tanstack/react-table"
import { InventoryItem } from "@prisma/client"


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
    },
    {
        accessorKey: "description",
        header: "Description",
    },
    {
        accessorKey: "status",
        header: "Status",
    },
    {
        accessorKey: "vin",
        header: "VIN",
    },
    {
        accessorKey: "createdAt",
        header: "Created At",
    },
]
