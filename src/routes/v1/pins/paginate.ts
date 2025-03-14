import { Request, Response } from "express";
import PinRepo from "../../../database/repository/pinRepo";
import APIResponse from "../../../utils/api";

const fetchPinsHandler: (
    req: Request,
    res: Response
  ) => Promise<void> = async (req, res) => {
    try {
      const { pageNumber, pageSize, sortField, sortType, search, ...rest } =
        req.query;
      const filter = {
        ...(rest && rest),
      };
  
      const sortLogic =
        sortField && sortType
          ? {
              [sortField as string]: sortType as string | number,
            }
          : undefined;
  
      const pins = await PinRepo.getPaginatedPin({
        pageNumber: Number(pageNumber),
        pageSize: Number(pageSize),
        filter,
        search: search as string,
        sortLogic,
      });
      if (!pins || pins.length === 0) {
        return APIResponse.error("No pins found", 404).send(res);
      }
      return APIResponse.success(
        { message: "pins retrieved successfully", data: pins },
        200
      ).send(res);
    } catch (error) {
        APIResponse.error((error as Error).message, 500).send(res);
    }
  };
  export default fetchPinsHandler;
  