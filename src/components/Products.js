"use client";
import { useState } from "react";
import Link from "next/link";
import Carousel from "./Carousel";
import OrderForm3D from "./OrderForm3D";
import AniKuresi from "./AniKuresi";

export default function Products() {
  const [activeTab, setActiveTab] = useState("3d");

  const bibloImages = [
    require("../assets/biblo.jpg"),
    require("../assets/biblo2.jpg"),
    require("../assets/biblo3.jpg"),
    require("../assets/biblo4.jpg"),
    require("../assets/biblo5.jpg"),
    require("../assets/biblo6.jpg"),
  ];

  const aniKuresiImages = [
    require("../assets/anıküresi.jpg"),
    require("../assets/anıkuresi2.jpg"),
    require("../assets/anıkuresi3.jpg"),
    require("../assets/anıkuresi4.jpg"),
    require("../assets/anıkuresi5.jpg"),
  ];

  return (
    <section id="products" className="py-20 bg-gradient-to-b from-gray-900 to-black">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
            Çalışmalarımız
          </h2>
          <p className="text-xl text-gray-400">
            Müşterilerimiz için özel olarak ürettiğimiz eserler
          </p>
        </div>

        {/* Tab Navigation */}
        <div className="flex justify-center mb-12">
          <div className="bg-gray-800/50 backdrop-blur-sm rounded-full p-1 grid grid-cols-3 relative">
            {/* Animated Background Slider */}
            <div
              className={`absolute top-1 bottom-1 rounded-full bg-gradient-to-r from-purple-600 to-blue-600 transition-all duration-500 ease-in-out ${
                activeTab === "3d"
                  ? "left-1 right-[calc(66.666%+2px)]"
                  : activeTab === "ani"
                  ? "left-[calc(33.333%+2px)] right-[calc(33.333%+2px)]"
                  : "left-[calc(66.666%+2px)] right-1"
              }`}
            />
            
            <button
              onClick={() => setActiveTab("3d")}
              className={`relative cursor-pointer z-10 px-6 py-3 rounded-full font-medium transition-all duration-300 ${
                activeTab === "3d"
                  ? "text-white"
                  : "text-gray-400 hover:text-white"
              }`}
            >
              3D Figür
            </button>
            <button
              onClick={() => setActiveTab("ani")}
              className={`relative cursor-pointer z-10 px-6 py-3 rounded-full font-medium transition-all duration-300 ${
                activeTab === "ani"
                  ? "text-white"
                  : "text-gray-400 hover:text-white"
              }`}
            >
              Anı Küresi
            </button>
            <button
              onClick={() => setActiveTab("all")}
              className={`relative cursor-pointer z-10 px-6 py-3 rounded-full font-medium transition-all duration-300 ${
                activeTab === "all"
                  ? "text-white"
                  : "text-gray-400 hover:text-white"
              }`}
            >
              Tüm Ürünler
            </button>
          </div>
        </div>

        {/* Content Based on Tab */}
        {activeTab === "all" && (
          <div className="space-y-20">
            {/* Carousels - Yan Yana */}
            <div className="grid md:grid-cols-2 gap-8">
              {/* 3D Figür Carousel */}
              <div className="relative">
                <div className="absolute -inset-4 bg-gradient-to-r from-purple-600/20 to-blue-600/20 rounded-3xl blur-3xl"></div>
                <div className="relative bg-gray-800/50 backdrop-blur-sm rounded-3xl p-6 border border-gray-700/50">
                  <Carousel images={bibloImages} title="3D Figür Çalışmalarımız" />
                </div>
              </div>

              {/* Anı Küresi Carousel */}
              <div className="relative">
                <div className="absolute -inset-4 bg-gradient-to-r from-pink-600/20 to-purple-600/20 rounded-3xl blur-3xl"></div>
                <div className="relative bg-gray-800/50 backdrop-blur-sm rounded-3xl p-6 border border-gray-700/50">
                  <Carousel images={aniKuresiImages} title="Anı Küresi Çalışmalarımız" />
                </div>
              </div>
            </div>

            {/* 3D Figür Bilgileri ve Sipariş */}
            <div className="bg-gradient-to-r from-gray-800/50 to-gray-900/50 backdrop-blur-sm rounded-3xl p-8 border border-gray-700/50">
              <div className="grid md:grid-cols-2 gap-8 items-center">
                <div className="space-y-6">
                  <h3 className="text-3xl font-bold text-white">
                    Kişiye Özel 3D Figürler
                  </h3>
                  <p className="text-gray-300 leading-relaxed">
                    Filamentbiblo3D olarak, sevdiklerinizle paylaştığınız özel anları 3D baskı figürlere dönüştürüyoruz 🎨
                  </p>
                  <p className="text-gray-300 leading-relaxed">
                    Ailenizi, dostlarınızı ya da en sevdiğiniz kareyi ölümsüzleştirin 👨‍👩‍👧‍👦
                  </p>
                  
                  <div className="space-y-4">
                    <div className="flex items-center space-x-3">
                      <span className="text-2xl">📦</span>
                      <span className="text-white">Kişiye özel tasarım</span>
                    </div>
                    <div className="flex items-center space-x-3">
                      <span className="text-2xl">🧩</span>
                      <span className="text-white">Gerçek boyutlu modelleme</span>
                    </div>
                    <div className="flex items-center space-x-3">
                      <span className="text-2xl">✨</span>
                      <span className="text-white">SLA baskı teknolojisi</span>
                    </div>
                  </div>

                  <Link
                    href="#siparis-3d"
                    className="inline-flex items-center justify-center px-8 py-4 font-bold text-white bg-gradient-to-r from-purple-600 to-blue-600 rounded-full hover:shadow-2xl hover:shadow-purple-500/30 hover:scale-105 transition-all duration-300"
                  >
                    Hemen Sipariş Ver
                  </Link>
                </div>

                <div className="bg-gray-900/50 rounded-2xl p-6 border border-gray-700/50">
                  <h4 className="text-xl font-bold text-white mb-4">
                    🎨 Özel Tasarım Fiyat Listesi
                  </h4>
                  <p className="text-sm text-gray-400 mb-4">
                    (Bir görselde Max 4 kişi - 4'ten fazla kişi için +400 TL)
                  </p>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center p-3 bg-gray-800/50 rounded-lg">
                      <span className="text-white font-medium">10 cm</span>
                      <span className="text-purple-400 font-bold">1.850 TL</span>
                    </div>
                    <div className="flex justify-between items-center p-3 bg-gray-800/50 rounded-lg">
                      <span className="text-white font-medium">15 cm</span>
                      <span className="text-purple-400 font-bold">2.999 TL</span>
                    </div>
                    <div className="flex justify-between items-center p-3 bg-gray-800/50 rounded-lg">
                      <span className="text-white font-medium">20 cm</span>
                      <span className="text-purple-400 font-bold">3.999 TL</span>
                    </div>
                    <div className="flex justify-between items-center p-3 bg-gray-800/50 rounded-lg">
                      <span className="text-white font-medium">25 cm</span>
                      <span className="text-purple-400 font-bold">4.999 TL</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* 3D Figür Sipariş Formu */}
            <OrderForm3D />

            {/* Anı Küresi Bilgileri ve Sipariş */}
            <AniKuresi images={aniKuresiImages} />
          </div>
        )}

        {activeTab === "3d" && (
          <div className="space-y-20">
            {/* 3D Figür Section */}
            <div id="3d-figur" className="relative">
              <div className="absolute -inset-4 bg-gradient-to-r from-purple-600/20 to-blue-600/20 rounded-3xl blur-3xl"></div>
              <div className="relative bg-gray-800/50 backdrop-blur-sm rounded-3xl p-8 border border-gray-700/50">
                <Carousel images={bibloImages} title="3D Figür Çalışmalarımız" />
              </div>
            </div>

            {/* 3D Figure Info */}
            <div className="bg-gradient-to-r from-gray-800/50 to-gray-900/50 backdrop-blur-sm rounded-3xl p-8 border border-gray-700/50">
              <div className="grid md:grid-cols-2 gap-8 items-center">
                <div className="space-y-6">
                  <h3 className="text-3xl font-bold text-white">
                    Kişiye Özel 3D Figürler
                  </h3>
                  <p className="text-gray-300 leading-relaxed">
                    Filamentbiblo3D olarak, sevdiklerinizle paylaştığınız özel anları 3D baskı figürlere dönüştürüyoruz 🎨
                  </p>
                  <p className="text-gray-300 leading-relaxed">
                    Ailenizi, dostlarınızı ya da en sevdiğiniz kareyi ölümsüzleştirin 👨‍👩‍👧‍👦
                  </p>
                  
                  <div className="space-y-4">
                    <div className="flex items-center space-x-3">
                      <span className="text-2xl">📦</span>
                      <span className="text-white">Kişiye özel tasarım</span>
                    </div>
                    <div className="flex items-center space-x-3">
                      <span className="text-2xl">🧩</span>
                      <span className="text-white">Gerçek boyutlu modelleme</span>
                    </div>
                    <div className="flex items-center space-x-3">
                      <span className="text-2xl">✨</span>
                      <span className="text-white">SLA baskı teknolojisi</span>
                    </div>
                  </div>

                  <Link
                    href="#siparis-3d"
                    className="inline-flex items-center justify-center px-8 py-4 font-bold text-white bg-gradient-to-r from-purple-600 to-blue-600 rounded-full hover:shadow-2xl hover:shadow-purple-500/30 hover:scale-105 transition-all duration-300"
                  >
                    Hemen Sipariş Ver
                  </Link>
                </div>

                <div className="bg-gray-900/50 rounded-2xl p-6 border border-gray-700/50">
                  <h4 className="text-xl font-bold text-white mb-4">
                    🎨 Özel Tasarım Fiyat Listesi
                  </h4>
                  <p className="text-sm text-gray-400 mb-4">
                    (Bir görselde Max 4 kişi - 4'ten fazla kişi için +400 TL)
                  </p>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center p-3 bg-gray-800/50 rounded-lg">
                      <span className="text-white font-medium">10 cm</span>
                      <span className="text-purple-400 font-bold">1.850 TL</span>
                    </div>
                    <div className="flex justify-between items-center p-3 bg-gray-800/50 rounded-lg">
                      <span className="text-white font-medium">15 cm</span>
                      <span className="text-purple-400 font-bold">2.999 TL</span>
                    </div>
                    <div className="flex justify-between items-center p-3 bg-gray-800/50 rounded-lg">
                      <span className="text-white font-medium">20 cm</span>
                      <span className="text-purple-400 font-bold">3.999 TL</span>
                    </div>
                    <div className="flex justify-between items-center p-3 bg-gray-800/50 rounded-lg">
                      <span className="text-white font-medium">25 cm</span>
                      <span className="text-purple-400 font-bold">4.999 TL</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Order Form */}
            <OrderForm3D />
          </div>
        )}

        {activeTab === "ani" && (
          <div className="space-y-20">
            {/* Anı Küresi Carousel */}
            <div id="ani-kuresi" className="relative">
              <div className="absolute -inset-4 bg-gradient-to-r from-pink-600/20 to-purple-600/20 rounded-3xl blur-3xl"></div>
              <div className="relative bg-gray-800/50 backdrop-blur-sm rounded-3xl p-8 border border-gray-700/50">
                <Carousel images={aniKuresiImages} title="Anı Küresi Çalışmalarımız" />
              </div>
            </div>

            {/* Anı Küresi Bilgileri ve Sipariş */}
            <AniKuresi images={aniKuresiImages} />
          </div>
        )}
      </div>
    </section>
  );
}
