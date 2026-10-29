# 🚗 Deu Partida

> Sistema web para gestão de aluguéis de automóveis: o cliente faz, modifica, consulta e cancela pedidos pela Internet, e os agentes (empresas e bancos) analisam e avaliam cada pedido.

<table>
  <tr>
    <td width="800px">
      <div align="justify">
        O <b>Deu Partida</b> é um sistema de apoio à gestão de aluguéis de automóveis desenvolvido como <b>Laboratório 02</b> da disciplina <b>Desenvolvimento e Integração de Aplicações Web (DIAW)</b>, do curso de Engenharia de Software da PUC Minas. O sistema permite que clientes criem pedidos de aluguel e acompanhem seu status, enquanto agentes (empresas e bancos) fazem a análise financeira do pedido e, em caso de parecer positivo, o colocam para execução do contrato. O back-end é construído com <b>Spring Boot</b> seguindo a arquitetura <b>MVC</b>, o front-end com <b>React + Vite</b> e os dados ficam no <b>Supabase (PostgreSQL)</b>.
      </div>
    </td>
    <td>
      <div>
        <!-- Substitua pela logo do Deu Partida -->
        <img src="./docs/img/logo.png" alt="Logo do Deu Partida" width="120px"/>
      </div>
    </td>
  </tr>
</table>

---

## 🚧 Status do Projeto

