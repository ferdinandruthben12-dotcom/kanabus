import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { MessageSquare, Send, User, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { format } from "date-fns";
import { fr } from "date-fns/locale";

export const Route = createFileRoute("/admin/contacts")({
  component: AdminChatPage,
});

function AdminChatPage() {
  const [conversations, setConversations] = useState<any[]>([]);
  const [selectedUser, setSelectedUser] = useState<string | null>(null);
  const [messages, setMessages] = useState<any[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchConversations();

    const channel = supabase
      .channel("admin_chat_list")
      .on(
        "postgres_changes",
        { event: "INSERT", schema: "public", table: "chat_messages" },
        () => {
          fetchConversations();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  async function fetchConversations() {
    // Get unique user IDs from messages
    const { data, error } = await supabase
      .from("chat_messages")
      .select("user_id, created_at, content")
      .order("created_at", { ascending: false });

    if (data) {
      const uniqueUsers = new Map();
      data.forEach((m) => {
        if (!uniqueUsers.has(m.user_id)) {
          uniqueUsers.set(m.user_id, m);
        }
      });
      setConversations(Array.from(uniqueUsers.values()));
    }
    setLoading(false);
  }

  useEffect(() => {
    if (!selectedUser) return;

    fetchMessages();

    const channel = supabase
      .channel(`admin_chat_user_${selectedUser}`)
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "chat_messages",
          filter: `user_id=eq.${selectedUser}`,
        },
        (payload) => {
          setMessages((prev) => [...prev, payload.new]);
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [selectedUser]);

  async function fetchMessages() {
    const { data } = await supabase
      .from("chat_messages")
      .select("*")
      .eq("user_id", selectedUser)
      .order("created_at", { ascending: true });
    if (data) setMessages(data);
  }

  async function handleSendMessage(e: React.FormEvent) {
    e.preventDefault();
    if (!newMessage.trim() || !selectedUser) return;

    const msg = {
      user_id: selectedUser,
      content: newMessage.trim(),
      is_admin: true,
    };

    const { error } = await supabase.from("chat_messages").insert(msg);
    if (!error) setNewMessage("");
  }

  return (
    <div className="h-full flex flex-col">
      <header className="p-6 border-b border-foreground/10 bg-background/50 backdrop-blur-md sticky top-0 z-10">
        <h1 className="font-display italic text-3xl">Support Client</h1>
        <p className="text-[10px] font-mono uppercase tracking-widest text-foreground/40 mt-1">
          Messagerie en temps réel
        </p>
      </header>

      <div className="flex-1 flex overflow-hidden">
        {/* Sidebar Conversations */}
        <aside className="w-80 border-r border-foreground/10 flex flex-col bg-card/20">
          <div className="flex-1 overflow-y-auto no-scrollbar">
            {conversations.length === 0 ? (
              <p className="p-10 text-center text-[10px] font-mono uppercase tracking-widest text-foreground/30">
                Aucune conversation.
              </p>
            ) : (
              conversations.map((c) => (
                <button
                  key={c.user_id}
                  onClick={() => setSelectedUser(c.user_id)}
                  className={`w-full text-left p-6 border-b border-foreground/5 transition-colors hover:bg-foreground/5 ${
                    selectedUser === c.user_id ? "bg-foreground/5 border-r-2 border-r-accent" : ""
                  }`}
                >
                  <div className="flex justify-between items-start mb-2">
                    <p className="font-mono text-[10px] uppercase tracking-widest text-foreground/60 truncate max-w-[150px]">
                      {c.user_id.split("-")[0]}...
                    </p>
                    <span className="text-[9px] font-mono text-foreground/30">
                      {format(new Date(c.created_at), "HH:mm")}
                    </span>
                  </div>
                  <p className="text-xs text-foreground/80 line-clamp-1 italic">{c.content}</p>
                </button>
              ))
            )}
          </div>
        </aside>

        {/* Chat Area */}
        <main className="flex-1 flex flex-col bg-background relative">
          {selectedUser ? (
            <>
              <div className="flex-1 overflow-y-auto p-8 space-y-6 no-scrollbar">
                {messages.map((m) => (
                  <div key={m.id} className={`flex ${m.is_admin ? "justify-end" : "justify-start"}`}>
                    <div className={`max-w-[70%] p-4 text-sm ${
                      m.is_admin 
                        ? "bg-forest text-background" 
                        : "bg-sand/30 text-foreground border border-foreground/5"
                    }`}>
                      <p className="leading-relaxed">{m.content}</p>
                      <p className={`text-[9px] font-mono mt-2 opacity-50 ${m.is_admin ? "text-right" : "text-left"}`}>
                        {format(new Date(m.created_at), "dd/MM HH:mm")}
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              <form onSubmit={handleSendMessage} className="p-6 border-t border-foreground/10 bg-card/50 flex gap-4">
                <Input
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  placeholder="Répondre au client..."
                  className="bg-transparent border-foreground/10 rounded-none h-12"
                />
                <Button type="submit" size="lg" className="bg-accent hover:bg-forest rounded-none px-8">
                  <Send size={18} />
                </Button>
              </form>
            </>
          ) : (
            <div className="flex-1 flex flex-col items-center justify-center text-center px-10">
              <MessageSquare size={48} className="text-foreground/10 mb-4" />
              <h2 className="font-display italic text-2xl">Sélectionnez une conversation</h2>
              <p className="text-sm text-foreground/40 mt-2">
                Cliquez sur un utilisateur à gauche pour commencer à chatter en temps réel.
              </p>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
