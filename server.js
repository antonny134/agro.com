const express = require('express');
const app = express();
const PORT = process.env.PORT || 3001;

app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  next();
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
