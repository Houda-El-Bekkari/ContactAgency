import { Webhook } from 'svix';
import { headers } from 'next/headers';
import { prisma } from '../../../../lib/prisma';

export async function POST(req) {
  const WEBHOOK_SECRET = process.env.CLERK_WEBHOOK_SECRET;

  if (!WEBHOOK_SECRET) {
    return new Response('Error: CLERK_WEBHOOK_SECRET is missing', {
      status: 500
    });
  }

  // Get the headers
  const headerPayload = await headers();
  const svix_id = headerPayload.get("svix-id");
  const svix_timestamp = headerPayload.get("svix-timestamp");
  const svix_signature = headerPayload.get("svix-signature");

  // If there are no headers, error out
  if (!svix_id || !svix_timestamp || !svix_signature) {
    return new Response('Error: No svix headers', {
      status: 400
    });
  }

  // Get the body
  const payload = await req.json();
  const body = JSON.stringify(payload);

  // Create a new Svix instance with your secret.
  const wh = new Webhook(WEBHOOK_SECRET);

  let evt;

  // Verify the payload with the headers
  try {
    evt = wh.verify(body, {
      "svix-id": svix_id,
      "svix-timestamp": svix_timestamp,
      "svix-signature": svix_signature,
    });
  } catch (err) {
    console.error('Error verifying webhook:', err);
    return new Response('Error verifying webhook', {
      status: 400
    });
  }

  // Handle the webhook
  const eventType = evt.type;

  try {
    if (eventType === 'user.created') {
      const { id, email_addresses, first_name, last_name } = evt.data;

      // Créer l'utilisateur dans votre base de données
      await prisma.user.create({
        data: {
          clerkUserId: id,
          email: email_addresses[0].email_address,
          firstName: first_name,
          lastName: last_name,
          dailyContactViews: 0,
          lastViewReset: new Date(),
          isPremium: false,
        },
      });

      console.log(`✅ User ${id} created in database`);
    }

    if (eventType === 'user.updated') {
      const { id, email_addresses, first_name, last_name } = evt.data;

      // Mettre à jour l'utilisateur dans votre base de données
      await prisma.user.update({
        where: { clerkUserId: id },
        data: {
          email: email_addresses[0].email_address,
          firstName: first_name,
          lastName: last_name,
        },
      });

      console.log(`✅ User ${id} updated in database`);
    }

    if (eventType === 'user.deleted') {
      const { id } = evt.data;

      // Supprimer l'utilisateur de votre base de données
      await prisma.user.delete({
        where: { clerkUserId: id },
      });

      console.log(`✅ User ${id} deleted from database`);
    }

    return new Response('Webhook processed successfully', { status: 200 });
  } catch (error) {
    console.error('❌ Error processing webhook:', error);
    return new Response('Error processing webhook', { status: 500 });
  }
}