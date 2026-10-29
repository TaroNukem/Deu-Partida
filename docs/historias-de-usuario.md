# Histórias de Usuário e Regras de Negócio — Sistema de Aluguel de Carros

**Disciplina:** DIAW — Laboratório 02 (PUC Minas, Engenharia de Software)
**Stack:** Java (JDK 25) · Spring Boot 4.0.x (MVC) · Maven · React + Vite · Supabase (PostgreSQL)

---

## 1. Atores

| Ator | Descrição |
|---|---|
| **Cliente** | Usuário individual que solicita aluguéis de automóveis. |
| **Agente** | Empresa ou banco que avalia pedidos e executa contratos. |
| **Agente Empresa** | Especialização de Agente (pode ser proprietária de automóveis). |
| **Agente Banco** | Especialização de Agente (pode ser proprietário de automóveis e conceder crédito). |

---

## 2. Histórias de Usuário

Prioridade: **Alta** = necessária para o protótipo do Lab02 (login, CRUD de cliente, criar e ver status do pedido) · **Média** = fluxo completo do pedido · **Baixa** = evolução.

### Acesso ao sistema

#### HU01 — Cadastrar-se (UC01) · Alta
**Como** visitante (futuro cliente ou agente), **quero** me cadastrar com usuário e senha, **para** poder utilizar o sistema.

**Critérios de aceitação**
- [ ] O formulário pede nome, usuário (único), senha e tipo de conta (Cliente, Agente Empresa ou Agente Banco).
- [ ] Não permite usuário já existente nem senha fora do padrão mínimo (RN02).
- [ ] A senha é armazenada com hash, nunca em texto puro.
- [ ] Após o cadastro bem-sucedido, o usuário é levado à tela de login.

#### HU02 — Autenticar (UC02) · Alta
**Como** usuário cadastrado, **quero** entrar com usuário e senha, **para** acessar as funções do meu perfil.

**Critérios de aceitação**
- [ ] Login correto abre a sessão e leva à tela inicial do perfil (Cliente ou Agente).
- [ ] Credenciais inválidas mostram mensagem genérica, sem dizer qual campo errou.
- [ ] Qualquer rota protegida sem sessão redireciona ao login (RN01).
- [ ] Existe opção de sair (logout), que encerra a sessão.

### Gestão de clientes

#### HU03 — Gerenciar meus dados de cliente (UC03) · Alta
**Como** cliente, **quero** cadastrar, consultar, editar e excluir meus dados, **para** que minhas informações estejam corretas nos pedidos.

**Critérios de aceitação**
- [ ] Posso informar RG, CPF, nome e endereço (obrigatórios).
- [ ] Posso informar profissão e de 0 a 3 empregadores, cada um com seu rendimento (RN04).
- [ ] CPF é validado e não pode repetir entre clientes (RN03).
- [ ] Ao tentar adicionar um 4º empregador, o sistema bloqueia e avisa.
- [ ] Não consigo excluir meu cadastro se houver pedido em andamento (RN12).
- [ ] Só vejo e altero os meus próprios dados.

### Pedidos de aluguel

#### HU04 — Introduzir pedido de aluguel (UC04, UC05) · Alta
**Como** cliente, **quero** criar um pedido de aluguel escolhendo um automóvel, **para** solicitar o contrato.

**Critérios de aceitação**
- [ ] Só consigo criar o pedido se meus dados de cliente estiverem completos (RN05).
- [ ] Escolho um automóvel da lista de disponíveis e informo o período do aluguel.
- [ ] Posso indicar se desejo associar um contrato de crédito (RN09).
- [ ] O pedido nasce com status **Em análise** (RN06).
- [ ] O sistema mostra a confirmação com o número do pedido.

#### HU05 — Consultar pedidos e status (UC06) · Alta
**Como** cliente, **quero** ver meus pedidos e o status de cada um, **para** acompanhar o andamento.

**Critérios de aceitação**
- [ ] Vejo a lista dos meus pedidos com automóvel, período e status.
- [ ] Posso abrir o detalhe de um pedido, incluindo o parecer do agente, quando houver.
- [ ] Não vejo pedidos de outros clientes.

**Como** agente, **quero** consultar os pedidos recebidos, **para** decidir quais analisar.

- [ ] Vejo a lista de pedidos e posso filtrar por status.

#### HU06 — Modificar pedido (UC07) · Média
**Como** cliente, **quero** alterar um pedido meu (automóvel, período, crédito), **para** corrigir ou ajustar a solicitação.

**Critérios de aceitação**
- [ ] Só posso modificar pedido com status **Em análise** (RN07).
- [ ] Após a alteração, o pedido volta a ser analisado.

**Como** agente, **quero** modificar um pedido, **para** ajustar condições durante a análise.

- [ ] A modificação do agente fica registrada e visível ao cliente.

#### HU07 — Cancelar pedido (UC08) · Média
**Como** cliente, **quero** cancelar um pedido meu, **para** desistir do aluguel.

**Critérios de aceitação**
- [ ] O sistema pede confirmação antes de cancelar.
- [ ] Só é possível cancelar enquanto o contrato não foi executado (RN08).
- [ ] O pedido passa a **Cancelado** e o automóvel volta a ficar disponível.

### Fluxo do agente

#### HU08 — Avaliar pedido financeiramente (UC09) · Média
**Como** agente, **quero** analisar a situação financeira do cliente de um pedido e dar um parecer, **para** decidir se o contrato pode ser feito.

