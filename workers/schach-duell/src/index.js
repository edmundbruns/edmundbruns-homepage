// Schach-Duell: Relay für zwei Teams pro Raumcode (Durable Object mit WebSockets).
// Speichert nur Teamnamen und Spielstand des laufenden Duells, keine personenbezogenen Daten.
const ORIGINS = ["https://www.edmundbruns.com", "https://edmundbruns.com", "https://bruns-homepage.pages.dev"];
export default {
  async fetch(req, env) {
    const url = new URL(req.url);
    if (url.pathname === "/") return new Response("Schach-Duell-Server läuft.", { headers: { "content-type": "text/plain; charset=utf-8" } });
    const m = url.pathname.match(/^\/room\/([A-Z0-9]{4,8})$/);
    if (!m) return new Response("Nicht gefunden", { status: 404 });
    const origin = req.headers.get("Origin") || "";
    if (origin && !ORIGINS.includes(origin) && !origin.endsWith(".bruns-homepage.pages.dev") && origin !== "null") return new Response("Verboten", { status: 403 });
    if (req.headers.get("Upgrade") !== "websocket") return new Response("WebSocket erwartet", { status: 426 });
    const id = env.ROOMS.idFromName(m[1]);
    return env.ROOMS.get(id).fetch(req);
  }
};
export class DuellRoom {
  constructor(state, env) { this.state = state; }
  async fetch(req) {
    const pair = new WebSocketPair();
    const [client, server] = Object.values(pair);
    const open = this.state.getWebSockets();
    if (open.length >= 2) { server.accept(); server.send(JSON.stringify({ t: "full" })); server.close(1000, "voll"); return new Response(null, { status: 101, webSocket: client }); }
    this.state.acceptWebSocket(server);
    return new Response(null, { status: 101, webSocket: client });
  }
  async webSocketMessage(ws, msg) {
    let d; try { d = JSON.parse(msg); } catch (e) { return; }
    if (typeof msg !== "string" || msg.length > 4000) return;
    const all = this.state.getWebSockets();
    if (d.t === "hello") {
      ws.serializeAttachment({ team: String(d.team || "").slice(0, 28), id: String(d.id || "").slice(0, 16) });
      const teams = all.map(w => w.deserializeAttachment()).filter(Boolean);
      for (const w of all) w.send(JSON.stringify({ t: "lobby", teams }));
      return;
    }
    if (d.t === "ping") { ws.send(JSON.stringify({ t: "pong" })); return; }
    // alles andere an das andere Team weiterreichen
    for (const w of all) if (w !== ws) w.send(msg);
  }
  async webSocketClose(ws) {
    const all = this.state.getWebSockets().filter(w => w !== ws);
    for (const w of all) w.send(JSON.stringify({ t: "left" }));
  }
}
