const API = '/api/toko'; // Sesuaikan endpoint API toko kamu
const $ = id => document.getElementById(id);
const tabel = $('katalogBarang');
const pesan = $('pesan');

function tampilPesan(teks) {
  pesan.textContent = teks;
}

// 1. Ambil & Tampilkan Data Katalog
async function muatKatalog() {
  try {
    const res = await fetch(API);
    if (!res.ok) throw new Error('Gagal memuat katalog');
    const data = await res.json();
    tampilkanKatalog(data);
  } catch (err) {
    tampilPesan(err.message);
  }
}

function tampilkanKatalog(data) {
  tabel.replaceChildren();
  data.forEach(item => {
    const tr = document.createElement('tr');
    
    // Tampilkan Nama, Harga, Stok
    [item.barang, `Rp ${item.harga}`, item.jumlah_stok].forEach(nilai => {
      const td = document.createElement('td');
      td.textContent = nilai;
      tr.appendChild(td);
    });

    // Kolom Tombol Beli
    const aksi = document.createElement('td');
    const btnBeli = document.createElement('button');
    btnBeli.textContent = 'Beli 1';
    
    // Disable tombol jika stok habis
    if (item.jumlah_stok <= 0) {
      btnBeli.disabled = true;
      btnBeli.textContent = 'Stok Habis';
    } else {
      btnBeli.onclick = () => beliBarang(item);
    }

    aksi.appendChild(btnBeli);
    tr.appendChild(aksi);
    tabel.appendChild(tr);
  });
}

// 2. Fungsi Pembelian (Mengurangi Stok)
async function beliBarang(item) {
  const stokBaru = item.jumlah_stok - 1;

  try {
    const url = API + '/' + encodeURIComponent(item.id_barang);
    const res = await fetch(url, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        barang: item.barang,
        jumlah_stok: stokBaru,
        harga: item.harga
      })
    });

    if (!res.ok) throw new Error('Pembelian gagal');
    
    tampilPesan(`Berhasil membeli ${item.barang}!`);
    await muatKatalog(); // Reload tabel untuk melihat stok berkurang
  } catch (err) {
    tampilPesan(err.message);
  }
}

muatKatalog();