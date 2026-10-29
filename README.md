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
- [Banco de Dados](#-banco-de-dados)
- [Estrutura de Pastas](#-estrutura-de-pastas)
- [Demonstração](#-demonstração)
- [Documentações Utilizadas](#-documentações-utilizadas)
- [Autores](#-autores)
- [Agradecimentos](#-agradecimentos)
- [Licença](#-licença)

---

## 🔗 Links Úteis

- 🌐 **Demo Online:** [Acesse a Aplicação Web](<link-da-demo-web>)
- 📖 **Documentação UML:** [Pasta `/docs`](./docs)
- 🎨 **Wireframe:** [Wireframe do Deu Partida](https://claude.ai/artifact/FEMYX3ad4GBNoscHfaLFeK)

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

- **Biblioteca:** React
- **Build Tool:** Vite
- **Linguagem:** JavaScript

### 🖥️ Back-end

- **Linguagem:** Java (JDK 25)
- **Framework:** Spring Boot 4.0.x
- **Arquitetura:** MVC
- **Build e dependências:** Apache Maven
- **Autenticação:** login com usuário e senha

### 🗄️ Banco de Dados

- **SGBD:** PostgreSQL
- **Hospedagem:** Supabase
- **Conexão:** JDBC utilizando Session Pooler

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
| Diagrama de Casos de Uso | [Documentação em `/docs`](./docs) |
| Histórias do Usuário | [Documentação em `/docs`](./docs) |
| Diagrama de Classes | [Documentação em `/docs`](./docs) |
| Diagrama de Pacotes (Visão Lógica) | [Documentação em `/docs`](./docs) |

---

## 🔧 Instalação e Execução

### Pré-requisitos

- **Java JDK 25** para o back-end.
- **Maven** ou Maven Wrapper (`./mvnw`).
- **Node.js LTS** e **npm** para o front-end.
- Um projeto no **Supabase** com banco PostgreSQL criado.

### 1. Clonar o Repositório

```bash
git clone <URL_DO_REPOSITORIO>
cd deu-partida
```

### 2. Configurar o Banco de Dados

Siga as instruções da seção [Banco de Dados](#-banco-de-dados) para criar o projeto no Supabase e configurar as variáveis de ambiente antes de executar o back-end.

### 3. Instalar as Dependências

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

No Windows, caso o wrapper não execute pelo terminal, utilize:

```powershell
.\mvnw.cmd clean install
```

### 4. Executar a Aplicação

Execute o back-end e o front-end em dois terminais separados.

**Terminal 1 — Back-end (Spring Boot):**

```bash
cd backend
./mvnw spring-boot:run
```

No Windows PowerShell:

```powershell
cd backend
.\mvnw.cmd spring-boot:run
```

O back-end estará disponível em `http://localhost:8080`.

**Terminal 2 — Front-end (React + Vite):**

```bash
cd frontend
npm run dev
```

O front-end estará disponível em `http://localhost:5173`.

---

## 🗄️ Banco de Dados

O projeto utiliza o **PostgreSQL hospedado no Supabase**. Para que o back-end consiga acessar o banco, é necessário criar um projeto, obter os dados de conexão do Session Pooler e configurar as variáveis de ambiente.

### 1. Criar um projeto no Supabase

1. Acesse o [Supabase](https://supabase.com/).
2. Entre na sua conta ou crie uma conta.
3. Clique em **New Project**.
4. Informe o nome do projeto e configure a senha do banco de dados.
5. Guarde a senha em local seguro e aguarde a criação do projeto.

### 2. Obter a conexão pelo Session Pooler

1. Abra o projeto no painel do Supabase.
2. Clique em **Connect** para consultar as opções de conexão.
3. Selecione **Session Pooler** como método de conexão.
4. Copie a string de conexão fornecida pelo Supabase.
5. Utilize o endereço do servidor, a porta, o nome do banco e o usuário indicados na configuração.

O endereço JDBC normalmente segue este formato:

```text
jdbc:postgresql://<HOST_DO_SESSION_POOLER>:<PORTA>/postgres?sslmode=require
```

Os valores entre `<` e `>` são marcadores ilustrativos e devem ser substituídos pelos dados fornecidos no painel do Supabase.

> **Importante:** utilize os dados específicos do seu projeto. Não compartilhe nem publique a senha do banco de dados.

### 3. Criar o arquivo `.env`

Na pasta `backend`, copie o arquivo `.env.example` e renomeie a cópia para `.env`.

A estrutura esperada é:

```text
deu-partida/
├── backend/
│   ├── .env.example
│   ├── .env
│   └── ...
└── frontend/
    └── ...
```

Preencha o arquivo `backend/.env` com os dados da conexão do seu projeto:

```env
SERVER_PORT=8080
SPRING_DATASOURCE_URL=jdbc:postgresql://<HOST_DO_SESSION_POOLER>:<PORTA>/postgres?sslmode=require
SPRING_DATASOURCE_USERNAME=<USUARIO_DO_SESSION_POOLER>
SPRING_DATASOURCE_PASSWORD=
```

- `SERVER_PORT`: porta local do servidor Spring Boot.
- `SPRING_DATASOURCE_URL`: endereço JDBC do Session Pooler.
- `SPRING_DATASOURCE_USERNAME`: usuário de conexão fornecido pelo Supabase.
- `SPRING_DATASOURCE_PASSWORD`: senha definida para o banco de dados.

**Atenção:** preencha a senha apenas no arquivo `.env` local. O exemplo acima deixa o campo vazio intencionalmente para não expor credenciais.

### 4. Configurar o Spring Boot

Confira se o arquivo `backend/src/main/resources/application.properties` utiliza as variáveis de ambiente:

```properties
server.port=${SERVER_PORT:8080}

spring.datasource.url=${SPRING_DATASOURCE_URL}
spring.datasource.username=${SPRING_DATASOURCE_USERNAME}
spring.datasource.password=${SPRING_DATASOURCE_PASSWORD}
```

Se essas configurações já existirem, não é necessário duplicá-las.

**Importante sobre o `.env`:** o Spring Boot não carrega automaticamente arquivos `.env` em todas as configurações. Se o projeto não tiver uma biblioteca ou configuração específica para carregá-lo, defina as variáveis no ambiente de execução da aplicação ou configure o carregamento do arquivo. No IntelliJ IDEA, elas podem ser definidas nas configurações de execução do Spring Boot.

### 5. Manter as credenciais protegidas

Confira se o `.gitignore` da raiz do repositório contém regras para ignorar os arquivos `.env`:

```gitignore
# Variáveis de ambiente
.env
.env.*
!.env.example
```

Se necessário, acrescente regras específicas para os arquivos de ambiente do projeto:

```gitignore
backend/.env
frontend/.env
```

O arquivo `backend/.env.example` pode ser versionado, desde que contenha somente nomes de variáveis e valores ilustrativos, sem senhas, tokens ou credenciais reais.

---

## 📂 Estrutura de Pastas

```text
.
├── README.md                    # 📘 Documentação principal do projeto
├── .gitignore                   # 🧹 Arquivos ignorados pelo Git
│
├── frontend/                    # 📁 Aplicação React + Vite
│   ├── .env.example             # 🧩 Exemplo de variáveis de ambiente
│   ├── public/                  # 📂 Arquivos estáticos
│   ├── src/
│   │   ├── components/          # 🧱 Componentes reutilizáveis
│   │   ├── pages/               # 📄 Telas da aplicação
│   │   ├── services/             # 🔌 Chamadas HTTP à API
│   │   └── utils/                # 🛠️ Funções utilitárias
│   └── package.json              # 📦 Dependências e scripts
│
├── backend/                     # 📁 Aplicação Spring Boot (MVC)
│   ├── .env.example             # 🧩 Modelo das variáveis de ambiente
│   ├── .env                     # 🔐 Credenciais locais (não versionar)
│   ├── src/
│   │   ├── main/
│   │   │   ├── java/            # ☕ Código-fonte Java
│   │   │   │   └── ...          # Controllers, services, repositories e models
│   │   │   └── resources/       # ⚙️ application.properties e recursos
│   │   └── test/
│   │       └── java/            # 🧪 Testes
│   └── pom.xml                  # 🛠️ Build e dependências Maven
│
└── docs/                        # 📚 Diagramas UML, documentação e wireframes
    └── img/                     # 🖼️ Imagens do projeto
```

> A estrutura apresentada é uma referência. Os diretórios e arquivos devem corresponder aos que realmente existem no repositório.

---

## 🎥 Demonstração

### 🌐 Aplicação Web

| Login e Cadastro | Meus Pedidos (cliente) |
| :---: | :---: |
| *Sua captura aqui* | *Sua captura aqui* |

| Novo Pedido | Perfil do Cliente (CRUD) |
| :---: | :---: |
| *Sua captura aqui* | *Sua captura aqui* |

| Painel do Agente |
| :---: |
| *Sua captura aqui* |

> **Dica:** hospede as imagens na pasta `docs/img` do repositório para manter as capturas disponíveis no GitHub.

---

## 🔗 Documentações Utilizadas

- 📖 [React](https://react.dev/reference/react)
- 📖 [Vite](https://vite.dev/guide/)
- 📖 [Spring Boot](https://docs.spring.io/spring-boot/docs/current/reference/html/)
- 📖 [Supabase](https://supabase.com/docs)
- 📖 [PostgreSQL](https://www.postgresql.org/docs/)
- 📖 [Conventional Commits](https://www.conventionalcommits.org/en/v1.0.0/)

---

## 👥 Autores

| 👤 Nome | :octocat: GitHub | 💼 LinkedIn | 📤 Gmail |
| :--- | :--- | :--- | :--- |
| Daniel Gomes Rolando | [TaroNukem](https://github.com/TaroNukem) | [daniel-gomes-rolando](https://linkedin.com/in/daniel-gomes-rolando) | [danielgomesrolando@gmail.com](mailto:danielgomesrolando@gmail.com) |

---

## 🙏 Agradecimentos

- [**Engenharia de Software PUC Minas**](https://www.instagram.com/engsoftwarepucminas/): pelo apoio institucional e pela estrutura acadêmica.
- [**Prof. Dr. João Paulo Aramuni**](https://github.com/joaopauloaramuni): pelos ensinamentos de Arquitetura de Software e Padrões de Projeto, e pelo template de README.

---

## 📄 Licença

Este projeto é de uso acadêmico. Defina aqui a licença do repositório (por exemplo, [MIT](./LICENSE)), caso aplicável.

---
