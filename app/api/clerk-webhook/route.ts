import { Webhook } from "svix";
import { WebhookEvent } from "@clerk/nextjs/server";
import { headers } from "next/headers";
import prisma from "@/lib/prisma";

export async function POST(req: Request) {
  // Get the webhook secret from your environment variables
  const WEBHOOK_SECRET = process.env.CLERK_WEBHOOK_SECRET;

  if (!WEBHOOK_SECRET) {
    throw new Error(
      "Please add CLERK_WEBHOOK_SECRET from Clerk Dashboard to .env or .env.local"
    );
  }

  // Get the headers
  const headerPayload = headers();
  const svix_id = headerPayload.get("svix-id");
  const svix_timestamp = headerPayload.get("svix-timestamp");
  const svix_signature = headerPayload.get("svix-signature");

  // If there are no headers, error out
  if (!svix_id || !svix_timestamp || !svix_signature) {
    return new Response("Error occured -- no svix headers", {
      status: 400,
    });
  }

  // Get the body
  const payload = await req.json();
  const body = JSON.stringify(payload);

  // Create a new Svix instance with your secret.
  const wh = new Webhook(WEBHOOK_SECRET);

  let evt: WebhookEvent;
  console.log("Received webhook:", body);

  // Verify the payload with the headers
  try {
    evt = wh.verify(body, {
      "svix-id": svix_id,
      "svix-timestamp": svix_timestamp,
      "svix-signature": svix_signature,
    }) as WebhookEvent;
  } catch (err) {
    console.error("Error verifying webhook:", err);
    return new Response("Error occured", {
      status: 400,
    });
  }

  // Handle the webhook
  try {
    const { type } = evt;
    const eventData = evt.data;

    switch (type) {
      case "user.created":
        if ("email_addresses" in eventData) {
          await prisma.user.create({
            data: {
              clerkId: eventData.id,
              firstName: eventData.first_name ?? "",
              lastName: eventData.last_name ?? "",
              email: eventData.email_addresses[0]?.email_address ?? "",
              phone: eventData.phone_numbers?.[0]?.phone_number ?? "",
            },
          });
        }
        break;
      case "user.updated":
        if ("id" in eventData && "email_addresses" in eventData) {
          const userId = eventData.id;
          const firstName = (eventData as any).first_name ?? "";
          const lastName = (eventData as any).last_name ?? "";
          const email = eventData.email_addresses[0]?.email_address ?? "";
          const phone =
            (eventData as any).phone_numbers?.[0]?.phone_number ?? "";
          await prisma.user.upsert({
            where: { clerkId: userId },
            update: {
              firstName,
              lastName,
              email,
              phone,
            },
            create: {
              clerkId: userId,
              firstName,
              lastName,
              email,
              phone,
            },
          });
        }
        break;

      // Add more cases for other event types as needed

      default:
        console.log(`Unhandled event type: ${type}`);
    }

    return new Response("Success", { status: 200 });
  } catch (error) {
    console.error("Error processing webhook:", error);
    return new Response("Error processing webhook", { status: 500 });
  }
}
