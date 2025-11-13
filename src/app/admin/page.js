"use client";

import { useEffect, useMemo, useState } from "react";
import { subscribeToOrders, updateOrderStatus } from "@/lib/orders";

const ADMIN_CREDENTIALS = {
  username: "admin14kasim2025",
  password: "313169",
};

const SESSION_KEY = "filamentbiblo3d-admin-auth";

const formatDateTime = (value) => {
  if (!value) return "—";
  try {
    return new Date(value).toLocaleString("tr-TR", {
      dateStyle: "medium",
      timeStyle: "short",
    });
  } catch {
    return value;
  }
};

const statusLabelMap = {
  awaiting_payment: "Ödeme Bekleniyor",
  awaiting_verification: "Dekont İncelemede",
  completed: "Tamamlandı",
  awaiting_receipt: "Dekont Bekleniyor",
  receipt_submitted: "Dekont Gönderildi",
  verified: "Ödeme Onaylandı",
};

const statusVariantMap = {
  awaiting_payment: "info",
  awaiting_verification: "warning",
  completed: "success",
  awaiting_receipt: "info",
  receipt_submitted: "warning",
  verified: "success",
};

const badgeClassMap = {
  success:
    "border-green-500/30 bg-green-500/10 text-green-200 backdrop-blur-sm",
  warning:
    "border-amber-400/30 bg-amber-400/10 text-amber-200 backdrop-blur-sm",
  info: "border-blue-400/30 bg-blue-400/10 text-blue-200 backdrop-blur-sm",
};

const orderTypeLabel = (orderType) => {
  switch (orderType) {
    case "3d-figure":
      return "3D Figür";
    case "ani-kuresi":
      return "Anı Küresi";
    default:
      return "Sipariş";
  }
};

