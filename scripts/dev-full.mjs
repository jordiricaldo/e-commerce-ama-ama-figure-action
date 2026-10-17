import { spawn } from 'node:child_process';
import http from 'node:http';
import net from 'node:net';

const apiPort = Number(process.env.API_PORT || 4000);
const frontendPort = Number(process.env.FRONTEND_PORT || 3000);
const children = [];

function portIsOpen(port) {
  return new Promise(resolve => {
    const socket = net.createConnection({ host: '127.0.0.1', port });
    socket.once('connect', () => { socket.destroy(); resolve(true); });
    socket.once('error', () => resolve(false));
  });
}

function apiIsHealthy() {
  return new Promise(resolve => {
    const request = http.get(`http://127.0.0.1:${apiPort}/api/health`, response => {
      resolve(response.statusCode === 200);
      response.resume();
    });
    request.setTimeout(1000, () => { request.destroy(); resolve(false); });
    request.on('error', () => resolve(false));
  });
}

function start(command, args, env) {
  const child = spawn(command, args, {
    stdio: 'inherit',
    env: { ...process.env, ...env },
    shell: process.platform === 'win32',
  });
  children.push(child);
  return child;
}

const apiPortOpen = await portIsOpen(apiPort);
if (apiPortOpen) {
  if (await apiIsHealthy()) console.log(`[dev:full] API sudah aktif di http://localhost:${apiPort}`);
  else throw new Error(`Port API ${apiPort} sedang dipakai proses lain dan bukan AMA-AMA API.`);
} else {
  start(process.platform === 'win32' ? 'npm.cmd' : 'npm', ['run', 'api'], { API_PORT: String(apiPort) });
}

if (await portIsOpen(frontendPort)) {
  console.log(`[dev:full] Frontend sudah aktif di http://localhost:${frontendPort}`);
} else {
  start(process.platform === 'win32' ? 'npm.cmd' : 'npm', ['run', 'dev', '--', `--port=${frontendPort}`], {
    VITE_API_PORT: String(apiPort),
  });
}

console.log(`[dev:full] Buka http://localhost:${frontendPort}`);

function shutdown() {
  for (const child of children) child.kill('SIGTERM');
  process.exit(0);
}
process.on('SIGINT', shutdown);
process.on('SIGTERM', shutdown);
setInterval(() => {}, 1000);
