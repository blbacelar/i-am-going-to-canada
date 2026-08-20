# Prompt mestre para o Codex

Você é responsável por planejar, projetar, implementar, testar e preparar um preview do revamp completo de `https://iamgoingtocanada.ca/`.

Leia integralmente, antes de agir:

- `AGENTS.md`
- `docs/PROJECT-BRIEF.md`
- `docs/design.md`
- `docs/ARCHITECTURE.md`
- `docs/CONTENT-I18N.md`
- `docs/SKILLS.md`
- `docs/RESEARCH.md`
- `docs/QA-CHECKLIST.md`
- `data/consultants.example.json`
- `data/site-content.example.json`

## Regra principal

Não comece escrevendo a interface final. Primeiro investigue, planeje e estabeleça o sistema visual. Trabalhe por etapas e mantenha o projeto executável ao final de cada etapa.

## Etapa 0 — Inspeção e proteção

1. Inspecione a pasta e determine se existe um projeto, repositório ou trabalho anterior.
2. Preserve todo conteúdo existente e nunca apague trabalho do usuário sem autorização explícita.
3. Identifique package manager, framework, versão do Node e comandos existentes.
4. Se houver Git, examine o status e não sobrescreva alterações alheias.
5. Se o projeto não existir, prepare a criação com Next.js App Router e TypeScript.
6. Registre premissas e lacunas; use placeholders para dados ainda não fornecidos.

## Etapa 1 — Skills e capacidades

Siga `docs/SKILLS.md`.

1. Faça inventário das skills já disponíveis.
2. Não reinstale capacidades equivalentes.
3. Priorize skills oficiais, verificáveis ou de fornecedores reconhecidos.
4. Não instale automaticamente uma skill chamada “Apple Design”, “GPT Taste” ou outra skill de origem incerta.
5. Se uma skill recomendada não estiver disponível, continue usando as regras deste pacote; a falta de uma skill não bloqueia o projeto.
6. Use skills de design para orientar o trabalho, não para impor um template genérico.

## Etapa 2 — Auditoria do site e pesquisa

1. Abra `https://iamgoingtocanada.ca/` e documente:
   - arquitetura da informação;
   - conteúdo aproveitável;
   - serviços e links de agendamento;
   - sinais de confiança;
   - problemas de navegação, legibilidade, responsividade, SEO e conversão;
   - quais elementos deixam o site excessivamente dependente da imagem de Marina.
2. Pesquise os concorrentes e referências listados em `docs/RESEARCH.md`.
3. Compare pelo menos seis sites atuais.
4. Não copie layout, texto, identidade, fotografia ou código de terceiros.
5. Produza `docs/AUDIT-RESULTS.md` e `docs/IMPLEMENTATION-PLAN.md` antes de implementar.

## Etapa 3 — Jornada e arquitetura de conteúdo

Projete o site como um funil consultivo:

1. visitante escolhe EN, FR ou PT;
2. entende rapidamente a proposta da empresa;
3. informa, por meio de uma experiência curta, o tipo de ajuda procurada;
4. vê as consultoras compatíveis, sem receber diagnóstico migratório;
5. compara perfis, serviços e idiomas;
6. abre o perfil da profissional;
7. agenda no Calendly correspondente.

Esse seletor é um concierge de navegação, não um teste de elegibilidade. Não afirmar que o visitante “se qualifica”, “tem chances” ou “deve aplicar”.

Prepare wireframes e a hierarquia de seções antes da interface final. A página inicial deve apresentar a empresa e as quatro profissionais, e não uma narrativa centrada apenas em Marina.

## Etapa 4 — Sistema visual