export default function AdminPage() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loginForm, setLoginForm] = useState({ username: "", password: "" });
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [updatingId, setUpdatingId] = useState(null);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const stored = sessionStorage.getItem(SESSION_KEY);
    if (stored === "true") {
      setIsAuthenticated(true);
    }
  }, []);

  useEffect(() => {
    if (!isAuthenticated) return;

    setLoading(true);
    const unsubscribe = subscribeToOrders(
      (data) => {
        setOrders(data);
        setLoading(false);
      },
      (err) => {
        console.error("Error subscribing to orders:", err);
        setError("Sipariş verileri alınırken bir sorun oluştu.");
        setLoading(false);
      }
    );

    return () => {
      if (typeof unsubscribe === "function") {
        unsubscribe();
      }
    };
  }, [isAuthenticated]);

  const stats = useMemo(() => {
    const total = orders.length;
    const awaitingPayment = orders.filter(
      (order) =>
        order.status === "awaiting_payment" ||
        order.paymentStatus === "awaiting_receipt"
    ).length;
    const awaitingVerification = orders.filter(
      (order) => order.status === "awaiting_verification"
    ).length;
    const completed = orders.filter((order) => order.status === "completed")
      .length;

    return [
      {
        label: "Toplam Sipariş",
        value: total,
        accent: "from-purple-500 to-blue-500",
      },
      {
        label: "Ödeme Bekleyen",
        value: awaitingPayment,
        accent: "from-amber-500 to-orange-500",
      },
      {
        label: "Dekont İncelemede",
        value: awaitingVerification,
        accent: "from-blue-500 to-cyan-500",
      },
      {
        label: "Tamamlanan",
        value: completed,
        accent: "from-green-500 to-emerald-500",
      },
    ];
  }, [orders]);

  const handleLogin = (e) => {
    e.preventDefault();
    setError(null);

    if (
      loginForm.username === ADMIN_CREDENTIALS.username &&
      loginForm.password === ADMIN_CREDENTIALS.password
    ) {
      setIsAuthenticated(true);
      if (typeof window !== "undefined") {
        sessionStorage.setItem(SESSION_KEY, "true");
      }
    } else {
      setError("Kullanıcı adı veya şifre hatalı.");
    }
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    setOrders([]);
    setError(null);
    if (typeof window !== "undefined") {
      sessionStorage.removeItem(SESSION_KEY);
    }
  };

  const handleUpdateStatus = async (orderId, updates) => {
    setUpdatingId(orderId);
    try {
      await updateOrderStatus(orderId, updates);
    } catch (updateError) {
      console.error("Error updating order status:", updateError);
      alert("Sipariş güncellenirken bir sorun oluştu. Lütfen tekrar deneyin.");
    } finally {
      setUpdatingId(null);
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-black px-4 py-24 sm:px-6 lg:px-8">
        <div className="mx-auto flex w-full max-w-md flex-col items-center gap-8 rounded-3xl border border-white/10 bg-white/5 p-10 shadow-2xl shadow-purple-500/10 backdrop-blur-xl">
          <div className="space-y-2 text-center">
            <h1 className="text-3xl font-bold text-white">
              Filamentbiblo3D Admin
            </h1>
            <p className="text-sm text-gray-300">
              Yönetici paneline erişmek için bilgilerinizi girin.
            </p>
          </div>
          <form onSubmit={handleLogin} className="w-full space-y-5">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-widest text-gray-400">
                Kullanıcı Adı
              </label>
              <input
                type="text"
                value={loginForm.username}
                onChange={(event) =>
                  setLoginForm((prev) => ({
                    ...prev,
                    username: event.target.value,
                  }))
                }
                className="mt-2 w-full rounded-xl border border-white/10 bg-black/40 px-4 py-3 text-white outline-none transition focus:border-purple-500"
                placeholder="Kullanıcı adınızı girin"
                required
              />
            </div>
            <div>
              <label className="block text-xs font-semibold uppercase tracking-widest text-gray-400">
                Şifre
              </label>
              <input
                type="password"
                value={loginForm.password}
                onChange={(event) =>
                  setLoginForm((prev) => ({
                    ...prev,
                    password: event.target.value,
                  }))
                }
                className="mt-2 w-full rounded-xl border border-white/10 bg-black/40 px-4 py-3 text-white outline-none transition focus:border-purple-500"
                placeholder="Şifrenizi girin"
                required
              />
            </div>
            {error && (
              <p className="text-sm font-medium text-rose-300">{error}</p>
            )}
            <button
              type="submit"
              className="w-full rounded-full bg-linear-to-r from-purple-600 to-blue-600 px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-purple-500/30 transition hover:-translate-y-0.5"
            >
              Admin Girişi Yap
            </button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black px-4 py-16 sm:px-6 lg:px-10">
      <div className="mx-auto flex w-full max-w-7xl flex-col gap-10">
        <header className="flex flex-col gap-6 rounded-3xl border border-white/10 bg-white/5 p-8 shadow-xl shadow-purple-500/10 backdrop-blur-xl lg:flex-row lg:items-center lg:justify-between">
          <div>
            <p className="text-xs uppercase tracking-widest text-purple-200">
              Yönetim Paneli
            </p>
            <h1 className="mt-2 text-3xl font-bold text-white">
              Sipariş Takip Merkezi
            </h1>
            <p className="mt-2 max-w-2xl text-sm text-gray-300">
              3D figür ve anı küresi siparişlerinizi gerçek zamanlı takip edin,
              ödeme dekontlarını görüntüleyin ve sipariş durumlarını güncelleyin.
            </p>
          </div>
          <button
            onClick={handleLogout}
            className="inline-flex items-center justify-center rounded-full border border-white/20 px-5 py-2 text-xs font-semibold uppercase tracking-widest text-white transition hover:bg-white/10"
          >
            Oturumu Kapat
          </button>
        </header>

        <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          {stats.map((stat) => (
            <div
              key={stat.label}
              className="rounded-3xl border border-white/10 bg-white/5 p-6 shadow-lg shadow-purple-500/10 backdrop-blur-xl"
            >
              <p className="text-xs uppercase tracking-widest text-gray-400">
                {stat.label}
              </p>
              <p className="mt-3 text-3xl font-bold text-white">{stat.value}</p>
              <div
                className={`mt-4 h-1 rounded-full bg-linear-to-r ${stat.accent}`}
              ></div>
            </div>
          ))}
        </section>

        <section className="rounded-3xl border border-white/10 bg-white/5 p-8 shadow-xl shadow-purple-500/10 backdrop-blur-xl">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h2 className="text-2xl font-semibold text-white">
                Tüm Siparişler
              </h2>
              <p className="text-sm text-gray-400">
                En yeni siparişler en üstte olacak şekilde listelenir.
              </p>
            </div>
            {loading && (
              <span className="text-sm font-medium text-purple-200">
                Veriler yükleniyor...
              </span>
            )}
          </div>

          {error && (
            <div className="mt-6 rounded-2xl border border-rose-500/40 bg-rose-500/10 p-4 text-sm text-rose-100">
              {error}
            </div>
          )}

          <div className="mt-8 grid gap-6 lg:grid-cols-2">
            {orders.map((order) => {
              const productTitle =
                order.productLabel || orderTypeLabel(order.orderType);
              const productPrice =
                order.product?.price || order.price || "Belirtilmedi";
              const orderCreatedAt = formatDateTime(order.createdAt);
              const previewImage =
                order.image?.url || order.displayImage || null;
              const receiptUrl = order.payment?.receiptUrl || null;
              const receiptUploadedAt = formatDateTime(
                order.payment?.uploadedAt
              );

              const badges = [
                {
                  label: "Sipariş",
                  value: statusLabelMap[order.status] || order.status,
                  className:
                    badgeClassMap[statusVariantMap[order.status] || "info"],
                },
                {
                  label: "Ödeme",
                  value:
                    statusLabelMap[order.paymentStatus] || order.paymentStatus,
                  className:
                    badgeClassMap[
                      statusVariantMap[order.paymentStatus] || "info"
                    ],
                },
              ];

              const actions = [];
              if (order.paymentStatus === "receipt_submitted") {
                actions.push({
                  label: "Ödemeyi Onayla",
                  onClick: () =>
                    handleUpdateStatus(order.id, {
                      paymentStatus: "verified",
                      status: "completed",
                    }),
                });
              }
              if (order.status !== "completed") {
                actions.push({
                  label: "Siparişi Tamamla",
                  onClick: () =>
                    handleUpdateStatus(order.id, {
                      status: "completed",
                    }),
                });
              }

              const customerName =
                order.customer?.name || order.name || "Belirtilmedi";
              const customerPhone =
                order.customer?.phone || order.phone || "Belirtilmedi";
              const addressLine = order.shipping?.address
                ? `${order.shipping.address}${
                    order.shipping.city ? ` • ${order.shipping.city}` : ""
                  }`
                : order.address
                ? `${order.address}${order.city ? ` • ${order.city}` : ""}`
                : "Belirtilmedi";

              return (
                <div
                  key={order.id}
                  className="flex flex-col gap-6 rounded-3xl border border-white/10 bg-black/40 p-6 shadow-lg shadow-purple-500/10"
                >
                  <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                    <div>
                      <p className="text-xs uppercase tracking-widest text-gray-400">
                        {orderTypeLabel(order.orderType)}
                      </p>
                      <h3 className="text-xl font-semibold text-white">
                        {productTitle}
                      </h3>
                      <p className="text-sm text-gray-400">
                        Sipariş No:{" "}
                        <span className="text-white">
                          #{order.id.slice(-8).toUpperCase()}
                        </span>
                      </p>
                      <p className="text-xs uppercase tracking-widest text-gray-500">
                        {orderCreatedAt}
                      </p>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {badges
                        .filter((badge) => badge.value)
                        .map((badge) => (
                          <span
                            key={`${order.id}-${badge.label}`}
                            className={`rounded-full border px-3 py-1 text-xs font-semibold ${badge.className}`}
                          >
                            {badge.label}: {badge.value}
                          </span>
                        ))}
                    </div>
                  </div>

                  <div className="grid gap-4 md:grid-cols-3">
                    <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
                      <p className="text-xs uppercase tracking-widest text-gray-400">
                        Ürün Bilgisi
                      </p>
                      <p className="mt-2 text-sm font-semibold text-white">
                        {productTitle}
                      </p>
                      <p className="text-sm text-purple-300">{productPrice}</p>
                      {order.product?.size && (
                        <p className="text-xs text-gray-400">
                          Boyut: {order.product.size}
                        </p>
                      )}
                      {order.product?.packageType && (
                        <p className="text-xs text-gray-400">
                          Paket:{" "}
                          {order.product.packageType === "premium"
                            ? "Anı Küresi + Hoparlör"
                            : "Sadece Anı Küresi"}
                        </p>
                      )}
                    </div>

                    <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
                      <p className="text-xs uppercase tracking-widest text-gray-400">
                        Müşteri
                      </p>
                      <p className="mt-2 text-sm font-semibold text-white">
                        {customerName}
                      </p>
                      <p className="text-sm text-gray-300">{customerPhone}</p>
                      {order.notes && (
                        <p className="mt-2 text-xs text-gray-400">
                          Not: {order.notes}
                        </p>
                      )}
                    </div>

                    <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
                      <p className="text-xs uppercase tracking-widest text-gray-400">
                        Kargo Adresi
                      </p>
                      <p className="mt-2 text-sm text-gray-300">{addressLine}</p>
                      {receiptUrl && (
                        <a
                          href={receiptUrl}
                          target="_blank"
                          rel="noreferrer"
                          className="mt-4 inline-flex items-center justify-center rounded-full border border-white/20 px-3 py-1 text-xs font-semibold uppercase tracking-widest text-white transition hover:bg-white/10"
                        >
                          Dekontu Aç
                        </a>
                      )}
                      {receiptUploadedAt && (
                        <p className="mt-2 text-xs text-gray-500">
                          Dekont Yüklendi: {receiptUploadedAt}
                        </p>
                      )}
                    </div>
                  </div>

                  {previewImage && (
                    <div className="overflow-hidden rounded-2xl border border-white/10 bg-black/40">
                      <img
                        src={previewImage}
                        alt="Sipariş görseli"
                        className="h-48 w-full object-cover"
                      />
                    </div>
                  )}

                  {actions.length > 0 && (
                    <div className="flex flex-wrap gap-3">
                      {actions.map((action) => (
                        <button
                          key={action.label}
                          onClick={action.onClick}
                          disabled={updatingId === order.id}
                          className="inline-flex items-center justify-center rounded-full border border-white/20 px-4 py-2 text-xs font-semibold uppercase tracking-widest text-white transition hover:bg-white/10 disabled:cursor-not-allowed disabled:opacity-50"
                        >
                          {updatingId === order.id
                            ? "Güncelleniyor..."
                            : action.label}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {orders.length === 0 && !loading && (
            <div className="mt-6 rounded-2xl border border-white/10 bg-black/30 p-6 text-center text-sm text-gray-300">
              Henüz kayıtlı bir sipariş bulunmuyor.
            </div>
          )}
        </section>
      </div>
    </div>
  );
}

