'use client';

import React, { useState } from 'react';
import styles from './styles.module.css';
import Sidebar from '@/components/sidebar';
import Loading from '@/components/load/loading';

const DriverForm = () => {
  const [name, setName] = useState(''); 
  const [cnh, setCnh] = useState(''); 
  const [phone1, setPhone1] = useState(''); 
  const [phone2, setPhone2] = useState(''); 
  const [address, setAddress] = useState(''); 
  const [cpf, setCpf] = useState(''); 
  const [rg, setRg] = useState(''); 
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();

    const driverData = {
      name,
      cnh,
      phone1,
      phone2,
      address,
      cpf,
      rg,
    };

    localStorage.setItem('driverData', JSON.stringify(driverData));
    alert('Dados do motorista salvos no localStorage!');
  };

  const toggleSidebar = () => {
    setIsSidebarOpen((prev) => !prev);
  };

  return (
    <>
      {loading && <Loading message="Carregando..." />}
      <Sidebar isSidebarOpen={isSidebarOpen} toggleSidebar={toggleSidebar} />
      <div
        className={`${styles.container} ${
          isSidebarOpen ? styles['with-sidebar-open'] : styles['with-sidebar-closed']
        }`}
      >
        {!loading && (
          <form onSubmit={handleSubmit}>
            <div className={styles['form-row']}>
              <label>
                Nome:
                <input
                  type="text"
                  placeholder="Nome"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
              </label>
            </div>

            <div className={styles['form-row']}>
              <label>
                CNH:
                <input
                  type="text"
                  placeholder="CNH"
                  value={cnh}
                  onChange={(e) => setCnh(e.target.value)}
                />
              </label>
            </div>

            <div className={styles['form-row']}>
              <label>
                Telefone 1:
                <input
                  type="text"
                  placeholder="Telefone 1"
                  value={phone1}
                  onChange={(e) => setPhone1(e.target.value)}
                />
              </label>
            </div>

            <div className={styles['form-row']}>
              <label>
                Telefone 2:
                <input
                  type="text"
                  placeholder="Telefone 2"
                  value={phone2}
                  onChange={(e) => setPhone2(e.target.value)}
                />
              </label>
            </div>

            <div className={styles['form-row']}>
              <label>
                Endereço Completo:
                <input
                  type="text"
                  placeholder="Endereço Completo"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                />
              </label>
            </div>

            <div className={styles['form-row']}>
              <label>
                CPF:
                <input
                  type="text"
                  placeholder="CPF"
                  value={cpf}
                  onChange={(e) => setCpf(e.target.value)}
                />
              </label>
            </div>

            <div className={styles['form-row']}>
              <label>
                RG:
                <input
                  type="text"
                  placeholder="RG"
                  value={rg}
                  onChange={(e) => setRg(e.target.value)}
                />
              </label>
            </div>
            
            <div className={styles['button-row']}>
              <button type="submit">Salvar</button>
            </div>
          </form>
        )}
      </div>
    </>
  );
};

export default DriverForm;
