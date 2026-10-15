# Pesquisa de Suporte · Mentoria Hydra Evolution

**Link de teste:** https://leticiavessle.github.io/forms-suporte-evolution/

**Link de revisão (para o time):** https://leticiavessle.github.io/forms-suporte-evolution/?revisao
Avança pelas etapas sem precisar responder, mostra as perguntas condicionais com uma nota e nunca envia nada, mesmo depois que a planilha estiver conectada. Não mande este link para os Sócios.

Enquanto a planilha não estiver conectada, a página mostra uma faixa amarela de **Modo de teste**: dá para responder a pesquisa inteira e ver a tela final, mas nada é salvo. Quando você fizer os passos 1 e 2 abaixo, **o mesmo link** passa a gravar as respostas.

## O que tem neste repositório

| Arquivo | Para que serve |
|---|---|
| `index.html` | A página da pesquisa (é ela que aparece no link). |
| `apps-script.gs` | O código que recebe as respostas e grava na planilha do Google. |
| `GUIA.md` | Este guia. |

Como funciona: o Sócio abre o link e responde. A página envia as respostas para um script do Google, que grava **uma linha por pessoa** numa planilha sua. Tudo gratuito.

---

## Passo 1 · Criar a planilha que recebe as respostas (10 min)

1. Entre na conta Google que vai ser dona das respostas e abra **sheets.new**. Dê o nome *Pesquisa de Suporte · Hydra Evolution*.
2. No menu, clique em **Extensões > Apps Script**.
3. Apague tudo o que estiver no arquivo `Código.gs`, cole o conteúdo inteiro do arquivo [`apps-script.gs`](apps-script.gs) e clique no ícone de salvar.
4. *(Opcional, recomendado)* Na linha `const EMAIL_ALERTA = '';`, coloque entre as aspas o e-mail do time de CX. Toda nota de NPS de 0 a 6 chega como alerta nesse e-mail.
5. Clique em **Implantar > Nova implantação**. Na engrenagem ao lado de "Selecionar tipo", escolha **App da Web** e preencha:
   - Descrição: `Pesquisa v1`
   - Executar como: **Eu**
   - Quem pode acessar: **Qualquer pessoa**
6. Clique em **Implantar > Autorizar acesso** e escolha a sua conta. Vai aparecer *"O Google não verificou este app"*. É normal, porque o app é seu: clique em **Avançado > Acessar (não seguro) > Permitir**.
7. Copie a **URL do app da Web** (termina em `/exec`).
8. Teste: cole essa URL no navegador. Tem que aparecer `{"ok":true,"mensagem":"Endpoint da pesquisa funcionando."}`.

## Passo 2 · Conectar a página à planilha (2 min, pelo próprio GitHub)

1. Abra o arquivo [`index.html`](index.html) aqui no GitHub e clique no **ícone de lápis** (*Edit this file*).
2. Com **Ctrl+F** (ou **Cmd+F** no Mac), procure por `ENDPOINT: ''`.
3. Cole a URL do passo 1 entre as aspas, assim:
   `ENDPOINT: 'https://script.google.com/macros/s/AKfy.../exec',`
4. Clique em **Commit changes** e confirme.

Em 1 ou 2 minutos o link de teste já grava na planilha e a faixa amarela some. Se preferir, mande a URL para o Claude e ele faz essa troca.

## Passo 3 · Testar antes de disparar

1. Abra o link **no celular** e responda a pesquisa inteira uma vez.
2. Confira se a linha apareceu na aba **Respostas** da planilha.
3. Apague a linha de teste (botão direito no número da linha > Excluir linha).

## Passo 4 · Link oficial

O link de teste já pode ser o link oficial. Se quiser um endereço com o nome da marca (ex.: `pesquisa.seudominio.com.br`), vá em **Settings > Pages > Custom domain** neste repositório e crie no DNS do domínio um registro **CNAME** apontando para `leticiavessle.github.io`.

> O repositório é **público**, porque é isso que permite o GitHub Pages gratuito. Ele só tem o código da página: nenhuma resposta fica aqui, as respostas vão direto para a sua planilha. A página também não aparece em buscas do Google (`noindex`).

---

## Divulgação

Acrescente `?origem=` ao link para saber de onde veio cada resposta (coluna **Origem** da planilha):

- `https://leticiavessle.github.io/forms-suporte-evolution/?origem=whatsapp`
- `https://leticiavessle.github.io/forms-suporte-evolution/?origem=circle`
- `https://leticiavessle.github.io/forms-suporte-evolution/?origem=call`

## Lendo os resultados

**Dificuldade individual de cada Sócio.** Cada linha é uma pessoa, com nome, e-mail e WhatsApp. Para ver alguém específico, use **Dados > Criar um filtro** e filtre pelo e-mail. As colunas que mostram a trava da pessoa, lado a lado:

- **Estratégia de tráfego**: pago, orgânico, os dois ou ainda não definiu.
- **Fase da operação**.
- **Onde mais trava**.
- **Vídeos produzidos por semana** e **Dificuldades na criação de vídeos** (vale para anúncio e orgânico).
- **Maior dificuldade**: o relato com as palavras da própria pessoa.

Para comparar orgânico com pago, filtre a coluna **Estratégia de tráfego** e leia as mesmas colunas acima.

**Indicadores gerais:**

- **NPS** = % de promotores (9 e 10) menos % de detratores (0 a 6). A coluna **Categoria NPS** já vem preenchida (coluna `BG` da planilha). Fórmula pronta:
  `=(CONT.SE(Respostas!BG:BG;"Promotor")-CONT.SE(Respostas!BG:BG;"Detrator"))/(CONT.VALORES(Respostas!BG:BG)-1)*100`
- **Esforço para conseguir ajuda (CES, 1 a 7)**: média abaixo de 5 indica que pedir ajuda está custando caro para o Sócio.
- **"Se a mentoria acabasse amanhã"**: 40% ou mais de "Muito desapontado(a)" é sinal forte de valor percebido.
- **Canais**: cruze *uso* com *por que não usa*. Muito "Não sabia que existia" ou "Não sei como acessar" é problema de onboarding e comunicação, não de atendimento.
- **Resolvido no 1º contato** baixo + **WhatsApp · tempo de resposta** alto: o gargalo é de capacidade ou de base de respostas prontas.
- Cruze **Fase da operação**, **Onde mais trava** e **Temas** para montar o cronograma de aulas.
- **Feche o ciclo**: detratores que marcaram "Sim, pode me chamar" devem receber contato em até 48h.

## Mudanças futuras

- **Editar perguntas:** em `index.html`, procure o bloco `const STEPS`. Cada pergunta tem um `col`, que é o nome da coluna na planilha. Pergunta nova vira coluna nova no fim da planilha, sem quebrar nada.
- **Editar o código da planilha:** depois de salvar no Apps Script, vá em **Implantar > Gerenciar implantações > ícone de lápis > Versão: Nova versão > Implantar**. Sem isso, o Google continua rodando a versão antiga. A URL não muda.

## Privacidade

- As respostas ficam só na sua planilha. Não compartilhe a planilha com "qualquer pessoa com o link".
- Rascunhos ficam salvos apenas no aparelho de quem responde e são apagados no envio.
