import { NextFunction, Request, Response } from "express";
import APIResponse from "../utils/api";
import { verifyjwt } from "../utils/jwt";

const deserialize = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const accesstoken = (req.headers.authorization || "").replace(
      /^Bearer\s/,
      ""
    );
    if (!accesstoken) return next();

    // verify that the token is valid
    const decodedToken = await verifyjwt(accesstoken, "accessTokenPrivateKey");
    res.locals.user = decodedToken;
    next();
  } catch (error) {
    // Send an error response if the token is invalid or an error occurs
    APIResponse.error((error as Error).message).send(res);
  }
};


export default deserialize