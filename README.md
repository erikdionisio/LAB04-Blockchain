# ✈️ Seguro Paramétrico de Voo (Prova de Conceito - PoC)

**Desenvolvido por:** Cristian Alves da Silva e Jose Erik Dionisio da Silva

Projeto acadêmico focado na automação de seguros de atraso de voo utilizando **Smart Contracts**. Desenvolvido para a disciplina de Blockchain da UFCG.

O objetivo deste documento é guiar a execução e o teste completo do sistema em ordem cronológica.

---

## 👣 Passo a Passo para Execução e Testes

Siga as etapas abaixo exatamente nesta ordem para configurar o ambiente, iniciar a rede, compilar o código e rodar a demonstração.

### Passo 1: Pré-requisitos
Certifique-se de que sua máquina possui as seguintes ferramentas instaladas:
* **Node.js** (Versão 22 ou superior recomendada)
* **Git**
* **Docker** e **Docker Compose** (Necessários para emular a rede blockchain local)

### Passo 2: Clonagem e Instalação
Abra o seu terminal e rode os comandos abaixo para baixar o código e instalar todas as dependências (`node_modules`) do projeto:

```bash
git clone <URL_DO_SEU_REPOSITORIO>
cd LAB04-Blockchain
npm install

### Passo 3: Iniciando a Rede Blockchain Local (Docker)

Antes de compilar o código ou interagir com os contratos, é fundamental que a rede local esteja em execução. Inicie a rede utilizando o Docker com o comando:

Bash
docker compose up -d
(Nota: Aguarde alguns segundos para garantir que o container da rede esteja rodando corretamente de forma estável no background).

Passo 4: Deploy e Execução da Demonstração
Com a rede local ativa e pronta para receber requisições, você já pode realizar o deploy do Smart Contract. O comando abaixo irá compilar o contrato, publicá-lo na rede localhost e, em seguida, rodar o script de demonstração do seguro parametrizado:

Bash
npx hardhat run scripts/deploy_and_demo.ts --network localhost
