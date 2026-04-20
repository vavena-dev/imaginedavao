const {
  buildAssistantReply,
  proxyRagIfConfigured,
  readJsonBody,
  sendJson,
  wait
} = require("../_lib/common");

module.exports = async function handler(req, res) {
  if (req.method !== "POST") {
    return sendJson(res, 405, { error: "Method not allowed" });
  }

  let body;
  try {
    body = await readJsonBody(req);
  } catch (error) {
    return sendJson(res, 400, { error: error.message || "Invalid request" });
  }

  const message = String(body.message || "").trim();
  const city = String(body.city || "Davao");
  const history = Array.isArray(body.history) ? body.history : [];

  if (!message) {
    return sendJson(res, 400, { error: "Message is required" });
  }

  const ragReply = await proxyRagIfConfigured(message, city, history);
  const assistant = ragReply || buildAssistantReply(message, city);

  res.statusCode = 200;
  res.setHeader("Content-Type", "text/event-stream; charset=utf-8");
  res.setHeader("Cache-Control", "no-cache, no-transform");
  res.setHeader("Connection", "keep-alive");

  const emit = (payload) => {
    res.write(`data: ${JSON.stringify(payload)}\n\n`);
  };

  emit({ type: "start" });

  const words = assistant.text.split(" ");
  for (let index = 0; index < words.length; index += 1) {
    const chunk = index === 0 ? words[index] : ` ${words[index]}`;
    emit({ type: "token", text: chunk });
    await wait(20);
  }

  emit({ type: "actions", actions: assistant.actions || [] });
  emit({ type: "done" });
  res.end();
};
