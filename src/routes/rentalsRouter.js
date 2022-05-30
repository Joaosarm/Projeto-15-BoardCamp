import { Router } from "express";
import { deleteRental, endRental, getRentals, postRental } from "../controllers/rentalsController.js";


const rentalsRouter = Router();

rentalsRouter.post("/rentals", postRental);
rentalsRouter.get("/rentals", getRentals);
rentalsRouter.post("/rentals/:id/return", endRental);
rentalsRouter.delete("/rentals/:id", deleteRental);

export default rentalsRouter;