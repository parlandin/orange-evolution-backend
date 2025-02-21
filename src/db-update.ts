import { PrismaClient } from "@prisma/client";
import { hash } from "bcrypt";
import crypto, { randomBytes } from "crypto";

const prisma = new PrismaClient();

async function generatePasswordHash(password: string): Promise<string> {
  return await hash(password, 8);
}

function generateRandomName(index: number): string {
  const firstNames = [
    "Alice",
    "Benjamin",
    "Charlotte",
    "Daniel",
    "Eleanor",
    "Felipe",
    "Gabriella",
    "Henry",
    "Isabella",
    "Jonathan",
  ];
  const lastNames = [
    "Anderson",
    "Bennett",
    "Carter",
    "Dawson",
    "Evans",
    "Fitzgerald",
    "Gomez",
    "Henderson",
    "Irwin",
    "Jefferson",
  ];
  return `${firstNames[index % firstNames.length]} ${
    lastNames[index % lastNames.length]
  }`;
}

async function main() {
  console.log("Populating database...");

  // Criando trilhas detalhadas
  await prisma.trails.createMany({
    data: [
      {
        name: "UX/UI Design",
        hours: 50,
        description:
          "Aprofunde-se nos princípios de design centrado no usuário, wireframing e prototipação para criar interfaces intuitivas e acessíveis.",
        icon: "https://i.imgur.com/5LaCgb8.png",
      },
      {
        name: "Ciência de Dados",
        hours: 60,
        description:
          "Aprenda a coletar, limpar, analisar e visualizar dados para gerar insights estratégicos em diferentes áreas do mercado.",
        icon: "https://i.imgur.com/nqrgo8j.png",
      },
      {
        name: "Desenvolvimento FullStack",
        hours: 70,
        description:
          "Domine as tecnologias essenciais para construir aplicações web modernas, do front-end ao back-end.",
        icon: "https://i.imgur.com/LFzC0Z2.png",
      },
    ],
  });

  // Criando categorias
  await prisma.category.createMany({
    data: [
      { name: "Design e Experiência do Usuário" },
      { name: "Lógica de Programação" },
      { name: "Banco de Dados e Análise" },
      { name: "Front-end e UI Development" },
      { name: "Back-end e Arquitetura de Software" },
    ],
  });

  const categoryList = await prisma.category.findMany();
  const trailList = await prisma.trails.findMany();
  const avatars = [
    "Emery",
    "Jack",
    "George",
    "Eliza",
    "Aidan",
    "Eden",
    "Brooklynn",
    "Brian",
    "Chase",
    "Caleb",
    "Christian",
    "Destiny",
    "Amaya",
    "Aiden",
    "Avery",
  ];

  // Criando conteúdos detalhados para cada trilha
  for (const trail of trailList) {
    await prisma.contents.createMany({
      data: Array.from({ length: 15 }, (_, i) => ({
        title: `Módulo ${i + 1}: Fundamentos de ${trail.name}`,
        description: `Este módulo cobre os conceitos essenciais de ${trail.name}, incluindo as melhores práticas, ferramentas e metodologias utilizadas pelos profissionais da área.`,
        link: "https://tech.orangejuice.com.br/orangeapp",
        type: "Curso",
        trail_id: trail.id,
        category_id: categoryList[i % categoryList.length].id,
      })),
    });
  }

  // Criando usuários
  for (let i = 0; i < 20; i++) {
    const name = generateRandomName(i);
    const avatar = avatars[i % avatars.length];
    const passwordHash = await generatePasswordHash("123456");

    await prisma.users.create({
      data: {
        id: crypto.randomUUID(),
        name,
        email: `usuario${i + 1}@exemplo.com`,
        password: passwordHash,
        role: "USER",
        picture: `https://api.dicebear.com/9.x/notionists-neutral/svg?seed=${avatar}&randomizeIds=true`,
      },
    });
  }

  console.log("Database populated successfully!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
