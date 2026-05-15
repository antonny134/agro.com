const express = require('express');
const app = express();
const PORT = process.env.PORT || 3001;

app.use(express.json());
app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,POST,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  next();
});

app.options('*', (req, res) => res.sendStatus(204));

function normalizar(texto) {
  return texto.toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '');
}

function gerarRespostaIA(msg) {
  const texto = normalizar(msg);

  const conhecimento = [
    {
      chaves: ['irrigação','irrigar','regar','água','molhar','umidade','aspersão','gotejamento','sulco','seco','encharcar'],
      resposta: `💧 <b>Irrigação Agrícola</b><br>
        • <b>Gotejamento:</b> Ideal para frutas e hortaliças — econômiza até 50% de água<br>
        • <b>Aspersão:</b> Boa para grãos e pastagens<br>
        • <b>Sulco:</b> Tradicional, usado em cana-de-açúcar e milho<br><br>
        💡 <b>Dica:</b> Use o comando <b>solo [umidade] [temperatura]</b> para a IA analisar se seu solo precisa de água!`
    },
    {
      chaves: ['praga','inseto','lagarta','pulgão','mosca','percevejo','besouro','broca','controle','defensivo','pesticida','manejo integrado'],
      resposta: `🐛 <b>Controle de Pragas</b><br>
        • <b>MIP (Manejo Integrado):</b> Monitore antes de aplicar defensivos<br>
        • <b>Controle biológico:</b> Trichogramma, Bacillus thuringiensis, predadores naturais<br>
        • <b>Armadilhas:</b> Feromônios para monitoramento<br>
        • <b>Rotação de culturas:</b> Quebra o ciclo de pragas<br><br>
        ⚠️ Sempre consulte um agrônomo antes de aplicar agrotóxicos.`
    },
    {
      chaves: ['doença','fungo','ferrugem','mancha','podridão','míldio','antracnose'],
      resposta: `🍂 <b>Doenças nas Plantas</b><br>
        • <b>Fungos:</b> Aplique fungicidas preventivos em épocas úmidas<br>
        • <b>Ferrugem:</b> Comum em soja e café — use variedades resistentes<br>
        • <b>Bacterioses:</b> Evite ferimentos e use sementes certificadas<br>
        • <b>Prevenção:</b> Boa ventilação, espaçamento adequado e rotação de cultura<br><br>
        🌿 O diagnóstico correto é fundamental — consulte um fitopatologista.`
    },
    {
      chaves: ['solo','terra','adubo','fertilizante','npk','calcário','ph','nutriente','matéria orgânica','fertilidade','textura','compactação','calagem'],
      resposta: `🌍 <b>Solos e Nutrição</b><br>
        • <b>pH ideal:</b> 6.0 a 6.5 para maioria das culturas<br>
        • <b>Calagem:</b> Corrija o pH com calcário antes do plantio<br>
        • <b>NPK:</b> N (crescimento), P (raízes), K (resistência e frutos)<br>
        • <b>Matéria orgânica:</b> Compostagem melhora estrutura e retenção de água<br><br>
        💡 Use o comando <b>solo [umidade 0-10] [temperatura 0-10]</b> para análise de irrigação!`
    },
    {
      chaves: ['plantio','semear','semente','cultivar','mudas','época','plantar','preparo'],
      resposta: `🌱 <b>Plantio e Semeadura</b><br>
        • <b>Época:</b> Respeite o zoneamento agrícola da sua região<br>
        • <b>Espaçamento:</b> Varia por cultura — consulte a embalagem da semente<br>
        • <b>Profundidade:</b> Sementes pequenas: 1-2cm | Grandes: 3-5cm<br>
        • <b>Qualidade:</b> Use sementes certificadas com boa germinação<br>
        • <b>Preparo do solo:</b> Aração + gradagem + calagem (30 dias antes)`
    },
    {
      chaves: ['colheita','colher','produção','safra','produtividade','rendimento'],
      resposta: `🌾 <b>Colheita e Produtividade</b><br>
        • <b>Ponto de colheita:</b> Observe cor, tamanho e teor de umidade do grão<br>
        • <b>Mecanização:</b> Colhedoras reduzem perdas e custos<br>
        • <b>Armazenamento:</b> Grãos devem ter ≤13% de umidade para armazenar<br>
        • <b>Pós-colheita:</b> Seque, limpe e armazene em local ventilado e seco<br><br>
        📊 Produtividade depende: genética + ambiente + manejo`
    },
    {
      chaves: ['soja','milho','trigo','arroz','feijão','café','cana','algodão','mandioca'],
      resposta: `🌿 <b>Principais Culturas do Brasil</b><br>
        • 🟡 <b>Soja:</b> Maior exportação — ciclo 100-130 dias<br>
        • 🌽 <b>Milho:</b> Safrinha de março ganha espaço<br>
        • ☕ <b>Café:</b> Brasil é maior produtor mundial<br>
        • 🍬 <b>Cana:</b> Etanol e açúcar — colheita mecanizada<br>
        • 🌾 <b>Trigo:</b> Sul do Brasil — inverno<br><br>
        Qual cultura você quer saber mais? Pergunte!`
    },
    {
      chaves: ['clima','chuva','seca','temperatura','geada','vento','previsão','tempo','estação','meteorologia','frio','calor'],
      resposta: `🌤️ <b>Clima e Agricultura</b><br>
        • <b>Seca:</b> Irrigação de salvação + cobertura do solo<br>
        • <b>Geada:</b> Plantio tardio, quebra-ventos, irrigação noturna preventiva<br>
        • <b>Excesso de chuva:</b> Drenagem, canteiros elevados<br>
        • <b>Apps úteis:</b> Agritempo (Embrapa), Climatempo Agro, INMET<br><br>
        🌡️ Use <b>solo [umidade] [temperatura]</b> para análise de irrigação.`
    },
    {
      chaves: ['adubo','composto','húmus','esterco','orgânico','biofertilizante','húmus de minhoca','adubação verde'],
      resposta: `♻️ <b>Adubação Orgânica</b><br>
        • <b>Esterco bovino:</b> Rico em N, P, K — cure por 60 dias antes de usar<br>
        • <b>Compostagem:</b> Restos vegetais + esterco — leva 60-90 dias<br>
        • <b>Húmus de minhoca:</b> Alta qualidade biológica e química<br>
        • <b>Biofertilizante:</b> Fermentado líquido foliar ou solo<br><br>
        🌱 Adubação verde: Crotalária, Brachiaria e Nabo forrageiro melhoram o solo!`
    },
    {
      chaves: ['agronegócio','mercado','preço','exportação','cotação','commodity','PIB','preços'],
      resposta: `📈 <b>Agronegócio Brasileiro</b><br>
        • Brasil é TOP 3 exportador: soja, carne, café, açúcar<br>
        • Agro representa ~27% do PIB nacional<br>
        • <b>Cotações:</b> CEPEA/Esalq, B3, Chicago (CBOT)<br>
        • <b>Tendências:</b> Agricultura de precisão, rastreabilidade, ESG<br><br>
        💹 Diversificação de culturas reduz risco de preço!`
    },
    {
      chaves: ['olá','oi','bom dia','boa tarde','boa noite','hey','hello','tudo bem'],
      resposta: `👋 <b>Olá! Bem-vindo à Agro.ia!</b><br>
        Sou sua inteligência artificial agrícola, criada para ajudar com:<br>
        🌱 Plantio e cultivo &nbsp;|&nbsp; 💧 Irrigação &nbsp;|&nbsp; 🐛 Pragas<br>
        🌍 Solos e adubação &nbsp;|&nbsp; 🌾 Colheita &nbsp;|&nbsp; ☁️ Clima<br><br>
        Pergunte qualquer coisa sobre agricultura! 🚜`
    },
    {
      chaves: ['obrigado','obrigada','valeu','grato','agradeço'],
      resposta: `😊 <b>Fico feliz em ajudar!</b><br>
        Qualquer dúvida sobre agricultura, estou aqui! 🌱<br>
        Use <b>solo [umidade] [temperatura]</b> para analisar a necessidade de irrigação da sua lavoura.`
    },
    {
      chaves: ['ajuda','comandos','o que você faz','como usar','funciona'],
      resposta: `🤖 <b>Comandos da Agro.ia:</b><br>
        • <b>Pergunte livremente</b> sobre agricultura<br>
        • <b>solo 3 8</b> → Análise de irrigação pela rede neural<br><br>
        📚 <b>Temas que domino:</b><br>
        Irrigação • Pragas • Doenças • Solos • Plantio<br>
        Colheita • Clima • Adubação • Agronegócio • Culturas`
    }
  ];

  let melhorScore = 0;
  let melhorResposta = null;

  for (const item of conhecimento) {
    let score = 0;
    for (const chave of item.chaves) {
      const chaveNorm = normalizar(chave);
      if (texto.includes(chaveNorm)) score += 1;
    }
    if (score > 0 && /\b(como|quando|qual|por que|preciso|devo|recomenda|onde|melhor)\b/.test(texto)) {
      score += 1;
    }
    if (score > melhorScore) {
      melhorScore = score;
      melhorResposta = item.resposta;
    }
  }

  if (melhorResposta && melhorScore >= 2) return melhorResposta;

  if (texto.includes('solo') || texto.includes('umidade') || texto.includes('temperatura') || texto.includes('regar') || texto.includes('irrig')) {
    return `🌱 <b>Quer analisar seu solo?</b><br>
      Use o comando: <b>solo [umidade 0-10] [temperatura 0-10]</b><br>
      Exemplo: <em>solo 3 8</em><br>
      Assim a Agro.ia usa a rede neural para prever a necessidade de irrigação e recomenda se o solo precisa de água.`;
  }

  if (texto.includes('praga') || texto.includes('doença') || texto.includes('inseto') || texto.includes('fungo')) {
    return `🐛 <b>Fale mais sobre a praga ou doença.</b><br>
      Pergunte, por exemplo: <em>como controlar pulgão</em> ou <em>o que fazer com ferrugem</em>.<br>
      Posso ajudar com manejo integrado, armadilhas e prevenção.`;
  }

  return `🤔 <b>Não entendi bem sua pergunta.</b><br>
    Pergunte sobre plantio, irrigação, pragas, doenças, solos, colheita, adubação ou clima.<br><br>
    Exemplo: <em>solo 3 8</em> ou <em>como plantar feijão</em> ou <em>qual adubo usar</em>.`;
}

