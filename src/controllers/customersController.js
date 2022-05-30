import db from "../../db.js";

export async function getCustomers(req, res) {
  const { cpf } = req.query;

  try {

    if (cpf) {
      const result = await db.query(`
            SELECT * FROM customers
            WHERE customers.cpf ILIKE $1
            `, [`${cpf}%`]);

      res.status(200).send(result.rows);
    }
    else {
      const result = await db.query(`SELECT * FROM customers`);
      res.send(result.rows);
    }
  } catch (e) {
    console.log(e);
    res.status(500).send("Erro ao obter os clientes!");
  }
}

export async function getCustomerById(req, res) {
  const { id } = req.params;

  try {
    const result = await db.query(`SELECT * FROM customers WHERE id=$1`, [id]);
    if (result.rowCount === 0) return res.sendStatus(404);

    res.send(result.rows[0]);

  } catch (e) {
    console.log(e);
    res.status(500).send("Erro ao obter o cliente!");
  }
}


export async function postCustomer(req, res) {
  const customer = req.body;

  try {
    await db.query(`INSERT INTO customers (name,phone,cpf,birthday) VALUES ($1, $2, $3, $4)`, [customer.name, customer.phone, customer.cpf, customer.birthday]);

    res.sendStatus(201);
  } catch (e) {
    console.log(e);
    res.status(500).send("Erro ao enviar cliente!");
  }
}

export async function updateCostumer(req, res) {
  const { id } = req.params;
  const customer = req.body;

  try {
    await db.query(`UPDATE customers SET name=$1,phone=$2,cpf=$3,birthday=$4 WHERE id=$5`,[customer.name, customer.phone, customer.cpf, customer.birthday, id]);

    res.sendStatus(200);

  } catch (e) {
    console.log(e);
    res.status(500).send("Erro ao atualizar dados do clientes!");
  }
}