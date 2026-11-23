/** LEGION Creative MCP Bridge — client-side tool router (browser) */
(function (root) {
  const Tools = {
    async list() {
      const r = await fetch('tools.json').catch(() => null);
      if (r && r.ok) return r.json();
      return { tools: Object.keys(Handlers).map(name => ({ name })) };
    }
  };

  const Handlers = {
    'creative.method_omega'(args) {
      const intent = (args && args.intent) || 'sin intención';
      const seeds = [
        { id: 'A', style: 'cinemático frío', hook: intent + ' · neón quirúrgico' },
        { id: 'B', style: 'cálido humano', hook: intent + ' · empatía + glitch' },
        { id: 'C', style: 'brutalismo digital', hook: intent + ' · alto contraste' }
      ];
      const pick = seeds[Math.floor(Math.random() * 3)];
      return {
        ok: true,
        method: 'OMEGA',
        intent,
        seeds,
        chosen: pick,
        next: ['build_variant', 'dual_judge', 'publish.github_push'],
        evidence: { ts: Date.now() }
      };
    },
    'scene.live_fx'(args) {
      const action = (args && args.action) || 'jump';
      if (typeof root.dispatchEvent === 'function') {
        root.dispatchEvent(new CustomEvent('mutante-mcp', { detail: { tool: 'scene.live_fx', action } }));
      }
      return { ok: true, action, routed: true };
    },
    'mutante.mutate'(args) {
      root.dispatchEvent && root.dispatchEvent(new CustomEvent('mutante-mcp', { detail: { tool: 'mutante.mutate', args: args || {} } }));
      return { ok: true, queued: true, args: args || {} };
    },
    'mutante.arena_duel'(args) {
      root.dispatchEvent && root.dispatchEvent(new CustomEvent('mutante-mcp', { detail: { tool: 'mutante.arena_duel', args: args || {} } }));
      return { ok: true, queued: true };
    }
  };

  async function call(name, args) {
    if (!Handlers[name]) return { ok: false, error: 'unknown_tool', name };
    try {
      const result = await Handlers[name](args || {});
      const log = JSON.parse(localStorage.getItem('mcp_creative_log') || '[]');
      log.unshift({ t: Date.now(), name, args, result });
      localStorage.setItem('mcp_creative_log', JSON.stringify(log.slice(0, 100)));
      return result;
    } catch (e) {
      return { ok: false, error: String(e) };
    }
  }

  root.LegionMCP = { Tools, call, Handlers };
})(typeof window !== 'undefined' ? window : globalThis);
