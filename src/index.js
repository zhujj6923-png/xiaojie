// 站点后端入口。
// 默认情况下静态文件由 assets 层直接返回，只有没有对应文件的路径才会进到这里，
// 所以这里只处理 /api/* 和 /ws/*，其余一律交回 ASSETS。

const CORS = {
  "access-control-allow-origin": "*",
  "access-control-allow-methods": "GET,POST,OPTIONS",
  "access-control-allow-headers": "content-type",
};

function json(data, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: {
      "content-type": "application/json; charset=utf-8",
      "cache-control": "no-store",
      ...CORS,
    },
  });
}

export default {
  async fetch(request, env) {
    const url = new URL(request.url);

    if (request.method === "OPTIONS") {
      return new Response(null, { status: 204, headers: CORS });
    }

    // P0 探针：只为了验证「脚本能和静态资源共存」这一件事
    if (url.pathname === "/api/ping") {
      return json({
        ok: true,
        service: "xiaojie",
        ts: Date.now(),
        colo: request.cf?.colo ?? null,
      });
    }

    if (url.pathname.startsWith("/api/")) {
      return json({ ok: false, error: "not_found" }, 404);
    }

    return env.ASSETS.fetch(request);
  },
};