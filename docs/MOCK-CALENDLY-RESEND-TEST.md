# Mock Calendly + contrato por e-mail (modo de teste)

O fluxo está disponível apenas em `/pt/mock-calendly` (ou `/en/mock-calendly` e `/fr/mock-calendly`) durante desenvolvimento/preview. Ele simula o preenchimento do Calendly, não cobra cartão e cria uma solicitação de assinatura SignWell em `test_mode` antes de enviar o link por Resend.

## Configuração local (SignWell)

Adicione ao `.env.local` (nunca ao código ou ao JSON público):

```ini
ENABLE_MOCK_BOOKING_FLOW=true
RESEND_API_KEY=re_...
RESEND_FROM_EMAIL=Sua equipe <onboarding@resend.dev>
RESEND_TEST_RECIPIENT=seu-email-verificado@example.com
SIGNWELL_API_KEY=seu-token-signwell
SIGNWELL_TEST_MODE=true
SIGNWELL_TEST_RECIPIENT=seu-email-de-teste@example.com
SIGNWELL_WEBHOOK_ID=seu-id-do-webhook
INITIAL_QUESTIONNAIRE_URL=https://...
MOCK_CONSULTANT_NAME=TODO_CONTENT
MOCK_CONSULTANT_RCIC=TODO_CONTENT
MOCK_CONSULTANT_CONTACT=TODO_CONTENT
```

O remetente do Resend deve ser permitido pela conta (o domínio `resend.dev` é apenas para os testes aceitos pela conta).

Se a conta Resend ainda estiver no sandbox, preencha `RESEND_TEST_RECIPIENT` com o e-mail verificado da conta. A mensagem de teste será entregue a esse endereço autorizado.

O SignWell aceita `test_mode=true`; esses documentos não são juridicamente vinculantes e não contam para cobrança.

Em produção, defina `SIGNWELL_TEST_MODE=false`. Nesse modo, o assinante e o destinatário do Resend passam a ser o e-mail real do cliente (`record.email`).

## Arquivamento no Dropbox

Configure no SignWell o webhook para `https://SEU_HOST/api/webhooks/signwell`, ouvindo `document_completed`. O endpoint baixa o PDF final e faz upload para `DROPBOX_CONTRACTS_PATH`. Adicione `DROPBOX_ACCESS_TOKEN` com escopo de escrita em arquivos; essa é uma credencial do Dropbox Storage, não do provedor de assinatura.

## Teste

1. Execute `npm run dev`.
2. Abra `http://localhost:3000/pt/mock-calendly`.
3. Preencha os dados que o Calendly pediria e use um endereço de e-mail controlado pela equipe.
4. Marque a confirmação de teste e clique em **Confirmar pagamento de teste**.
5. Confirme no painel do SignWell (solicitação não vinculante) e na caixa de entrada do Resend.

O endpoint `/api/test/mock-booking` responde `404` quando `NODE_ENV=production` ou quando `ENABLE_MOCK_BOOKING_FLOW` não é exatamente `true`. Não habilite essa flag em produção. O fluxo também não grava o lead no CRM: isso permanece reservado ao webhook real do Calendly.
