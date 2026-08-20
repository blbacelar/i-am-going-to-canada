# Revamp iamgoingtocanada.ca — pacote para o Codex

Este pacote contém o briefing e as instruções para reconstruir o site da I Am Going To Canada.

## Como usar

1. Crie ou abra a pasta do projeto no Codex.
2. Coloque todos os arquivos deste pacote na raiz do projeto, preservando as pastas `docs/` e `data/`.
3. Envie ao Codex o conteúdo de `01-PROMPT-MESTRE.md` ou mencione esse arquivo no chat.
4. Peça para o Codex trabalhar em modo de planejamento antes de escrever código.
5. Não substitua o site de produção. Gere primeiro uma versão local e depois um preview separado.

O arquivo `AGENTS.md` contém as regras permanentes do projeto. O Codex o lê automaticamente quando ele está na raiz do repositório.

## Ordem dos documentos

1. `01-PROMPT-MESTRE.md` — comando completo de execução.
2. `AGENTS.md` — regras permanentes do repositório.
3. `docs/PROJECT-BRIEF.md` — negócio, público, objetivo e escopo.
4. `docs/design.md` — direção visual e sistema de design.
5. `docs/ARCHITECTURE.md` — arquitetura Next.js, dados e internacionalização.
6. `docs/CONTENT-I18N.md` — regras de conteúdo em inglês, francês e português.
7. `docs/SKILLS.md` — skills recomendadas e política de instalação.
8. `docs/RESEARCH.md` — auditoria e referências competitivas.
9. `docs/QA-CHECKLIST.md` — critérios obrigatórios de conclusão.
10. `docs/OWNER-CONTENT-CHECKLIST.md` — informações e fotos a solicitar à Marina.
11. `data/consultants.example.json` — exemplo de cadastro das consultoras.
12. `data/site-content.example.json` — exemplo de conteúdo trilíngue.

## Decisões já tomadas

- Tecnologia: Next.js App Router + TypeScript.
- Dados das consultoras: arquivo JSON validado; não usar banco de dados nesta fase.
- Idiomas: inglês, francês e português em todas as páginas públicas.
- Conversão principal: encontrar uma consultora compatível e agendar pelo Calendly.
- Equipe inicial: Marina Snyder, Aline, Virginia Melo e Beatriz Dias.
- Fotografias: usar placeholders elegantes até as fotos oficiais serem entregues.
- Posicionamento: a empresa e a equipe vêm antes de Marina individualmente.
- Estilo: editorial premium, humano, contemporâneo e canadense; disciplina visual inspirada na Apple, sem copiar a Apple.
- Segurança de marca: não prometer aprovação, elegibilidade ou resultado migratório.

## Fontes metodológicas

- [Boas práticas oficiais do Codex](https://learn.chatgpt.com/guides/best-practices)
- [Instruções com AGENTS.md](https://learn.chatgpt.com/docs/agent-configuration/agents-md)
- [Skills no Codex](https://learn.chatgpt.com/docs/build-skills)
- [Vídeo de referência do processo visual](https://www.youtube.com/watch?v=pHstb0JGGhE)
