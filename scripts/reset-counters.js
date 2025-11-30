const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function resetAllCounters() {
  try {
    console.log('🔄 Resetting all user counters...');
    
    // Réinitialiser tous les compteurs utilisateur à 0
    await prisma.user.updateMany({
      data: {
        dailyContactViews: 0,
        lastViewReset: new Date()
      }
    });

    console.log('✅ All user counters reset to 0');
    
    // Vider la table ContactView si elle existe
    try {
      await prisma.contactView.deleteMany({});
      console.log('✅ ContactView table cleared');
    } catch (error) {
      console.log('ℹ️ ContactView table might not exist or is empty');
    }

  } catch (error) {
    console.error('❌ Error resetting counters:', error);
  } finally {
    await prisma.$disconnect();
  }
}

resetAllCounters();