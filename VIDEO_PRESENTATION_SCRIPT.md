# Roteiro de Apresentação em Vídeo (Foco em Engenharia)

**Tempo Estimado:** 3 a 5 minutos
**Público Alvo:** Avaliadores Técnicos / Recrutadores

---

## 🎬 Introdução: O Desafio (0:00 - 0:45)

**Visual:**
*   **Câmera:** Você falando.
*   **Tela:** Slide de capa "Desafio GDash - Engenharia de Software".

**Roteiro (Fala):**
> "Olá! Meu nome é Felipe e hoje vou apresentar o **Desafio GDash**.
>
> Mais do que apenas entregar uma tela bonita, meu foco neste projeto foi simular um ambiente de engenharia de software real.
>
> O objetivo foi construir uma aplicação distribuída, segura e testável, utilizando boas práticas de desenvolvimento e colaboração com IA para acelerar a entrega sem perder a qualidade."

---

## 🤝 Processo de Desenvolvimento (0:45 - 1:15)

**Visual:**
*   **Tela:** Slide mostrando "Dev + IA".

**Roteiro (Fala):**
> "O desenvolvimento seguiu uma abordagem estratégica de **Engenharia Assistida por IA**.
>
> Ao invés de apenas escrever código, eu atuei como o **Arquiteto de Software**, definindo as restrições de segurança e os padrões de projeto. A IA foi utilizada para acelerar a implementação dessas definições.
>
> Isso transformou o processo: meu foco ficou totalmente na qualidade da arquitetura e na robustez da solução, enquanto a IA eliminou o trabalho repetitivo, permitindo uma entrega de nível sênior em tempo recorde."

---

## 🏗️ Arquitetura e Padrões (1:15 - 2:00)

**Visual:**
*   **Tela:** Diagrama da arquitetura (Microsserviços).

**Roteiro (Fala):**
> "A arquitetura foi projetada para ser resiliente. Utilizamos microsserviços orquestrados via **Docker Compose**.
>
> No Backend, a **Clean Architecture** isola o domínio da aplicação de detalhes externos.
>
> Usamos o **Repository Pattern** para criar uma barreira de proteção entre nossa lógica e os dados. Isso significa que o 'Core' da aplicação não sabe se estamos usando MongoDB, Postgres ou um arquivo de texto. Isso nos dá total flexibilidade para mudar a tecnologia de banco no futuro sem reescrever uma linha sequer da regra de negócio. Também aplicamos **Injeção de Dependência** em todo o projeto para manter o código desacoplado e altamente testável."
>
> A comunicação entre o Coletor de dados e o Worker é feita via **RabbitMQ**, garantindo que o sistema suporte picos de carga sem derrubar a API principal."

---

## 🛡️ Segurança e Qualidade (2:00 - 3:00)

**Visual:**
*   **Tela:** Código mostrando um Teste Unitário ou o Guard de Autenticação.

**Roteiro (Fala):**
> "Segurança e qualidade foram prioridades desde o dia zero.
>
> Implementamos autenticação via **JWT**. Para proteção de dados, utilizamos **DTOs** com validação automática.
>
> Qualquer dado que não siga o contrato estrito é rejeitado ou sanitizado, removendo campos maliciosos ou extras antes que eles atinjam o núcleo da aplicação. Isso blinda o sistema contra injeções."
>
> Além disso, a confiança na aplicação é garantida por uma suíte de **Testes Automatizados**.
>
> *(Mostre um teste rodando)*
>
> Temos testes unitários e de integração que validam desde a lógica de negócio até a comunicação com o banco de dados, garantindo que novas funcionalidades não quebrem o que já existe."

---

## 🚀 Demo: Rodando o Projeto (3:00 - 4:00)

**Visual:**
*   **Tela:** Terminal rodando `docker-compose up` e depois o Dashboard abrindo.

**Roteiro (Fala):**
> "Para rodar o projeto, a experiência do desenvolvedor (DX) é simples.
>
> Com um único comando `docker-compose up`, subimos toda a infraestrutura: Banco, Filas, Backend e Frontend.
>
> Além disso, incluí scripts de automação para rodar a suíte de testes completa com um único comando, facilitando a verificação de qualidade em ambientes de Integração Contínua (CI)."
>
> *(Mostre o Dashboard carregando)*
>
> Aqui vemos o resultado final: uma aplicação performática, atualizando dados em tempo real, sustentada por uma engenharia sólida nos bastidores."

---

## 🏁 Conclusão (4:00 - 4:30)

**Visual:**
*   **Câmera:** Volta para você.

**Roteiro (Fala):**
> "Este projeto demonstra como aplicar engenharia de software moderna para criar soluções robustas.
>
> O foco em testes, segurança e arquitetura limpa garante que o software não apenas funcione hoje, mas seja sustentável a longo prazo.
>
> O código completo e a documentação estão disponíveis no repositório. Obrigado!"
