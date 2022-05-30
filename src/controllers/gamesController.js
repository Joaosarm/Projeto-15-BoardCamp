import db from "../../db.js";

export async function getGames(req, res) {
    const { name } = req.query;

    try {
        if (name) {
            const result = await db.query(`
            SELECT games.*,categories.name AS "categoryName"
            FROM games
            JOIN categories
            ON games."categoryId"=categories.id
            WHERE games.name ILIKE $1
            `, [`${name}%`]);

            res.status(200).send(result.rows);
        }
        else {
            const result = await db.query(`
            SELECT games.*,categories.name AS "categoryName"
            FROM games
            JOIN categories
            ON games."categoryId"=categories.id
            `);

            res.status(200).send(result.rows);
        }
    } catch (e) {
        console.log(e);
        res.status(500).send("Erro ao obter dados dos jogos!");
    }
}


export async function postGame(req, res) {
    const { name, image, stockTotal, categoryId, pricePerDay } = req.body;
    const categoryExists = await db.query(`SELECT id FROM categories WHERE id=$1`, [categoryId]);
    if (!name || !stockTotal || !pricePerDay || categoryExists.rowCount === 0) return res.sendStatus(400);
    const result = await db.query(`SELECT * FROM games WHERE name=$1`, [name]);
    if (result.rowCount !== 0) return res.sendStatus(409);
    try {
        await db.query(`
      INSERT INTO games (name,image,"stockTotal","categoryId","pricePerDay")
      VALUES ($1,$2,$3,$4,$5);
    `, [name, image, stockTotal, categoryId, pricePerDay]);

        res.sendStatus(201);
    } catch (e) {
        console.log(e);
        res.status(500).send("Erro ao enviar dados do jogo!");
    }
}

// SELECT games.*, categories.name as "categoryName" FROM games JOIN categories ON games."categoryId"=categories.id