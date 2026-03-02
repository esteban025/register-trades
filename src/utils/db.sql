-- 1. Crear la base de datos
DROP DATABASE IF EXISTS trading_journal;
CREATE DATABASE trading_journal;
USE trading_journal;

-- 2 Tabla de Instrumentos (Activos y su valor por punto)
CREATE TABLE instruments (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(20) NOT NULL UNIQUE, 
    pip_value DECIMAL(10, 4) NOT NULL   
);

-- 3. Tabla de Cuentas (Capital Inicial)
CREATE TABLE accounts (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(50) NOT NULL UNIQUE,
    initial_capital DECIMAL(15, 2) NOT NULL,
    badge VARCHAR(3) DEFAULT 'USD'
);

-- 4. Tabla de Operaciones (Trades)
CREATE TABLE trades (
    id INT AUTO_INCREMENT PRIMARY KEY,
    accounts_id INT,
    instruments_id INT,
    date DATE NOT NULL,
    type ENUM('compra', 'venta') NOT NULL,
    lotage DECIMAL(10, 2) NOT NULL,
    entry_price DECIMAL(15, 2) NOT NULL,
    exit_price DECIMAL(15, 2) NOT NULL,
    swap DECIMAL(10, 2) DEFAULT 0.00,
    rollover DECIMAL(10, 2) DEFAULT 0.00,
    comentario TEXT,
    FOREIGN KEY (accounts_id) REFERENCES accounts(id),
    FOREIGN KEY (instruments_id) REFERENCES instruments(id)
);

-- 5. VISTA PARA CÁLCULO DE BENEFICIOS Y SALDO ACTUAL
-- Esta vista automatiza la lógica de Compra/Venta y suma el capital inicial
CREATE VIEW trading_report AS
SELECT 
    t.id,
    t.date,
    i.name AS instrument,
    t.type,
    -- Cálculo Beneficio Bruto
    CASE 
        WHEN t.type = 'venta' THEN (t.entry_price - t.exit_price) * i.pip_value
        ELSE (t.exit_price - t.entry_price) * i.pip_value
    END AS gross_profit,
    -- Cálculo Beneficio Neto (Bruto - Swap - Rollover)
    (CASE 
        WHEN t.type = 'venta' THEN (t.entry_price - t.exit_price) * i.pip_value
        ELSE (t.exit_price - t.entry_price) * i.pip_value
    END) - t.swap - t.rollover AS net_profit,
    a.initial_capital,
    a.name AS account_name
FROM trades t
JOIN instruments i ON t.instruments_id = i.id
JOIN accounts a ON t.accounts_id = a.id;