import { ethers } from "hardhat";

async function main() {
  console.log("✈️ --- DEMONSTRAÇÃO DO SEGURO PARAMÉTRICO DE VOO ---\n");

  const [airline, passenger1, passenger2] = await ethers.getSigners();

  // Parâmetros: Limiar de 2 horas de atraso, Indenização de 1.0 ETH por passageiro
  const thresholdHours = 2;
  const payoutAmount = ethers.parseEther("1.0");

  // 1. Deploy do Contrato
  const Insurance = await ethers.getContractFactory("FlightInsurance");
  const insurance = (await Insurance.deploy(thresholdHours, payoutAmount)) as any;
  await insurance.waitForDeployment();
  const contractAddress = await insurance.getAddress();
  console.log(`✅ Smart Contract implantado em: ${contractAddress}`);

  // 2. Escrow: Companhia Aérea deposita 5.0 ETH no cofre
  const depositTx = await insurance.connect(airline).depositEscrow({ value: ethers.parseEther("5.0") });
  await depositTx.wait();
  console.log(`💰 Escrow ativado: Companhia Aérea depositou 5.0 ETH de garantia.\n`);

  // 3. Passageiros compram seguro para o voo LA8100
  const flightId = "LA8100";
  
  const buyTx1 = await insurance.connect(passenger1).buyInsurance(flightId);
  await buyTx1.wait();
  console.log(`🎟️ Passageiro 1 (${passenger1.address}) adquiriu seguro para o voo ${flightId}`);

  const buyTx2 = await insurance.connect(passenger2).buyInsurance(flightId);
  await buyTx2.wait();
  console.log(`🎟️ Passageiro 2 (${passenger2.address}) adquiriu seguro para o voo ${flightId}`);

  // Saldo dos passageiros antes da indenização
  const bal1Before = await ethers.provider.getBalance(passenger1.address);
  const bal2Before = await ethers.provider.getBalance(passenger2.address);

  // 4. Oráculo detecta e reporta atraso de 3 horas (3 >= 2)
  console.log(`\n⏱️ [ORÁCULO] Detectado atraso de 3 horas no voo ${flightId} (Limiar contratual: ${thresholdHours}h)...`);
  const delayTx = await insurance.reportDelay(flightId, 3);
  await delayTx.wait();

  // Saldo dos passageiros depois do disparo paramétrico
  const bal1After = await ethers.provider.getBalance(passenger1.address);
  const bal2After = await ethers.provider.getBalance(passenger2.address);

  console.log("\n🏁 --- RESULTADO DA EXECUÇÃO PARAMÉTRICA ---");
  console.log(`✅ Termo de Quitação Registrado On-Chain: Voo ${flightId}`);
  console.log(`💵 Indenização recebida pelo Passageiro 1: +${ethers.formatEther(bal1After - bal1Before)} ETH`);
  console.log(`💵 Indenização recebida pelo Passageiro 2: +${ethers.formatEther(bal2After - bal2Before)} ETH\n`);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});