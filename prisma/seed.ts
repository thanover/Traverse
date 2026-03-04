import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  // Clear existing data
  await prisma.integration.deleteMany();
  await prisma.flow.deleteMany();
  await prisma.environment.deleteMany();
  await prisma.system.deleteMany();
  await prisma.stage.deleteMany();

  // Stages
  const stages = await Promise.all([
    prisma.stage.create({ data: { id: "dev", label: "Dev", color: "#818cf8" } }),
    prisma.stage.create({ data: { id: "test", label: "Test", color: "#38bdf8" } }),
    prisma.stage.create({ data: { id: "mo", label: "MO", color: "#fbbf24" } }),
    prisma.stage.create({ data: { id: "prod", label: "Prod", color: "#34d399" } }),
  ]);

  // Systems
  const sys1 = await prisma.system.create({
    data: { id: "sys1", name: "Policy Admin", subtitle: "Core policy mgmt", order: 0 },
  });
  const sys2 = await prisma.system.create({
    data: { id: "sys2", name: "Rating Engine", subtitle: "Premium calculation", order: 1 },
  });
  const sys3 = await prisma.system.create({
    data: { id: "sys3", name: "Doc Generator", subtitle: "Document output", order: 2 },
  });
  const sys4 = await prisma.system.create({
    data: { id: "sys4", name: "Underwriting", subtitle: "Risk assessment", order: 3 },
  });

  // Environments
  const envs = await Promise.all([
    // Policy Admin
    prisma.environment.create({ data: { id: "sys1-dev", label: "DEV", systemId: "sys1", stageId: "dev" } }),
    prisma.environment.create({ data: { id: "sys1-uat", label: "UAT", systemId: "sys1", stageId: "test" } }),
    prisma.environment.create({ data: { id: "sys1-mo", label: "MO", systemId: "sys1", stageId: "mo" } }),
    prisma.environment.create({ data: { id: "sys1-prod", label: "PROD", systemId: "sys1", stageId: "prod" } }),
    // Rating Engine
    prisma.environment.create({ data: { id: "sys2-dev", label: "DEV", systemId: "sys2", stageId: "dev" } }),
    prisma.environment.create({ data: { id: "sys2-test", label: "TEST", systemId: "sys2", stageId: "test" } }),
    prisma.environment.create({ data: { id: "sys2-uat", label: "UAT", systemId: "sys2", stageId: "test" } }),
    prisma.environment.create({ data: { id: "sys2-mo", label: "MO", systemId: "sys2", stageId: "mo" } }),
    prisma.environment.create({ data: { id: "sys2-prod", label: "PROD", systemId: "sys2", stageId: "prod" } }),
    // Doc Generator
    prisma.environment.create({ data: { id: "sys3-dev", label: "DEV", systemId: "sys3", stageId: "dev" } }),
    prisma.environment.create({ data: { id: "sys3-uat", label: "UAT", systemId: "sys3", stageId: "test" } }),
    prisma.environment.create({ data: { id: "sys3-mo", label: "MO", systemId: "sys3", stageId: "mo" } }),
    prisma.environment.create({ data: { id: "sys3-prod", label: "PROD", systemId: "sys3", stageId: "prod" } }),
    // Underwriting
    prisma.environment.create({ data: { id: "sys4-dev", label: "DEV", systemId: "sys4", stageId: "dev" } }),
    prisma.environment.create({ data: { id: "sys4-test", label: "TEST", systemId: "sys4", stageId: "test" } }),
    prisma.environment.create({ data: { id: "sys4-uat", label: "UAT", systemId: "sys4", stageId: "test" } }),
    prisma.environment.create({ data: { id: "sys4-mo", label: "MO", systemId: "sys4", stageId: "mo" } }),
    prisma.environment.create({ data: { id: "sys4-prod", label: "PROD", systemId: "sys4", stageId: "prod" } }),
  ]);

  // Flows
  const quoteHome = await prisma.flow.create({
    data: { id: "quote-home", label: "Quoting Homeowners", icon: "🏠", color: "#818cf8", systemIds: ["sys1", "sys2", "sys3"] },
  });
  const quoteAuto = await prisma.flow.create({
    data: { id: "quote-auto", label: "Quoting Auto", icon: "🚗", color: "#38bdf8", systemIds: ["sys1", "sys2", "sys3"] },
  });
  const uwAuto = await prisma.flow.create({
    data: { id: "uw-auto", label: "Underwriting Auto", icon: "📋", color: "#fbbf24", systemIds: ["sys1", "sys4", "sys2"] },
  });

  // Integrations
  const integrationData = [
    { fromId: "sys1-dev", toId: "sys2-test", flowIds: ["quote-home", "quote-auto"] },
    { fromId: "sys2-test", toId: "sys3-dev", flowIds: ["quote-home", "quote-auto"] },
    { fromId: "sys1-dev", toId: "sys4-test", flowIds: ["uw-auto"] },
    { fromId: "sys4-test", toId: "sys2-test", flowIds: ["uw-auto"] },
    { fromId: "sys1-uat", toId: "sys2-uat", flowIds: ["quote-home", "quote-auto"] },
    { fromId: "sys2-uat", toId: "sys3-uat", flowIds: ["quote-home"] },
    { fromId: "sys1-uat", toId: "sys4-uat", flowIds: ["uw-auto"] },
    { fromId: "sys4-uat", toId: "sys2-uat", flowIds: ["uw-auto"] },
    { fromId: "sys1-prod", toId: "sys2-prod", flowIds: ["quote-home", "quote-auto", "uw-auto"] },
    { fromId: "sys2-prod", toId: "sys3-prod", flowIds: ["quote-home", "quote-auto"] },
    { fromId: "sys1-prod", toId: "sys4-prod", flowIds: ["uw-auto"] },
    { fromId: "sys4-prod", toId: "sys2-prod", flowIds: ["uw-auto"] },
    { fromId: "sys1-mo", toId: "sys2-mo", flowIds: ["quote-home", "quote-auto"] },
    { fromId: "sys2-mo", toId: "sys3-mo", flowIds: ["quote-home"] },
  ];

  for (const { fromId, toId, flowIds } of integrationData) {
    await prisma.integration.create({
      data: {
        fromId,
        toId,
        flows: {
          connect: flowIds.map((id) => ({ id })),
        },
      },
    });
  }

  const integrationCount = await prisma.integration.count();
  const envCount = await prisma.environment.count();
  const systemCount = await prisma.system.count();
  const flowCount = await prisma.flow.count();

  console.log(`Seeded: ${systemCount} systems, ${envCount} environments, ${flowCount} flows, ${integrationCount} integrations`);
}

main()
  .then(() => prisma.$disconnect())
  .catch((e) => {
    console.error(e);
    prisma.$disconnect();
    process.exit(1);
  });