1. Revise `docs/design.md` e transforme-o em tokens implementáveis.
2. Preserve os ativos de marca válidos encontrados no site atual, mas não permita que uma identidade antiga e inconsistente limite o revamp.
3. Crie uma direção editorial premium, humana, clara e contemporânea.
4. Use princípios associados aos melhores produtos da Apple — clareza, hierarquia, espaço, tipografia, precisão, narrativa visual e movimento controlado — sem copiar Apple.com, liquid glass, componentes proprietários ou aparência de produto tecnológico.
5. Evite os padrões de “site feito por IA”: gradientes roxo/azul genéricos, excesso de glassmorphism, blobs decorativos, cards idênticos, ícones aleatórios, textos artificiais e animações em toda parte.
6. Prepare placeholders fotográficos consistentes para as quatro consultoras. Não gere rostos que possam ser confundidos com as profissionais reais.
7. Faça o design funcionar em EN, FR e PT, inclusive quando o texto francês for mais longo.

## Etapa 5 — Implementação

Implemente conforme `docs/ARCHITECTURE.md`:

- Next.js App Router;
- TypeScript estrito;
- rotas localizadas `/en`, `/fr` e `/pt`;
- conteúdo e consultoras dirigidos por JSON;
- validação do JSON com schema;
- componentes acessíveis e responsivos;
- SEO e dados estruturados por idioma;
- links de Calendly configurados nos dados das consultoras;
- analytics orientado à jornada, sem armazenar informações migratórias sensíveis.

Não introduza banco de dados, CMS, autenticação ou painel administrativo nesta fase. Estruture as interfaces para permitir futura migração para CMS sem reescrever os componentes.

## Etapa 6 — Conteúdo

1. Recupere conteúdo factual válido do site atual.
2. Reescreva para clareza, confiança e conversão, sem inventar credenciais, números, depoimentos ou serviços.
3. Quando uma informação não estiver confirmada, marque-a claramente como `TODO_CONTENT`.
4. Todo conteúdo público deve existir em EN, FR e PT.
5. Inclua disclaimer informando que o conteúdo geral do site não constitui aconselhamento jurídico ou migratório individual.
6. Não use promessas, urgência artificial ou linguagem sensacionalista.

## Etapa 7 — Verificação visual e funcional

1. Inicie o site localmente.
2. Abra-o em navegador e inspecione visualmente todas as rotas principais.
3. Teste pelo menos 375, 768, 1024 e 1440 px.
4. Verifique os três idiomas, menu, seletor de idioma, concierge, filtros, cards, perfis e Calendly.
5. Tire screenshots para comparar e faça pelo menos duas rodadas de refinamento visual.
6. Execute lint, typecheck, testes e build de produção.
7. Faça auditoria de acessibilidade, SEO e performance.
8. Teste `prefers-reduced-motion`, navegação por teclado, foco, contraste e estados de erro.

## Etapa 8 — Refinamento

Refine componentes específicos sem reconstruir aleatoriamente a página:

- hero;
- navegação e seletor de idiomas;
- concierge de escolha;
- cards das consultoras;
- perfil individual;
- prova social;
- FAQ;
- CTA e integração com Calendly;
- footer e disclaimers.

Use bibliotecas de componentes apenas como referência ou ponto de partida. Adapte tudo ao sistema visual e confira licença, acessibilidade, peso e impacto na performance.

## Etapa 9 — Preview e entrega

1. Não publique no domínio de produção.
2. Gere um preview separado somente depois que todos os critérios de `docs/QA-CHECKLIST.md` passarem.
3. Se não houver autorização ou ferramenta de hospedagem, entregue o projeto local completo e as instruções exatas de preview.
4. Entregue um relatório final com:
   - resumo do que foi criado;
   - decisões principais;
   - arquivos alterados;
   - comandos executados;
   - resultados dos testes;
   - URLs de preview, se houver;
   - lista de `TODO_CONTENT`;
   - instruções para substituir as fotos e adicionar uma nova consultora no JSON.

## Definição de pronto

O trabalho só está concluído quando:

- o site compila sem erro;
- o fluxo completo funciona nos três idiomas;
- as quatro consultoras aparecem com o mesmo nível de importância;
- adicionar uma consultora exige apenas editar o JSON e adicionar sua imagem;
- nenhum texto factual foi inventado;
- o site foi verificado visualmente em celular e desktop;
- acessibilidade, SEO e performance foram conferidos;
- existe uma entrega clara para revisão antes da publicação em produção.
