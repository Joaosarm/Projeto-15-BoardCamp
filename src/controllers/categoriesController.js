import db from "../../db.js";

export async function getCategories(req, res) {
  try {
    const result = await db.query("SELECT * FROM categories");
    res.send(result.rows);
  } catch (e) {
    console.log(e);
    res.status(500).send("Erro ao obter as categorias!");
  }
}


export async function postCategory(req, res) {
  const {name} = req.body;
  if (!name) return res.sendStatus(400);
  const result = await db.query(`SELECT * FROM categories WHERE name=$1`, [name]);
  if (result.rowCount!==0) return res.sendStatus(409);
  try {
    await db.query(`
      INSERT INTO categories (name)
      VALUES ($1);
    `, [name]);
    
    res.sendStatus(201);
  } catch (e) {
    console.log(e);
    res.status(500).send("Erro ao enviar categoria!");
  }
}