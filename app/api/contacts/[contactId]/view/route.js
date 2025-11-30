import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function POST(request, { params }) {
  try {
    const { contactId } = await params;
    
    console.log('👀 API: Tracking view for contact:', contactId);

    // Pour la démo, utiliser le premier utilisateur
    const testUser = await prisma.user.findFirst();
    
    if (!testUser) {
      console.log('❌ API: No user found');
      return NextResponse.json({ error: 'No user found' }, { status: 404 });
    }

    console.log('👤 API: Using user:', testUser.id, testUser.email);

    // Vérifier si le contact existe
    const contact = await prisma.contacts_contact_rows.findUnique({
      where: { id: contactId }
    });

    if (!contact) {
      console.log('❌ API: Contact not found:', contactId);
      return NextResponse.json({ error: 'Contact not found' }, { status: 404 });
    }

    console.log('✅ API: Contact found:', contact.first_name, contact.last_name);

    // Vérifier et réinitialiser si nouveau jour
    const today = new Date();
    const lastReset = new Date(testUser.lastViewReset);
    const isNewDay = today.toDateString() !== lastReset.toDateString();

    if (isNewDay) {
      console.log('🔄 API: Resetting daily views for new day');
      await prisma.user.update({
        where: { id: testUser.id },
        data: {
          dailyContactViews: 0,
          lastViewReset: today,
          viewedContacts: [] // Réinitialiser la liste des contacts vus
        }
      });
    }

    // Vérifier si l'utilisateur a DÉJÀ vu ce contact aujourd'hui
    const alreadyViewed = testUser.viewedContacts.includes(contactId);
    
    console.log('📊 API: Current views:', testUser.dailyContactViews, 'Already viewed:', alreadyViewed);

    if (alreadyViewed) {
      console.log('ℹ️ API: Contact already viewed today, not counting');
      return NextResponse.json({
        success: true,
        viewsToday: testUser.dailyContactViews,
        limit: 50,
        alreadyViewed: true,
        isNewView: false
      });
    }

    // Vérifier la limite (seulement pour les nouvelles vues)
    if (testUser.dailyContactViews >= 50 && !testUser.isPremium) {
      console.log('⛔ API: Limit reached');
      return NextResponse.json({
        error: 'LIMIT_REACHED',
        message: 'Limite quotidienne atteinte',
        viewsToday: testUser.dailyContactViews
      }, { status: 429 });
    }

    // Incrémenter le compteur et ajouter le contact à la liste des vus
    const updatedUser = await prisma.user.update({
      where: { id: testUser.id },
      data: {
        dailyContactViews: {
          increment: 1
        },
        viewedContacts: {
          push: contactId // Ajouter l'ID du contact à la liste
        }
      }
    });

    console.log('✅ API: View tracked. Total views today:', updatedUser.dailyContactViews, 'Viewed contacts:', updatedUser.viewedContacts.length);

    return NextResponse.json({
      success: true,
      viewsToday: updatedUser.dailyContactViews,
      limit: 50,
      alreadyViewed: false,
      isNewView: true
    });

  } catch (error) {
    console.error('❌ API: Error tracking contact view:', error);
    return NextResponse.json(
      { 
        error: 'Failed to track contact view',
        details: error.message
      },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}