import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function POST(request) {
  try {
    const { userId } = await request.json();

    if (!userId) {
      return NextResponse.json({ error: 'User ID is required' }, { status: 400 });
    }

    console.log(`🔄 Syncing user: ${userId}`);

    // Récupérer les informations utilisateur depuis Clerk
    const clerkResponse = await fetch(`https://api.clerk.com/v1/users/${userId}`, {
      headers: {
        Authorization: `Bearer ${process.env.CLERK_SECRET_KEY}`,
        'Content-Type': 'application/json',
      },
    });

    if (!clerkResponse.ok) {
      const errorText = await clerkResponse.text();
      console.error('Clerk API error:', errorText);
      
      // Si Clerk ne répond pas, créer un utilisateur avec des données basiques
      console.log('⚠️ Using fallback user creation');
      return await createFallbackUser(userId);
    }

    const clerkUser = await clerkResponse.json();
    console.log('📧 Clerk user data:', {
      id: clerkUser.id,
      email: clerkUser.email_addresses?.[0]?.email_address,
      firstName: clerkUser.first_name,
      lastName: clerkUser.last_name
    });

    // Vérifier que nous avons les données nécessaires
    if (!clerkUser.email_addresses || clerkUser.email_addresses.length === 0) {
      console.log('⚠️ No email found in Clerk data, using fallback');
      return await createFallbackUser(userId);
    }

    const userEmail = clerkUser.email_addresses[0].email_address;
    const userFirstName = clerkUser.first_name || '';
    const userLastName = clerkUser.last_name || '';

    // Vérifier si l'utilisateur existe déjà
    const existingUser = await prisma.user.findUnique({
      where: { clerkUserId: userId }
    });

    if (existingUser) {
      console.log(`✅ User already exists: ${existingUser.email}`);
      
      // Mettre à jour les informations si elles ont changé
      if (existingUser.email !== userEmail || 
          existingUser.firstName !== userFirstName || 
          existingUser.lastName !== userLastName) {
        
        console.log('🔄 Updating user information');
        const updatedUser = await prisma.user.update({
          where: { clerkUserId: userId },
          data: {
            email: userEmail,
            firstName: userFirstName,
            lastName: userLastName,
            updatedAt: new Date(),
          }
        });
        return NextResponse.json(updatedUser);
      }
      
      return NextResponse.json(existingUser);
    }

    // Créer un nouvel utilisateur avec les vraies données de Clerk
    const newUser = await prisma.user.create({
      data: {
        clerkUserId: userId,
        email: userEmail,
        firstName: userFirstName,
        lastName: userLastName,
        dailyContactViews: 0,
        lastViewReset: new Date(),
        isPremium: false,
        viewedContacts: []
      }
    });

    console.log(`✅ New user created with real data: ${newUser.email} - ${newUser.firstName} ${newUser.lastName}`);

    return NextResponse.json(newUser);

  } catch (error) {
    console.error('❌ Error syncing user:', error);
    return NextResponse.json(
      { 
        error: 'Failed to sync user', 
        details: error.message
      },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}

// Fonction de secours si Clerk n'est pas disponible
async function createFallbackUser(userId) {
  const prisma = new PrismaClient();
  
  try {
    // Vérifier si l'utilisateur existe déjà
    const existingUser = await prisma.user.findUnique({
      where: { clerkUserId: userId }
    });

    if (existingUser) {
      return NextResponse.json(existingUser);
    }

    // Créer un utilisateur avec des données basiques
    const newUser = await prisma.user.create({
      data: {
        clerkUserId: userId,
        email: `user-${userId}@example.com`,
        firstName: 'Utilisateur',
        lastName: 'Clerk',
        dailyContactViews: 0,
        lastViewReset: new Date(),
        isPremium: false,
        viewedContacts: []
      }
    });

    console.log(`✅ Fallback user created: ${newUser.email}`);
    return NextResponse.json(newUser);
    
  } finally {
    await prisma.$disconnect();
  }
}