import { PrismaClient, Age, Size } from "@generated/prisma/client.js";
import { hash } from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  console.log("Iniciando seed...");

  await prisma.petImage.deleteMany();
  await prisma.pet.deleteMany();
  await prisma.org.deleteMany();

  const defaultPassword = await hash("senha123", 6);

  const orgs = await Promise.all([
    prisma.org.create({
      data: {
        name: "ONG Patinhas de Icapuí",
        email: "contato@patinhasicapui.org",
        password_hash: defaultPassword,
        whatsapp: "88999990001",
        city: "Icapuí",
        state: "CE",
      },
    }),
    prisma.org.create({
      data: {
        name: "Abrigo Amigo Fiel Fortaleza",
        email: "contato@amigofielfortaleza.org",
        password_hash: defaultPassword,
        whatsapp: "85999990002",
        city: "Fortaleza",
        state: "CE",
      },
    }),
    prisma.org.create({
      data: {
        name: "ONG Focinhos de Russas",
        email: "contato@focinhosrussas.org",
        password_hash: defaultPassword,
        whatsapp: "88999990003",
        city: "Russas",
        state: "CE",
      },
    }),
  ]);

  const [icapui, fortaleza, russas] = orgs;

  const petsData: {
    name: string;
    description: string;
    age: Age;
    size: Size;
    org_id: string;
  }[] = [
    // Icapuí (6 pets)
    {
      name: "Mel",
      description: "Cadela dócil e brincalhona, adora praia e crianças.",
      age: Age.FILHOTE,
      size: Size.PEQUENO,
      org_id: icapui.id,
    },
    {
      name: "Thor",
      description: "Cachorro forte e protetor, ótimo com outros animais.",
      age: Age.ADULTO,
      size: Size.GRANDE,
      org_id: icapui.id,
    },
    {
      name: "Nina",
      description: "Gata calma e independente, gosta de janelas ensolaradas.",
      age: Age.ADULTO,
      size: Size.PEQUENO,
      org_id: icapui.id,
    },
    {
      name: "Bidu",
      description: "Idoso tranquilo, já castrado e vacinado.",
      age: Age.IDOSO,
      size: Size.MEDIO,
      org_id: icapui.id,
    },
    {
      name: "Luna",
      description: "Filhote muito ativa, precisa de espaço para correr.",
      age: Age.FILHOTE,
      size: Size.MEDIO,
      org_id: icapui.id,
    },
    {
      name: "Max",
      description: "Cão de porte médio, obediente e já sabe alguns comandos.",
      age: Age.ADULTO,
      size: Size.MEDIO,
      org_id: icapui.id,
    },

    // Fortaleza (6 pets)
    {
      name: "Amora",
      description: "Gatinha filhote, muito sociável com outros gatos.",
      age: Age.FILHOTE,
      size: Size.PEQUENO,
      org_id: fortaleza.id,
    },
    {
      name: "Rex",
      description: "Cachorro brincalhão e carinhoso, adora crianças.",
      age: Age.ADULTO,
      size: Size.GRANDE,
      org_id: fortaleza.id,
    },
    {
      name: "Bella",
      description: "Cadela dócil, resgatada e já totalmente recuperada.",
      age: Age.ADULTO,
      size: Size.MEDIO,
      org_id: fortaleza.id,
    },
    {
      name: "Simba",
      description: "Gato idoso, tranquilo, ideal para apartamento.",
      age: Age.IDOSO,
      size: Size.PEQUENO,
      org_id: fortaleza.id,
    },
    {
      name: "Duque",
      description: "Filhote enérgico, adora brincar com bola.",
      age: Age.FILHOTE,
      size: Size.GRANDE,
      org_id: fortaleza.id,
    },
    {
      name: "Mia",
      description: "Gata adulta, carinhosa e gosta de colo.",
      age: Age.ADULTO,
      size: Size.PEQUENO,
      org_id: fortaleza.id,
    },

    // Russas (6 pets)
    {
      name: "Zeca",
      description: "Cachorro adulto, muito leal e ótimo guarda-costas.",
      age: Age.ADULTO,
      size: Size.GRANDE,
      org_id: russas.id,
    },
    {
      name: "Fofa",
      description: "Filhote pequena, ainda em fase de socialização.",
      age: Age.FILHOTE,
      size: Size.PEQUENO,
      org_id: russas.id,
    },
    {
      name: "Toby",
      description: "Cão idoso, calmo, já castrado.",
      age: Age.IDOSO,
      size: Size.MEDIO,
      org_id: russas.id,
    },
    {
      name: "Pandora",
      description: "Gata adulta, independente mas afetuosa com a família.",
      age: Age.ADULTO,
      size: Size.PEQUENO,
      org_id: russas.id,
    },
    {
      name: "Bob",
      description: "Filhote médio, muito curioso e brincalhão.",
      age: Age.FILHOTE,
      size: Size.MEDIO,
      org_id: russas.id,
    },
    {
      name: "Sansão",
      description:
        "Cachorro grande, dócil apesar do tamanho, ótimo com crianças.",
      age: Age.ADULTO,
      size: Size.GRANDE,
      org_id: russas.id,
    },
  ];

  for (const pet of petsData) {
    await prisma.pet.create({ data: pet });
  }

  console.log(
    `Seed concluído: ${orgs.length} orgs e ${petsData.length} pets criados.`,
  );
}

main()
  .catch((e) => {
    console.error("Erro no seed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
