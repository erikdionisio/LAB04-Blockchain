import { ethers } from "hardhat";

async function main() {
  console.log("✈️ --- PREPARANDO O AMBIENTE ACORDOINSTANT ---");

  const [airline] = await ethers.getSigners();
  const thresholdHours = 2; // Voo atrasou 2 horas ou mais? Paga!
  const payoutAmount = ethers.parseEther("1.0");

  // 1. Implanta o Contrato
  const Insurance = await ethers.getContractFactory("FlightInsurance");
  const insurance = await Insurance.deploy(thresholdHours, payoutAmount);
  await insurance.waitForDeployment();
  const contractAddress = await insurance.getAddress();
  
  console.log(`✅ Contrato implantado em: ${contractAddress}`);

  // 2. Faz o depósito em Escrow (5 ETH) para ter dinheiro para pagar o seguro
  // Tipagem do contrato é BaseContract; fazer cast para any para acessar métodos específicos do contrato
  const depositTx = await (insurance as any).connect(airline).depositEscrow({ value: ethers.parseEther("5.0") });
  await depositTx.wait();
  
  console.log(`💰 Cofre Escrow abastecido com 5.0 ETH pela companhia aérea.`);
  console.log(`\n🚀 Tudo pronto! Agora vá para o Frontend (index.html) testar a aplicação no navegador.`);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});