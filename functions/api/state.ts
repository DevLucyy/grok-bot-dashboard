export const onRequestGet = async (context: any) => {
  try {
    const res = await fetch('https://grok-trading-engine.lucifer-dev75.workers.dev/api/state');
    const data = await res.text();
    return new Response(data, {
      status: res.status,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
        'Cache-Control': 'no-store, no-cache, must-revalidate'
      }
    });
  } catch (err: any) {
    return new Response(JSON.stringify({ error: err.message || 'Worker proxy error' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' }
    });
  }
};
