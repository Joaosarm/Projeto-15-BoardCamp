import { Router } from "express";
import {  getCustomerById, getCustomers, postCustomer, updateCostumer } from "../controllers/customersController.js";
import { validateCustomer } from "../middlewares/customerValidator.js";



const customersRouter = Router();


customersRouter.post("/customers", validateCustomer, postCustomer);
customersRouter.get("/customers/:id", getCustomerById);
customersRouter.get("/customers", getCustomers);
customersRouter.put("/customers/:id", validateCustomer, updateCostumer);

export default customersRouter;