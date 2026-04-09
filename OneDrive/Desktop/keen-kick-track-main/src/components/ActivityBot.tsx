import { useState, useRef, useEffect } from "react";
import { Bot, X, Zap, Phone, Mail, Users, FileText, Calendar, ChevronRight, Sparkles, ArrowLeft } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useActivities } from "@/contexts/ActivityContext";
import { leads, currentUser } from "@/lib/mock-data";
import { ActivityType } from "@/lib/types";
import { toast } from "sonner";

const ACTIVITY_ICONS: Record<string, React.ReactNode> = {
  note: <FileText className="h-4 w-4" />,
  call: <Phone className="h-4 w-4" />,
  meeting: <Users className="h-4 w-4" />,
  email: <Mail className="h-4 w-4" />,
  demo: <Zap className="h-4 w-4" />,
  "follow-up": <Calendar className="h-4 w-4" />,
};

const ACTIVITY_COLORS: Record<string, string> = {
  note: "#a78bfa",
  call: "#34d399",
  meeting: "#60a5fa",
  email: "#f472b6",
  demo: "#fb923c",
  "follow-up": "#facc15",
};

export function ActivityBot() {
  const { addActivity } = useActivities();
  const [open, setOpen] = useState(false);
  const [step, setStep] = useState<"greeting" | "form" | "success">("greeting");

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [type, setType] = useState<ActivityType>("note");
  const [leadId, setLeadId] = useState("");

  const panelRef = useRef<HTMLDivElement>(null);

  // Close on outside click
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (panelRef.current && !panelRef.current.contains(e.target as Node)) {
        // Only close if click is not on the trigger button
        const trigger = document.getElementById("activity-bot-trigger");
        if (trigger && !trigger.contains(e.target as Node)) {
          setOpen(false);
        }
      }
    }
    if (open) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [open]);

  const handleOpen = () => {
    setOpen((prev) => !prev);
    if (!open) setStep("greeting");
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !leadId) {
      toast.error("Title and Lead are required.");
      return;
    }

    addActivity({
      title,
      description,
      type,
      leadId,
      assignedTo: currentUser.id,
      dateTime: new Date().toISOString(),
      status: "completed",
      priority: "medium",
    });

    setStep("success");
    setTimeout(() => {
      setOpen(false);
      setStep("greeting");
      setTitle("");
      setDescription("");
      setType("note");
      setLeadId("");
    }, 1800);
  };

  const selectedLead = leads.find((l) => l.id === leadId);

  return (
    <>
      {/* Overlay backdrop */}
      <div
        className="activity-bot-backdrop"
        style={{
          position: "fixed",
          inset: 0,
          zIndex: 49,
          background: "rgba(10,10,30,0.35)",
          backdropFilter: "blur(2px)",
          opacity: open ? 1 : 0,
          pointerEvents: open ? "auto" : "none",
          transition: "opacity 0.3s ease",
        }}
        onClick={() => setOpen(false)}
      />

      {/* Bot Panel */}
      <div
        ref={panelRef}
        style={{
          position: "fixed",
          bottom: open ? "90px" : "60px",
          right: "24px",
          width: "370px",
          maxHeight: open ? "600px" : "0px",
          opacity: open ? 1 : 0,
          pointerEvents: open ? "auto" : "none",
          zIndex: 50,
          borderRadius: "20px",
          overflow: "hidden",
          transition: "all 0.4s cubic-bezier(0.34, 1.56, 0.64, 1)",
          boxShadow: "0 25px 60px rgba(99, 102, 241, 0.35), 0 8px 32px rgba(0,0,0,0.3)",
        }}
      >
        <div
          style={{
            background: "linear-gradient(135deg, #1e1b4b 0%, #312e81 40%, #1e1b4b 100%)",
            height: "100%",
            display: "flex",
            flexDirection: "column",
            fontFamily: "'Inter', system-ui, sans-serif",
          }}
        >
          {/* Header */}
          <div
            style={{
              padding: "16px 20px",
              background: "linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%)",
              display: "flex",
              alignItems: "center",
              gap: "12px",
              position: "relative",
              overflow: "hidden",
            }}
          >
            {/* Shimmer overlay */}
            <div style={{
              position: "absolute", inset: 0,
              background: "linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.08) 50%, transparent 100%)",
              animation: "shimmer 2.5s infinite",
            }} />

            {/* Back arrow — only on form step */}
            {step === "form" && (
              <button
                onClick={() => setStep("greeting")}
                title="Back"
                style={{
                  width: 32, height: 32, borderRadius: "50%",
                  background: "rgba(255,255,255,0.12)",
                  border: "none", cursor: "pointer",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  color: "#fff", zIndex: 1, flexShrink: 0,
                  transition: "background 0.2s, transform 0.2s",
                }}
                onMouseEnter={e => {
                  e.currentTarget.style.background = "rgba(255,255,255,0.25)";
                  e.currentTarget.style.transform = "translateX(-2px)";
                }}
                onMouseLeave={e => {
                  e.currentTarget.style.background = "rgba(255,255,255,0.12)";
                  e.currentTarget.style.transform = "translateX(0)";
                }}
              >
                <ArrowLeft style={{ width: 16, height: 16 }} />
              </button>
            )}

            <div style={{
              width: 42, height: 42, borderRadius: "50%",
              background: "rgba(255,255,255,0.15)",
              display: "flex", alignItems: "center", justifyContent: "center",
              border: "2px solid rgba(255,255,255,0.3)",
              flexShrink: 0,
              position: "relative",
            }}>
              <Bot style={{ width: 22, height: 22, color: "#fff" }} />
              <span style={{
                position: "absolute", bottom: -2, right: -2,
                width: 12, height: 12, borderRadius: "50%",
                background: "#4ade80",
                border: "2px solid #312e81",
              }} />
            </div>

            <div style={{ flex: 1, zIndex: 1 }}>
              <div style={{ color: "#fff", fontWeight: 700, fontSize: "15px", letterSpacing: "0.01em" }}>
                Activity Bot
              </div>
              <div style={{ color: "rgba(255,255,255,0.7)", fontSize: "12px", display: "flex", alignItems: "center", gap: 4 }}>
                <span style={{ width: 6, height: 6, borderRadius: "50%", background: "#4ade80", display: "inline-block" }} />
                Online — Ready to log
              </div>
            </div>

            <button
              onClick={() => setOpen(false)}
              style={{
                width: 32, height: 32, borderRadius: "50%",
                background: "rgba(255,255,255,0.12)",
                border: "none", cursor: "pointer",
                display: "flex", alignItems: "center", justifyContent: "center",
                color: "#fff", zIndex: 1,
                transition: "background 0.2s",
              }}
              onMouseEnter={e => (e.currentTarget.style.background = "rgba(255,255,255,0.25)")}
              onMouseLeave={e => (e.currentTarget.style.background = "rgba(255,255,255,0.12)")}
            >
              <X style={{ width: 16, height: 16 }} />
            </button>
          </div>

          {/* Body */}
          <div style={{ flex: 1, overflowY: "auto", padding: "20px" }}>

            {step === "greeting" && (
              <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                {/* Bot message */}
                <div style={{ display: "flex", gap: 10, alignItems: "flex-start" }}>
                  <div style={{
                    width: 32, height: 32, borderRadius: "50%",
                    background: "linear-gradient(135deg,#4f46e5,#7c3aed)",
                    display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0,
                  }}>
                    <Bot style={{ width: 16, height: 16, color: "#fff" }} />
                  </div>
                  <div style={{
                    background: "rgba(255,255,255,0.08)",
                    borderRadius: "0 14px 14px 14px",
                    padding: "10px 14px",
                    color: "#e0e7ff",
                    fontSize: "13.5px",
                    lineHeight: 1.5,
                    maxWidth: "260px",
                  }}>
                    👋 Hi! I'm your <strong style={{ color: "#a5b4fc" }}>Activity Bot</strong>. I can quickly log calls, meetings, emails, and notes for you!
                  </div>
                </div>

                <div style={{ display: "flex", gap: 10, alignItems: "flex-start" }}>
                  <div style={{ width: 32, flexShrink: 0 }} />
                  <div style={{
                    background: "rgba(255,255,255,0.08)",
                    borderRadius: "0 14px 14px 14px",
                    padding: "10px 14px",
                    color: "#e0e7ff",
                    fontSize: "13.5px",
                    lineHeight: 1.5,
                  }}>
                    What would you like to log today?
                  </div>
                </div>

                {/* Quick type select chips */}
                <div style={{ marginTop: 4, display: "flex", flexWrap: "wrap", gap: 8, paddingLeft: 42 }}>
                  {(["call", "meeting", "note", "email", "demo", "follow-up"] as ActivityType[]).map((t) => (
                    <button
                      key={t}
                      onClick={() => { setType(t); setStep("form"); }}
                      style={{
                        display: "flex", alignItems: "center", gap: 6,
                        padding: "6px 12px",
                        borderRadius: 20,
                        border: `1.5px solid ${ACTIVITY_COLORS[t]}40`,
                        background: `${ACTIVITY_COLORS[t]}18`,
                        color: ACTIVITY_COLORS[t],
                        fontSize: "12px", fontWeight: 600,
                        cursor: "pointer",
                        transition: "all 0.2s",
                      }}
                      onMouseEnter={e => {
                        e.currentTarget.style.background = `${ACTIVITY_COLORS[t]}35`;
                        e.currentTarget.style.transform = "scale(1.05)";
                      }}
                      onMouseLeave={e => {
                        e.currentTarget.style.background = `${ACTIVITY_COLORS[t]}18`;
                        e.currentTarget.style.transform = "scale(1)";
                      }}
                    >
                      {ACTIVITY_ICONS[t]}
                      {t.charAt(0).toUpperCase() + t.slice(1)}
                    </button>
                  ))}
                </div>

                <div style={{ paddingLeft: 42, marginTop: 4 }}>
                  <button
                    onClick={() => setStep("form")}
                    style={{
                      display: "flex", alignItems: "center", gap: 6,
                      color: "#818cf8", fontSize: "12.5px",
                      background: "none", border: "none", cursor: "pointer", padding: 0,
                    }}
                  >
                    Open full form <ChevronRight style={{ width: 14, height: 14 }} />
                  </button>
                </div>
              </div>
            )}

            {step === "form" && (
              <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: 16 }}>
                <div style={{ display: "flex", gap: 10, alignItems: "flex-start" }}>
                  <div style={{
                    width: 32, height: 32, borderRadius: "50%",
                    background: "linear-gradient(135deg,#4f46e5,#7c3aed)",
                    display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0,
                  }}>
                    <Bot style={{ width: 16, height: 16, color: "#fff" }} />
                  </div>
                  <div style={{
                    background: "rgba(255,255,255,0.08)",
                    borderRadius: "0 14px 14px 14px",
                    padding: "10px 14px",
                    color: "#e0e7ff",
                    fontSize: "13.5px",
                    lineHeight: 1.5,
                  }}>
                    Let me help you log a <strong style={{ color: ACTIVITY_COLORS[type] }}>{type}</strong>. Fill in the details below 👇
                  </div>
                </div>

                {/* Activity Type Selector */}
                <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
                  {(["call", "meeting", "note", "email", "demo", "follow-up"] as ActivityType[]).map((t) => (
                    <button
                      type="button"
                      key={t}
                      onClick={() => setType(t)}
                      style={{
                        padding: "5px 10px",
                        borderRadius: 16,
                        border: `1.5px solid ${type === t ? ACTIVITY_COLORS[t] : "rgba(255,255,255,0.1)"}`,
                        background: type === t ? `${ACTIVITY_COLORS[t]}28` : "transparent",
                        color: type === t ? ACTIVITY_COLORS[t] : "#6b7280",
                        fontSize: "11px", fontWeight: 600,
                        cursor: "pointer", transition: "all 0.15s",
                        display: "flex", alignItems: "center", gap: 4,
                      }}
                    >
                      {ACTIVITY_ICONS[t]}
                      {t.charAt(0).toUpperCase() + t.slice(1)}
                    </button>
                  ))}
                </div>

                {/* Lead Select */}
                <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                  <label style={{ color: "#94a3b8", fontSize: "12px", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.05em" }}>
                    Related Lead *
                  </label>
                  <Select value={leadId} onValueChange={setLeadId} required>
                    <SelectTrigger style={{
                      background: "rgba(255,255,255,0.07)", border: "1.5px solid rgba(255,255,255,0.12)",
                      color: "#e0e7ff", borderRadius: 10,
                    }}>
                      <SelectValue placeholder="Select a lead..." />
                    </SelectTrigger>
                    <SelectContent>
                      {leads.map(lead => (
                        <SelectItem key={lead.id} value={lead.id}>
                          {lead.name} — {lead.company}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Title */}
                <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                  <label style={{ color: "#94a3b8", fontSize: "12px", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.05em" }}>
                    Title *
                  </label>
                  <Input
                    placeholder="e.g. Discovery Call with Acme Corp"
                    value={title}
                    onChange={e => setTitle(e.target.value)}
                    required
                    style={{
                      background: "rgba(255,255,255,0.07)", border: "1.5px solid rgba(255,255,255,0.12)",
                      color: "#e0e7ff", borderRadius: 10,
                    }}
                  />
                </div>

                {/* Notes */}
                <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                  <label style={{ color: "#94a3b8", fontSize: "12px", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.05em" }}>
                    Notes
                  </label>
                  <Textarea
                    placeholder="What happened? Key takeaways..."
                    value={description}
                    onChange={e => setDescription(e.target.value)}
                    rows={3}
                    style={{
                      background: "rgba(255,255,255,0.07)", border: "1.5px solid rgba(255,255,255,0.12)",
                      color: "#e0e7ff", borderRadius: 10, resize: "none",
                    }}
                  />
                </div>

                <div style={{ display: "flex", gap: 8 }}>
                  <button
                    type="button"
                    onClick={() => setStep("greeting")}
                    style={{
                      flex: 1, padding: "10px", borderRadius: 10,
                      background: "rgba(255,255,255,0.07)", border: "1.5px solid rgba(255,255,255,0.12)",
                      color: "#94a3b8", fontSize: "13px", fontWeight: 600,
                      cursor: "pointer", transition: "all 0.2s",
                    }}
                    onMouseEnter={e => e.currentTarget.style.background = "rgba(255,255,255,0.12)"}
                    onMouseLeave={e => e.currentTarget.style.background = "rgba(255,255,255,0.07)"}
                  >
                    Back
                  </button>
                  <button
                    type="submit"
                    style={{
                      flex: 2, padding: "10px", borderRadius: 10,
                      background: "linear-gradient(135deg, #4f46e5, #7c3aed)",
                      border: "none", color: "#fff", fontSize: "13px", fontWeight: 700,
                      cursor: "pointer", transition: "all 0.2s",
                      display: "flex", alignItems: "center", justifyContent: "center", gap: 6,
                      boxShadow: "0 4px 15px rgba(99,102,241,0.4)",
                    }}
                    onMouseEnter={e => { e.currentTarget.style.transform = "translateY(-1px)"; e.currentTarget.style.boxShadow = "0 6px 20px rgba(99,102,241,0.5)"; }}
                    onMouseLeave={e => { e.currentTarget.style.transform = "translateY(0)"; e.currentTarget.style.boxShadow = "0 4px 15px rgba(99,102,241,0.4)"; }}
                  >
                    <Zap style={{ width: 14, height: 14 }} />
                    Save Activity
                  </button>
                </div>
              </form>
            )}

            {step === "success" && (
              <div style={{
                display: "flex", flexDirection: "column", alignItems: "center",
                justifyContent: "center", gap: 16, padding: "30px 20px", textAlign: "center",
              }}>
                <div style={{
                  width: 70, height: 70, borderRadius: "50%",
                  background: "linear-gradient(135deg, #059669, #10b981)",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  boxShadow: "0 0 0 12px rgba(16,185,129,0.15)",
                  animation: "pop 0.4s cubic-bezier(0.34, 1.56, 0.64, 1)",
                }}>
                  <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                </div>
                <div>
                  <div style={{ color: "#a7f3d0", fontWeight: 700, fontSize: "16px" }}>Activity Logged!</div>
                  <div style={{ color: "#6b7280", fontSize: "13px", marginTop: 4 }}>
                    {title} has been saved.
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Footer */}
          <div style={{
            padding: "10px 20px",
            borderTop: "1px solid rgba(255,255,255,0.07)",
            display: "flex", alignItems: "center", justifyContent: "center", gap: 5,
            color: "rgba(255,255,255,0.3)", fontSize: "11px",
          }}>
            <Sparkles style={{ width: 11, height: 11 }} />
            Powered by Activity Bot
          </div>
        </div>
      </div>

      {/* FAB Trigger Button */}
      <button
        id="activity-bot-trigger"
        onClick={handleOpen}
        style={{
          position: "fixed",
          bottom: "24px",
          right: "24px",
          width: "62px",
          height: "62px",
          borderRadius: "50%",
          background: open
            ? "linear-gradient(135deg, #7c3aed, #4f46e5)"
            : "linear-gradient(135deg, #4f46e5 0%, #7c3aed 50%, #ec4899 100%)",
          border: "none",
          cursor: "pointer",
          zIndex: 51,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          boxShadow: open
            ? "0 0 0 6px rgba(99,102,241,0.2), 0 8px 30px rgba(99,102,241,0.5)"
            : "0 0 0 0px rgba(99,102,241,0), 0 8px 30px rgba(99,102,241,0.5)",
          transform: open ? "rotate(0deg) scale(1.05)" : "rotate(0deg) scale(1)",
          transition: "all 0.35s cubic-bezier(0.34, 1.56, 0.64, 1)",
          animation: open ? "none" : "botPulse 2.5s infinite",
        }}
        onMouseEnter={e => {
          e.currentTarget.style.transform = "scale(1.12)";
          e.currentTarget.style.boxShadow = "0 0 0 8px rgba(99,102,241,0.25), 0 12px 40px rgba(99,102,241,0.6)";
        }}
        onMouseLeave={e => {
          e.currentTarget.style.transform = open ? "scale(1.05)" : "scale(1)";
          e.currentTarget.style.boxShadow = open
            ? "0 0 0 6px rgba(99,102,241,0.2), 0 8px 30px rgba(99,102,241,0.5)"
            : "0 0 0 0px rgba(99,102,241,0), 0 8px 30px rgba(99,102,241,0.5)";
        }}
      >
        {/* Rotating ring */}
        <svg
          width="62" height="62"
          style={{ position: "absolute", top: 0, left: 0, animation: "spin 8s linear infinite" }}
          viewBox="0 0 62 62"
        >
          <circle cx="31" cy="31" r="28" fill="none" stroke="rgba(255,255,255,0.2)" strokeWidth="1.5" strokeDasharray="6 4" />
        </svg>

        {/* Icon */}
        <div style={{
          position: "relative", zIndex: 1,
          transform: open ? "rotate(90deg)" : "rotate(0deg)",
          transition: "transform 0.3s ease",
        }}>
          {open
            ? <X style={{ width: 24, height: 24, color: "#fff" }} />
            : <Bot style={{ width: 26, height: 26, color: "#fff" }} />
          }
        </div>

        {/* Notification dot */}
        {!open && (
          <span style={{
            position: "absolute", top: 8, right: 8,
            width: 10, height: 10, borderRadius: "50%",
            background: "#4ade80",
            border: "2px solid #4f46e5",
            animation: "dotPulse 2s infinite",
          }} />
        )}
      </button>

      <style>{`
        @keyframes botPulse {
          0%, 100% { box-shadow: 0 0 0 0px rgba(99,102,241,0.5), 0 8px 30px rgba(99,102,241,0.5); }
          50% { box-shadow: 0 0 0 12px rgba(99,102,241,0), 0 8px 30px rgba(99,102,241,0.5); }
        }
        @keyframes dotPulse {
          0%, 100% { transform: scale(1); opacity: 1; }
          50% { transform: scale(1.4); opacity: 0.7; }
        }
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        @keyframes shimmer {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(200%); }
        }
        @keyframes pop {
          0% { transform: scale(0.5); opacity: 0; }
          100% { transform: scale(1); opacity: 1; }
        }
      `}</style>
    </>
  );
}