const OPENAI_API_KEY = process.env.OPENAI_API_KEY || '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';
const OPENAI_MODEL = process.env.OPENAI_MODEL || 'gpt-3.5-turbo';

async function callOpenAI(message) {
  if (!OPENAI_API_KEY) {
    throw new Error('OPENAI_API_KEY não configurada');
  }

  const fetch = (...args) => import('node-fetch').then(({ default: fetch }) => fetch(...args));
  const response = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${OPENAI_API_KEY}`
    },
    body: JSON.stringify({
      model: OPENAI_MODEL,
      messages: [
        { role: 'system', content: 'Você é uma assistente agrícola que responde de forma clara, curta e prática.' },
        { role: 'user', content: message }
      ],
      temperature: 0.7,
      max_tokens: 300
    })
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`OpenAI erro ${response.status}: ${errorText}`);
  }

  const data = await response.json();
  return data.choices?.[0]?.message?.content?.trim();
}

app.post('/api/ia', async (req, res) => {
  const message = req.body?.message;
  if (!message || typeof message !== 'string') {
    return res.status(400).json({ error: 'Envie a mensagem no corpo como { "message": "texto" }.' });
  }

  if (OPENAI_API_KEY) {
    try {
      const answer = await callOpenAI(message);
      return res.json({ answer: answer || gerarRespostaIA(message) });
    } catch (error) {
      console.error('Erro OpenAI:', error);
      const answer = gerarRespostaIA(message);
      return res.json({ answer, warning: 'Usando fallback local, OpenAI falhou.' });
    }
  }

  const answer = gerarRespostaIA(message);
  return res.json({ answer });
});

app.get('/api/cotacoes', async (req, res) => {
  const symbols = ['AGRO3.SA', 'JBSS3.SA', 'BRFS3.SA', 'MRFG3.SA', 'SLCE3.SA'];
  const yahooUrl = `https://query1.finance.yahoo.com/v7/finance/quote?symbols=${symbols.join(',')}`;

  try {
    const fetch = (...args) => import('node-fetch').then(({ default: fetch }) => fetch(...args));
    const response = await fetch(yahooUrl, { headers: { 'User-Agent': 'Mozilla/5.0' } });

    if (!response.ok) {
      return res.status(response.status).json({ error: `Erro na consulta externa: ${response.status}` });
    }

    const data = await response.json();
    return res.json(data);
  } catch (error) {
    console.error('Erro ao buscar cotações:', error);
    return res.status(500).json({ error: 'Falha ao obter cotações.' });
  }
});

app.get('/', (req, res) => {
  res.send('Servidor de cotações do Agro rodando. Use /api/cotacoes');
});

app.listen(PORT, () => {
  console.log(`Backend de cotações rodando em http://127.0.0.1:${PORT}`);
});
