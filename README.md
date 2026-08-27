# Digital Nomad App

## Idiomas / Languages

- [Português (PT-BR)](#portugues-pt-br)
- [English (EN)](#english-en)

<a id="portugues-pt-br"></a>

## Português (PT-BR)

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

<a id="english-en"></a>

## English (EN)

A complete app inspired by the top travel destinations chosen by digital nomads. Users can explore destinations around the world, view details such as tourist attractions, city descriptions, and an interactive map. The app includes features such as search, favorites, filters, and authentication.

[View the full design in Figma.](https://www.figma.com/design/NM5CCCaGU5ovcJzFqPTlaM/Digital-Nomad--Expo-?node-id=0-1&p=f&t=UmtjwMK6EWgpwaMt-0)

## 🚀 Technologies

- **Expo Router** -> File-based navigation that makes the app easier to organize and scale.
- **TanStack Query** -> Efficient async state management, caching, and data revalidation for a smooth user experience.
- **Supabase** -> Complete backend with PostgreSQL database, authentication, and image storage.
- **Frontend Architecture** -> Modular structure inspired by best practices such as Separation of Concerns, Domain-Driven Design, and SOLID, making the code easier to test, maintain, and reuse.
- **Expo EAS (CI/CD)** -> Automated build and deployment pipeline for Android and iOS using Expo Application Services.
- **Expo Updates (Over-the-Air)** -> Fast updates delivered directly to users without requiring app store approval.
- **Store Publishing** -> Complete process for generating builds, configuration, and submission to Google Play and the Apple Store.
- **React Native Testing Library** -> Unit and integration tests that ensure quality and expected behavior for components and business logic.
- **E2E Tests** -> End-to-end test automation that simulates real user interactions in the app.

## 📁 Project Structure

The project follows a clean and modular architecture split into layers:

```text
app/                    # Navigation layer (Expo Router)
src/
  ├── domain/          # Domain layer (entities, repositories, use cases)
  ├── infra/           # Infrastructure layer (implementations, adapters)
  └── ui/              # Presentation layer (components, containers, theme)
```

For more details about the architecture, check the `AGENTS.md` files in each folder.

## 🏃 How to Run

1. **Install dependencies**

   ```bash
   yarn install
   ```

2. **Configure environment variables**

   Create a `.env` file in the project root with your Supabase credentials.

3. **Start the app**

   ```bash
   yarn start
   ```

   Or for specific platforms:

   ```bash
   yarn android
   yarn ios
   ```

## 🧪 Tests

```bash
# Unit and integration tests
yarn test

# E2E tests
yarn test:e2e
```

## 📦 Build and Deploy

```bash
# Development build
eas build --profile development

# Production build
eas build --profile production

# Publish OTA update
eas update
```

## 📚 Documentation for AI Agents

This project contains strategically placed `AGENTS.md` files to help AI agents understand the architecture, patterns, and code conventions:

- `/app/AGENTS.md` - Navigation and route structure
- `/src/AGENTS.md` - General project architecture
- `/src/domain/AGENTS.md` - Domain layer and business rules
- `/src/infra/AGENTS.md` - Infrastructure and implementations
- `/src/ui/AGENTS.md` - UI components and patterns

## 📄 License

This project is an educational example.
