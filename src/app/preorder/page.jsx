"use client";
import styles from './PreorderPage.module.css';
import { useEffect, useState } from 'react';

export default function PreorderPage() {
  const [preorders, setPreorders] = useState([]);
  const [pakets, setPakets] = useState([]);
  const [customers, setCustomers] = useState([]);
  const [formVisible, setFormVisible] = useState(false);
  const [order_date, setOrderDate] = useState('');
  const [order_by, setOrderBy] = useState('');
  const [selected_package, setSelectedPackage] = useState('');
  const [qty, setQty] = useState('');
  const [status, setStatus] = useState('');
  const [msg, setMsg] = useState('');
  const [editId, setEditId] = useState(null);

  const fetchPreorders = async () => {
    const res = await fetch('/api/preorder');
    const data = await res.json();

    const formatted = data.map((item) => ({
      ...item,
      status: item.is_paid ? "Lunas" : "Belum Lunas",
    }));

    setPreorders(formatted);
  };

  const fetchCustomers = async () => {
    const res = await fetch('/api/customer');
    const data = await res.json();
    setCustomers(data);
  };

  const fetchPakets = async () => {
    const res = await fetch('/api/paket');
    const data = await res.json();
    setPakets(data);
  };

  useEffect(() => {
    fetchPreorders();
    fetchPakets();
    fetchCustomers();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const method = editId ? 'PUT' : 'POST';
    const url = editId ? `/api/preorder/${editId}` : '/api/preorder';
    const res = await fetch(url, {
      method,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        order_date,
        order_by,
        selected_package,
        qty: Number(qty),
        status
      }),
    });

    if (res.ok) {
      setMsg('Berhasil disimpan!');
      setOrderDate('');
      setOrderBy('');
      setSelectedPackage('');
      setQty('');
      setStatus('');
      setEditId(null);
      setFormVisible(false);
      fetchPreorders();
    } else {
      setMsg('Gagal menyimpan data');
    }
  };

  const handleEdit = (item) => {
    setOrderDate(item.order_date.split('T')[0]);
    setOrderBy(item.customer?.id || '');
    setSelectedPackage(item.paket?.id || '');
    setQty(item.qty);
    setStatus(item.status);
    setEditId(item.id);
    setFormVisible(true);
  };

  const handleDelete = async (id) => {
    if (!confirm('Yakin hapus data ini?')) return;

    await fetch(`/api/preorder/${id}`, {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id }),
    });

    fetchPreorders();
  };

  return (
    <div className={styles.container}>
        <h1 className={styles.title}>Ayam Penyet Koh Alex</h1>
        <button
            className={styles.buttonToggle}
            onClick={() => setFormVisible(!formVisible)}>
            {formVisible ? 'Tutup Form' : 'Tambah Data'}
      </button>
      <button style={{ marginRight: '10px', float: 'right' }} onClick={() => window.location.href = '/customer'}>Kelola Customer</button>
      <button style={{ marginRight: '10px', float: 'right' }} onClick={() => window.location.href = '/paket'}>Kelola Paket</button>

      {formVisible && (
        <div className={styles.formWrapper}>
          <h3>Input Data Baru</h3>
          <form onSubmit={handleSubmit}>
            <div className={styles.formGroup}>
              <span>Tanggal Pesanan</span>
              <input
                type="date"
                value={order_date}
                onChange={(e) => setOrderDate(e.target.value)}
                required
              />
            </div>
            <div className={styles.formGroup}>
              <span>Nama Pemesan</span>
              <select
                value={order_by}
                onChange={(e) => setOrderBy(e.target.value)}
                required
              >
                <option value="">Pilih Pelanggan</option>
                {customers.map((customer) => (
                  <option key={customer.id} value={customer.id}>
                    {customer.name}
                  </option>
                ))}
              </select>
            </div>
            <div className={styles.formGroup}>
              <span>Paket</span>
              <select
                value={selected_package}
                onChange={(e) => setSelectedPackage(e.target.value)}
                required
              >
                <option value="">Pilih Paket</option>
                {pakets.map((paket) => (
                  <option key={paket.id} value={paket.id}>
                    {paket.nama}
                  </option>
                ))}
              </select>
            </div>
            <div className={styles.formGroup}>
              <span>Jumlah</span>
              <input
                type="number"
                value={qty}
                onChange={(e) => setQty(e.target.value)}
                placeholder="Input Jumlah"
                required
              />
            </div>
            <div className={styles.formGroup}>
              <span>Status</span>
              <label>
                <input
                  type="radio"
                  value="Lunas"
                  checked={status === "Lunas"}
                  onChange={(e) => setStatus(e.target.value)}
                />
                Lunas
              </label>
              <label>
                <input
                  type="radio"
                  value="Belum Lunas"
                  checked={status === "Belum Lunas"}
                  onChange={(e) => setStatus(e.target.value)}
                />
                Belum Lunas
              </label>
            </div>
            <button type="submit">
              Simpan
            </button>
            <p>{msg}</p>
          </form>
        </div>
      )}

      <div className={styles.tableWrapper}>
        <table>
          <thead>
            <tr>
              <th>No</th>
              <th>Tanggal Pesanan</th>
              <th>Nama Pemesan</th>
              <th>Paket</th>
              <th>Jumlah</th>
              <th>Status</th>
              <th>Aksi</th>
            </tr>
          </thead>
          <tbody style={{ textAlign: 'center', verticalAlign: 'middle' }}>
            {preorders.map((item, index) => (
              <tr key={item.id}>
                <td>{index + 1}</td>
                <td>{item.order_date.split('T')[0]}</td>
                <td>{item.customer?.name || "Unknown"}</td>
                <td>{item.paket?.nama || "Unknown"}</td>
                <td>{item.qty}</td>
                <td>{item.status}</td>
                <td>
                  <button onClick={() => handleEdit(item)}>Edit</button>
                  <button onClick={() => handleDelete(item.id)} style={{ marginLeft: '10px' }}>Hapus</button>
                </td>
              </tr>
            ))}
            {preorders.length === 0 && (
              <tr>
                <td colSpan="7">Belum ada data</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
