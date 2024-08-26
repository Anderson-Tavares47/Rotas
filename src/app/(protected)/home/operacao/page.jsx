'use client';

import React, { useState } from 'react';
import styles from './styles.module.css';
import Sidebar from '@/components/sidebar';
import Loading from '@/components/load/loading';

const OperationForm = () => {
  const [selectedName, setSelectedName] = useState(''); 
  const [selectedOperation, setSelectedOperation] = useState(''); 
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const names = ['João Silva', 'Maria Oliveira', 'Carlos Souza']; // Exemplo de opções para o select de nomes
  const operations = ['Carga', 'Descarga', 'Transferência']; // Exemplo de opções para o select de operações

  const handleSubmit = (e) => {
    e.preventDefault();

    const operationData = {
      name: selectedName,
      operation: selectedOperation,
    };

    localStorage.setItem('operationData', JSON.stringify(operationData));
    alert('Dados da operação salvos no localStorage!');
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
                <select
                  value={selectedName}
                  onChange={(e) => setSelectedName(e.target.value)}
                >
                  <option value="">Selecione um nome</option>
                  {names.map((name, index) => (
                    <option key={index} value={name}>
                      {name}
                    </option>
                  ))}
                </select>
              </label>
            </div>

            <div className={styles['form-row']}>
              <label>
                Operação:
                <select
                  value={selectedOperation}
                  onChange={(e) => setSelectedOperation(e.target.value)}
                >
                  <option value="">Selecione uma operação</option>
                  {operations.map((operation, index) => (
                    <option key={index} value={operation}>
                      {operation}
                    </option>
                  ))}
                </select>
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

export default OperationForm;
