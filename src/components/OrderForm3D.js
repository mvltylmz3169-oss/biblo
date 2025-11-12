"use client";
import { useState, useEffect } from "react";

export default function OrderForm3D() {
  const [formData, setFormData] = useState({
    image: null,
    size: "",
    name: "",
    phone: "",
    address: "",
    city: "",
    notes: "",
  });

  const [imagePreview, setImagePreview] = useState(null);
  const [currentStep, setCurrentStep] = useState(1);
  const [isDesktop, setIsDesktop] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;

    const mediaQuery = window.matchMedia("(min-width: 768px)");
    const handleMediaChange = (event) => setIsDesktop(event.matches);

    setIsDesktop(mediaQuery.matches);
    mediaQuery.addEventListener("change", handleMediaChange);

    return () => mediaQuery.removeEventListener("change", handleMediaChange);
  }, []);

  const steps = isDesktop
    ? [
        { id: 1, label: "Görsel Yükle" },
        { id: 2, label: "Boyut Seç" },
        { id: 3, label: "Kargo Bilgileri" },
        { id: 4, label: "Ödeme" },
      ]
    : [
        { id: 1, label: "Görsel Yükle" },
        { id: 2, label: "Boyut Seç" },
        { id: 3, label: "Kargo Bilgileri" },
      ];

  const maxStep = steps.length;

  useEffect(() => {
    if (currentStep > maxStep) {
      setCurrentStep(maxStep);
    }
  }, [currentStep, maxStep]);

  const sizes = [
    { size: "10 cm", price: "1.850 TL" },
    { size: "15 cm", price: "2.999 TL" },
    { size: "17 cm", price: "2.300 TL" },
    { size: "20 cm", price: "3.999 TL" },
    { size: "24 cm", price: "2.800 TL" },
    { size: "25 cm", price: "4.999 TL" },
    { size: "30-34 cm", price: "3.200 TL" },
  ];

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData({ ...formData, image: file });
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Handle form submission
    console.log("Form submitted:", formData);
    alert("Siparişiniz alındı! En kısa sürede sizinle iletişime geçeceğiz.");
  };

  const nextStep = () => {
    setCurrentStep((prev) => Math.min(prev + 1, maxStep));
  };

  const prevStep = () => {
    setCurrentStep((prev) => Math.max(prev - 1, 1));
  };

  return (
    <div id="siparis-3d" className="bg-gradient-to-r  from-gray-800/50 to-gray-900/50 backdrop-blur-sm rounded-3xl p-8 border border-gray-700/50">
      <h3 className="text-3xl font-bold text-white mb-8 text-center">
        3D Figür Siparişinizi Oluşturun
      </h3>

      {/* Progress Steps */}
      <div className="flex items-center justify-center mb-8 max-w-3xl mx-auto">
        {steps.map((step, index) => {
          const stepNumber = index + 1;
          const isCompleted = currentStep > stepNumber;
          const isActive = currentStep >= stepNumber;

          return (
            <div key={step.id} className="flex items-center">
              <div className="flex flex-col items-center">
                <div
                  className={`flex h-12 w-12 items-center justify-center rounded-full font-bold transition-all duration-300 ${
                    isActive
                      ? "bg-gradient-to-r from-purple-600 to-blue-600 text-white"
                      : "bg-gray-700 text-gray-400"
                  }`}
                >
                  {stepNumber}
                </div>
                <p className="mt-3 max-w-[7.5rem] text-center text-sm text-gray-400">
                  {step.label}
                </p>
              </div>
              {index < steps.length - 1 && (
                <div
                  className={`mx-3 h-1 w-14 transition-all duration-300 sm:mx-4 sm:w-20 ${
                    isCompleted ? "bg-purple-600" : "bg-gray-700"
                  }`}
                />
              )}
            </div>
          );
        })}
      </div>

      <form onSubmit={handleSubmit} className="max-w-3xl mx-auto">
        {/* Step 1: Image Upload */}
        {currentStep === 1 && (
          <div className="space-y-6">
            <div className="bg-gray-800/50 rounded-2xl p-6 border border-gray-700/50">
              <h4 className="text-xl font-bold text-white mb-4">
                Adım 1: Görselinizi Yükleyin
              </h4>
              <div className="space-y-4">
                <label className="block">
                  <div className="border-2 border-dashed border-gray-600 rounded-xl p-8 text-center hover:border-purple-500 transition-colors cursor-pointer">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageUpload}
                      className="hidden"
                    />
                    {imagePreview ? (
                      <div className="space-y-4">
                        <img
                          src={imagePreview}
                          alt="Preview"
                          className="max-h-64 mx-auto rounded-lg"
                        />
                        <p className="text-green-400">✓ Görsel yüklendi</p>
                      </div>
                    ) : (
                      <div className="space-y-4">
                        <svg
                          className="w-16 h-16 mx-auto text-gray-500"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                          />
                        </svg>
                        <p className="text-gray-400">
                          Görselinizi yüklemek için tıklayın
                        </p>
                        <p className="text-sm text-gray-500">
                          PNG, JPG, GIF max. 10MB
                        </p>
                      </div>
                    )}
                  </div>
                </label>
              </div>
            </div>

            <div className="flex justify-end">
              <button
                type="button"
                onClick={nextStep}
                disabled={!formData.image}
                className="px-8 py-3 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-full font-bold hover:shadow-xl transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Sonraki Adım →
              </button>
            </div>
          </div>
        )}

        {/* Step 2: Size Selection */}
        {currentStep === 2 && (
          <div className="space-y-6">
            <div className="bg-gray-800/50 rounded-2xl p-6 border border-gray-700/50">
              <h4 className="text-xl font-bold text-white mb-4">
                Adım 2: Boyut Seçin
              </h4>
              <div className="grid md:grid-cols-2 gap-4">
                {sizes.map((item) => (
                  <label
                    key={item.size}
                    className={`relative flex items-center justify-between p-4 rounded-xl border-2 cursor-pointer transition-all duration-300 ${
                      formData.size === item.size
                        ? "border-purple-500 bg-purple-500/10"
                        : "border-gray-700 hover:border-gray-600"
                    }`}
                  >
                    <input
                      type="radio"
                      name="size"
                      value={item.size}
                      checked={formData.size === item.size}
                      onChange={(e) =>
                        setFormData({ ...formData, size: e.target.value })
                      }
                      className="hidden"
                    />
                    <div className="flex items-center space-x-3">
                      <div
                        className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                          formData.size === item.size
                            ? "border-purple-500"
                            : "border-gray-600"
                        }`}
                      >
                        {formData.size === item.size && (
                          <div className="w-3 h-3 bg-purple-500 rounded-full" />
                        )}
                      </div>
                      <span className="text-white font-medium">{item.size}</span>
                    </div>
                    <span className="text-purple-400 font-bold">{item.price}</span>
                  </label>
                ))}
              </div>
            </div>

            <div className="flex justify-between">
              <button
                type="button"
                onClick={prevStep}
                className="px-8 py-3 bg-gray-700 text-white rounded-full font-bold hover:bg-gray-600 transition-all duration-300"
              >
                ← Önceki Adım
              </button>
              <button
                type="button"
                onClick={nextStep}
                disabled={!formData.size}
                className="px-8 py-3 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-full font-bold hover:shadow-xl transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Sonraki Adım →
              </button>
            </div>
          </div>
        )}

        {/* Step 3: Shipping Information */}
        {currentStep === 3 && (
          <div className="space-y-6">
            <div className="bg-gray-800/50 rounded-2xl p-6 border border-gray-700/50">
              <h4 className="text-xl font-bold text-white mb-4">
                Adım 3: Kargo Bilgileriniz
              </h4>
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-gray-400 mb-2">Ad Soyad</label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) =>
                      setFormData({ ...formData, name: e.target.value })
                    }
                    className="w-full px-4 py-3 bg-gray-900/50 border border-gray-700 rounded-lg text-white focus:border-purple-500 focus:outline-none transition-colors"
                    placeholder="Adınız Soyadınız"
                  />
                </div>
                <div>
                  <label className="block text-gray-400 mb-2">Telefon</label>
                  <input
                    type="tel"
                    required
                    value={formData.phone}
                    onChange={(e) =>
                      setFormData({ ...formData, phone: e.target.value })
                    }
                    className="w-full px-4 py-3 bg-gray-900/50 border border-gray-700 rounded-lg text-white focus:border-purple-500 focus:outline-none transition-colors"
                    placeholder="05XX XXX XX XX"
                  />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-gray-400 mb-2">Adres</label>
                  <textarea
                    required
                    value={formData.address}
                    onChange={(e) =>
                      setFormData({ ...formData, address: e.target.value })
                    }
                    rows="3"
                    className="w-full px-4 py-3 bg-gray-900/50 border border-gray-700 rounded-lg text-white focus:border-purple-500 focus:outline-none transition-colors"
                    placeholder="Teslimat adresi"
                  />
                </div>
                <div>
                  <label className="block text-gray-400 mb-2">Şehir</label>
                  <input
                    type="text"
                    required
                    value={formData.city}
                    onChange={(e) =>
                      setFormData({ ...formData, city: e.target.value })
                    }
                    className="w-full px-4 py-3 bg-gray-900/50 border border-gray-700 rounded-lg text-white focus:border-purple-500 focus:outline-none transition-colors"
                    placeholder="Şehir"
                  />
                </div>
                <div>
                  <label className="block text-gray-400 mb-2">
                    Notlar (Opsiyonel)
                  </label>
                  <input
                    type="text"
                    value={formData.notes}
                    onChange={(e) =>
                      setFormData({ ...formData, notes: e.target.value })
                    }
                    className="w-full px-4 py-3 bg-gray-900/50 border border-gray-700 rounded-lg text-white focus:border-purple-500 focus:outline-none transition-colors"
                    placeholder="Özel istekleriniz"
                  />
                </div>
              </div>
            </div>

            <div className="flex justify-between">
              <button
                type="button"
                onClick={prevStep}
                className="px-8 py-3 bg-gray-700 text-white rounded-full font-bold hover:bg-gray-600 transition-all duration-300"
              >
                ← Önceki Adım
              </button>
              <button
                type={isDesktop ? "button" : "submit"}
                onClick={isDesktop ? nextStep : undefined}
                className={`px-8 py-3 rounded-full font-bold transition-all duration-300 ${
                  isDesktop
                    ? "bg-gradient-to-r from-purple-600 to-blue-600 text-white hover:shadow-xl"
                    : "bg-gradient-to-r from-green-600 to-green-700 text-white hover:shadow-xl hover:shadow-green-500/30"
                }`}
              >
                {isDesktop ? "Ödemeye Geç →" : "Siparişi Tamamla"}
              </button>
            </div>
          </div>
        )}

        {/* Step 4: Payment (Desktop Only) */}
        {isDesktop && currentStep === 4 && (
          <div className="space-y-6">
            <div className="bg-gray-800/50 rounded-2xl p-6 border border-gray-700/50">
              <h4 className="text-xl font-bold text-white mb-4">
                Adım 4: Ödeme
              </h4>
              <div className="space-y-4 text-gray-300">
                <p>
                  Siparişinizi tamamlamak için tercih ettiğiniz ödeme yöntemini seçin.
                  Temsilcimiz kısa süre içinde sizinle iletişime geçerek ödemeyi
                  onaylayacaktır.
                </p>
                <div className="grid md:grid-cols-3 gap-4">
                  <div className="rounded-xl border border-gray-700 bg-gray-900/50 p-4 text-center">
                    <p className="text-white font-semibold">Havale/EFT</p>
                    <p className="text-sm text-gray-400">
                      Güvenli banka transferi ile ödeme.
                    </p>
                  </div>
                  <div className="rounded-xl border border-gray-700 bg-gray-900/50 p-4 text-center">
                    <p className="text-white font-semibold">Kredi Kartı</p>
                    <p className="text-sm text-gray-400">
                      Online link ile hızlı ödeme.
                    </p>
                  </div>
                  <div className="rounded-xl border border-gray-700 bg-gray-900/50 p-4 text-center">
                    <p className="text-white font-semibold">Kapıda Ödeme</p>
                    <p className="text-sm text-gray-400">
                      Teslimatta nakit veya kart ile ödeme.
                    </p>
                  </div>
                </div>
                <p className="text-sm text-gray-400">
                  Ödeme bilgilerini gönderdiğinizde siparişiniz işleme alınacaktır.
                </p>
              </div>
            </div>

            <div className="flex justify-between">
              <button
                type="button"
                onClick={prevStep}
                className="px-8 py-3 bg-gray-700 text-white rounded-full font-bold hover:bg-gray-600 transition-all duration-300"
              >
                ← Önceki Adım
              </button>
              <button
                type="submit"
                className="px-8 py-3 bg-gradient-to-r from-green-600 to-green-700 text-white rounded-full font-bold hover:shadow-xl hover:shadow-green-500/30 transition-all duration-300"
              >
                Siparişi Tamamla
              </button>
            </div>
          </div>
        )}
      </form>
    </div>
  );
}
