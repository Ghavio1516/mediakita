"use client";

import React, { useState } from "react";

const PricelistPage = () => {
  const [activeTab, setActiveTab] = useState("billboard");

  const tabs = [
    { id: "billboard", label: "Billboard" },
    { id: "photo", label: "Photo" },
    { id: "videography", label: "Videography" },
    { id: "design", label: "Design" },
    { id: "liputan", label: "Liputan" },
    { id: "iklan", label: "Iklan" },
  ];

  const billboardTerms = [
    "Tidak mengandung unsur SARA",
    "Tidak mengandung unsur provokatif atau dapat menyebabkan konflik",
    "Untuk perizinan bisnis atau usaha dilarang untuk dipasang di bisnis milik orang lain",
    "Untuk pemasangan iklan di billboard dapat menggunakan jangka panjang ulang tahun perusahaan, event-event, dll yang sesuai dengan poin - poin lainnya",
    "Untuk pemasangan yang mengandung identitas ataupun instansi tertentu tidak diizinkan untuk dipasang di instansi maupun bisnis yang lain kecuali berada pada billboard yang ada pada wilayah masing-masing",
    "Durasi pemasangan billboard dalam jangka panjang maksimal dalam sebulan 2 slot",
    "Perhitungan harian billboard terhitung dari hari pemasangan. Ex : 14 Feb - 16 Feb (3 Hari)",
    "Kesalahan ukuran foto/design dari client bukan tanggung jawab media",
    "Apabila billboard sudah terpasang, maka tidak ada revisi / mengganti billboard seperti yang sudah disepakati",
    "Tidak akan ada refund terhadap billboard yang dilepas sebelum waktu pemasangan selesai / yang telah disepakati",
    "Cancel billboard minimal H-2. Apabila melakukan cancel H-1 (paling telatnya H-1, pukul 17.00), DP HANGUS, apabila sudah Full Payment akan di refund 30%",
  ];

  const pricelistData = {
    billboard: [
      {
        lokasi: "Banco Pelabuhan",
        jenis: "Landscape",
        harga: "2.000.000",
        hargaPajak: "2.100.000",
      },
      {
        lokasi: "BJM",
        jenis: "Landscape",
        harga: "1.200.000",
        hargaPajak: "1.260.000",
      },
      {
        lokasi: "DEM",
        jenis: "Landscape",
        harga: "1.500.000",
        hargaPajak: "1.575.000",
      },
      {
        lokasi: "EMS",
        jenis: "Landscape",
        harga: "2.000.000",
        hargaPajak: "2.100.000",
      },
      {
        lokasi: "Euphoria",
        jenis: "Portrait",
        harga: "1.200.000",
        hargaPajak: "1.260.000",
      },
      {
        lokasi: "Garasi Kota",
        jenis: "Landscape",
        harga: "2.000.000",
        hargaPajak: "2.100.000",
      },
      {
        lokasi: "Jembatan Keywood",
        jenis: "Landscape",
        harga: "1.500.000",
        hargaPajak: "1.575.000",
      },
      {
        lokasi: "Kantor Media",
        jenis: "Landscape",
        harga: "1.500.000",
        hargaPajak: "1.575.000",
      },
      {
        lokasi: "Kantor Polisi",
        jenis: "Landscape",
        harga: "2.000.000",
        hargaPajak: "2.100.000",
      },
      {
        lokasi: "Karnaval",
        jenis: "Portrait",
        harga: "1.500.000",
        hargaPajak: "1.575.000",
      },
      {
        lokasi: "Kellys",
        jenis: "Landscape",
        harga: "2.000.000",
        hargaPajak: "2.100.000",
      },
      {
        lokasi: "Pelabuhan",
        jenis: "Landscape",
        harga: "2.500.000",
        hargaPajak: "2.625.000",
      },
      {
        lokasi: "Pelabuhan",
        jenis: "Portrait",
        harga: "3.500.000",
        hargaPajak: "3.675.000",
      },
      {
        lokasi: "Pemerintah",
        jenis: "Landscape",
        harga: "2.000.000",
        hargaPajak: "2.100.000",
      },
      {
        lokasi: "QQ",
        jenis: "Landscape",
        harga: "1.500.000",
        hargaPajak: "1.575.000",
      },
      {
        lokasi: "Spawn Paleto",
        jenis: "Landscape",
        harga: "2.000.000",
        hargaPajak: "2.100.000",
      },
      {
        lokasi: "Spawn SS",
        jenis: "Landscape",
        harga: "2.000.000",
        hargaPajak: "2.100.000",
      },
      {
        lokasi: "Top Speed",
        jenis: "Landscape",
        harga: "1.500.000",
        hargaPajak: "1.575.000",
      },
    ],
    photo: [
      {
        namaPaket: "Paket 1",
        jenisSesi: "Solo Session / Couple Session",
        keterangan: "1 Sesi, 1 Venue, 1 Hour",
        harga: "2.0 M",
      },
      {
        namaPaket: "Paket 2",
        jenisSesi: "Solo Session / Couple Session",
        keterangan: "2 Sesi, 2 Venue, 2 Hour",
        harga: "3.5 M",
      },
      {
        namaPaket: "Paket 3",
        jenisSesi: "Fam Session / Group Session",
        keterangan: "1 Sesi, 1 Venue, 1 Hour",
        harga: "3.0 M",
      },
      {
        namaPaket: "Paket 4",
        jenisSesi: "Fam Session / Group Session",
        keterangan: "2 Sesi, 2 Venue, 2 Hour",
        harga: "4 M",
      },
    ],
    soloVideo: [
      {
        durasi: "30s",
        harga: "8 - 10 M",
      },
      {
        durasi: "1 Min",
        harga: "10 - 16 M",
      },
      {
        durasi: "2 Min",
        harga: "ask",
      },
    ],
    videography: [
      {
        service: "Short Video (10-30 detik)",
        description: "Video pendek untuk konten sosial media",
        price: "Rp 1.000.000 - 1.500.000",
      },
      {
        service: "Konsep",
        description: "Additional Fee - Pembuatan konsep video",
        price: "Rp 1.000.000",
      },
      {
        service: "Penambahan durasi",
        description: "Additional Fee - Per 15 detik",
        price: "Rp 300.000",
      },
      {
        service: "Penambahan talent",
        description: "Additional Fee - Per 1 orang",
        price: "Rp 200.000",
      },
    ],
    design: [
      {
        service: "Banner Billboard",
        description: "Design banner untuk billboard",
        price: "Rp 600.000",
      },
      {
        service: "Undangan (Ultah, Nikah, Event)",
        description: "Design undangan untuk berbagai acara",
        price: "Rp 500.000",
      },
    ],
    liputan: [
      {
        paket: "Paket Tablet Only",
        harga: "Rp 350.000",
      },
      {
        paket: "Paket Live Report Only (Berita Langit)",
        harga: "Rp 500.000",
      },
      {
        paket: "Paket Premium (Berita Tablet + Live Report)",
        harga: "Rp 1.000.000",
      },
    ],
    iklan: [
      {
        paket: "Paket Basic (Berita Langit)",
        harga: "Rp 300.000",
      },
      {
        paket: "Paket Premium (Berita Langit + Billboard)",
        harga: "Rp 1.750.000",
      },
      {
        paket: "Paket Exclusive (Berita Langit + Billboard + Pamflet)",
        harga: "Rp 1.850.000",
      },
    ],
    iklanNotes: [
      "PEMASANGAN BILLBOARD H + 2",
      "SUDAH INCLUDE BILLBOARD 3 HARI DI KANTOR MEDIA",
      "INCLUDE PAMFLET 50 PCS",
      "IKLAN BERUPA PROMOSI EVENT / ACARA",
    ],
  };

  const billboardSizes = {
    portrait: "576 x 1024",
    landscape: "1748 x 1240",
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Price List</h1>

      {/* Tabs */}
      <div className="border-b border-gray-200 mb-6">
        <nav className="-mb-px flex space-x-8">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`${
                activeTab === tab.id
                  ? "border-blue-500 text-blue-600"
                  : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
              } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
            >
              {tab.label}
            </button>
          ))}
        </nav>
      </div>

      {/* Content */}
      {activeTab === "billboard" ? (
        <div>
          <div className="bg-white rounded-lg shadow-md p-6 mb-6">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Lokasi
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Jenis
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Harga / 3 hari
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Setelah Pajak (5%)
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {pricelistData.billboard.map((item, index) => (
                    <tr key={index}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {item.lokasi}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {item.jenis}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        Rp {item.harga}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        Rp {item.hargaPajak}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Notes Section */}
          <div className="bg-white rounded-lg shadow-md p-6 mb-6">
            <h2 className="text-xl font-bold mb-4">NOTE:</h2>
            <div className="text-red-600 mb-4">
              <p>!! PEMESANAN BILLBOARD WAJIB H-2 DARI PEMASANGAN</p>
              <p>!! DESIGN WAJIB SUDAH ADA H-1 DARI HARI H</p>
            </div>
          </div>

          {/* Size Information */}
          <div className="bg-white rounded-lg shadow-md p-6 mb-6">
            <h2 className="text-xl font-bold mb-4">Size Billboard:</h2>
            <p>Portrait: {billboardSizes.portrait}</p>
            <p>Landscape: {billboardSizes.landscape}</p>
          </div>

          {/* Terms and Conditions */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-bold mb-4">
              SYARAT DAN KETENTUAN MEMASANG BILLBOARD:
            </h2>
            <ol className="list-decimal pl-6 space-y-2">
              {billboardTerms.map((term, index) => (
                <li key={index} className="text-sm text-gray-700">
                  {term}
                </li>
              ))}
            </ol>
          </div>
        </div>
      ) : activeTab === "photo" ? (
        <div>
          {/* Photoshoot Packages */}
          <div className="bg-white rounded-lg shadow-md p-6 mb-6">
            <h2 className="text-2xl font-bold mb-6">PRICELIST PHOTOSHOOT</h2>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Nama Paket
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Jenis Sesi
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Keterangan
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Harga
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {pricelistData.photo.map((item, index) => (
                    <tr key={index}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {item.namaPaket}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {item.jenisSesi}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {item.keterangan}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {item.harga}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Solo/Couple Video */}
          <div className="bg-white rounded-lg shadow-md p-6 mb-6">
            <h2 className="text-2xl font-bold mb-6">Solo/Couple Video</h2>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Durasi
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Harga
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {pricelistData.soloVideo.map((item, index) => (
                    <tr key={index}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {item.durasi}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {item.harga}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Notes Section */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-bold mb-4">NOTE:</h2>
            <div className="text-red-600 space-y-2">
              <p>!! No Concept & Styling Included</p>
              <p>!! Additional Charge Untuk Konsep dari Media (1jt)</p>
              <p>!! No Revisions</p>
              <p>!! Untuk Video Max Minor Revision 1x</p>
              <p>!! Exclude pajak 15%</p>
            </div>
          </div>
        </div>
      ) : activeTab === "videography" ? (
        <div>
          <div className="bg-white rounded-lg shadow-md p-6 mb-6">
            <h2 className="text-2xl font-bold mb-6">SHORT VIDEO</h2>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Service
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Description
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Price
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {pricelistData.videography.map((item, index) => (
                    <tr key={index}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {item.service}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {item.description}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {item.price}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Notes Section */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-bold mb-4">NOTE:</h2>
            <div className="text-red-600 space-y-2">
              <p>!! MAKSIMAL 2 ORANG DALAM 1 FRAME</p>
              <p>!! BERUPA VIDEO PENDEK (DANCE / TIKTOK TREND)</p>
              <p>!! TIDAK TERMASUK STYLING/STYLIST, VENUE & KONSEP</p>
              <p>!! EXCLUDE PAJAK 15%</p>
            </div>
          </div>
        </div>
      ) : activeTab === "design" ? (
        <div>
          <div className="bg-white rounded-lg shadow-md p-6 mb-6">
            <h2 className="text-2xl font-bold mb-6">DESIGN SERVICE</h2>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Service
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Price
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {pricelistData.design.map((item, index) => (
                    <tr key={index}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {item.service}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {item.price}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Notes Section */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-bold mb-4">NOTE:</h2>
            <div className="text-red-600 space-y-2">
              <p>!! ASSETS DARI CLIENT</p>
              <p>!! DETAIL DARI CLIENT (TANGGAL/LOKASI/KATA-KATA)</p>
            </div>
          </div>
        </div>
      ) : activeTab === "liputan" ? (
        <div>
          <div className="bg-white rounded-lg shadow-md p-6 mb-6">
            <h2 className="text-2xl font-bold mb-6">PRICELIST LIPUTAN</h2>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Paket
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Harga
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {pricelistData.liputan.map((item, index) => (
                    <tr key={index}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {item.paket}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {item.harga}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Notes Section */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-bold mb-4">NOTE:</h2>
            <div className="text-red-600 space-y-2">
              <p>!! LIVE REPORT (DARI ACARA MULAI - SELESAI) MAX 3 JAM</p>
              <p>!! PENULISAN BERITA H+1</p>
            </div>
          </div>
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Service
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Description
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Price
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {pricelistData[activeTab].map((item, index) => (
                  <tr key={index}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {item.paket}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {item.description}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {item.harga}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

export default PricelistPage;
