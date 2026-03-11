# Digital Nomad App

Aplicativo completo inspirado nos principais destinos de viagem escolhidos por nômades digitais. O usuário poderá explorar destinos ao redor do mundo, visualizar detalhes como pontos turísticos, descrição da cidade e mapa interativo. O app inclui funcionalidades como busca, favoritos, filtros e autenticação.

[Veja o design completo no Figma.](https://www.figma.com/design/NM5CCCaGU5ovcJzFqPTlaM/Digital-Nomad--Expo-?node-id=0-1&p=f&t=UmtjwMK6EWgpwaMt-0)

## 🚀 Tecnologias

- **Expo Router** → Navegação com rotas baseadas em arquivos, facilitando a organização e a escalabilidade do app.
- **TanStack Query** → Controle eficiente de estados assíncronos, cache e revalidação de dados com uma experiência fluida para o usuário.
- **Supabase** → Backend completo com banco de dados PostgreSQL, autenticação, e storage para imagens.
- **Arquitetura para Frontend** → Estrutura modular inspirada em boas práticas como Separation of Concerns, Domain-Driven Design e SOLID facilitando testes, manutenção e reuso de código.
- **Expo EAS (CI/CD)** → Pipeline automatizado de build e deploy para Android e iOS usando o Expo Application Services.
- **Expo Updates (Over-the-Air)** → Atualizações rápidas e sem necessidade de aprovação nas lojas, entregues direto para os usuários.
- **Publicação nas Lojas** → Processo completo de geração de builds, configuração e envio para Google Play e Apple Store.
- **React Native Testing Library** → Testes de unidade e integração garantindo qualidade e comportamento esperado dos componentes e lógica de negócio.
- **Testes E2E** → Automação de testes ponta a ponta, simulando interações reais de usuários no app.

## 📁 Estrutura do Projeto

O projeto segue uma arquitetura limpa e modular, dividida em camadas:

```
app/                    # Camada de navegação (Expo Router)
src/
  ├── domain/          # Camada de domínio (entidades, repositórios, casos de uso)
  ├── infra/           # Camada de infraestrutura (implementações, adapters)
  └── ui/              # Camada de apresentação (componentes, containers, theme)
```

Para mais detalhes sobre a arquitetura, consulte os arquivos `AGENTS.md` em cada pasta.

## 🏃 Como Executar

1. **Instalar dependências**

   ```bash
   yarn install
   ```

2. **Configurar variáveis de ambiente**

   Crie um arquivo `.env` na raiz do projeto com suas credenciais do Supabase.

3. **Iniciar o app**

   ```bash
   yarn start
   ```

   Ou para plataformas específicas:

   ```bash
   yarn android
   yarn ios
   ```

## 🧪 Testes

```bash
# Testes de unidade e integração
yarn test

# Testes E2E
yarn test:e2e
```

## 📦 Build e Deploy

```bash
# Build de desenvolvimento
eas build --profile development

# Build de produção
eas build --profile production

# Publicar atualização OTA
eas update
```

## 📚 Documentação para Agentes de IA

Este projeto contém arquivos `AGENTS.md` estrategicamente posicionados para ajudar agentes de IA a entenderem a arquitetura, padrões e convenções do código:

- `/app/AGENTS.md` - Navegação e estrutura de rotas
- `/src/AGENTS.md` - Arquitetura geral do projeto
- `/src/domain/AGENTS.md` - Camada de domínio e regras de negócio
- `/src/infra/AGENTS.md` - Infraestrutura e implementações
- `/src/ui/AGENTS.md` - Componentes e padrões de UI

## 📄 Licença

Este projeto é um exemplo educacional.
