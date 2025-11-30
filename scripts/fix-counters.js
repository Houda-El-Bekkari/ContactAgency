// scripts/fix-duplicate-views.js
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function fixDuplicateViews() {
  try {
    console.log('🔄 Fixing duplicate views and counters...');
    
    const users = await prisma.user.findMany();
    
    for (const user of users) {
      const startOfDay = new Date();
      startOfDay.setHours(0, 0, 0, 0);
      
      try {
        // Compter les vues uniques d'aujourd'hui
        const uniqueViewsToday = await prisma.contactView.count({
          where: {
            userId: user.id,
            viewedAt: {
              gte: startOfDay
            }
          },
          distinct: ['contactId']
        });
        
        // Mettre à jour le compteur utilisateur avec la valeur correcte
        await prisma.user.update({
          where: { id: user.id },
          data: {
            dailyContactViews: uniqueViewsToday
          }
        });
        
        console.log(`✅ User ${user.id}: ${uniqueViewsToday} unique views today (was ${user.dailyContactViews})`);
        
      } catch (error) {
        console.log(`⚠️ Error for user ${user.id}:`, error.message);
      }
    }
    
    console.log('✅ All duplicate views fixed!');
    
  } catch (error) {
    console.error('❌ Error fixing duplicate views:', error);
  } finally {
    await prisma.$disconnect();
  }
}

fixDuplicateViews();