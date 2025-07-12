async function getStatus() {
  try {
    const res = await fetch('/api/status');
    const data = await res.json();
    document.getElementById('server-status').textContent = `Status: ✅ ${data.status}`;
    updatePlayerList(data.players);
  } catch (err) {
    document.getElementById('server-status').textContent = 'Status: ❌ Offline';
  }
}

function updatePlayerList(raw) {
  const list = document.getElementById('player-list');
  list.innerHTML = '';
  const emoji = ['😎', '🤖', '🧙‍♂️', '🐉', '👻', '👽', '🔥', '🎮'];
  const matches = raw.match(/: (.+)/);
  if (matches && matches[1]) {
    const players = matches[1].split(', ');
    players.forEach(p => {
      const li = document.createElement('li');
      const randEmoji = emoji[Math.floor(Math.random() * emoji.length)];
      li.textContent = `${randEmoji} ${p}`;
      list.appendChild(li);
    });
  }
}

async function sendCommand(cmd) {
  await fetch('/api/command', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ command: cmd })
  });
}

function sendConsoleCommand() {
  const input = document.getElementById('console-input');
  const cmd = input.value.trim();
  if (!cmd) return;
  sendCommand(cmd);
  document.getElementById('command-history').innerHTML += `<p>> ${cmd}</p>`;
  input.value = '';
}

function showTab(tabId) {
  document.querySelectorAll('.tab').forEach(tab => tab.classList.remove('active'));
  document.getElementById(tabId).classList.add('active');
}

getStatus();
setInterval(getStatus, 10000); // Refresh status every 10s
