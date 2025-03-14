import { array, object, preprocess, string, TypeOf, z } from "zod";

export const pinSchema = object({
  body: object({
    image: string({
      required_error: "Image is required",
    }).url("Invalid image URL"),
    tags: array(string()).optional(),
    title: string({
      required_error: "Title is required",
    }).max(30, "Title must be at most 30 characters"),
    description: string({
      required_error: "Description is required",
    }).max(300, "Description must be at most 300 characters"),
  }),
});

// get pin by Id
export const getSinglePinSchema = object({
  params: object({
    id: string({
      required_error: "Pin ID is required",
    }),
  }),
});

//like a pin
export const likePinSchema = z.object({
  params: object({
    id: string().nonempty("Pin ID is required"),
  }),
});

//dislike a pin
export const dislikePinSchema = z.object({
  params: object({
    id: string().nonempty("Pin ID is required"),
  }),
});

export const getPinsLikedByUserSchema = z.object({
  params: object({
    id: string().nonempty("User id is required"),
  }),
  query: object({
    page: preprocess(
      (val) => (typeof val === "string" ? parseInt(val, 10) : undefined),
      z.number().optional()
    ),
    limit: preprocess(
      (val) => (typeof val === "string" ? parseInt(val, 10) : undefined),
      z.number().optional()
    ),
  }),
});

// delete single pin
export const deleteSinglePinSchema = object({
  params: object({
    id: string({
      required_error: "Pin ID is required",
    }),
  }),
});

//update Pin
export const updatePinSchema = object({
  params: object({
    id: string({
      required_error: "Pin ID is required",
    }),
  }),
  body: object({
    image: string({
      required_error: "Image is required",
    }).url("Invalid image URL"),
    tags: array(string()).optional(),
    title: string({
      required_error: "Title is required",
    }).max(30, "Title must be at most 30 characters"),
    description: string({
      required_error: "Description is required",
    }).max(300, "Description must be at most 300 characters"),
  }),
});

//get Related Pins
export const getRelatedPinsSchema = z.object({
  params: object({
    id: string({
      required_error: "Pin ID is required",
    }).refine((val) => /^[0-9a-fA-F]{24}$/.test(val), {
      message: "Invalid Pin ID format",
    }),
  }),
});

export type PinSchemaType = TypeOf<typeof pinSchema>["body"];
export type getSinglePinSchemaType = TypeOf<
  typeof getSinglePinSchema
>["params"];
export type likePinSchemaType = TypeOf<typeof likePinSchema>["params"];
export type dislikePinSchemaType = TypeOf<typeof dislikePinSchema>["params"];
export type getPinsLikedByUserSchemaType = {
  params: TypeOf<typeof getPinsLikedByUserSchema>["params"];
  query: TypeOf<typeof getPinsLikedByUserSchema>["query"]; // or `body` if that is intended
};
export type deletePinSchemaType = TypeOf<
  typeof deleteSinglePinSchema
>["params"];
export type updatePinSchemaType = {
  params: TypeOf<typeof updatePinSchema>["params"];
  body: TypeOf<typeof updatePinSchema>["body"];
};
export type getRelatedPinsSchemaType = TypeOf<typeof  getRelatedPinsSchema>["params"];
