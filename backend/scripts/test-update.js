const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  const questions = await prisma.quizQuestion.findMany({ take: 1 });
  if (questions.length === 0) {
    console.log("No questions found to test update.");
    return;
  }
  
  const id = questions[0].id;
  console.log(`Testing update for ID: ${id}`);
  
  try {
    const updated = await prisma.quizQuestion.update({
      where: { id },
      data: { text: questions[0].text + " (Updated)" }
    });
    console.log("Update Success!");
  } catch (error) {
    console.error("Update Failed:", error.message);
  } finally {
    await prisma.$disconnect();
  }
}

main();
