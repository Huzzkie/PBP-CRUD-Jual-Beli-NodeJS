const express = require('express');
const db = require('./database');
const app = express();

app.use(express.json());
app.use(express.static('public'));

// GET: Ambil Semua Stok
app.get('/api/toko', async (req, res) => {
  try {
    const [rows] = await db.query('SELECT * FROM stok');
    res.json(rows);
  } catch (err) {
    res.status(500).json({ pesan: 'Gagal mengambil data' });
  }
});

// POST: Tambah Barang
app.post('/api/toko', async (req, res) => {
  const { id_barang, barang, jumlah_stok, harga } = req.body;
  if (!id_barang || !barang || !jumlah_stok || !harga)
    return res.status(400).json({ pesan: 'Isi semua kolom' });
  try {
    await db.execute(
      'INSERT INTO stok (id_barang, barang, jumlah_stok, harga) VALUES (?, ?, ?, ?)',
      [id_barang, barang, jumlah_stok, harga]
    );
    res.status(201).json({ pesan: 'Data ditambahkan' });
  } catch (err) {
    res.status(400).json({ pesan: 'id_barang sudah ada / data salah' });
  }
});

// PUT: Perbarui Barang
app.put('/api/toko/:id_barang', async (req, res) => {
  const { barang, jumlah_stok, harga } = req.body;
  if (!barang || !jumlah_stok || !harga)
    return res.status(400).json({ pesan: 'Isi semua kolom' });
  try {
    const [hasil] = await db.execute(
      'UPDATE stok SET barang = ?, jumlah_stok = ?, harga = ? WHERE id_barang = ?',
      [barang, jumlah_stok, harga, req.params.id_barang]
    );
    if (!hasil.affectedRows) return res.sendStatus(404);
    res.json({ pesan: 'Data diperbarui' });
  } catch (err) { 
    res.sendStatus(500); 
  }
});

// DELETE: Hapus Barang
app.delete('/api/toko/:id_barang', async (req, res) => {
  try {
    const [hasil] = await db.execute(
      'DELETE FROM stok WHERE id_barang = ?', 
      [req.params.id_barang]
    );
    if (!hasil.affectedRows) return res.sendStatus(404);
    res.json({ pesan: 'Data dihapus' });
  } catch (err) { 
    res.sendStatus(500); 
  }
});

app.listen(3000, () => console.log('Server berjalan di http://localhost:3000'));