import db from "../../db.js";
import dayjs from "dayjs";

async function insertInfos(result) {
    for (let i = 0; i < result.rowCount; i++) {
        const resultCustomer = await db.query(`SELECT * FROM customers WHERE id=$1`, [result.rows[i].customerId]);
        const resultGame = await db.query(`SELECT * FROM games WHERE id=$1`, [result.rows[i].gameId]);
        const customer = resultCustomer.rows[0];
        const game = resultGame.rows[0];
        result.rows[i] = { ...result.rows[i], customer, game }
    }
}

export async function getRentals(req, res) {
    const { customerId, gameId } = req.query;
    try {
        if (customerId) {
            const result = await db.query(`SELECT * FROM rentals WHERE "customerId" = $1`, [customerId]);
            await insertInfos(result);
            res.send(result.rows);
        }
        else if (gameId) {
            const result = await db.query(`SELECT * FROM rentals WHERE "gameId" = $1`, [customerId]);
            await insertInfos(result);
            res.send(result.rows);
        }
        else {
            let result = await db.query("SELECT * FROM rentals");
            await insertInfos(result);
            res.send(result.rows);
        }
    } catch (e) {
        console.log(e);
        res.status(500).send("Erro ao obter dados de alugueis!");
    }
}


export async function postRental(req, res) {
    const rental = req.body;
    const { customerId, gameId, daysRented } = rental;
    const returnDate = null, delayFee = null;
    const rentDate = dayjs().format('YYYY-MM-DD');

    try {
        const customer = await db.query(`SELECT * FROM customers WHERE id=$1`, [customerId]);
        const game = await db.query(`SELECT * FROM games WHERE id=$1`, [gameId]);
        const rentals = await db.query(`SELECT * FROM rentals WHERE "gameId"=$1`, [gameId]);
        if (game.rowCount === 0 || customer.rowCount === 0 || daysRented <= 0 || rentals.rowCount >= game.rows[0].stockTotal) return res.sendStatus(400);

        const originalPrice = game.rows[0].pricePerDay * daysRented;

        await db.query(`
            INSERT INTO rentals ("customerId", "gameId", "rentDate", "daysRented", "returnDate", "originalPrice", "delayFee")
            VALUES ($1,$2,$3,$4,$5,$6,$7);
        `, [customerId, gameId, rentDate, daysRented, returnDate, originalPrice, delayFee]);

        res.sendStatus(201);
    } catch (e) {
        console.log(e);
        res.status(500).send("Erro ao fazer aluguel!");
    }
}

export async function endRental(req, res) {
    const { id } = req.params;
    let delayFee = 0;
    const returnDate = dayjs();
    try {
        const result = await db.query(`SELECT * FROM rentals WHERE id = $1`, [id]);
        if (result.rowCount === 0) return res.sendStatus(404);
        if (result.rows[0].returnDate) return res.sendStatus(400);
        const days = dayjs().diff(dayjs(result.rows[0].rentDate), "days");
        const game = await db.query(`SELECT * FROM games WHERE id = $1`, [result.rows[0].gameId]);
        const dayDiff = days-result.rows[0].daysRented;

        if (dayDiff>0) delayFee = dayDiff*game.rows[0].pricePerDay;
        

        await db.query(`UPDATE rentals SET "delayFee"=$1, "returnDate"=$2  WHERE id=$3`,[delayFee, returnDate, id]);
        res.sendStatus(200);
    } catch (e) {
        console.log(e);
        res.status(500).send("Erro ao enviar finalizar aluguel!");
    }
}

export async function deleteRental(req, res) {
    const { id } = req.params;
    try {
        const result = await db.query(`SELECT * FROM rentals WHERE id = $1`, [id]);
        if (result.rowCount === 0) return res.sendStatus(404);
        if (result.rows[0].returnDate) return res.sendStatus(400);
        await db.query(`DELETE FROM rentals WHERE id = $1`, [id]);
        res.sendStatus(200);
    } catch (e) {
        console.log(e);
        res.status(500).send("Erro ao enviar excluir aluguel!");
    }
}