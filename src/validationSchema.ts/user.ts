import { boolean, object, string, TypeOf, z } from "zod";

export const userSchema = object({
  body: object({
    userName: string({
      required_error: "Username is required",
    }).min(3, "Username must be at least 3 characters long"),

    password: string({
      required_error: "Password is required",
    })
      .min(8, { message: "Password must be at least 8 characters long" })
      .regex(/[a-zA-Z]/, {
        message: "Password must contain at least one letter",
      })
      .regex(/[0-9]/, { message: "Password must contain at least one number" })
      .regex(/[@$!%*?&#]/, {
        message:
          "Password must contain at least one special character (@$!%*?&#)",
      }),

    email: string({
      required_error: "Email is required",
    }).email("Invalid email address"),
  }),
});

// verify Email
export const verifyEmailSchema = z.object({
  params: object({
    userId: string({ required_error: "User ID is required" }) // Ensures it's required
      .min(1, "User ID cannot be empty"), // Ensures it's not an empty string

    token: string({ required_error: "Token is required" }) // Ensures it's required
      .min(1, "Token cannot be empty"), // Ensures it's not an empty string
  }),
});

//login user
export const userLoginSchema = object({
  body: object({
    userName: string({
      required_error: "Username is required",
    }).min(3, "Username must be at least 3 characters long"),

    password: string({
      required_error: "Password is required",
    })
      .min(8, { message: "Password must be at least 8 characters long" })
      .regex(/[a-zA-Z]/, {
        message: "Password must contain at least one letter",
      })
      .regex(/[0-9]/, { message: "Password must contain at least one number" })
      .regex(/[@$!%*?&#]/, {
        message:
          "Password must contain at least one special character (@$!%*?&#)",
      }),
  }),
});

//get users profile
export const getUserProfileSchema = object({
  params: object({
    userName: string({
      required_error: "userName is required",
    }).min(1, "userName cannot be empty"),
  }),
});

// Update User Profile Schema
export const updateUserProfileSchema = z.object({
  params: object({
    id: string({ required_error: "User ID is required" }), // Corrected the error message
  }),
  body: object({
    userName: string()
      .trim()
      .min(3, "Username must be at least 3 characters long")
      .max(30, "Username must be at most 30 characters long")
      .optional(), // Making it optional for updates

    password: string()
      .min(6, "Password must be at least 6 characters long")
      .max(100, "Password must be at most 100 characters long")
      .optional(),

    email: string().email("Invalid email format").optional(),

    profilePicture: string()
      .url("Profile picture must be a valid URL")
      .default("https://via.placeholder.com/150")
      .optional(),

    bio: string()
      .trim()
      .max(160, "Bio must be at most 160 characters long")
      .default("Nothing to say yet")
      .optional(),
  }),
});

//recover password
export const recoverPasswordSchema = object({
  body: object({
    email: string({
      required_error: "Email is required",
    }).email("Invalid email format"),
  }),
});

// reset password
export const resetPasswordSchema = object({
  params: object({
    id: string().nonempty({ message: "User ID is required" }),
    token: string().nonempty({ message: "Reset token is required" }),
  }),
  body: object({
    password: string({
      required_error: "Password is required",
    })
      .min(8, { message: "Password must be at least 8 characters long" })
      .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&#]).{8,}$/, {
        message:
          "Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character (@$!%*?&#)",
      }),
  }),
});

//follow a user
export const getFollowSchema = object({
  params: object({
    userId: string({ required_error: "User ID is required" }) // Ensures it's required
      .min(1, "User ID cannot be empty"), // Ensures it's not an empty string
  }),
});

//unfollow a User
export const getUnFollowSchema = object({
  params: object({
    userId: string({ required_error: "User ID is required" }) // Ensures it's required
      .min(1, "User ID cannot be empty"), // Ensures it's not an empty string
  }),
});

//get followers
export const getFollowersSchema = object({
  params: object({
    id: string({
      required_error: "User ID is required",
    })
      .min(1, "User ID cannot be empty")
      .regex(/^[0-9a-fA-F]{24}$/, "Invalid User ID format"),
  }),
});

//get followed users
export const getFollowedUsersSchema = object({
  params: object({
    id: string({
      required_error: "User ID is required",
    })
      .min(1, "User ID cannot be empty")
      .regex(/^[0-9a-fA-F]{24}$/, "Invalid User ID format"),
  }),
});

export type UserSchemaType = TypeOf<typeof userSchema>["body"];
export type verifyEmail = TypeOf<typeof verifyEmailSchema>["params"];
export type LoginSchemaType = TypeOf<typeof userLoginSchema>["body"];
export type getUserProfileSchemaType = TypeOf<
  typeof getUserProfileSchema
>["params"];
export type UpdateUserProfileSchemaType = {
  params: TypeOf<typeof updateUserProfileSchema>["params"];
  body: TypeOf<typeof updateUserProfileSchema>["body"];
};
export type resetPassword = {
  params: TypeOf<typeof resetPasswordSchema>["params"];
  body: TypeOf<typeof resetPasswordSchema>["body"];
};
export type recoverPassword = TypeOf<typeof recoverPasswordSchema>["body"];
export type followUserSchemaType = TypeOf<typeof getFollowSchema>["params"];
export type unfollowUserSchemaType = TypeOf<typeof getUnFollowSchema>["params"];
export type getfollowerUserSchemaType = TypeOf<typeof getFollowersSchema>["params"];
export type fetfollowedUserSchemaType = TypeOf<typeof getFollowedUsersSchema>["params"];
