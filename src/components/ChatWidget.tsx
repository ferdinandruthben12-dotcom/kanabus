import { useState, useEffect, useRef } from "react";
import { supabase } from "@/integrations/supabase/client";
import { MessageCircle, X, Send, User } from "lucide-react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { format } from "date-fns";
import { fr } from "date-fns/locale";

export function ChatWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<any[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [user, setUser] = useState<any>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_e, session) => {
      setUser(session?.user ?? null);
    });

    return () => subscription.unsubscribe();
  }, []);

  useEffect(() => {
    if (!user || !isOpen) return;

    // Fetch existing messages
    async function fetchMessages() {
      const { data } = await supabase
        .from("chat_messages")
        .select("*")
        .eq("user_id", user.id)
        .order("created_at", { ascending: true });
      if (data) setMessages(data);
    }
    fetchMessages();

    // Subscribe to new messages
    const channel = supabase
      .channel(`chat:${user.id}`)
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "chat_messages",
          filter: `user_id=eq.${user.id}`,
        },
        (payload) => {
          setMessages((prev) => [...prev, payload.new]);
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [user, isOpen]);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  async function handleSendMessage(e: React.FormEvent) {
    e.preventDefault();
    if (!newMessage.trim() || !user) return;

    const msg = {
      user_id: user.id,
      content: newMessage.trim(),
      is_admin: false,
    };

    const { error } = await supabase.from("chat_messages").insert(msg);
    if (!error) setNewMessage("");
  }

  if (!user) return null; // Chat only for logged in users for now

  return (
    <div className="fixed bottom-6 right-6 z-50">
      {isOpen ? (
        <div className="w-80 md:w-96 h-[500px] bg-background border border-foreground/10 shadow-2xl flex flex-col grain animate-in fade-in slide-in-from-bottom-4 duration-300">
          {/* Header */}
          <div className="p-4 bg-forest text-background flex justify-between items-center">
            <div className="flex items-center gap-3">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
              <p className="font-display italic text-lg">Support KanaBus</p>
            </div>
            <button onClick={() => setIsOpen(false)} className="hover:rotate-90 transition-transform">
              <X size={20} />
            </button>
          </div>

          {/* Messages */}
          <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 space-y-4 no-scrollbar">
            {messages.length === 0 && (
              <p className="text-center text-[10px] font-mono uppercase tracking-widest text-foreground/40 py-10">
                Posez-nous vos questions ici.
              </p>
            )}
            {messages.map((m) => (
              <div key={m.id} className={`flex ${m.is_admin ? "justify-start" : "justify-end"}`}>
                <div className={`max-w-[80%] p-3 text-sm ${
                  m.is_admin 
                    ? "bg-sand/30 text-foreground border border-foreground/5" 
                    : "bg-forest text-background"
                }`}>
                  <p className="leading-relaxed">{m.content}</p>
                  <p className={`text-[9px] font-mono mt-1 opacity-50 ${m.is_admin ? "text-left" : "text-right"}`}>
                    {format(new Date(m.created_at), "HH:mm")}
                  </p>
                </div>
              </div>
            ))}
          </div>

          {/* Footer */}
          <form onSubmit={handleSendMessage} className="p-4 border-t border-foreground/10 flex gap-2">
            <Input
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              placeholder="Votre message..."
              className="bg-transparent border-foreground/10 rounded-none h-10 text-xs"
            />
            <Button type="submit" size="icon" className="shrink-0 bg-accent hover:bg-forest rounded-none">
              <Send size={16} />
            </Button>
          </form>
        </div>
      ) : (
        <button
          onClick={() => setIsOpen(true)}
          className="w-14 h-14 bg-accent text-background rounded-full shadow-lg flex items-center justify-center hover:scale-110 transition-transform group"
        >
          <MessageCircle className="group-hover:rotate-12 transition-transform" />
          <span className="absolute -top-1 -right-1 w-4 h-4 bg-forest rounded-full border-2 border-background" />
        </button>
      )}
    </div>
  );
}
