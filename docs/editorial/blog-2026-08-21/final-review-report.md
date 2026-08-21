# Relatório final — Canada Immigration Newsroom

Data do pacote: 21 de agosto de 2026  
Status final: `approved_for_publish`  
Publicação autorizada: **sim — 21 de agosto de 2026**

## Decisão editorial

As três pautas e os textos integrais em PT-BR, EN-CA e FR-CA foram aprovados pela Marina Snyder (RCIC-IRB R519265) em 21 de agosto de 2026. O pacote foi produzido, localizado e submetido a revisões independentes de fatos, ética e copy/SEO.

O pacote aprovado corresponde ao conteúdo versionado em `data/articles.json` no commit de publicação.
Hash SHA-256 do conteúdo aprovado: `7a6ad2b47dc651f9db81157fdb48e82e2dd95e5b45a4422c37191bbbf02bfc37`.

## Artigos entregues

### 1. Express Entry — três rodadas em agosto

| Idioma | Slug | Meta title |
|---|---|---|
| PT-BR | `express-entry-tres-rodadas-cortes-crs-explicados` | Express Entry: entenda os cortes 760, 523 e 382 |
| EN-CA | `express-entry-three-rounds-crs-cutoffs-explained` | Express Entry cut-off scores: 760, 523 and 382 |
| FR-CA | `entree-express-trois-rondes-seuils-scg-expliques` | Entrée express : comprendre les seuils 760, 523 et 382 |

Schema proposto: `NewsArticle`  
Próxima revisão de atualidade: 28 de agosto de 2026

### 2. TFWP — cálculo do limite em locais menores

| Idioma | Slug | Meta title |
|---|---|---|
| PT-BR | `tfwp-limite-vagas-baixa-remuneracao-locais-pequenos` | TFWP: limite para locais com menos de 10 funcionários |
| EN-CA | `tfwp-low-wage-cap-small-work-locations` | TFWP low-wage cap for work locations under 10 employees |
| FR-CA | `ptet-limite-postes-bas-salaire-petits-lieux-travail` | PTET : limite pour les lieux de travail de moins de 10 employés |

Schema proposto: `Article`  
Próxima revisão de atualidade: 28 de agosto de 2026

### 3. PEI — consulta sobre proteção de trabalhadores estrangeiros temporários

| Idioma | Slug | Meta title |
|---|---|---|
| PT-BR | `ilha-principe-eduardo-consulta-trabalhadores-estrangeiros-temporarios` | PEI consulta regras para trabalhadores estrangeiros temporários |
| EN-CA | `pei-temporary-foreign-worker-regulations-consultation` | PEI consultation on temporary foreign worker rules |
| FR-CA | `ile-du-prince-edouard-consultation-travailleurs-etrangers-temporaires` | Î.-P.-É. consulte sur les travailleurs étrangers temporaires |

Schema proposto: `NewsArticle`  
Próxima revisão de atualidade: 18 de setembro de 2026

## Revisão factual

Resultado: **PASS** após correções.

- Express Entry: rodadas nº 435, 436 e 437; 442, 1.000 e 5.000 convites; CRS 760, 523 e 382; soma de 6.442 confirmada nos dados oficiais do IRCC.
- Os três cortes são apresentados como resultados de grupos de seleção distintos. Convite não é descrito como aprovação ou admissão.
- TFWP: base de cálculo de dez, máximos de um ou dois trabalhadores, contagem de 0,5 para meio período e composição do quadro confirmados nas páginas atuais do ESDC.
- 18 de agosto de 2026 é descrito como data de atualização da orientação, não como data de vigência. O texto não presume retroatividade.
- PEI: abertura em 20 de agosto, prazo em 17 de setembro, valores propostos de C$500 a C$3.000 e dobra em caso de repetição dentro de três anos confirmados.
- A segunda fase de PEI é sempre descrita como minuta em consulta e ainda não vigente. A primeira fase, em vigor desde 1º de abril de 2025, permanece separada.
- Links oficiais foram localizados quando havia página oficial equivalente em francês.

Fontes primárias: IRCC, Employment and Social Development Canada e Government of Prince Edward Island. Os links diretos estão associados aos fatos relevantes em cada artigo e reunidos novamente na seção de fontes.

## Revisão ética e de conformidade

Resultado: **PASS e aprovado para publicação**.

- Nenhum texto promete elegibilidade, aprovação, admissão, prazo ou resultado.
- Nenhum artigo transforma informação geral em recomendação individual.
- Os CTAs encaminham a uma conversa com profissional autorizada e dizem expressamente que a consulta não influencia decisões governamentais.
- A nota informativa obrigatória está presente e semanticamente equivalente em PT-BR, EN-CA e FR-CA.
- `reviewer` está registrado como Marina Snyder e a credencial informada é RCIC-IRB R519265.

## SEO, estrutura e dados estruturados

Resultado: **PASS para publicação em produção**.

- H1 único, H2 e H3 semânticos em todas as versões.
- Slugs, meta titles e meta descriptions localizados.
- Canonical próprio e alternates `en-CA`, `fr-CA` e `pt-BR` com os slugs equivalentes.
- JSON-LD `Article` ou `NewsArticle`, com `dateCreated`, idioma, organização autora, publisher e `mainEntityOfPage`.
- `datePublished` e `reviewedBy` foram incluídos após a aprovação. Não há imagem editorial associada neste release.
- Páginas estão indexáveis e as rotas aprovadas entram no sitemap.

## Integração no aplicativo

- Nova opção “Articles / Articles / Artigos” no menu desktop, menu mobile e rodapé.
- Índice editorial em `/[locale]/blog`.
- Nove rotas estáticas de artigo: três matérias em três idiomas.
- Troca de idioma preserva o artigo e usa o slug localizado correto.
- Design mantém a tipografia, cores, bordas, superfícies e linguagem editorial do aplicativo.
- O conteúdo vem de uma fonte JSON validada por schema; slugs duplicados e referências a fontes inexistentes são rejeitados.

## Pendências pós-publicação

1. Produzir ou aprovar um asset editorial real antes de incluir `image` no JSON-LD e nos metadados sociais.
2. Executar a verificação de atualidade antes de qualquer atualização material.
3. Em caso de alteração factual, registrar `modifiedAt`, nota de correção e nova revisão nos três idiomas.

## Aprovação

- Pautas: **aprovadas pela Marina**.
- Fatos e fontes: **aprovados**.
- Ética e conformidade: **aprovadas**.
- Textos integrais: **aprovados pela Marina Snyder (RCIC-IRB R519265), em 21/08/2026**.
- Destino: **produção**.
- Publicação: **autorizada**.

Status de saída: `approved_for_publish`