![Status](https://img.shields.io/badge/Status-Em_desenvolvimento-yellow?style=for-the-badge)
![Java](https://img.shields.io/badge/Java-25-007ec6?style=for-the-badge&logo=openjdk&logoColor=white)
![Spring Boot](https://img.shields.io/badge/Spring_Boot-4.0.x-007ec6?style=for-the-badge&logo=springboot&logoColor=white)
![Maven](https://img.shields.io/badge/Maven-Build-007ec6?style=for-the-badge&logo=apachemaven&logoColor=white)
![React](https://img.shields.io/badge/React-Front--end-007ec6?style=for-the-badge&logo=react&logoColor=white)
![Vite](https://img.shields.io/badge/Vite-Bundler-007ec6?style=for-the-badge&logo=vite&logoColor=white)
![Supabase](https://img.shields.io/badge/Supabase-PostgreSQL-007ec6?style=for-the-badge&logo=supabase&logoColor=white)

---

## 📚 Índice
- [Links Úteis](#-links-úteis)
- [Sobre o Projeto](#-sobre-o-projeto)
- [Funcionalidades Principais](#-funcionalidades-principais)
- [Tecnologias Utilizadas](#-tecnologias-utilizadas)
- [Arquitetura](#-arquitetura)
- [Instalação e Execução](#-instalação-e-execução)
- [Estrutura de Pastas](#-estrutura-de-pastas)
- [Demonstração](#-demonstração)
- [Documentações utilizadas](#-documentações-utilizadas)
- [Autores](#-autores)
- [Agradecimentos](#-agradecimentos)
- [Licença](#-licença)

---

## 🔗 Links Úteis
* 🌐 **Demo Online:** [Acesse a Aplicação Web](<link-da-demo-web>)
* 📖 **Documentação (UML):** [Pasta `/docs`](./docs)
* 🎨 **Wireframe:** [Wireframe do Deu Partida](https://claude.ai/artifact/FEMYX3ad4GBNoscHfaLFeK)

---

## 📝 Sobre o Projeto
O Deu Partida nasce da necessidade de organizar o processo de aluguel de automóveis em um único ambiente web, no qual cliente e agentes acompanham o mesmo pedido do início ao fim.

- **Problema que resolve:** centraliza a solicitação, a análise financeira e a execução do contrato de aluguel, que hoje dependem de contatos separados entre cliente, empresa e banco.
- **Contexto:** projeto acadêmico (Laboratório 02 de DIAW, PUC Minas).
- **Como funciona:** o sistema só pode ser usado após cadastro prévio e login. Depois que o cliente registra o pedido, os agentes o analisam do ponto de vista financeiro e, com parecer positivo, o colocam à consideração do cliente para execução do contrato.
- **Automóveis:** dependendo do tipo de contrato, o veículo pode ser registrado como propriedade de clientes, empresas ou bancos. O aluguel pode estar associado a um contrato de crédito concedido por um banco agente.
- **Subsistemas:** gestão de pedidos e contratos, e construção dinâmica das páginas web.

---

## ✨ Funcionalidades Principais

- 🔐 **Autenticação:** cadastro e login com usuário e senha para clientes e agentes; acesso restrito a usuários cadastrados.
- 👤 **CRUD de Cliente:** dados de identificação (RG, CPF, nome, endereço), profissão, entidades empregadoras e rendimentos (máximo de 3).
- 📝 **Pedidos de Aluguel (cliente):** criar, modificar, consultar e cancelar pedidos, com visualização do status.
- 🏦 **Análise de Pedidos (agentes):** empresas e bancos modificam e avaliam pedidos, com parecer financeiro.
- 📄 **Contratos:** execução do contrato após parecer positivo, com contrato de crédito opcional vinculado a um banco agente.
- 🚘 **Automóveis:** registro de matrícula, ano, marca, modelo e placa, com definição do proprietário (cliente, empresa ou banco).

---

## 🛠 Tecnologias Utilizadas

### 💻 Front-end
* **Biblioteca:** React
* **Build Tool:** Vite
* **Linguagem:** JavaScript

### 🖥️ Back-end
* **Linguagem:** Java (JDK 25)
* **Framework:** Spring Boot 4.0.x
* **Arquitetura:** MVC
* **Build e dependências:** Apache Maven
* **Autenticação:** login com usuário e senha

### 🗄️ Banco de Dados
* **Supabase (PostgreSQL)**

---

## 🏗 Arquitetura

O sistema segue a arquitetura **MVC** no back-end, em um modelo cliente-servidor: o servidor central (Spring Boot) atende, pela Internet, o front-end do cliente e dos agentes (React + Vite), e persiste os dados no Supabase.

| Camada | Responsabilidade |
| :--- | :--- |
| **Model** | Entidades do domínio (Cliente, Agente, Automóvel, Pedido de Aluguel, Contrato, Contrato de Crédito, Rendimento). |
| **View** | Interface em React + Vite, que consome a API do back-end. |
| **Controller** | Endpoints REST que recebem as requisições e delegam às regras de negócio. |
| **Service / Repository** | Regras de negócio e acesso ao banco de dados. |

### Diagramas

Os modelos UML ficam versionados na pasta [`/docs`](./docs).

| Modelo | Arquivo |
| :--- | :--- |
| Diagrama de Casos de Uso | [docs/casos-de-uso](./docs) |
| Histórias do Usuário | [docs/historias-de-usuario](./docs) |
| Diagrama de Classes | [docs/diagrama-de-classes](./docs) |
| Diagrama de Pacotes (Visão Lógica) | [docs/diagrama-de-pacotes](./docs) |

---

## 🔧 Instalação e Execução

### Pré-requisitos
* **Java JDK 25** (back-end)
* **Maven** (ou o Maven Wrapper `./mvnw` do projeto)
* **Node.js** LTS (front-end) e **npm**
* Um projeto no **Supabase** com o banco PostgreSQL criado

### 🔑 Variáveis de Ambiente

#### Back-end (Spring Boot)

| Variável | Descrição | Exemplo |
| :--- | :--- | :--- |
| `SERVER_PORT` | Porta do back-end. | `8080` |
| `SPRING_DATASOURCE_URL` | URL JDBC do banco no Supabase. | `jdbc:postgresql://db.<projeto>.supabase.co:5432/postgres` |
| `SPRING_DATASOURCE_USERNAME` | Usuário do banco. | `postgres` |
| `SPRING_DATASOURCE_PASSWORD` | Senha do banco. | `sua-senha-aqui` |

#### Front-end (React, Vite)

Crie um arquivo `.env` na raiz da pasta `/frontend`:

| Variável | Descrição | Exemplo |
| :--- | :--- | :--- |
| `VITE_API_URL` | URL base da API do back-end. | `http://localhost:8080/api` |

> **Atenção:** nunca versione senhas ou chaves. Mantenha os arquivos `.env` no `.gitignore` e disponibilize apenas um `.env.example`.

### 📦 Instalação de Dependências

```bash
git clone <URL_DO_REPOSITORIO>
cd deu-partida
```

**Front-end:**

```bash
cd frontend
npm install
cd ..
```

**Back-end:**

```bash
cd backend
./mvnw clean install
cd ..
```

### ⚡ Como Executar a Aplicação

Execute em **dois terminais separados**.

**Terminal 1: Back-end (Spring Boot)**

```bash
cd backend
./mvnw spring-boot:run
```

🚀 O back-end estará disponível em **http://localhost:8080**.

**Terminal 2: Front-end (React, Vite)**

```bash
cd frontend
npm run dev
```

🎨 O front-end estará disponível em **http://localhost:5173**.

---

## 📂 Estrutura de Pastas

```
.
├── README.md                    # 📘 Documentação principal do projeto.
├── .gitignore                   # 🧹 Arquivos ignorados pelo Git (.env, node_modules, target).
│
├── /frontend                    # 📁 Aplicação React + Vite
│   ├── .env.example             # 🧩 Exemplo de variáveis de ambiente.
│   ├── /public                  # 📂 Arquivos estáticos.
│   ├── /src
│   │   ├── /components          # 🧱 Componentes reutilizáveis.
│   │   ├── /pages               # 📄 Telas (login, pedidos, novo pedido, perfil, painel do agente).
│   │   ├── /services            # 🔌 Chamadas HTTP à API.
│   │   └── /utils               # 🛠️ Funções utilitárias.
│   └── package.json             # 📦 Dependências e scripts.
│
├── /backend                     # 📁 Aplicação Spring Boot (MVC)
│   ├── /src/main/java           # 📂 Código-fonte Java
│   │   ├── /controller          # 🎮 Endpoints REST.
│   │   ├── /service             # ⚙️ Regras de negócio.
│   │   ├── /repository          # 🗄️ Acesso a dados.
│   │   ├── /model               # 🧬 Entidades do domínio.
│   │   ├── /dto                 # ✉️ Data Transfer Objects.
│   │   ├── /config              # 🔧 Configurações gerais.
│   │   └── /security            # 🛡️ Autenticação (login).
│   ├── /src/main/resources      # 📂 application.properties/yml e recursos.
│   ├── /src/test/java           # 🧪 Testes.
│   └── pom.xml                  # 🛠️ Build e dependências (Maven).
│
└── /docs                        # 📚 Modelos UML (casos de uso, histórias, classes, pacotes) e wireframes.
```

---

## 🎥 Demonstração

### 🌐 Aplicação Web

| Tela | Captura de Tela |
| :---: | :---: |
| **Login e Cadastro** | **Meus Pedidos (cliente)** |
| _Sua captura aqui_ | _Sua captura aqui_ |
| **Novo Pedido** | **Perfil do Cliente (CRUD)** |
| _Sua captura aqui_ | _Sua captura aqui_ |
| **Painel do Agente** | |
| _Sua captura aqui_ | |

> Dica: hospede as imagens na pasta `/docs/img` do repositório ou no GitHub Pages para que não quebrem.

---

## 🔗 Documentações utilizadas

* 📖 [React](https://react.dev/reference/react)
* 📖 [Vite](https://vitejs.dev/config/)
* 📖 [Spring Boot](https://docs.spring.io/spring-boot/docs/current/reference/html/)
* 📖 [Supabase](https://supabase.com/docs)
* 📖 [Conventional Commits](https://www.conventionalcommits.org/en/v1.0.0/)

---

## 👥 Autores

| 👤 Nome | :octocat: GitHub | 💼 LinkedIn | 📤 Gmail |
|---------|------------------|-------------|----------|
| Daniel Gomes Rolando | [TaroNukem](https://github.com/TaroNukem) | [daniel-gomes-rolando](https://linkedin.com/in/daniel-gomes-rolando) | [danielgomesrolando@gmail.com](mailto:danielgomesrolando@gmail.com) |

---

## 🙏 Agradecimentos

* [**Engenharia de Software PUC Minas**](https://www.instagram.com/engsoftwarepucminas/): pelo apoio institucional e pela estrutura acadêmica.
* [**Prof. Dr. João Paulo Aramuni**](https://github.com/joaopauloaramuni): pelos ensinamentos de Arquitetura de Software e Padrões de Projeto, e pelo template de README.

---

## 📄 Licença

Este projeto é de uso acadêmico. Defina aqui a licença do repositório (ex.: [MIT](./LICENSE)).

---