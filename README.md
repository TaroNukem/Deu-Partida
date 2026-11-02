# 🚗 Deu Partida

> [!NOTE]
> Sistema web para gestão de aluguéis de automóveis: o cliente cria, consulta, modifica e cancela pedidos pela Internet, e os agentes (empresas e bancos) avaliam financeiramente cada pedido e executam o contrato.

<table>
  <tr>
    <td width="600px">
      <div align="justify">
        O <b>Deu Partida</b> foi desenvolvido no <b>Laboratório 02</b> da disciplina de <b>Desenvolvimento e Integração de Aplicações Web (DIAW)</b>, do curso de Engenharia de Software da PUC Minas. O sistema centraliza o fluxo de aluguel de automóveis: cadastro e login obrigatórios, pedidos de aluguel com status acompanhável, análise financeira feita por agentes e contratos de crédito concedidos por bancos. O projeto segue a arquitetura <b>MVC</b> no back-end (<b>Spring Boot</b>), usa <b>React + Vite</b> no front-end e <b>Supabase (PostgreSQL)</b> como banco de dados, com a modelagem UML versionada junto ao código.
      </div>
    </td>
    <td width="250px">
      <div>
        <img src="./frontend/src/assets/LogoReadme.png" alt="Logo do Deu Partida" width="250px"/>
      </div>
    </td>
  </tr>
</table>

---

## 🚧 Status do Projeto

