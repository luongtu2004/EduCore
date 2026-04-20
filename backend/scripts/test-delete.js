const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function testDelete() {
  const id = "69e6637f37f735c40819d572"; // ID from the screenshot (Góc học viên)
  try {
    console.log(`Attempting to delete category: ${id}`);
    
    // Manual cleanup
    const postsDeleted = await prisma.post.deleteMany({
      where: { categoryId: id }
    });
    console.log(`Posts deleted: ${postsDeleted.count}`);

    const result = await prisma.category.delete({
      where: { id }
    });
    console.log('Category deleted successfully:', result);
  } catch (error) {
    console.error('DELETE ERROR:', error);
  } finally {
    await prisma.$disconnect();
  }
}

testDelete();
