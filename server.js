const pg = require('pg');
const client = new pg.Client(process.env.DATABASE_URL || 'postgres://localhost/acmedb');

const init = async()=> {
    await client.connect();
    console.log('connected to database');
    let SQL = `
        DROP TABLE IF EXISTS employees;
        DROP TABLE IF EXISTS departments;
        CREATE TABLE departments(
            id SERIAL PRIMARY KEY,
            name VARCHAR(200)
        );
        CREATE TABLE employees(
            id SERIAL PRIMARY KEY,
            name VARCHAR(200),
            ranking INTEGER DEFAULT 5,
            department_id INTEGER REFERENCES departments(id)
        );
    `;
    await client.query(SQL);
    console.log('tables created');
    SQL = `
        INSERT INTO departments(name) VALUES('accounting');
        INSERT INTO departments(name) VALUES('sales');
        INSERT INTO departments(name) VALUES('service');
        INSERT INTO employees(name, department_id) VALUES('random employee', (
            SELECT id FROM departments WHERE name = 'sales'
        ));
        INSERT INTO employees(name, department_id) VALUES('random employee 2', (
            SELECT id FROM departments WHERE name = 'sales'
        ));
        INSERT INTO employees(name, department_id) VALUES('random employee 3', (
            SELECT id FROM departments WHERE name = 'sales'
        ));
    `;
    await client.query(SQL);
    console.log('data seeded');
};

init();