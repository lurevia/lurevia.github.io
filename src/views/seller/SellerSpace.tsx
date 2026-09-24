import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { BarChart3, Package, ShoppingBag, Star, Trash2, Pencil, Plus, RefreshCw } from "lucide-react";
import { sellerApi, type SellerProductInput, type SellerStats } from "../../api/seller";
import type { Product } from "../../bin/types/homeType";
import type { Order } from "../../bin/types/orderType";
import type { ServiceFeedback } from "../../bin/types/feedbackType";
import { toErrorMessage } from "../../api/http";

const money = (n: number) => new Intl.NumberFormat("fr-FR", { style: "currency", currency: "MGA", maximumFractionDigits: 0 }).format(n);
const statuses = ["PENDING", "PAID", "SHIPPED", "DELIVERED", "CANCELLED"];
const emptyForm: SellerProductInput = { title: "", sku: "", price: 0, stock: 0, tags: [], categoryIds: [], images: [], colors: [], sizes: [] };

export function SellerSpace() {
  const [tab, setTab] = useState<"dashboard" | "products" | "orders">("dashboard");
  const [stats, setStats] = useState<SellerStats | null>(null);
  const [feedback, setFeedback] = useState<ServiceFeedback[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [form, setForm] = useState<SellerProductInput | null>(null);
  const [editing, setEditing] = useState<string | null>(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  const load = async () => {
    setLoading(true); setError("");
    try {
      const [s, f, p, o] = await Promise.all([sellerApi.stats(), sellerApi.feedback(), sellerApi.products(), sellerApi.orders()]);
      setStats(s); setFeedback(f); setProducts(p); setOrders(o);
    } catch (e) { setError(toErrorMessage(e)); } finally { setLoading(false); }
  };
  useEffect(() => { void load(); }, []);

  const save = async (event: React.FormEvent) => {
    event.preventDefault(); if (!form) return;
    try {
      const payload = { ...form, categoryIds: form.categoryIds.filter(Boolean), images: form.images.filter(Boolean) };
      if (editing) await sellerApi.updateProduct(editing, payload);
      else await sellerApi.createProduct(payload);
      setForm(null); setEditing(null); await load();
    } catch (e) { setError(toErrorMessage(e)); }
  };
  const startEdit = (p: Product) => { setForm({ ...emptyForm, title: p.title, sku: p.sku ?? "", price: p.price, stock: p.stock ?? 0, description: p.description, images: p.images ?? [p.imageUrl] }); setEditing(p.id); };
  const remove = async (id: string) => { if (!window.confirm("Supprimer ce produit ?")) return; try { await sellerApi.removeProduct(id); await load(); } catch (e) { setError(toErrorMessage(e)); } };
  const updateStatus = async (id: string, status: string) => { try { await sellerApi.updateOrderStatus(id, status); await load(); } catch (e) { setError(toErrorMessage(e)); } };

  return <div className="max-w-7xl mx-auto px-4 py-6 md:py-10 pb-28">
    <div className="flex flex-wrap items-center justify-between gap-4 mb-7">
      <div><p className="text-xs font-black uppercase tracking-widest text-lurevia-orange">Espace vendeur</p><h1 className="text-2xl md:text-3xl font-black text-lurevia-dark">Votre activité</h1></div>
      <div className="flex gap-2"><button onClick={() => void load()} className="p-2 rounded-xl border border-slate-200 text-slate-500" aria-label="Actualiser"><RefreshCw size={17} /></button><Link to="/" className="text-sm font-bold text-lurevia-dark py-2">Voir la boutique →</Link></div>
    </div>
    {error && <div className="mb-5 rounded-xl bg-red-50 px-4 py-3 text-sm font-semibold text-red-700">{error}</div>}
    <div className="flex gap-2 mb-6 border-b border-slate-100">
      {([["dashboard", "Tableau de bord", BarChart3], ["products", "Produits", Package], ["orders", "Commandes", ShoppingBag]] as const).map(([key, label, Icon]) => <button key={key} onClick={() => setTab(key)} className={`flex items-center gap-2 px-4 py-3 text-sm font-bold border-b-2 ${tab === key ? "border-lurevia-orange text-lurevia-dark" : "border-transparent text-slate-400"}`}><Icon size={16} />{label}</button>)}
    </div>
    {loading ? <div className="py-20 text-center text-sm font-bold text-slate-400">Chargement de votre espace…</div> : <>
      {tab === "dashboard" && <><div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-8">{[["Produits", stats?.products ?? 0], ["Ventes", stats?.sales ?? 0], ["Chiffre d'affaires", money(stats?.revenue ?? 0)], ["Avis", stats?.feedbackCount ?? 0]].map(([label, value]) => <div key={String(label)} className="rounded-2xl bg-white border border-slate-100 p-5"><p className="text-xs font-bold text-slate-400">{label}</p><p className="mt-2 text-xl font-black text-lurevia-dark">{value}</p></div>)}</div><section className="rounded-2xl bg-white border border-slate-100 p-5"><h2 className="font-black text-lurevia-dark mb-4">Derniers retours clients</h2>{feedback.length === 0 ? <p className="text-sm text-slate-400">Aucun retour pour le moment.</p> : <div className="space-y-3">{feedback.slice(0, 6).map(f => <div key={f.id} className="border-b border-slate-100 pb-3"><div className="flex justify-between"><b className="text-sm">{f.userName}</b><span className="flex items-center gap-1 text-xs font-bold text-lurevia-orange"><Star size={13} fill="currentColor" />{f.overallRating}/5</span></div><p className="text-sm text-slate-600 mt-1">{f.comment}</p></div>)}</div>}</section></>}
      {tab === "products" && <><div className="flex justify-end mb-4"><button onClick={() => { setForm(emptyForm); setEditing(null); }} className="flex items-center gap-2 rounded-xl bg-lurevia-dark px-4 py-2.5 text-sm font-bold text-white"><Plus size={16} />Nouveau produit</button></div>{form && <form onSubmit={save} className="mb-6 grid md:grid-cols-2 gap-3 rounded-2xl bg-white border border-slate-100 p-5">{(["title", "sku", "price", "stock"] as const).map(field => <label key={field} className="text-xs font-bold text-slate-500">{field === "title" ? "Titre" : field.toUpperCase()}<input required={field !== "stock"} type={field === "price" || field === "stock" ? "number" : "text"} value={form[field] as string | number} onChange={e => setForm({ ...form, [field]: field === "price" || field === "stock" ? Number(e.target.value) : e.target.value })} className="mt-1 w-full rounded-lg border border-slate-200 p-2.5 text-sm" /></label>)}<label className="text-xs font-bold text-slate-500">Images (URL, séparées par des virgules)<input required value={form.images.join(",")} onChange={e => setForm({ ...form, images: e.target.value.split(",").map(v => v.trim()) })} className="mt-1 w-full rounded-lg border border-slate-200 p-2.5 text-sm" /></label><label className="text-xs font-bold text-slate-500">Catégories (IDs, séparés par des virgules)<input required value={form.categoryIds.join(",")} onChange={e => setForm({ ...form, categoryIds: e.target.value.split(",").map(v => v.trim()) })} className="mt-1 w-full rounded-lg border border-slate-200 p-2.5 text-sm" /></label><div className="md:col-span-2 flex gap-2"><button className="rounded-xl bg-lurevia-orange px-4 py-2 text-sm font-bold text-white">{editing ? "Enregistrer" : "Créer"}</button><button type="button" onClick={() => setForm(null)} className="rounded-xl bg-slate-100 px-4 py-2 text-sm font-bold">Annuler</button></div></form>}<div className="grid md:grid-cols-2 gap-4">{products.map(p => <div key={p.id} className="flex items-center gap-4 rounded-2xl bg-white border border-slate-100 p-4"><img src={p.imageUrl} alt="" className="h-16 w-16 rounded-xl object-cover" /><div className="flex-1 min-w-0"><p className="font-black truncate">{p.title}</p><p className="text-sm text-slate-500">{money(p.price)} · Stock {p.stock ?? 0}</p></div><button onClick={() => startEdit(p)} className="p-2 text-slate-500" aria-label="Modifier"><Pencil size={16} /></button><button onClick={() => void remove(p.id)} className="p-2 text-red-500" aria-label="Supprimer"><Trash2 size={16} /></button></div>)}</div></>}
      {tab === "orders" && <div className="space-y-3">{orders.length === 0 ? <p className="text-sm text-slate-400">Aucune commande.</p> : orders.map(o => <div key={o.id} className="flex flex-wrap items-center gap-4 justify-between rounded-2xl bg-white border border-slate-100 p-4"><div><p className="font-black">Commande #{o.id.slice(-8)}</p><p className="text-sm text-slate-500">{o.items.length} article(s) · {money(o.total)}</p></div><select value={o.status.toUpperCase()} onChange={e => void updateStatus(o.id, e.target.value)} className="rounded-lg border border-slate-200 px-3 py-2 text-sm font-bold">{statuses.map(s => <option key={s}>{s}</option>)}</select></div>)}</div>}
    </>}
  </div>;
}
