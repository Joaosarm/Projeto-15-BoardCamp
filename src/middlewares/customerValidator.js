import joi from "joi";
import db from "../db.js";

export async function validateCustomer(req, res, next) {
  const customer = req.body;

  const customerSchema = joi.object({
    name: joi.string().required(),
    phone: joi.string().required().pattern(/^[0-9]{10,11}$/),
    cpf: joi.string().required().pattern(/^[0-9]{11}$/),
    birthday: joi.string().required().pattern(/^[0-9]{4}-[0-9]{2}-[0-9]{2}$/)
  });

  const result = await db.query(`SELECT * FROM customers WHERE cpf=$1`, [customer.cpf]);
  if (result.rowCount !== 0) return res.sendStatus(409);

  const validation = customerSchema.validate(customer);
  if(validation.error) {
    res.status(400).send(validation.error.details);
    return;
  }

  next();
}