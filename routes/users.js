import Express from "express";
import {
  signIn,
  signUp,
} from "../controllers/users.js";

const router = Express.Router();

router.post("/signIn", signIn);
router.post("/signUp", signUp);

export default router;
