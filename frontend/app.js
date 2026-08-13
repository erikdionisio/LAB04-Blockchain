const contractABI = [
    "function buyInsurance(string flightNumber) external",
    "function reportDelay(string flightNumber, uint256 delayHours) external",
    "function isFlightSettled(string) view returns (bool)",
    "function hasInsurance(string, address) view returns (bool)"
];

// Chave da Companhia/Oráculo (Conta 1 do TJPB)
const oracleKey = "0x8f2a55949038a9610f50fb23b5883af3b4ecb3c3bb792cbcefbd1542c692be63";

// Chaves dos Passageiros (Contas 2 e 3 do TJPB)
const passengerKeys = [
    "0xc87509a1c067bbde78beb793e6fa76530b6382a4c0241e5e4a9ec0a0f44dc0d3", // Passageiro 1
    "0xae6ae8e5ccbfb04590405997ee2d52d2b330726137b875053c36d94e974d162f"  // Passageiro 2
];

function getContract(privateKey) {
    const address = document.getElementById('contractAddress').value.trim();
    if(!address) { 
        alert("Cole o endereço do contrato no topo da página!"); 
        return null; 
    }
    // Conecta à rede Besu no Docker rodando na porta 8545
    const provider = new ethers.JsonRpcProvider("http://127.0.0.1:8545");
    return new ethers.Contract(address, contractABI, new ethers.Wallet(privateKey, provider));
}

// Ação do Passageiro: Comprar o Seguro
document.getElementById('btnBuy').onclick = async () => {
    const selectedIndex = document.getElementById('passengerSelect').value;
    const contract = getContract(passengerKeys[selectedIndex]);
    if(!contract) return;
    
    try {
        document.getElementById('btnBuy').innerText = "Processando...";
        const tx = await contract.buyInsurance(document.getElementById('flightPassenger').value.trim());
        await tx.wait(); 
        alert("✅ Seguro contratado! Usuário ativo protegido.");
    } catch(e) { 
        alert("Erro! Voo já indenizado ou usuário já possui seguro ativo."); 
    }
    document.getElementById('btnBuy').innerText = "Contratar Seguro Paramétrico";
};

// Ação do Oráculo: Reportar Atraso e Disparar Pagamento
document.getElementById('btnReport').onclick = async () => {
    const contract = getContract(oracleKey);
    if(!contract) return;
    
    const delay = document.getElementById('delayInput').value;
    if(!delay) return alert("Digite as horas de atraso!");
    
    try {
        document.getElementById('btnReport').innerText = "Enviando à Blockchain...";
        const tx = await contract.reportDelay(document.getElementById('flightOracle').value.trim(), delay);
        await tx.wait(); 
        alert("📡 Atraso registrado! Indenizações disparadas aos passageiros cadastrados.");
    } catch(e) { 
        alert("Erro! Voo não existe ou já foi liquidado."); 
    }
    document.getElementById('btnReport').innerText = "Registrar Atraso na Blockchain";
};

// Ação do Passageiro: Consultar a Situação On-Chain
document.getElementById('btnCheck').onclick = async () => {
    const selectedIndex = document.getElementById('passengerSelect').value;
    const contract = getContract(passengerKeys[selectedIndex]);
    if(!contract) return;
    
    const voo = document.getElementById('flightPassenger').value.trim();
    const isSettled = await contract.isFlightSettled(voo);
    
    // Pega o endereço público da opção selecionada no HTML
    const selectElement = document.getElementById('passengerSelect');
    const currentAddress = selectElement.options[selectElement.selectedIndex].getAttribute('data-address');
    const hasIns = await contract.hasInsurance(voo, currentAddress);

    // Atualiza as tags visuais (SIM/NÃO)
    document.getElementById('statusActive').innerText = hasIns ? "SIM" : "NÃO";
    document.getElementById('statusActive').className = hasIns ? "badge active" : "badge";
    document.getElementById('statusSettled').innerText = isSettled ? "SIM (Indenizado)" : "NÃO";
    document.getElementById('statusSettled').className = isSettled ? "badge settled" : "badge";

    // Mostra o Recibo de Quitação se as condições baterem
    document.getElementById('receiptBox').innerHTML = (isSettled && hasIns) ? 
        `<div class="receipt"><strong>🧾 Termo de Quitação Emitido On-Chain</strong><br>A indenização foi liquidada. Validade jurídica para extinção de litígio no TJPB garantida para esta carteira.</div>` : "";
};