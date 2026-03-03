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
    net_profit DECIMAL(15, 2) DEFAULT 0.00,
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
    gross_profit DECIMAL(15, 2) DEFAULT 0.00,
    net_profit DECIMAL(15, 2) DEFAULT 0.00,
    comentario TEXT,
    FOREIGN KEY (accounts_id) REFERENCES accounts(id),
    FOREIGN KEY (instruments_id) REFERENCES instruments(id)
);

-- INSERATAMOS ACTIVOS 
INSERT INTO instruments (name, pip_value) VALUES 
('XAUUSD', 1),
('US30', 0.05),
('US100', 0.2),
('SILVER', 50);