![Status](https://img.shields.io/badge/Status-Em_desenvolvimento-yellow?style=for-the-badge) ![Java](https://img.shields.io/badge/Java-25-007ec6?style=for-the-badge&logo=openjdk&logoColor=white) ![Spring Boot](https://img.shields.io/badge/Spring_Boot-4.0.x-007ec6?style=for-the-badge&logo=springboot&logoColor=white) ![Maven](https://img.shields.io/badge/Maven-build-007ec6?style=for-the-badge&logo=apachemaven&logoColor=white) ![React](https://img.shields.io/badge/React-front--end-007ec6?style=for-the-badge&logo=react&logoColor=white) ![Vite](https://img.shields.io/badge/Vite-bundler-007ec6?style=for-the-badge&logo=vite&logoColor=white) ![Supabase](https://img.shields.io/badge/Supabase-PostgreSQL-007ec6?style=for-the-badge&logo=supabase&logoColor=white)

---

## 📚 Índice
- [Links Úteis](#-links-úteis)
- [Sobre o Projeto](#-sobre-o-projeto)
- [Funcionalidades Principais](#-funcionalidades-principais)
- [Tecnologias Utilizadas](#-tecnologias-utilizadas)
  - [Front-end](#-front-end)
  - [Back-end](#-back-end)
  - [Banco de Dados](#-banco-de-dados)
- [Arquitetura](#-arquitetura)
  - [Diagramas](#diagramas)
- [Instalação e Execução](#-instalação-e-execução)
  - [Pré-requisitos](#pré-requisitos)
  - [Variáveis de Ambiente](#-variáveis-de-ambiente)
  - [Instalação de Dependências](#-instalação-de-dependências)
  - [Banco de Dados (Supabase)](#-banco-de-dados-supabase)
  - [Como Executar a Aplicação](#-como-executar-a-aplicação)
- [Deploy](#-deploy)
- [Estrutura de Pastas](#-estrutura-de-pastas)
- [Demonstração](#-demonstração)
- [Testes](#-testes)
- [Documentações utilizadas](#-documentações-utilizadas)
- [Autor](#-autor)
- [Contribuição](#-contribuição)
- [Agradecimentos](#-agradecimentos)
- [Licença](#-licença)

---

## 🔗 Links Úteis
* 🌐 **Demo Online:** [Acesse a Aplicação Web](<link-da-demo-web>)
* 📖 **Documentação de modelagem:** [pasta `docs/`](./docs)
  > 📚 Casos de uso, histórias do usuário, diagramas de classes e de pacotes.
* 🎨 **Wireframe:** [Wireframe do Deu Partida](https://claude.ai/artifact/FEMYX3ad4GBNoscHfaLFeK)

---

## 📝 Sobre o Projeto

Gerir aluguéis de automóveis envolve vários participantes: o cliente que contrata, a empresa ou o banco que avalia a capacidade financeira e, muitas vezes, um banco que concede o crédito. Sem um sistema centralizado, fica difícil acompanhar o andamento de cada pedido.

O Deu Partida resolve isso oferecendo um ponto único pela Internet:

- O **cliente** mantém seus dados (identificação, profissão e até 3 rendimentos) e acompanha o status de cada pedido de aluguel.
- O **agente** (empresa ou banco) analisa financeiramente os pedidos e, com parecer positivo, coloca o contrato para execução.
- O **banco** pode conceder o contrato de crédito associado ao aluguel.

Os automóveis podem ser registrados como propriedade de clientes, empresas ou bancos, dependendo do tipo de contrato. O sistema só pode ser usado após cadastro prévio e login.

O projeto nasceu como trabalho acadêmico (Laboratório 02 de DIAW, PUC Minas) e também serve como peça do portfólio profissional.

---

## ✨ Funcionalidades Principais

- 🔐 **Autenticação:** cadastro e login com usuário e senha para clientes e agentes; acesso restrito a usuários cadastrados.
- 👤 **CRUD de cliente:** identificação (RG, CPF, nome, endereço), profissão e até 3 rendimentos com entidade empregadora.
- 📝 **Pedidos de aluguel:** o cliente cria, consulta, modifica e cancela pedidos e acompanha o status.
- 🚘 **Automóveis:** registro de matrícula, ano, marca, modelo e placa, com proprietário cliente, empresa ou banco.
- 🏦 **Contrato de crédito:** associação opcional a um banco agente.
- ✅ **Avaliação financeira:** parecer positivo ou negativo do agente sobre cada pedido.
- 📄 **Execução de contrato:** pedidos com parecer positivo viram contrato de aluguel.

---

## 🛠 Tecnologias Utilizadas

### 💻 Front-end

| Ferramenta | Para que é usada |
| :--- | :--- |
| **React** | Biblioteca base da interface. |
| **Vite** | Servidor de desenvolvimento e build de produção. |
| **JavaScript** | Linguagem do front-end. |
| **Node.js (LTS) + npm** | Ambiente de execução e gerenciador de pacotes. |

### 🖥️ Back-end

| Ferramenta | Para que é usada |
| :--- | :--- |
| **Java (JDK 25)** | Linguagem e runtime da API. |
| **Spring Boot 4.0.x** | Framework principal, com arquitetura MVC. |
| **Apache Maven** | Build e gerenciamento de dependências (wrapper `./mvnw`). |

### 🗄️ Banco de Dados

* **Supabase** (PostgreSQL) hospedando o banco.
* Conexão via **JDBC** utilizando o **Session Pooler**.

---

## 🏗 Arquitetura

O sistema é dividido em dois subsistemas: gestão de pedidos e contratos, e construção dinâmica das páginas web. Segue o modelo cliente-servidor: o servidor central (Spring Boot) atende, pela Internet, o front-end do cliente e dos agentes (React + Vite) e persiste os dados no Supabase.

| Camada | Responsabilidade |
| :--- | :--- |
| **Model** | Entidades do domínio (Cliente, Agente, Automóvel, Pedido de Aluguel, Contrato, Contrato de Crédito, Rendimento). |
| **View** | Interface em React + Vite, que consome a API do back-end. |
| **Controller** | Endpoints REST que recebem as requisições e delegam às regras de negócio. |
| **Service / Repository** | Regras de negócio e acesso ao banco de dados. |

### Diagramas

Os modelos UML ficam versionados na pasta [`/docs`](./docs).

| Diagrama | Arquivo |
| :---: | :---: |
| **Casos de Uso** | [docs](./docs) |
| **Histórias do Usuário** | [docs](./docs) |
| **Classes** | [docs](./docs) |
| **Pacotes (Visão Lógica)** | [docs](./docs) |

---

## 🔧 Instalação e Execução

### Pré-requisitos

* **Java JDK:** versão **25**
* **Maven:** pelo wrapper `./mvnw` incluído no projeto
* **Node.js:** versão LTS, com **npm**
* **Conta no Supabase** com um projeto PostgreSQL criado

---

### 🔑 Variáveis de Ambiente

#### Back-end (Spring Boot)

Na pasta `backend`, copie `.env.example` para `.env` e preencha com os dados do seu projeto Supabase.

| Variável | Descrição | Exemplo |
| :--- | :--- | :--- |
| `SERVER_PORT` | Porta local do servidor Spring Boot. | `8080` |
| `SPRING_DATASOURCE_URL` | URL JDBC do Session Pooler. | `jdbc:postgresql://<HOST_DO_SESSION_POOLER>:<PORTA>/postgres?sslmode=require` |
| `SPRING_DATASOURCE_USERNAME` | Usuário de conexão fornecido pelo Supabase. | `<USUARIO_DO_SESSION_POOLER>` |
| `SPRING_DATASOURCE_PASSWORD` | Senha definida para o banco de dados. | `sua-senha-aqui` |

O `application.properties` deve ler essas variáveis:

```properties
server.port=${SERVER_PORT:8080}

spring.datasource.url=${SPRING_DATASOURCE_URL}
spring.datasource.username=${SPRING_DATASOURCE_USERNAME}
spring.datasource.password=${SPRING_DATASOURCE_PASSWORD}
```

> [!IMPORTANT]
> O Spring Boot não carrega arquivos `.env` automaticamente. Defina as variáveis no ambiente de execução (no IntelliJ IDEA, pelas configurações de execução do Spring Boot) ou configure o carregamento do arquivo.

#### Front-end (React, Vite)

Se necessário, crie `frontend/.env` usando o prefixo `VITE_`.

| Variável | Descrição | Exemplo |
| :--- | :--- | :--- |
| `VITE_API_URL` | URL base da API. | `http://localhost:8080` |

> [!WARNING]
> Nunca versione arquivos `.env` nem publique a senha do banco. Apenas os arquivos `.env.example` vão para o repositório. Confira se o `.gitignore` contém:
>
> ```gitignore
> .env
> .env.*
> !.env.example
> ```

---

### 📦 Instalação de Dependências

```bash
git clone <URL_DO_REPOSITORIO>
cd deu-partida
```

#### Front-end (React)

```bash
cd frontend
npm install
cd ..
```

#### Back-end (Spring Boot)

```bash
cd backend
./mvnw clean install
cd ..
```

No Windows PowerShell, caso o wrapper não execute pelo terminal:

```powershell
.\mvnw.cmd clean install
```

---

### 💾 Banco de Dados (Supabase)

1. Acesse o [Supabase](https://supabase.com/), entre na sua conta ou crie uma.
2. Clique em **New Project**, informe o nome e defina a senha do banco. Guarde a senha em local seguro.
3. Com o projeto criado, clique em **Connect** e selecione **Session Pooler**.
4. Copie o host, a porta, o nome do banco e o usuário indicados e preencha as variáveis `SPRING_DATASOURCE_*` do `backend/.env`.

> [!TIP]
> Os valores entre `<` e `>` são marcadores ilustrativos e devem ser substituídos pelos dados do painel do Supabase.

---

### ⚡ Como Executar a Aplicação

Execute em **dois terminais separados**.

#### Terminal 1: Back-end (Spring Boot)

```bash
cd backend
./mvnw spring-boot:run
```

No Windows PowerShell:

```powershell
cd backend
.\mvnw.cmd spring-boot:run
```

🚀 *O back-end estará disponível em **http://localhost:8080**.*

#### Terminal 2: Front-end (React, Vite)

```bash
cd frontend
npm run dev
```

🎨 *O front-end estará disponível em **http://localhost:5173**.*

---

## 🚀 Deploy

1. **Build do front-end** (gera a pasta `dist` com arquivos estáticos):

```bash
cd frontend
npm run build
```

2. **Build do back-end** (gera o `.jar` executável em `target`):

```bash
cd backend
./mvnw clean package
```

3. **Variáveis de produção:** configure no provedor as variáveis `SPRING_DATASOURCE_*` para o back-end e `VITE_API_URL` (URL pública da API) para o front-end.

> [!WARNING]
> Em produção, nunca use credenciais de teste nem exponha a senha do banco.

---

## 📂 Estrutura de Pastas

```
.
├── README.md                    # 📘 Documentação principal do projeto
├── .gitignore                   # 🧹 Arquivos ignorados pelo Git
│
├── /docs                        # 📚 Diagramas UML, documentação e wireframes
│   └── /img                     # 🖼️ Imagens do projeto
│
├── /frontend                    # 📁 Aplicação React + Vite
│   ├── .env.example             # 🧩 Exemplo de variáveis de ambiente
│   ├── /public                  # 📂 Arquivos estáticos
│   ├── /src
│   │   ├── /assets              # 🖼️ Imagens e logo (LogoReadme.png)
│   │   ├── /components          # 🧱 Componentes reutilizáveis
│   │   ├── /pages               # 📄 Telas da aplicação
│   │   ├── /services            # 🔌 Chamadas HTTP à API
│   │   └── /utils               # 🛠️ Funções utilitárias
│   └── package.json             # 📦 Dependências e scripts
│
└── /backend                     # 📁 Aplicação Spring Boot (MVC)
    ├── .env.example             # 🧩 Modelo das variáveis de ambiente
    ├── .env                     # 🔐 Credenciais locais (não versionar)
    ├── /src
    │   ├── /main
    │   │   ├── /java            # ☕ Controllers, services, repositories e models
    │   │   └── /resources       # ⚙️ application.properties e recursos
    │   └── /test/java           # 🧪 Testes
    └── pom.xml                  # 🛠️ Build e dependências Maven
```

> [!NOTE]
> A estrutura é uma referência: ajuste os diretórios para corresponder aos que realmente existem no repositório.

---

## 🎥 Demonstração

### 🌐 Aplicação Web

| Tela | Captura de Tela |
| :---: | :---: |
| **Login e Cadastro** | _em breve_ |
| **Meus Pedidos** | _em breve_ |
| **Novo Pedido** | _em breve_ |
| **Perfil do Cliente (CRUD)** | _em breve_ |
| **Painel do Agente** | _em breve_ |

> [!TIP]
> Hospede as imagens na pasta `docs/img` do repositório para manter as capturas disponíveis no GitHub.

---

## 🧪 Testes

```bash
cd backend
./mvnw test
```

Para validar o front-end:

```bash
cd frontend
npm run build
```

---

## 🔗 Documentações utilizadas

* 📖 [React](https://react.dev/reference/react)
* 📖 [Vite](https://vite.dev/guide/)
* 📖 [Spring Boot](https://docs.spring.io/spring-boot/index.html)
* 📖 [Supabase](https://supabase.com/docs)
* 📖 [PostgreSQL](https://www.postgresql.org/docs/)
* 📖 [Conventional Commits](https://www.conventionalcommits.org/en/v1.0.0/)

---

## 👥 Autor

| 👤 Nome | 🖼️ Foto | :octocat: GitHub | 💼 LinkedIn | 📤 Gmail |
|---------|----------|-----------------|-------------|-----------|
| Daniel Gomes Rolando | <div align="center"><img src="https://github.com/TaroNukem.png" width="70px" height="70px"></div> | <div align="center"><a href="https://github.com/TaroNukem"><img src="https://joaopauloaramuni.github.io/image/github6.png" width="50px" height="50px"></a></div> | <div align="center"><a href="https://www.linkedin.com/in/daniel-gomes-rolando"><img src="https://joaopauloaramuni.github.io/image/linkedin2.png" width="50px" height="50px"></a></div> | <div align="center"><a href="mailto:danielgomesrolando@gmail.com"><img src="https://joaopauloaramuni.github.io/image/gmail3.png" width="50px" height="50px"></a></div> |

---

## 🤝 Contribuição

1. Faça um `fork` do projeto.
2. Crie uma branch para sua feature (`git checkout -b feature/minha-feature`).
3. Faça commit das mudanças (`git commit -m 'feat: adiciona nova funcionalidade'`), seguindo o [Conventional Commits](https://www.conventionalcommits.org/en/v1.0.0/).
4. Envie a branch (`git push origin feature/minha-feature`).
5. Abra um **Pull Request**.

---

## 🙏 Agradecimentos

* [**Engenharia de Software PUC Minas**](https://www.instagram.com/engsoftwarepucminas/) - Pelo apoio institucional e estrutura acadêmica.
* [**Prof. Dr. João Paulo Aramuni**](https://github.com/joaopauloaramuni) - Pelos ensinamentos na matéria de Desenvolvimento e Integração de Aplicações Web e pelo template de README.

---

## 📄 Licença

Este projeto é de uso acadêmico. Defina aqui a licença do repositório (por exemplo, [MIT](./LICENSE)), caso aplicável.

---