**Critérios de aceitação**
- [ ] Vejo os dados do cliente: identificação, profissão, empregadores e rendimentos.
- [ ] Registro o parecer **Positivo** ou **Negativo**, com justificativa.
- [ ] Parecer positivo muda o pedido para **Aprovado** e o coloca à disposição para execução do contrato (RN06).
- [ ] Parecer negativo muda o pedido para **Reprovado**.

#### HU09 — Executar contrato de aluguel (UC10) · Média
**Como** agente, **quero** executar o contrato de um pedido aprovado, **para** formalizar o aluguel.

**Critérios de aceitação**
- [ ] Só consigo executar contrato de pedido **Aprovado** (RN10).
- [ ] O contrato registra cliente, automóvel, período e proprietário do automóvel.
- [ ] O pedido passa a **Contratado** e o automóvel fica indisponível no período.

#### HU10 — Registrar automóvel (UC11) · Média
**Como** agente, **quero** cadastrar automóveis informando o tipo de proprietário, **para** que fiquem disponíveis para aluguel.

**Critérios de aceitação**
- [ ] Informo matrícula, ano, marca, modelo e placa (todos obrigatórios).
- [ ] Matrícula e placa não podem repetir (RN11).
- [ ] Defino o proprietário: cliente, empresa ou banco (RN13).

#### HU11 — Conceder contrato de crédito (UC12) · Baixa
**Como** agente banco, **quero** conceder crédito a um aluguel, **para** financiar o cliente.

**Critérios de aceitação**
- [ ] Só agente do tipo Banco acessa esta função (RN09).
- [ ] O contrato de crédito fica vinculado ao contrato de aluguel e ao banco que o concedeu.
- [ ] Só é possível conceder crédito a pedido que o cliente solicitou com crédito e que esteja **Aprovado**.

---

## 3. Regras de Negócio

| Código | Regra |
|---|---|
| **RN01** | O sistema só pode ser usado após cadastro prévio e autenticação (usuário e senha). |
| **RN02** | O nome de usuário é único; a senha deve ter no mínimo 8 caracteres e é guardada com hash. *(valor mínimo sugerido pela equipe)* |
| **RN03** | CPF deve ser válido e único entre clientes. |
| **RN04** | Cada cliente armazena RG, CPF, nome, endereço, profissão e **até 3** empregadores, cada um com o respectivo rendimento. |
| **RN05** | Para criar pedido, o cliente precisa ter os dados de identificação preenchidos. |
| **RN06** | Ciclo de vida do pedido: **Em análise → Aprovado → Contratado**; ou **Em análise → Reprovado**; ou **Cancelado** (a partir de Em análise ou Aprovado). |
| **RN07** | O cliente só pode modificar pedido em **Em análise**. Agentes podem modificar pedidos ainda não contratados. |
| **RN08** | O cliente pode cancelar pedido enquanto não estiver **Contratado**. |
| **RN09** | O aluguel pode estar associado a um contrato de crédito, concedido por um agente banco. |
| **RN10** | Após o pedido, ele é analisado financeiramente por um agente; só com parecer positivo vai à consideração para execução do contrato. |
| **RN11** | Automóvel registra matrícula, ano, marca, modelo e placa; matrícula e placa são únicas. |
| **RN12** | Cliente com pedido em andamento (Em análise, Aprovado ou Contratado) não pode ser excluído. *(decisão da equipe)* |
| **RN13** | Dependendo do tipo de contrato, o automóvel pode pertencer a um cliente, uma empresa ou um banco. |
| **RN14** | Permissões: cliente introduz, modifica, consulta e cancela **seus** pedidos; agentes modificam e avaliam pedidos. |
| **RN15** | Um automóvel não pode estar em dois contratos com períodos sobrepostos. *(decisão da equipe)* |

> Regras marcadas como *(decisão da equipe)* ou *(sugerido)* não estão no enunciado: foram propostas para fechar lacunas. Vale confirmar com o professor.

---

## 4. Requisitos Não Funcionais (do enunciado)

| Código | Requisito |
|---|---|
| **RNF01** | Sistema WEB acessível pela Internet (servidor central ligado aos clientes e agentes). |
| **RNF02** | Back-end em Java (JDK 25) com Spring Boot 4.0.x, arquitetura **MVC**, build com Maven. |
| **RNF03** | Front-end em React + Vite. |
| **RNF04** | Banco de dados Supabase (PostgreSQL). |
| **RNF05** | Autenticação obrigatória por usuário e senha. |
| **RNF06** | Subsistemas: gestão de pedidos e contratos; construção dinâmica das páginas web. |
| **RNF07** | Repositório GitHub atualizado com todas as versões dos modelos UML e o código final; README no template da disciplina. |

---

## 5. Rastreabilidade (Caso de Uso → História → Regras)

| Caso de uso | História | Regras |
|---|---|---|
| UC01 Cadastrar-se | HU01 | RN01, RN02 |
| UC02 Autenticar | HU02 | RN01 |
| UC03 Gerenciar dados do cliente | HU03 | RN03, RN04, RN12 |
| UC04 Introduzir pedido / UC05 Selecionar automóvel | HU04 | RN05, RN06, RN09, RN15 |
| UC06 Consultar pedido e status | HU05 | RN14 |
| UC07 Modificar pedido | HU06 | RN07, RN14 |
| UC08 Cancelar pedido | HU07 | RN08 |
| UC09 Avaliar pedido | HU08 | RN06, RN10 |
| UC10 Executar contrato | HU09 | RN10, RN13, RN15 |
| UC11 Registrar automóvel | HU10 | RN11, RN13 |
| UC12 Conceder contrato de crédito | HU11 | RN09 |
