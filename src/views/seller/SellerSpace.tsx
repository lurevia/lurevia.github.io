import { useCallback, useEffect, useState } from "react";
import type { FormEvent } from "react";
import {
  sellerApi,
  type SellerProductInput,
  type SellerStats,
} from "../../api/seller";
import type { Product } from "../../bin/types/homeType";
import type { Order } from "../../bin/types/orderType";
import type { ServiceFeedback } from "../../bin/types/feedbackType";
import { toErrorMessage } from "../../api/http";
import { mediaApi } from "../../api/media";
import { useAuth } from "../../hooks/useAuth";
import { SellerDashboardPanel } from "./SellerDashboardPanel";
import { SellerOrdersPanel } from "./SellerOrdersPanel";
import { SellerProductsPanel } from "./SellerProductsPanel";
import { SellerProfileSettings } from "./SellerProfileSettings";
import { SellerSpaceNavigation } from "./SellerSpaceNavigation";
import { EMPTY_SELLER_PRODUCT, type SellerTab } from "./sellerDisplay";

export function SellerSpace() {
  const [tab, setTab] = useState<SellerTab>("dashboard");
  const { user } = useAuth();
  const [stats, setStats] = useState<SellerStats | null>(null);
  const [feedback, setFeedback] = useState<ServiceFeedback[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [form, setForm] = useState<SellerProductInput | null>(null);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const [nextStats, nextFeedback, nextProducts, nextOrders] =
        await Promise.all([
          sellerApi.stats(),
          sellerApi.feedback(),
          sellerApi.products(),
          sellerApi.orders(),
        ]);
      setStats(nextStats);
      setFeedback(nextFeedback);
      setProducts(nextProducts);
      setOrders(nextOrders);
    } catch (loadError) {
      setError(toErrorMessage(loadError));
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  const saveProduct = async (event: FormEvent) => {
    event.preventDefault();
    if (!form) return;

    try {
      const images = await Promise.all(
        form.images.filter(Boolean).map(importProductImage),
      );
      const payload = {
        ...form,
        categoryIds: form.categoryIds.filter(Boolean),
        images,
      };
      if (editingId) {
        await sellerApi.updateProduct(editingId, payload);
      } else {
        await sellerApi.createProduct(payload);
      }
      setForm(null);
      setEditingId(null);
      await load();
    } catch (saveError) {
      setError(toErrorMessage(saveError));
    }
  };

  const editProduct = (product: Product) => {
    setForm({
      ...EMPTY_SELLER_PRODUCT,
      title: product.title,
      sku: product.sku ?? "",
      price: product.price,
      stock: product.stock ?? 0,
      description: product.description,
      images: product.images ?? [product.imageUrl],
    });
    setEditingId(product.id);
  };

  const removeProduct = async (productId: string) => {
    if (!window.confirm("Supprimer ce produit ?")) return;
    try {
      await sellerApi.removeProduct(productId);
      await load();
    } catch (removeError) {
      setError(toErrorMessage(removeError));
    }
  };

  const updateOrderStatus = async (orderId: string, status: string) => {
    try {
      await sellerApi.updateOrderStatus(orderId, status);
      await load();
    } catch (updateError) {
      setError(toErrorMessage(updateError));
    }
  };

  const renderActiveTab = () => {
    if (tab === "dashboard") {
      return <SellerDashboardPanel stats={stats} feedback={feedback} />;
    }
    if (tab === "products") {
      return (
        <SellerProductsPanel
          products={products}
          form={form}
          editingId={editingId}
          onFormChange={setForm}
          onEditingChange={setEditingId}
          onSave={saveProduct}
          onEdit={editProduct}
          onRemove={(productId) => void removeProduct(productId)}
          onError={setError}
        />
      );
    }
    if (tab === "orders") {
      return (
        <SellerOrdersPanel
          orders={orders}
          onUpdateStatus={(orderId, status) =>
            void updateOrderStatus(orderId, status)
          }
        />
      );
    }
    return <SellerProfileSettings />;
  };

  return (
    <main className="max-w-7xl mx-auto px-4 py-6 md:py-10 pb-28">
      {error && (
        <div className="mb-5 rounded-xl bg-red-50 px-4 py-3 text-sm font-semibold text-red-700">
          {error}
        </div>
      )}

      <SellerSpaceNavigation
        activeTab={tab}
        userId={user?.id}
        onTabChange={setTab}
        onRefresh={() => void load()}
      />

      {loading ? (
        <div className="py-20 text-center text-sm font-bold text-slate-400">
          Chargement de votre espace…
        </div>
      ) : (
        renderActiveTab()
      )}
    </main>
  );
}

const importProductImage = async (url: string): Promise<string> => {
  if (url.startsWith("data:")) {
    return (await mediaApi.uploadDataUrl(url)).publicUrl;
  }
  if (url.includes("raw.githubusercontent.com/")) return url;
  return (await mediaApi.importUrl(url)).publicUrl;
};
