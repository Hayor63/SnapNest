import { formatResponseRecord } from "../../utils/formatter";
import { PartialLoose } from "../../utils/helper";
import { PinSchemaType } from "../../validationSchema.ts/pin";
import PinModel, { Pin } from "../models/pin";

class PinExtend extends Pin {
  createdAt: string;
}

type SortLogic = PartialLoose<PinExtend, "asc" | "desc" | 1 | -1>;
const defaultSortLogic: SortLogic = { createdAt: -1 };
export interface PaginatedFetchParams {
  pageNumber: number;
  pageSize: number;
  filter: Record<string, any>;
  sortLogic: SortLogic;
  search: string;
}

export default class PinRepo {
  static createPin: (pin: Omit<Pin, "likes">) => Promise<Pin> = async (pin) => {
    const data = await PinModel.create(pin);
    return data;
  };

  static getPaginatedPin = async ({
    pageNumber = 1,
    pageSize = 10,
    filter: _filter,
    sortLogic = defaultSortLogic, // Use -1 for descending order
    search,
  }: Partial<PaginatedFetchParams>): Promise<Pin[]> => {
    const filter = {
      ...(_filter || {}),
      ...(search ? { title: { $regex: search, $options: "i" } } : {}),
    };

    const pins = await PinModel.find(filter)
      .sort(sortLogic)
      .skip((pageNumber - 1) * pageSize)
      .limit(pageSize)
      .lean()
      .exec();

    const formattedPins: Pin[] = pins.map((pin) => {
      return {
        ...formatResponseRecord(pin),
      };
    });

    return formattedPins;
  };

  static findById = async (id: string) => {
    return await PinModel.findById(id);
  };
  

  //update pins
  static updatePin: (
    id: string,
    userId: any,
    updateParams: Partial<PinSchemaType>
  ) => Promise<any> = async (id, userId, updateParams) => {
    // Find the pin by its ID
    const pin = await PinModel.findById(id).lean();
  
    if (!pin) {
      throw new Error("Pin not found");
    }
  
     // Ensure userId is always a string
  const extractedUserId = typeof userId === "object" ? userId._id?.toString() : userId;
  
    // Check if the pin belongs to the user making the request
    if (pin.userId.toString() !== extractedUserId) {
      throw new Error("You are not authorized to update this pin");
    }
  
    // If the user is the owner, proceed with the update
    return await PinModel.findByIdAndUpdate(id, updateParams, { new: true });
  };

   //delete single pin
  static deletePin: (pinId: string) => Promise<any> = async (pinId) => {
    const data = await PinModel.findByIdAndDelete(pinId);
    return data;
  };

  // //count document
  //   static async countDocuments() {
  //     return PinModel.countDocuments(); // Calls the actual Mongoose method
  //   }
  
}
