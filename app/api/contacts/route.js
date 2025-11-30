import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET(request) {
  try {
    console.log('🚀 API Contacts called');
    
    // Pour la démo, utiliser le premier utilisateur
    const testUser = await prisma.user.findFirst();
    
    if (!testUser) {
      console.log('❌ No users found in database');
      return NextResponse.json({ error: 'No users in database' }, { status: 404 });
    }

    console.log('👤 Using test user:', testUser.email, 'Viewed contacts:', testUser.viewedContacts?.length || 0);

    // Vérifier et réinitialiser si nouveau jour
    const today = new Date();
    const lastReset = new Date(testUser.lastViewReset);
    const isNewDay = today.toDateString() !== lastReset.toDateString();

    if (isNewDay) {
      console.log('🔄 Resetting daily views for new day');
      await prisma.user.update({
        where: { id: testUser.id },
        data: {
          dailyContactViews: 0,
          lastViewReset: today,
          viewedContacts: [] // Réinitialiser la liste
        }
      });
    }

    // Récupérer les contacts
    const contacts = await prisma.contacts_contact_rows.findMany({
      include: {
        agency: {
          select: {
            name: true,
            state: true
          }
        }
      },
      orderBy: {
        first_name: 'asc'
      },
      take: 100
    });

    console.log(`✅ Returning ${contacts.length} contacts, views today: ${testUser.dailyContactViews}`);

    return NextResponse.json({
      contacts,
      viewsToday: testUser.dailyContactViews,
      limit: 50,
      hasPremium: testUser.isPremium,
      viewedContacts: testUser.viewedContacts || [] // Retourner la liste des contacts déjà vus
    });

  } catch (error) {
    console.error('❌ Error in contacts API:', error);
    return NextResponse.json(
      { 
        error: 'Failed to fetch contacts',
        details: error.message
      },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}