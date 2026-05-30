import { useState, useRef, useEffect } from "react";

const SYSTEM_PROMPT = `You are Yomi — a passionate anime companion who has watched everything. You give anime recommendations like a friend, not a database. 

When someone asks for a recommendation:
- Recommend 2-3 anime that genuinely fit their mood/request
- For each: title, a one-sentence hook (no spoilers), and why it fits what they asked for
- Be specific about vibes, not just genre tags
- Occasionally ask a follow-up to refine if their request is vague
- Keep it conversational, warm, slightly nerdy

Format each recommendation like:
**[Title]** — hook sentence. Why it fits: reason.

Don't be robotic. You love anime and it shows.`;

const recs = [
  "something sad but beautiful",
  "a short series, under 13 eps",
  "slice of life but actually good",
  "action but with a brain",
  "made me cry in a good way",
];

export default function AnimeRec() {
  const [messages, setMessages] = useState([
    {
      role: "assistant",
      content: "Hey! Tell me what kind of anime you're in the mood for — a vibe, a feeling, a length, anything. I'll find something that fits.",
    },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const bottomRef = useRef(null);
  const inputRef = useRef(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  async function sendMessage(text) {
    const userMsg = text || input.trim();
    if (!userMsg || loading) return;
    setInput("");

    const newMessages = [...messages, { role: "user", content: userMsg }];
    setMessages(newMessages);
    setLoading(true);

    try {
      const res = await fetch("https://api.anthropic.com/v1/messages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          model: "claude-sonnet-4-20250514",
          max_tokens: 1000,
          system: SYSTEM_PROMPT,
          messages: newMessages.map((m) => ({ role: m.role, content: m.content })),
        }),
      });
      const data = await res.json();
      const reply = data.content?.find((b) => b.type === "text")?.text || "Hmm, something went wrong. Try again?";
      setMessages((prev) => [...prev, { role: "assistant", content: reply }]);
    } catch {
      setMessages((prev) => [...prev, { role: "assistant", content: "Connection hiccup — give it another shot." }]);
    } finally {
      setLoading(false);
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  }

  function handleKey(e) {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  }

  function formatMessage(text) {
    const parts = text.split(/(\*\*[^*]+\*\*)/g);
    return parts.map((part, i) =>
      part.startsWith("**") && part.endsWith("**")
        ? <span key={i} style={{ color: "#f0c060", fontWeight: 700 }}>{part.slice(2, -2)}</span>
        : part
    );
  }

  return (
    <div style={{
      minHeight: "100vh",
      background: "#0d0d14",
      backgroundImage: "radial-gradient(ellipse at 20% 50%, rgba(80,40,120,0.18) 0%, transparent 60%), radial-gradient(ellipse at 80% 20%, rgba(40,80,140,0.14) 0%, transparent 55%)",
      display: "flex",
      flexDirection: "column",
      fontFamily: "'Georgia', serif",
      color: "#e8e0d4",
    }}>
      {/* Header */}
      <div style={{
        padding: "24px 28px 18px",
        borderBottom: "1px solid rgba(255,255,255,0.07)",
        background: "rgba(255,255,255,0.02)",
        backdropFilter: "blur(8px)",
        position: "sticky",
        top: 0,
        zIndex: 10,
      }}>
        <div style={{ display: "flex", alignItems: "baseline", gap: 12 }}>
          <span style={{ fontSize: 26, fontWeight: 700, letterSpacing: "-0.5px", color: "#f0c060" }}>夜見</span>
          <span style={{ fontSize: 18, fontWeight: 600, color: "#e8e0d4", letterSpacing: "0.3px" }}>Yomi</span>
          <span style={{ fontSize: 13, color: "rgba(232,224,212,0.4)", marginLeft: 4, fontStyle: "italic" }}>anime companion</span>
        </div>
      </div>

      {/* Chat */}
      <div style={{
        flex: 1,
        overflowY: "auto",
        padding: "28px 20px",
        display: "flex",
        flexDirection: "column",
        gap: 20,
        maxWidth: 720,
        width: "100%",
        margin: "0 auto",
        boxSizing: "border-box",
      }}>
        {messages.map((msg, i) => (
          <div key={i} style={{
            display: "flex",
            justifyContent: msg.role === "user" ? "flex-end" : "flex-start",
            animation: "fadeUp 0.3s ease",
          }}>
            <div style={{
              maxWidth: "82%",
              padding: msg.role === "user" ? "11px 16px" : "14px 18px",
              borderRadius: msg.role === "user" ? "18px 18px 4px 18px" : "4px 18px 18px 18px",
              background: msg.role === "user"
                ? "linear-gradient(135deg, #7c4dbb, #5a3a9a)"
                : "rgba(255,255,255,0.05)",
              border: msg.role === "assistant" ? "1px solid rgba(255,255,255,0.08)" : "none",
              fontSize: 15,
              lineHeight: 1.65,
              color: msg.role === "user" ? "#f0eaf8" : "#e0d8cc",
              whiteSpace: "pre-wrap",
              boxShadow: msg.role === "user" ? "0 2px 12px rgba(124,77,187,0.3)" : "none",
            }}>
              {msg.role === "assistant" ? formatMessage(msg.content) : msg.content}
            </div>
          </div>
        ))}

        {loading && (
          <div style={{ display: "flex", justifyContent: "flex-start" }}>
            <div style={{
              padding: "14px 20px",
              borderRadius: "4px 18px 18px 18px",
              background: "rgba(255,255,255,0.05)",
              border: "1px solid rgba(255,255,255,0.08)",
              display: "flex",
              gap: 6,
              alignItems: "center",
            }}>
              {[0, 1, 2].map((n) => (
                <div key={n} style={{
                  width: 7, height: 7,
                  borderRadius: "50%",
                  background: "#f0c060",
                  opacity: 0.6,
                  animation: `pulse 1.2s ease-in-out ${n * 0.2}s infinite`,
                }} />
              ))}
            </div>
          </div>
        )}
        <div ref={bottomRef} />
      </div>

      {/* Quick prompts */}
      {messages.length <= 2 && (
        <div style={{
          padding: "0 20px 16px",
          maxWidth: 720,
          width: "100%",
          margin: "0 auto",
          boxSizing: "border-box",
          display: "flex",
          flexWrap: "wrap",
          gap: 8,
        }}>
          {recs.map((r) => (
            <button key={r} onClick={() => sendMessage(r)} style={{
              background: "rgba(255,255,255,0.04)",
              border: "1px solid rgba(255,255,255,0.1)",
              borderRadius: 20,
              color: "rgba(232,224,212,0.7)",
              fontSize: 13,
              padding: "7px 14px",
              cursor: "pointer",
              fontFamily: "inherit",
              transition: "all 0.2s",
            }}
              onMouseEnter={e => { e.target.style.background = "rgba(240,192,96,0.1)"; e.target.style.borderColor = "rgba(240,192,96,0.3)"; e.target.style.color = "#f0c060"; }}
              onMouseLeave={e => { e.target.style.background = "rgba(255,255,255,0.04)"; e.target.style.borderColor = "rgba(255,255,255,0.1)"; e.target.style.color = "rgba(232,224,212,0.7)"; }}
            >
              {r}
            </button>
          ))}
        </div>
      )}

      {/* Input */}
      <div style={{
        padding: "14px 20px 20px",
        borderTop: "1px solid rgba(255,255,255,0.07)",
        background: "rgba(0,0,0,0.3)",
        backdropFilter: "blur(8px)",
        maxWidth: 720,
        width: "100%",
        margin: "0 auto",
        boxSizing: "border-box",
      }}>
        <div style={{
          display: "flex",
          gap: 10,
          alignItems: "flex-end",
          background: "rgba(255,255,255,0.05)",
          border: "1px solid rgba(255,255,255,0.1)",
          borderRadius: 14,
          padding: "10px 10px 10px 16px",
          transition: "border-color 0.2s",
        }}>
          <textarea
            ref={inputRef}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKey}
            placeholder="what are you in the mood for..."
            rows={1}
            style={{
              flex: 1,
              background: "transparent",
              border: "none",
              outline: "none",
              color: "#e8e0d4",
              fontSize: 15,
              fontFamily: "inherit",
              resize: "none",
              lineHeight: 1.5,
              maxHeight: 120,
              overflowY: "auto",
            }}
            onInput={(e) => {
              e.target.style.height = "auto";
              e.target.style.height = Math.min(e.target.scrollHeight, 120) + "px";
            }}
          />
          <button
            onClick={() => sendMessage()}
            disabled={!input.trim() || loading}
            style={{
              background: input.trim() && !loading ? "linear-gradient(135deg, #f0c060, #d4a040)" : "rgba(255,255,255,0.08)",
              border: "none",
              borderRadius: 9,
              width: 36,
              height: 36,
              cursor: input.trim() && !loading ? "pointer" : "default",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              transition: "all 0.2s",
              flexShrink: 0,
            }}
          >
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <path d="M2 8L14 8M14 8L9 3M14 8L9 13" stroke={input.trim() && !loading ? "#0d0d14" : "rgba(255,255,255,0.3)"} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>
        </div>
        <div style={{ textAlign: "center", marginTop: 10, fontSize: 11, color: "rgba(232,224,212,0.2)" }}>
          Enter to send · Shift+Enter for new line
        </div>
      </div>

      <style>{`
        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(8px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes pulse {
          0%, 100% { transform: scale(0.8); opacity: 0.4; }
          50% { transform: scale(1.1); opacity: 1; }
        }
        ::-webkit-scrollbar { width: 4px; }
        ::-webkit-scrollbar-track { background: transparent; }
        ::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.1); border-radius: 2px; }
      `}</style>
    </div>
  );
}
