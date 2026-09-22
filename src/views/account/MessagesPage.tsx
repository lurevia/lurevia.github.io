import { useEffect, useState } from "react";
import type { FC } from "react";
import { ArrowLeft, Check, Inbox, Mail, MailOpen } from "lucide-react";
import { Link } from "react-router-dom";
import { messagesApi, type UserMessage } from "../../api/messages";
import { toErrorMessage } from "../../api/http";

export const MessagesPage: FC = () => {
  const [messages, setMessages] = useState<UserMessage[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    void messagesApi.list().then(setMessages).catch((err) => {
      setError(toErrorMessage(err, "Impossible de charger vos messages."));
    });
  }, []);

  const markRead = async (message: UserMessage) => {
    if (message.read) return;
    setMessages((current) => current.map((item) => item.id === message.id ? { ...item, read: true } : item));
    try {
      await messagesApi.markRead(message.id);
    } catch {
      setMessages((current) => current.map((item) => item.id === message.id ? { ...item, read: false } : item));
    }
  };

  return (
    <>
      <Link to="/compte" className="inline-flex items-center gap-2 text-xs font-bold text-slate-500 hover:text-lurevia-dark uppercase tracking-wider">
        <ArrowLeft size={14} /> Retour au compte
      </Link>
      <div>
        <h1 className="text-2xl md:text-3xl font-black text-lurevia-dark">Messages</h1>
        <p className="text-sm text-slate-500 mt-1">Les messages envoyés par l’équipe Lurevia.</p>
      </div>
      {error && <div className="p-3 bg-red-50 border border-red-100 rounded-xl text-xs font-medium text-red-600">{error}</div>}
      {messages.length === 0 && !error ? (
        <div className="text-center py-16 bg-white border border-slate-100 rounded-2xl">
          <Inbox size={40} className="mx-auto text-slate-300" strokeWidth={1.5} />
          <h2 className="mt-4 text-lg font-black text-lurevia-dark">Votre boîte est vide</h2>
          <p className="text-sm text-slate-500 mt-2">Vous recevrez ici les réponses et informations importantes.</p>
        </div>
      ) : (
        <div className="bg-white border border-slate-100 rounded-2xl overflow-hidden divide-y divide-slate-100">
          {messages.map((message) => (
            <article key={message.id} className={`p-5 ${message.read ? "" : "bg-orange-50/50"}`} onClick={() => void markRead(message)}>
              <div className="flex items-start gap-3">
                <div className={`p-2 rounded-lg shrink-0 ${message.read ? "bg-slate-100 text-slate-500" : "bg-lurevia-orange text-white"}`}>
                  {message.read ? <MailOpen size={17} /> : <Mail size={17} />}
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <h2 className="text-sm font-black text-lurevia-dark">{message.subject}</h2>
                    <time className="text-[11px] text-slate-400" dateTime={message.createdAt}>
                      {new Date(message.createdAt).toLocaleDateString("fr-FR")}
                    </time>
                  </div>
                  <p className="text-sm text-slate-600 mt-2 whitespace-pre-wrap">{message.body}</p>
                  {!message.read && <span className="inline-flex items-center gap-1 mt-3 text-[11px] font-bold text-lurevia-orange"><Check size={12} /> Marquer comme lu</span>}
                </div>
              </div>
            </article>
          ))}
        </div>
      )}
    </>
  );
};
