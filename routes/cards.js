import Express from "express";
import { getCards, getCardCount, createCard, updateCard, deleteCard, favoriteCard } from '../controllers/cards.js'
import auth from "../middleware/auth.js";

const router = Express.Router();

router.get('/', auth, getCards);
router.get("/cardCount", auth, getCardCount);
router.post('/', auth, createCard);
router.patch('/:id', auth, updateCard);
router.delete('/:id', auth, deleteCard);
router.patch('/:id/favoriteCard', favoriteCard);

export default router;