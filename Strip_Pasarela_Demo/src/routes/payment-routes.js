import { Router } from "express";
import { procesarPago } from "../controllers/pagoControllers.js";
const router = Router(); 

router.post("/pagar", procesarPago);
// router.get("/pagar", (req, res) => { res.send("Pagando..."); });
// router.get("/exito", (req, res) => { res.send("Gracias por su pagos"); });

router.get("/exito", (req, res) => { res.redirect("pagado.html"); });

// router.get("/cancelar", (req, res) => { res.send("Pago cancelado"); });
router.get("/cancelado", (req, res) => { res.redirect("cancelado.html"); });

export default router;