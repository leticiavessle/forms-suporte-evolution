/**
 * Pesquisa de Suporte · Mentoria Hydra Evolution
 * Recebe as respostas do formulário e grava uma linha por resposta na planilha.
 *
 * Passo a passo de instalação: arquivo GUIA.md
 */

// Aba onde as respostas são gravadas. É criada sozinha na primeira resposta.
const NOME_ABA = 'Respostas';

// Opcional: e-mail que recebe um alerta a cada nota de NPS de 0 a 6 (detrator).
// Ex.: 'cx@suaempresa.com' ou 'pessoa1@x.com,pessoa2@x.com'. Vazio = desligado.
const EMAIL_ALERTA = '';

function doPost(e) {
  const lock = LockService.getScriptLock();
  lock.waitLock(30000);
  try {
    const dados = JSON.parse(e.postData.contents);
    const aba = obterAba_();

    // Se a mesma resposta chegar duas vezes (ex.: internet caiu e a pessoa reenviou), grava só uma.
    const id = dados['ID da resposta'];
    if (id && respostaJaExiste_(aba, id)) return responder_({ ok: true, duplicada: true });

    const registro = Object.assign({ 'Data/hora': new Date() }, dados);
    const cabecalho = garantirCabecalho_(aba, Object.keys(registro));
    aba.appendRow(cabecalho.map(coluna => valorSeguro_(registro[coluna])));

    if (EMAIL_ALERTA && dados['Categoria NPS'] === 'Detrator') enviarAlerta_(dados);
    return responder_({ ok: true });
  } catch (err) {
    console.error(err);
    return responder_({ ok: false, erro: String(err) });
  } finally {
    lock.releaseLock();
  }
}

// Abrir a URL no navegador mostra esta mensagem: serve para testar se a publicação deu certo.
function doGet() {
  return responder_({ ok: true, mensagem: 'Endpoint da pesquisa funcionando.' });
}

function obterAba_() {
  const planilha = SpreadsheetApp.getActiveSpreadsheet();
  return planilha.getSheetByName(NOME_ABA) || planilha.insertSheet(NOME_ABA);
}

// Garante que todas as perguntas tenham coluna. Perguntas novas viram colunas novas no fim.
function garantirCabecalho_(aba, chaves) {
  const vazia = aba.getLastRow() === 0;
  const cabecalho = vazia ? [] : aba.getRange(1, 1, 1, aba.getLastColumn()).getValues()[0];
  const novas = chaves.filter(c => cabecalho.indexOf(c) === -1);
  if (!novas.length) return cabecalho;

  const total = cabecalho.length + novas.length;
  if (aba.getMaxColumns() < total) aba.insertColumnsAfter(aba.getMaxColumns(), total - aba.getMaxColumns());
  aba.getRange(1, cabecalho.length + 1, 1, novas.length)
    .setValues([novas])
    .setFontWeight('bold')
    .setBackground('#15130F')
    .setFontColor('#F6F2E9');
  if (vazia) aba.setFrozenRows(1);
  return cabecalho.concat(novas);
}

function respostaJaExiste_(aba, id) {
  const ultima = aba.getLastRow();
  if (ultima < 2) return false;
  const cabecalho = aba.getRange(1, 1, 1, aba.getLastColumn()).getValues()[0];
  const coluna = cabecalho.indexOf('ID da resposta') + 1;
  if (!coluna) return false;
  return !!aba.getRange(2, coluna, ultima - 1, 1).createTextFinder(id).matchEntireCell(true).findNext();
}

// O apóstrofo faz o Sheets guardar o texto exatamente como veio:
// não vira fórmula, data ou hora (ex.: "=SOMA(...)" ou "1:1").
function valorSeguro_(valor) {
  if (valor === undefined || valor === null) return '';
  if (typeof valor === 'string' && valor !== '') return "'" + valor;
  return valor;
}

function enviarAlerta_(d) {
  const campo = nome => (d[nome] === undefined || d[nome] === '' ? '-' : d[nome]);
  const assunto = 'Alerta de detrator · NPS ' + campo('NPS (0 a 10)') + ' · ' + campo('Nome');
  const corpo = [
    'Chegou uma resposta com nota baixa na Pesquisa de Suporte da Hydra Evolution.',
    '',
    'Nome: ' + campo('Nome'),
    'E-mail: ' + campo('E-mail'),
    'WhatsApp: ' + campo('WhatsApp'),
    'Pode entrar em contato: ' + campo('Pode entrar em contato'),
    '',
    'Tempo na mentoria: ' + campo('Tempo na mentoria'),
    'Estratégia: ' + campo('Estratégia de tráfego'),
    'Fase da operação: ' + campo('Fase da operação'),
    'Onde mais trava: ' + campo('Onde mais trava'),
    'Dificuldades com vídeos: ' + campo('Dificuldades na criação de vídeos'),
    '',
    'Maior dificuldade: ' + campo('Maior dificuldade'),
    'Motivo da nota: ' + campo('Motivo da nota'),
    'Mudaria UMA coisa no suporte: ' + campo('Mudaria UMA coisa no suporte'),
  ].join('\n');
  MailApp.sendEmail(EMAIL_ALERTA, assunto, corpo);
}

function responder_(objeto) {
  return ContentService.createTextOutput(JSON.stringify(objeto)).setMimeType(ContentService.MimeType.JSON);
}
