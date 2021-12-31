import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import { HttpStatus } from "../HttpStatus.js";

dotenv.config();

const auth = async (req, res, next) => {

  try {
    const token = req.headers.authorization.split(" ")[1];

    const isCustomAuth = token.length < 500;

    let decodedData;

    if (token && isCustomAuth) {
      decodedData = jwt.verify(token, process.env.JWT_SECRET);

      req.userId = decodedData?.id;
    } else {
      decodedData = jwt.decode(token);

      // sub is how google auth differentiates google users
      req.userId = decodedData?.sub;
    }

    next();
  } catch (error) {
    console.log(error);
    res.status(HttpStatus.UNAUTHORIZED).json({ message: "UNAUTHORIZED"});
  }
}

export default auth;