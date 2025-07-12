const express = require('express');
const cors = require('cors');
const path = require('path');           // adaugă asta
const { Rcon } = require('rcon-client');

const app = express();
app.use(cors());
app.use(express.json());

// Servește fișiere statice (ex: index.html)
app.use(express.static(path.join(__dirname)));

const RCON_HOST = '191.96.231.11';
const RCON_PORT = 25575;
const RCON_PASSWORD = 'ParolaTaPuternica123';

let rconClient;

async function connectRcon() {
  if (!rconClient || !rconClient.connected) {
    rconClient = await Rcon.connect({
      host: RCON_HOST,
      port: RCON_PORT,
      password: RCON_PASSWORD,
    });

    rconClient.on('end', () => {
      rconClient = null;
      console.log('RCON connection closed');
    });
  }
  return rconClient;
}

app.get('/api/status', async (req, res) => {
  try {
    const rcon = await connectRcon();
    const response = await rcon.send('list');
    res.json({ status: 'online', players: response });
  } catch (error) {
    res.status(500).json({ status: 'offline', error: error.message });
  }
});

app.post('/api/command', async (req, res) => {
  const { command } = req.body;
  if (!command) {
    return res.status(400).json({ error: 'No command provided' });
  }

  try {
    const rcon = await connectRcon();
    const result = await rcon.send(command);
    res.json({ result });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`ZeeHUB backend running on http://localhost:${PORT}`);
});
