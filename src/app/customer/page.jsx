"use client";
import styles from './CustomerPage.module.css';
import { useEffect, useState } from 'react';

export default function CustomerPage() {

    const[customers,setCustomers] = useState([]);
  const [formVisible, setFormVisible] = useState(false);
  const [ name, setName ] = useState('');
  const [ phone, setPhone ] = useState('');
  const [ email, setEmail ]= useState('');
  const [ msg, setMsg ] = useState('');
  const [editId, setEditId] = useState(null);

  const fetchCustomers = async () => {
    const res = await fetch('api/customer');
    const data = await res.json();
    setCustomers(data);
  };

  useEffect(() => {
    fetchCustomers();
}, []);

const handleSubmit = async (e) => {
    e.preventDefault();
    const method = editId ? 'PUT' : 'POST';
    const url = editId ? `/api/customer/${editId}` : '/api/customer';
    const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, phone, email }),
    });

    if (res.ok) {
        setMsg('Berhasil disimpan!');
        setName('');
        setPhone('');
        setEmail('');
        setEditId(null);
        setFormVisible(false);
        fetchCustomers();
    } else {
        setMsg('Gagal menyimpan data');
    }
};

const handleEdit = (item) => {
    setName(item.name);
    setPhone(item.phone);
    setEmail(item.email);
    setEditId(item.id);
    setFormVisible(true);
};


const handleDelete = async (id) => {
    if (!confirm('Yakin hapus data ini?')) return;

    await fetch(`/api/customer/${id}`, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id }),
    });

    fetchCustomers();
};

  return (
    <div className={styles.container}>
        <h1 className={styles.title}>Ayam Penyet Koh Alex</h1>
        <button
            className={styles.buttonToggle}
            onClick={() => setFormVisible(!formVisible)}>
            {formVisible ? 'Tutup Form' : 'Tambah Data'}
        </button>
        
        {formVisible && (
            <div className={styles.formWrapper}>
                <h3>Input Data Baru</h3>
                <form onSubmit={handleSubmit}>
                <div className={styles.formGroup}>
                    <span>Nama Customer</span>
                    <input
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        required
                    />
                </div>
                <div className={styles.formGroup}>
                    <span>Nomor HP</span>
                    <input
                        type="tel"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        placeholder="Masukkan Nomor HP"
                        required
                    />
                </div>
                <div className={styles.formGroup}>
                    <span>Email</span>
                    <input
                    type="text"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Input Email"
                    />
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
                    <th>Nama Customer</th>
                    <th>Nomor HP</th>
                    <th>Email</th>
                    <th>Tanggal dan Waktu Input</th>
                    <th>Aksi</th>
                </tr>
                </thead>
                <tbody style={{ textAlign: 'center', verticalAlign: 'middle' }}>
                {customers.map((item, index) => (
                        <tr key={item.id}>
                            <td>{index + 1}</td>
                            <td>{item.name}</td>
                            <td>{item.phone}</td>
                            <td>{item.email}</td>
                            <td>{new Date(item.createdAt).toLocaleString()}</td>
                            <td>
                                <button onClick={() => handleEdit(item)}>Edit</button>
                                <button onClick={() => handleDelete(item.id)} style={{ marginLeft: '10px'}}>Hapus</button>
                            </td>
                            
                        </tr>
                    ))}
                    {customers.length === 0 && (
                        <tr>
                            <td colSpan="6">Belum ada data</td>
                        </tr>
                    )}
                </tbody>
            </table>    
        </div>
    </div>
  );
}
