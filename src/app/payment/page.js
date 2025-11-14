"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { uploadOrderReceipt } from "@/lib/orders";

import { getAdminSettings } from "@/lib/adminStorage";

export default function PaymentPage() {
  const [orderSummary, setOrderSummary] = useState(null);
  const [receiptFile, setReceiptFile] = useState(null);
  const [uploadPreview, setUploadPreview] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [ibanInfo, setIbanInfo] = useState({
    accountName: "Filamentbiblo3D Tasarım ve Üretim Ltd. Şti.",
    iban: "TR12 3456 7890 1234 5678 0001 23",
    bank: "Bank Filamento A.Ş.",
    branch: "Maslak Kurumsal Şube",
  });

  const gridBackground =
    "url('data:image/svg+xml,%3Csvg width=\"60\" height=\"60\" xmlns=\"http://www.w3.org/2000/svg\"%3E%3Cdefs%3E%3Cpattern id=\"grid\" width=\"60\" height=\"60\" patternUnits=\"userSpaceOnUse\"%3E%3Cpath d=\"M 60 0 L 0 0 0 60\" fill=\"none\" stroke=\"rgba(255,255,255,0.03)\" stroke-width=\"1\"/%3E%3C/pattern%3E%3C/defs%3E%3Crect width=\"100%25\" height=\"100%25\" fill=\"url(%23grid)\"/%3E%3C/svg%3E')";

  const floatingIcons = useMemo(() => {
    const symbols = ["💳", "🪙", "📄", "✉️", "💜", "🎁"];
    return Array.from({ length: 16 }, (_, index) => {
      const left = (index * 41 + 19) % 100;
      const top = (index * 29 + 11) % 100;
      const delay = ((index * 137) % 1000) / 100;
      const duration = 12 + ((index * 53) % 200) / 10;

      return {
        left: `${left}%`,
        top: `${top}%`,
        animationDelay: `${delay}s`,
        animationDuration: `${duration}s`,
        symbol: symbols[index % symbols.length],
      };
    });
  }, []);

  useEffect(() => {
    if (typeof window === "undefined") return;

    try {
      const storedData = sessionStorage.getItem("filamentbiblo3d-order");
      if (storedData) {
        const parsed = JSON.parse(storedData);
        setOrderSummary(parsed);
        if (parsed?.payment?.receiptUrl) {
          setIsSuccess(true);
        }
      }
    } catch (error) {
      console.error("Unable to read order summary from sessionStorage:", error);
    }
  }, []);

  useEffect(() => {
    const loadIbanSettings = async () => {
      try {
        const settings = await getAdminSettings();
        setIbanInfo({
          accountName: settings.authorizedName || "Filamentbiblo3D Tasarım ve Üretim Ltd. Şti.",
          iban: settings.iban || "TR12 3456 7890 1234 5678 0001 23",
          bank: settings.bank || "Bank Filamento A.Ş.",
          branch: settings.branch || "Maslak Kurumsal Şube",
        });
      } catch (error) {
        console.error("Error loading IBAN settings:", error);
        // Keep default values if loading fails
      }
    };

    loadIbanSettings();
  }, []);

  const hasReceipt = useMemo(() => Boolean(receiptFile), [receiptFile]);

  const handleReceiptUpload = (event) => {
    const file = event.target.files?.[0];
    if (!file) {
      setReceiptFile(null);
      setUploadPreview(null);
      return;
    }

    setReceiptFile(file);

    if (file.type.startsWith("image/")) {
      const reader = new FileReader();
      reader.onloadend = () => setUploadPreview(reader.result);
      reader.readAsDataURL(file);
    } else {
      setUploadPreview(null);
    }
  };

  const handleSubmitPayment = async () => {
    if (!hasReceipt || !orderSummary?.id) {
      if (!orderSummary?.id) {
        alert("Sipariş bilgileri yüklenemedi. Lütfen sipariş formunu tekrar doldurun.");
      }
      return;
    }

    setIsSubmitting(true);

    try {
      const updates = await uploadOrderReceipt(orderSummary.id, receiptFile);
      const nextSummary = {
        ...orderSummary,
        ...updates,
        payment: {
          ...(orderSummary.payment || {}),
          ...(updates.payment || {}),
        },
        paymentStatus: updates.paymentStatus,
        status: updates.status,
      };

      setOrderSummary(nextSummary);
      setIsSuccess(true);
      setReceiptFile(null);
      setUploadPreview(null);

      if (typeof window !== "undefined") {
        sessionStorage.setItem(
          "filamentbiblo3d-order",
          JSON.stringify(nextSummary)
        );
      }
    } catch (error) {
      console.error("Error uploading payment receipt:", error);
      alert("Dekont yüklenirken bir sorun oluştu. Lütfen tekrar deneyin.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const renderOrderSummary = () => {
    if (!orderSummary) {
      return (
        <div className="rounded-3xl border border-white/10 bg-black/40 p-6 text-sm text-gray-300">
          <p className="font-semibold text-white">Sipariş Özeti Bulunamadı</p>
          <p className="mt-2">
            Sipariş formunu tamamladıktan sonra bu ekrana yönlendirildiğinizde özet otomatik olarak görünecektir.
          </p>
          <Link
            href="/#siparis-3d"
            className="mt-4 inline-flex items-center justify-center rounded-full border border-white/20 px-5 py-2 text-xs font-semibold uppercase tracking-widest text-white transition hover:bg-white/10"
          >
            Sipariş Formuna Dön
          </Link>
        </div>
      );
    }

    const productLabel =
      orderSummary.productLabel ||
      (orderSummary.orderType === "3d-figure" && orderSummary.product?.size
        ? `3D Figür (${orderSummary.product.size})`
        : orderSummary.orderType === "ani-kuresi" && orderSummary.product?.packageType
        ? orderSummary.product.packageType === "premium"
          ? "Anı Küresi + Hoparlör"
          : "Sadece Anı Küresi"
        : "Sipariş Detayı");

    const productPrice =
      orderSummary.product?.price || orderSummary.price || "Belirtilmedi";

    const productExtras = [];
    if (orderSummary.product?.size) {
      productExtras.push({
        label: "Boyut",
        value: orderSummary.product.size,
      });
    }
    if (orderSummary.product?.packageType) {
      productExtras.push({
        label: "Paket",
        value:
          orderSummary.product.packageType === "premium"
            ? "Anı Küresi + Hoparlör"
            : "Sadece Anı Küresi",
      });
    }

    const displayImage =
      orderSummary.displayImage ||
      orderSummary.image?.url ||
      orderSummary.imagePreview ||
      null;

    const customerName =
      orderSummary.customer?.name || orderSummary.name || "Belirtilmedi";
    const customerPhone =
      orderSummary.customer?.phone || orderSummary.phone || "Belirtilmedi";
    const shippingAddress =
      orderSummary.shipping?.address || orderSummary.address || "";
    const shippingCity =
      orderSummary.shipping?.city || orderSummary.city || "";
    const addressLine = shippingAddress
      ? `${shippingAddress}${shippingCity ? ` • ${shippingCity}` : ""}`
      : "Belirtilmedi";
    const notes = orderSummary.notes;

    const receiptUrl = orderSummary.payment?.receiptUrl || null;
    const receiptUploadedAt = orderSummary.payment?.uploadedAt || null;
    const createdAtLabel = orderSummary.createdAt
      ? new Date(orderSummary.createdAt).toLocaleString("tr-TR", {
          dateStyle: "medium",
          timeStyle: "short",
        })
      : null;

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
      info:
        "border-blue-400/30 bg-blue-400/10 text-blue-200 backdrop-blur-sm",
    };

    const buildBadge = (value, label) => {
      if (!value) return null;
      const variant = statusVariantMap[value] || "info";
      return {
        label,
        value: statusLabelMap[value] || value,
        className: badgeClassMap[variant],
      };
    };

    const statusBadges = [
      buildBadge(orderSummary.status, "Sipariş"),
      buildBadge(orderSummary.paymentStatus, "Ödeme"),
    ].filter(Boolean);

    const orderIdShort = orderSummary.id
      ? `#${orderSummary.id.slice(-6).toUpperCase()}`
      : null;

    return (
      <div className="space-y-6">
        <div className="rounded-3xl border border-white/10 bg-black/40 p-6 shadow-lg shadow-purple-500/10">
          {(orderIdShort || statusBadges.length > 0) && (
            <div className="flex flex-wrap items-center gap-2 text-xs uppercase tracking-widest text-gray-300">
              {orderIdShort && (
                <span className="rounded-full border border-white/20 px-3 py-1 text-white">
                  {orderIdShort}
                </span>
              )}
              {statusBadges.map((badge) => (
                <span
                  key={`${badge.label}-${badge.value}`}
                  className={`rounded-full border px-3 py-1 text-xs font-semibold ${badge.className}`}
                >
                  {badge.label}: {badge.value}
                </span>
              ))}
            </div>
          )}
          <h3 className="mt-4 text-lg font-semibold text-white">Seçtiğiniz Ürün</h3>
          <dl className="mt-4 space-y-2 text-sm text-gray-300">
            <div className="flex items-center justify-between gap-4">
              <dt className="text-gray-400">Ürün</dt>
              <dd className="max-w-[60%] text-right font-medium text-white">
                {productLabel}
              </dd>
            </div>
            <div className="flex items-center justify-between">
              <dt className="text-gray-400">Toplam Tutar</dt>
              <dd className="font-medium text-purple-300">{productPrice}</dd>
            </div>
            {productExtras.map((extra) => (
              <div key={extra.label} className="flex items-center justify-between">
                <dt className="text-gray-400">{extra.label}</dt>
                <dd className="font-medium text-white">{extra.value}</dd>
              </div>
            ))}
            {createdAtLabel && (
              <div className="flex items-center justify-between">
                <dt className="text-gray-400">Sipariş Tarihi</dt>
                <dd className="font-medium text-white">{createdAtLabel}</dd>
              </div>
            )}
          </dl>
          {displayImage && (
            <div className="mt-6 overflow-hidden rounded-2xl border border-white/10 bg-black/60 p-3">
              <img
                src={displayImage}
                alt="Sipariş görseli"
                className="h-48 w-full rounded-xl object-cover"
              />
              <p className="mt-2 text-center text-xs text-gray-400">Sipariş formunda yüklediğiniz görsel</p>
            </div>
          )}
        </div>

        <div className="rounded-3xl border border-white/10 bg-black/40 p-6 shadow-lg shadow-purple-500/10">
          <h3 className="text-lg font-semibold text-white">Teslimat Bilgileri</h3>
          <dl className="mt-4 space-y-2 text-sm text-gray-300">
            <div>
              <dt className="text-gray-400">Ad Soyad</dt>
              <dd className="font-medium text-white">{customerName}</dd>
            </div>
            <div>
              <dt className="text-gray-400">Telefon</dt>
              <dd className="font-medium text-white">{customerPhone}</dd>
            </div>
            <div>
              <dt className="text-gray-400">Adres</dt>
              <dd className="font-medium text-white">{addressLine}</dd>
            </div>
            {notes && (
              <div>
                <dt className="text-gray-400">Notlar</dt>
                <dd className="text-gray-300">{notes}</dd>
              </div>
            )}
          </dl>
        </div>

        {receiptUrl && (
          <div className="rounded-3xl border border-white/10 bg-black/40 p-6 shadow-lg shadow-purple-500/10">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <h3 className="text-lg font-semibold text-white">Yüklenen Dekont</h3>
                {receiptUploadedAt && (
                  <p className="text-xs uppercase tracking-widest text-gray-400">
                    {new Date(receiptUploadedAt).toLocaleString("tr-TR", {
                      dateStyle: "medium",
                      timeStyle: "short",
                    })}
                  </p>
                )}
              </div>
              <a
                href={receiptUrl}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center justify-center rounded-full border border-white/20 px-4 py-2 text-xs font-semibold uppercase tracking-widest text-white transition hover:bg-white/10"
              >
                Dekontu Görüntüle
              </a>
            </div>
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="relative min-h-screen overflow-hidden bg-black">
      <div className="absolute inset-0">
        <div
          className="absolute inset-0 opacity-50"
          style={{ backgroundImage: gridBackground, backgroundRepeat: "repeat" }}
        ></div>
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(88,28,135,0.18),transparent_55%)]"></div>
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_bottom,rgba(59,130,246,0.12),transparent_60%)]"></div>
        <div className="absolute inset-0">
          {floatingIcons.map((icon, idx) => (
            <div
              key={idx}
              className="pointer-events-none absolute text-4xl text-white/10 animate-float"
              style={{
                left: icon.left,
                top: icon.top,
                animationDelay: icon.animationDelay,
                animationDuration: icon.animationDuration,
              }}
            >
              {icon.symbol}
            </div>
          ))}
        </div>
      </div>

      <div className="mx-auto w-full max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="flex flex-col gap-3 text-center">
          <span className="mx-auto inline-flex items-center rounded-full border border-purple-500/40 bg-purple-500/10 px-4 py-1 text-xs font-semibold uppercase tracking-widest text-purple-200">
            Güvenli Ödeme Adımı
          </span>
          <h1 className="text-3xl font-bold text-white md:text-4xl">
            Banka Transferi ile Ödemeyi Tamamlayın
          </h1>
          <p className="mx-auto max-w-2xl text-sm text-gray-300 md:text-base">
            Havale/EFT işleminizi tamamladıktan sonra dekontunuzu yükleyerek siparişinizi doğrulayın. Ekibimiz en geç aynı
            iş günü içinde ödeme teyidinizi sağlayacaktır.
          </p>
        </div>

        <div className="mt-14 lg:flex lg:items-start lg:gap-12">
          <div className="space-y-8 lg:w-[62%] xl:w-[60%]">
            <section className="rounded-3xl border border-white/10 bg-white/5 p-8 shadow-xl shadow-purple-500/10 backdrop-blur-xl">
              <header className="flex flex-col gap-2 border-b border-white/10 pb-6 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <h2 className="text-xl font-semibold text-white">IBAN Bilgileri</h2>
                  <p className="text-sm text-gray-400">Ödemenizi aşağıdaki banka hesabına güvenle gerçekleştirebilirsiniz.</p>
                </div>
                <Link
                  href="https://wa.me/905513481332"
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center justify-center rounded-full border border-white/20 px-4 py-2 text-xs font-semibold uppercase tracking-widest text-white transition hover:-translate-y-0.5 hover:bg-white/10"
                >
                  Destek ile İletişime Geç
                </Link>
              </header>

              <div className="mt-6 grid gap-4 sm:grid-cols-2">
                <div className="rounded-2xl border border-white/10 bg-black/40 p-5">
                  <p className="text-xs uppercase tracking-widest text-gray-400">Hesap Sahibi</p>
                  <p className="mt-2 text-sm font-semibold text-white">{ibanInfo.accountName}</p>
                </div>
                <div className="rounded-2xl border border-white/10 bg-black/40 p-5">
                  <p className="text-xs uppercase tracking-widest text-gray-400">IBAN</p>
                  <p className="mt-2 text-sm font-semibold text-white">{ibanInfo.iban}</p>
                </div>
                <div className="rounded-2xl border border-white/10 bg-black/40 p-5">
                  <p className="text-xs uppercase tracking-widest text-gray-400">Banka</p>
                  <p className="mt-2 text-sm font-semibold text-white">{ibanInfo.bank}</p>
                </div>
                <div className="rounded-2xl border border-white/10 bg-black/40 p-5">
                  <p className="text-xs uppercase tracking-widest text-gray-400">Şube</p>
                  <p className="mt-2 text-sm font-semibold text-white">{ibanInfo.branch}</p>
                </div>
              </div>

              <div className="mt-6 rounded-2xl border border-white/10 bg-black/30 p-6">
                <p className="text-sm font-semibold text-white">Ödeme Notu</p>
                <ul className="mt-3 space-y-2 text-sm text-gray-300">
                  <li>• Açıklama kısmına sipariş numaranızı veya adınızı yazmayı unutmayın.</li>
                  <li>• Havale/EFT işlemi sonrası dekontunuzu aşağıdaki alandan yükleyiniz.</li>
                  <li>• Mesai saatleri dışında yapılan ödemeler ilk iş gününde kontrol edilir.</li>
                </ul>
              </div>
            </section>

            <section className="rounded-3xl border border-purple-500/30 bg-purple-500/10 p-8 shadow-2xl shadow-purple-500/20 backdrop-blur-xl">
              <h2 className="text-xl font-semibold text-white">Dekont Yükleme</h2>
              <p className="mt-2 text-sm text-purple-100">
                Ödeme dekontunuzu yükleyerek siparişinizi tamamlayın. Elimizde dekontunuz olmadan üretime başlayamıyoruz.
              </p>

              <div className="mt-6 grid gap-6 md:grid-cols-2">
                <label className="flex h-48 flex-col items-center justify-center rounded-3xl border-2 border-dashed border-purple-300/50 bg-black/30 p-6 text-center transition hover:border-purple-200 hover:bg-black/40">
                  <input
                    type="file"
                    accept="image/*,.pdf"
                    onChange={handleReceiptUpload}
                    className="hidden"
                  />
                  <span className="text-4xl text-purple-200">⬆️</span>
                  <p className="mt-3 text-sm font-semibold text-white">Dekontu Sürükleyin ya da Seçin</p>
                  <p className="text-xs text-purple-100">PDF, JPG, PNG formatı | max. 10MB</p>
                </label>

                <div className="rounded-3xl border border-white/20 bg-black/40 p-6 text-sm text-gray-200">
                  <p className="text-xs uppercase tracking-widest text-gray-400">Yükleme Durumu</p>
                  {receiptFile ? (
                    <div className="mt-4 space-y-2">
                      <p className="font-semibold text-white">{receiptFile.name}</p>
                      <p className="text-xs text-gray-400">
                        {Math.round(receiptFile.size / 1024)} KB • {receiptFile.type || "Dosya"}
                      </p>
                      {uploadPreview && (
                        <div className="mt-4 overflow-hidden rounded-2xl border border-white/10 bg-black/60 p-3">
                          <img
                            src={uploadPreview}
                            alt="Dekont önizleme"
                            className="h-40 w-full rounded-xl object-cover"
                          />
                        </div>
                      )}
                      <button
                        type="button"
                        onClick={() => {
                          setReceiptFile(null);
                          setUploadPreview(null);
                        }}
                        className="mt-4 inline-flex items-center justify-center rounded-full border border-white/20 px-4 py-2 text-xs font-semibold uppercase tracking-widest text-white transition hover:bg-white/10"
                      >
                        Dosyayı Kaldır
                      </button>
                    </div>
                  ) : (
                    <p className="mt-2 text-sm text-gray-400">
                      Henüz dosya yüklenmedi. Ödeme dekontunuzu yüklediğinizde burada görünecektir.
                    </p>
                  )}
                </div>
              </div>

              <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <Link
                  href="/#siparis-3d"
                  className="inline-flex items-center justify-center rounded-full border border-white/20 px-5 py-3 text-xs font-semibold uppercase tracking-widest text-white transition hover:-translate-y-0.5 hover:bg-white/10"
                >
                  Sipariş Bilgilerimi Güncelle
                </Link>
                <button
                  type="button"
                  onClick={handleSubmitPayment}
                  disabled={!hasReceipt || !orderSummary?.id || isSubmitting || isSuccess}
                  className={`inline-flex items-center justify-center rounded-full px-8 py-3 text-sm font-semibold text-white transition-all ${
                    hasReceipt && !isSubmitting && !isSuccess
                      ? "bg-linear-to-r from-purple-600 to-blue-600 shadow-lg shadow-purple-500/30 hover:-translate-y-0.5"
                      : "bg-white/10 text-gray-400"
                  }`}
                >
                  {isSubmitting ? "Gönderiliyor..." : isSuccess ? "Ödeme Tamamlandı" : "Ödemeyi Tamamla"}
                </button>
              </div>

              {isSuccess && (
                <div className="mt-6 rounded-2xl border border-green-500/40 bg-green-500/10 p-5 text-sm text-green-100">
                  <p className="text-base font-semibold text-green-200">Ödeme Başarıyla İletildi</p>
                  <p className="mt-2">
                    Dekontunuz ekiplerimize ulaştı. Kısa süre içerisinde ödeme teyidinizi sağlayıp sipariş durumunuzu
                    güncelleyeceğiz. Teşekkür ederiz!
                  </p>
                </div>
              )}
            </section>
          </div>

          <aside className="mt-10 space-y-8 lg:mt-0 lg:w-[38%] xl:w-[36%]">
            <div className="space-y-8 lg:sticky lg:top-28">
              <div className="rounded-3xl border border-white/10 bg-white/5 p-8 shadow-xl shadow-purple-500/10 backdrop-blur-xl">
                <h2 className="text-xl font-semibold text-white">Sipariş Özeti</h2>
                <p className="mt-2 text-sm text-gray-300">
                  Ödemeniz onaylandığında bu özet doğrultusunda üretim sürecinizi başlatacağız.
                </p>
                <div className="mt-6">{renderOrderSummary()}</div>
              </div>

              <div className="rounded-3xl border border-white/10 bg-black/40 p-6">
                <h3 className="text-lg font-semibold text-white">Sık Sorulan Sorular</h3>
                <div className="mt-4 space-y-4 text-sm text-gray-300">
                  <details className="group rounded-2xl border border-white/10 bg-black/30 p-4">
                    <summary className="flex cursor-pointer items-center justify-between text-white">
                      Ödemem ne zaman onaylanır?
                      <span className="text-xl text-purple-300 transition group-open:rotate-45">+</span>
                    </summary>
                    <p className="mt-3 text-sm text-gray-300">
                      Dekontunuzu aldıktan sonra hafta içi 09:00-19:00 saatleri arasında en geç 2 saat içinde ödeme teyidi sağlıyoruz.
                    </p>
                  </details>
                  <details className="group rounded-2xl border border-white/10 bg-black/30 p-4">
                    <summary className="flex cursor-pointer items-center justify-between text-white">
                      Yanlış bilgileri nasıl güncellerim?
                      <span className="text-xl text-purple-300 transition group-open:rotate-45">+</span>
                    </summary>
                    <p className="mt-3 text-sm text-gray-300">
                      Sipariş formundaki bilgilerinizi güncelleyip yeniden gönderebilir veya WhatsApp üzerinden destek ekibimize ulaşabilirsiniz.
                    </p>
                  </details>
                  <details className="group rounded-2xl border border-white/10 bg-black/30 p-4">
                    <summary className="flex cursor-pointer items-center justify-between text-white">
                      Başka ödeme yöntemleri mevcut mu?
                      <span className="text-xl text-purple-300 transition group-open:rotate-45">+</span>
                    </summary>
                    <p className="mt-3 text-sm text-gray-300">
                      Kredi kartı ödemesi için link ile ödeme seçeneğini yakında ekleyeceğiz. Şimdilik havale/EFT yoluyla ödemenizi kabul ediyoruz.
                    </p>
                  </details>
                </div>
              </div>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}

