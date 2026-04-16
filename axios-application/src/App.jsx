import React, { useState, useEffect } from 'react';
import axios from 'axios';

// Cseréld le a tényleges elérési útra!
const API_URL = "http://gamfbead969.nhely.hu/api.php";

const MoziApp = () => {
  const [mozik, setMozik] = useState([]);
  const [form, setForm] = useState({ id: '', nev: '', varos: '', ferohely: '' });
  const [szerkesztesAlatt, setSzerkesztesAlatt] = useState(false);

  // 1. LEKÉRDEZÉS (GET)
  const getMozik = async () => {
    try {
      const response = await axios.get(API_URL);
      // A PHP kódod szerint: ['status' => '...', 'data' => $readData]
      if (response.data && response.data.data) {
        setMozik(response.data.data);
      }
    } catch (error) {
      console.error("Hiba a letöltéskor:", error);
    }
  };

  useEffect(() => {
    getMozik();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    const formattedValue = (name === 'id' || name === 'ferohely') ? (value === '' ? '' : Number(value)) : value;
    setForm({ ...form, [name]: formattedValue });
  };

  // 2. LÉTREHOZÁS ÉS MÓDOSÍTÁS (POST / PUT)
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (szerkesztesAlatt) {
        // PUT kérés: a PHP a body-ból várja az id-t is!
        await axios.put(API_URL, form);
        setSzerkesztesAlatt(false);
      } else {
        // POST kérés: új adat küldése
        await axios.post(API_URL, form);
      }
      setForm({ id: '', nev: '', varos: '', ferohely: '' });
      getMozik(); // Lista frissítése
    } catch (error) {
      console.error("Hiba a mentéskor:", error);
    }
  };

  // 3. TÖRLÉS (DELETE)
  const handleDelete = async (id) => {
    if (window.confirm("Biztosan törlöd ezt a mozit?")) {
      try {
        // Mivel a PHP body-ból olvassa az id-t (php://input), 
        // az Axios-nál a 'data' mezőbe kell tenni!
        await axios.delete(API_URL, { data: { id: id } });
        getMozik();
      } catch (error) {
        console.error("Hiba a törléskor:", error);
      }
    }
  };

  const handleEdit = (mozi) => {
    setForm(mozi);
    setSzerkesztesAlatt(true);
  };

  const styles = {
    container: { padding: '20px', maxWidth: '1000px', margin: '0 auto', fontFamily: 'Segoe UI, Tahoma, sans-serif' },
    formBox: { background: '#f0f2f5', padding: '25px', borderRadius: '12px', marginBottom: '30px', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' },
    label: { display: 'block', marginBottom: '5px', fontWeight: 'bold' },
    input: { width: '100%', padding: '10px', boxSizing: 'border-box', borderRadius: '6px', border: '1px solid #ccc' },
    button: { padding: '10px 20px', cursor: 'pointer', borderRadius: '6px', border: 'none', fontWeight: 'bold' },
    saveBtn: { backgroundColor: '#28a745', color: 'white', marginRight: '10px' },
    cancelBtn: { backgroundColor: '#6c757d', color: 'white' },
    table: { width: '100%', borderCollapse: 'collapse', marginTop: '10px' },
    th: { background: '#343a40', color: 'white', padding: '12px', textAlign: 'left' },
    td: { padding: '12px', borderBottom: '1px solid #dee2e6' },
    actionBtn: { padding: '6px 12px', marginRight: '5px', cursor: 'pointer' }
  };

  return (
    <div style={styles.container}>
      <h1 style={{ color: '#333' }}>Helyi Mozi Kezelő (AXIOS API)</h1>

      <div style={styles.formBox}>
        <h3 style={{ marginTop: 0 }}>{szerkesztesAlatt ? "Adatok szerkesztése" : "Új mozi hozzáadása"}</h3>
        <form onSubmit={handleSubmit}>
          <div style={{ display: 'flex', gap: '20px', flexWrap: 'wrap' }}>
            <div style={{ flex: '1', minWidth: '150px' }}>
              <label style={styles.label}>Mozi ID (Szám):</label>
              <input 
                style={styles.input} 
                name="id" 
                type="number" 
                value={form.id} 
                onChange={handleInputChange} 
                disabled={szerkesztesAlatt} 
                required 
              />
            </div>
            <div style={{ flex: '2', minWidth: '200px' }}>
              <label style={styles.label}>Mozi Neve:</label>
              <input style={styles.input} name="nev" value={form.nev} onChange={handleInputChange} required />
            </div>
            <div style={{ flex: '1', minWidth: '150px' }}>
              <label style={styles.label}>Város:</label>
              <input style={styles.input} name="varos" value={form.varos} onChange={handleInputChange} required />
            </div>
            <div style={{ flex: '1', minWidth: '120px' }}>
              <label style={styles.label}>Férőhely:</label>
              <input style={styles.input} name="ferohely" type="number" value={form.ferohely} onChange={handleInputChange} required />
            </div>
          </div>
          
          <div style={{ marginTop: '20px' }}>
            <button type="submit" style={{ ...styles.button, ...styles.saveBtn }}>
              {szerkesztesAlatt ? "Változtatások mentése" : "Mozi mentése"}
            </button>
            {szerkesztesAlatt && (
              <button 
                type="button" 
                style={{ ...styles.button, ...styles.cancelBtn }} 
                onClick={() => {setSzerkesztesAlatt(false); setForm({id:'', nev:'', varos:'', ferohely:''})}}
              >
                Mégse
              </button>
            )}
          </div>
        </form>
      </div>

      <div style={{ overflowX: 'auto' }}>
        <table style={styles.table}>
          <thead>
            <tr>
              <th style={styles.th}>ID</th>
              <th style={styles.th}>Mozi Név</th>
              <th style={styles.th}>Város</th>
              <th style={styles.th}>Férőhely</th>
              <th style={styles.th}>Műveletek</th>
            </tr>
          </thead>
          <tbody>
            {mozik.map(mozi => (
              <tr key={mozi.id}>
                <td style={styles.td}><strong>{mozi.id}</strong></td>
                <td style={styles.td}>{mozi.nev}</td>
                <td style={styles.td}>{mozi.varos}</td>
                <td style={styles.td}>{mozi.ferohely} fő</td>
                <td style={styles.td}>
                  <button style={styles.actionBtn} onClick={() => handleEdit(mozi)}>Szerkeszt</button>
                  <button 
                    style={{ ...styles.actionBtn, color: 'white', backgroundColor: '#dc3545', border: 'none', borderRadius: '4px' }} 
                    onClick={() => handleDelete(mozi.id)}
                  >
                    Töröl
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default MoziApp;