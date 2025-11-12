"use client";
import { useState } from "react";
import Carousel from "./Carousel";

export default function AniKuresi({ images }) {
  const [formData, setFormData] = useState({
    type: "",
    name: "",
    phone: "",
    address: "",
    city: "",
    notes: "",
    image: null,
  });

  const [imagePreview, setImagePreview] = useState(null);

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
    console.log("Form submitted:", formData);
    alert("Anı Küresi siparişiniz alındı! En kısa sürede sizinle iletişime geçeceğiz.");
  };

  return (
    <div className="space-y-20">
      {/* Romantic Section */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-pink-900/20 via-purple-900/20 to-blue-900/20 backdrop-blur-sm border border-gray-700/50">
        <div className="absolute inset-0">
          <div className="absolute top-10 left-10 text-8xl opacity-10 animate-float">❄️</div>
          <div className="absolute top-20 right-20 text-6xl opacity-10 animate-float animation-delay-200">💕</div>
          <div className="absolute bottom-10 left-1/2 text-7xl opacity-10 animate-float animation-delay-400">🔮</div>
          <div className="absolute bottom-20 right-10 text-9xl opacity-10 animate-float animation-delay-600">❄️</div>
        </div>

        <div className="relative z-10 p-12 text-center max-w-4xl mx-auto">
          <h3 className="text-4xl md:text-5xl font-bold text-white mb-8">
            Bir kar tanesinin içinde saklı aşkımız var… ❄️❤️
          </h3>
          
          <div className="space-y-6 text-lg md:text-xl text-gray-300">
            <p className="italic">
              "Her çevirdiğimde, o an yeniden gözlerimin önünde…"
            </p>
            
            <p className="text-2xl font-semibold text-transparent bg-clip-text bg-gradient-to-r from-pink-400 to-purple-400">
              Bir kürenin içine sığan koca bir hikaye…
            </p>
            
            <p>
              Fotoğrafınız, videonuz, sevginiz — hepsi bu kar tanelerinin arasında dönüyor. ❄️💞
            </p>
            
            <div className="py-6">
              <p className="text-xl font-medium text-white">
                Sevdiklerinize sadece bir hediye değil,
              </p>
              <p className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-pink-400 via-purple-400 to-blue-400">
                her baktıklarında "o an"ı yeniden yaşatacak bir hatıra verin. 💫
              </p>
            </div>
          </div>

          <div className="grid md:grid-cols-3 gap-6 mt-12">
            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20">
              <span className="text-4xl mb-4 block">📸</span>
              <h4 className="text-white font-bold mb-2">Fotoğraflı & Videolu</h4>
              <p className="text-gray-400 text-sm">Kar küresi içinde anılarınız</p>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20">
              <span className="text-4xl mb-4 block">💌</span>
              <h4 className="text-white font-bold mb-2">Kişiye Özel</h4>
              <p className="text-gray-400 text-sm">Tasarım ve mesaj</p>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20">
              <span className="text-4xl mb-4 block">🎁</span>
              <h4 className="text-white font-bold mb-2">En Romantik</h4>
              <p className="text-gray-400 text-sm">Hediye seçeneği</p>
            </div>
          </div>

          <p className="text-3xl font-bold text-white mt-12 animate-pulse">
            ✨ "Anılar geçmesin… hep dönsün."
          </p>
        </div>
      </div>

      {/* Pricing Section */}
      <div className="bg-gradient-to-r from-gray-800/50 to-gray-900/50 backdrop-blur-sm rounded-3xl p-8 border border-gray-700/50">
        <h3 className="text-3xl font-bold text-white mb-8 text-center">
          🔮 ANI KÜRESİ Fiyat Listesi
        </h3>
        
        <div className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto mb-8">
          <div className="bg-gradient-to-br from-purple-900/30 to-pink-900/30 rounded-2xl p-6 border border-purple-500/30 hover:border-purple-500/50 transition-all duration-300 hover:scale-105">
            <h4 className="text-xl font-bold text-white mb-4">Sadece Anı Küresi</h4>
            <p className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-400 mb-4">
              ₺2.500
            </p>
            <ul className="space-y-2 text-gray-300">
              <li className="flex items-center">
                <span className="text-green-400 mr-2">✓</span>
                Kişiye özel tasarım
              </li>
              <li className="flex items-center">
                <span className="text-green-400 mr-2">✓</span>
                Fotoğraf veya video
              </li>
              <li className="flex items-center">
                <span className="text-green-400 mr-2">✓</span>
                Kar efekti
              </li>
            </ul>
          </div>

          <div className="bg-gradient-to-br from-purple-900/30 to-blue-900/30 rounded-2xl p-6 border border-purple-500/30 hover:border-purple-500/50 transition-all duration-300 hover:scale-105">
            <h4 className="text-xl font-bold text-white mb-4">Anı Küresi + Hoparlör</h4>
            <p className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-blue-400 mb-4">
              ₺3.500
            </p>
            <ul className="space-y-2 text-gray-300">
              <li className="flex items-center">
                <span className="text-green-400 mr-2">✓</span>
                Tüm anı küresi özellikleri
              </li>
              <li className="flex items-center">
                <span className="text-green-400 mr-2">✓</span>
                Bluetooth hoparlör
              </li>
              <li className="flex items-center">
                <span className="text-green-400 mr-2">✓</span>
                Müzik ile anılarınız
              </li>
            </ul>
          </div>
        </div>

        <div className="text-center space-y-4">
          <p className="text-gray-400">
            💫 Güvenli kargo + Özenli ambalaj
          </p>
          <div className="bg-gray-900/50 rounded-2xl p-6 max-w-2xl mx-auto">
            <h4 className="text-xl font-bold text-white mb-4">Sipariş Süreci:</h4>
            <ol className="text-left space-y-3 text-gray-300">
              <li>1️⃣ Model seçimini yapın</li>
              <li>2️⃣ Fotoğraf/video ve özel mesajınızı belirtin</li>
              <li>3️⃣ Ürünler sigortalanır, sipariş numaranız iletilir</li>
              <li>4️⃣ 3-5 iş günü içerisinde teslim edilir 💫</li>
            </ol>
          </div>
        </div>
      </div>

      {/* Order Form */}
      <div id="siparis-ani" className="bg-gradient-to-r from-gray-800/50 to-gray-900/50 backdrop-blur-sm rounded-3xl p-8 border border-gray-700/50">
        <h3 className="text-3xl font-bold text-white mb-8 text-center">
          Anı Küresi Siparişi Oluştur
        </h3>

        <form onSubmit={handleSubmit} className="max-w-3xl mx-auto space-y-6">
          {/* Product Selection */}
          <div className="bg-gray-800/50 rounded-2xl p-6 border border-gray-700/50">
            <h4 className="text-xl font-bold text-white mb-4">Ürün Seçimi</h4>
            <div className="grid md:grid-cols-2 gap-4">
              <label className={`relative flex flex-col items-center p-6 rounded-xl border-2 cursor-pointer transition-all duration-300 ${
                formData.type === "basic" ? "border-purple-500 bg-purple-500/10" : "border-gray-700 hover:border-gray-600"
              }`}>
                <input
                  type="radio"
                  name="type"
                  value="basic"
                  checked={formData.type === "basic"}
                  onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                  className="hidden"
                />
                <span className="text-3xl mb-2">🔮</span>
                <span className="text-white font-medium">Sadece Anı Küresi</span>
                <span className="text-purple-400 font-bold mt-2">₺2.500</span>
              </label>

              <label className={`relative flex flex-col items-center p-6 rounded-xl border-2 cursor-pointer transition-all duration-300 ${
                formData.type === "premium" ? "border-purple-500 bg-purple-500/10" : "border-gray-700 hover:border-gray-600"
              }`}>
                <input
                  type="radio"
                  name="type"
                  value="premium"
                  checked={formData.type === "premium"}
                  onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                  className="hidden"
                />
                <span className="text-3xl mb-2">🔮🔊</span>
                <span className="text-white font-medium">Anı Küresi + Hoparlör</span>
                <span className="text-purple-400 font-bold mt-2">₺3.500</span>
              </label>
            </div>
          </div>

          {/* Image Upload */}
          <div className="bg-gray-800/50 rounded-2xl p-6 border border-gray-700/50">
            <h4 className="text-xl font-bold text-white mb-4">Fotoğraf/Video Yükle</h4>
            <label className="block">
              <div className="border-2 border-dashed border-gray-600 rounded-xl p-8 text-center hover:border-purple-500 transition-colors cursor-pointer">
                <input
                  type="file"
                  accept="image/*,video/*"
                  onChange={handleImageUpload}
                  className="hidden"
                />
                {imagePreview ? (
                  <div className="space-y-4">
                    <img src={imagePreview} alt="Preview" className="max-h-64 mx-auto rounded-lg" />
                    <p className="text-green-400">✓ Dosya yüklendi</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <span className="text-6xl">📸</span>
                    <p className="text-gray-400">Fotoğraf veya video yüklemek için tıklayın</p>
                    <p className="text-sm text-gray-500">PNG, JPG, MP4 max. 50MB</p>
                  </div>
                )}
              </div>
            </label>
          </div>

          {/* Contact Information */}
          <div className="bg-gray-800/50 rounded-2xl p-6 border border-gray-700/50">
            <h4 className="text-xl font-bold text-white mb-4">İletişim ve Kargo Bilgileri</h4>
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-gray-400 mb-2">Ad Soyad</label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
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
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  className="w-full px-4 py-3 bg-gray-900/50 border border-gray-700 rounded-lg text-white focus:border-purple-500 focus:outline-none transition-colors"
                  placeholder="05XX XXX XX XX"
                />
              </div>
              <div className="md:col-span-2">
                <label className="block text-gray-400 mb-2">Adres</label>
                <textarea
                  required
                  value={formData.address}
                  onChange={(e) => setFormData({ ...formData, address: e.target.value })}
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
                  onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                  className="w-full px-4 py-3 bg-gray-900/50 border border-gray-700 rounded-lg text-white focus:border-purple-500 focus:outline-none transition-colors"
                  placeholder="Şehir"
                />
              </div>
              <div>
                <label className="block text-gray-400 mb-2">Özel Mesajınız (Opsiyonel)</label>
                <input
                  type="text"
                  value={formData.notes}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                  className="w-full px-4 py-3 bg-gray-900/50 border border-gray-700 rounded-lg text-white focus:border-purple-500 focus:outline-none transition-colors"
                  placeholder="Küreye yazılacak mesaj"
                />
              </div>
            </div>
          </div>

          <div className="text-center">
            <button
              type="submit"
              className="px-12 py-4 bg-gradient-to-r from-pink-600 to-purple-600 text-white rounded-full font-bold text-lg hover:shadow-2xl hover:shadow-purple-500/30 transition-all duration-300 hover:scale-105"
            >
              Siparişi Tamamla 💝
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
