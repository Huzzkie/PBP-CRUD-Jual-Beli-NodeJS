const API = '/api/toko';
const $ = id => document.getElementById(id);
let idEdit = null;

const form = $('pembelianBarang');
const tabel = $('dataBarang');
const pesan = $('pesan');

function tampilPesan(teks) {
  pesan.textContent = teks;
}

async function muatData() {
  try {
    const res = await fetch(API);
    if (!res.ok) throw new Error('Gagal mengambil data');

    const data = await res.json();
    tampilkanTabel(data);
  } catch (error) {
    tampilPesan(error.message);
  }
}

function tampilkanTabel(data) {
  tabel.replaceChildren();
  data.forEach(m => {
    const tr = document.createElement('tr');
    [m.id_barang, m.barang, m.jumlah_stok, m.harga].forEach(nilai => {
      const td = document.createElement('td');
      td.textContent = nilai;
      tr.appendChild(td);
    });
    const aksi = document.createElement('td');
    const edit = document.createElement('button');
    edit.textContent = 'Edit';
    edit.onclick = () => mulaiEdit(m);

    const hapus = document.createElement('button');
    hapus.textContent = 'Hapus';
    hapus.onclick = () => hapusData(m.id_barang);

    aksi.append(edit, hapus);
    tr.appendChild(aksi);
    tabel.appendChild(tr);
  });
}

async function simpanData(data) {
  try {
    const url = idEdit
      ? API + '/' + encodeURIComponent(idEdit) : API;
    const res = await fetch(url, {
      method: idEdit ? 'PUT' : 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    if (!res.ok) throw new Error('Gagal menyimpan data');
    batalEdit();
    await muatData();
    tampilPesan('Data berhasil disimpan');
  } catch (err) { tampilPesan(err.message); }
}

function mulaiEdit(m) {
  idEdit = m.id_barang;
  $('id_barang').value = m.id_barang;
  $('id_barang').disabled = true;
  $('barang').value = m.barang;
  $('jumlah_stok').value = m.jumlah_stok;
  $('harga').value = m.harga;
  $('btnSimpan').textContent = 'Perbarui';
}

function batalEdit() {
  idEdit = null;
  form.reset();
  $('id_barang').disabled = false;
  $('btnSimpan').textContent = 'Simpan';
}

async function hapusData(id_barang) {
  if (!confirm('Hapus barang ' + id_barang + '?')) return;
  try {
    const url = API + '/' + encodeURIComponent(id_barang);
    const res = await fetch(url, { method: 'DELETE' });
    if (!res.ok) throw new Error('Gagal menghapus');
    if (idEdit === id_barang) batalEdit();
    await muatData();
    tampilPesan('Data berhasil dihapus');
  } catch (err) {
    tampilPesan(err.message);
  }
}

form.addEventListener('submit', async (e) => {
  e.preventDefault();

    const data = {
    id_barang: $('id_barang').value.trim(),
    barang: $('barang').value.trim(),
    jumlah_stok: Number($('jumlah_stok').value),
    harga: Number($('harga').value)
    };

  await simpanData(data);
});

$('btnBatal').addEventListener('click', batalEdit);
muatData();