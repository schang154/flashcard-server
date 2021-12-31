import Mongoose from "mongoose";
import postCard from "../models/postCards.js";
import { HttpStatus } from "../HttpStatus.js";

export const getCards = async (req, res) => {
  try {
    const postCards = await postCard.find();

    const flashCardOfThisUser = postCards.filter(
      (postCard) => postCard.creator === req.userId
    );
    
    (flashCardOfThisUser) && res.status(HttpStatus.OK).json(flashCardOfThisUser);
  } catch (error) {
    res.status(HttpStatus.NOT_FOUND).json({ message: error.message });
  }
};

export const getCardCount = async (req, res) => {
  const creator = req.userId;

  try {
    const cardsOfTheUser = await postCard.find({ creator });

    if (!cardsOfTheUser)
      return res
        .status(HttpStatus.BAD_REQUEST)
        .json({ message: "User doesn't exist." });

    res.status(HttpStatus.OK).json(cardsOfTheUser.length);
  } catch (error) {
    res
      .status(HttpStatus.SERVER_ERROR)
      .json({ message: `Server error: ${error}` });
  }
};


export const createCard = async (req, res) => {
  const card = req.body;

  const newCard = new postCard({ ...card, creator: req.userId });

  try {
    await newCard.save();
    res.status(HttpStatus.CREATED).json(newCard);
  } catch (error) {
    res.status(HttpStatus.CONFLICT).json({ message: error.message });
  }
};

export const updateCard = async (req, res) => {
  const { id: _id } = req.params;
  const card = req.body;

  if (!Mongoose.Types.ObjectId.isValid(_id))
    return res
      .status(HttpStatus.NOT_FOUND)
      .send(`No card with such id existed`);

  const updatedCard = await postCard.findByIdAndUpdate(
    _id,
    { ...card, _id },
    { new: true }
  );

  res.json(updatedCard);
};

export const deleteCard = async (req, res) => {
  const { id } = req.params;

  if (!Mongoose.Types.ObjectId.isValid(id))
    return res
      .status(HttpStatus.NOT_FOUND)
      .send(`No card with such id existed`);

  await postCard.findByIdAndRemove(id);

  res.json({ message: "Card successfully deleted" });
};

export const favoriteCard = async (req, res) => {
  const { id } = req.params;

  if (!Mongoose.Types.ObjectId.isValid(id))
    return res
      .status(HttpStatus.NOT_FOUND)
      .send(`No card with such id existed`);

  const card = await postCard.findById(id);
  const updatedCard = await postCard.findByIdAndUpdate(
    id,
    { favorite: !card.favorite },
    { new: true }
  );

  res.json(updatedCard);
};
