import { ethers } from "hardhat";

async function main() {
  console.log("✈️ Iniciando Simulação do Seguro Paramétrico...\n");

  // Pegamos as contas padrão do Hardhat (que sempre existem e sempre têm saldo)
  const [airline, passenger] = await ethers.getSigners();

  // 1. Deploy do Contrato (Limiar: 2 horas, Pagamento: 1 ETH)
  const payoutAmount = ethers.parseEther("1.0");
  const Insurance = await ethers.getContractFactory("FlightInsurance");
  const insurance = await Insurance.deploy(2, payoutAmount) as any;
  await insurance.waitForDeployment();
  
  console.log(`✅ Contrato implantado em: ${await insurance.getAddress()}`);

  // 2. Depósito do Escrow
  const depositTx = await insurance.connect(airline).depositEscrow({ value: ethers.parseEther("5.0") });
  await depositTx.wait();
  console.log("💰 Escrow depositado pela companhia aérea (5.0 ETH).");

  // 3. Compra do Seguro
  const flightId = "LA8100";
  const buyTx = await insurance.connect(passenger).buyInsurance(flightId);
  await buyTx.wait();
  console.log(`🎟️ Seguro registrado para o voo ${flightId} pelo passageiro: ${passenger.address}`);

  // 4. Captura do saldo
  const balanceBefore = await ethers.provider.getBalance(passenger.address);
  
  // 5. Oráculo Simulando Atraso
  console.log(`⏱️ Oráculo simulado reportando atraso de 3 horas para o voo ${flightId}...`);
  const delayTx = await insurance.reportDelay(flightId, 3);
  await delayTx.wait();

  // 6. Verificação Final
  const balanceAfter = await ethers.provider.getBalance(passenger.address);
  const difference = ethers.formatEther(balanceAfter - balanceBefore);
  
  console.log(`🏁 Pagamento executado! O saldo do passageiro aumentou em exatamente ${difference} ETH.\n`);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});