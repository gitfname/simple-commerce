import { z } from "zod"


// Users

export const CreateUserDto = z.object({
    username: z.string().min(4).max(12),
    password: z.string().min(5).max(12),
    avatar: z.string().max(500).optional()
})

export const UpdateUserDto = z.object({
    username: z.string().min(4).max(12).optional(),
    password: z.string().min(5).max(12).optional(),
    avatar: z.string().max(500).optional()
})

export const SignInUserDto = z.object({
    username: z.string().min(4).max(12),
    password: z.string().min(5).max(12)
})




// Products

export const CreateProductDto = z.object({
    title: z.string(),
    description: z.string(),
    price: z.number(),
    discount: z.number(),
    category: z.number().min(1).max(99999).optional(),
    thumbnail: z.string().max(350)
        .startsWith("https://")
        .endsWith(".png")
        .or(z.string().endsWith(".jpg"))
        .or(z.string().endsWith(".jpeg"))
        .or(z.string().endsWith(".webp")),
    images: z.string().max(300)
        .startsWith("https://")
        .endsWith(".png")
        .or(z.string().endsWith(".jpg"))
        .or(z.string().endsWith(".jpeg"))
        .or(z.string().endsWith(".webp"))
        .array().max(4),
    isPublic: z.boolean(),
    properties: z.object({
        name: z.string().max(100),
        value: z.string().max(100)
    }).array().max(6).optional()
})

export const UpdateProductDto = z.object({
    title: z.string().optional(),
    description: z.string().optional(),
    price: z.number().optional(),
    discount: z.number().optional(),
    category: z.number().min(1).max(99999).optional(),
    thumbnail: z.string().max(350)
        .startsWith("https://")
        .endsWith(".png")
        .or(z.string().endsWith(".jpg"))
        .or(z.string().endsWith(".jpeg"))
        .or(z.string().endsWith(".webp")).optional(),
    images: z.string().max(300)
        .startsWith("https://")
        .endsWith(".png")
        .or(z.string().endsWith(".jpg"))
        .or(z.string().endsWith(".jpeg"))
        .or(z.string().endsWith(".webp"))
        .array().max(4).optional(),
    isPublic: z.boolean().optional(),
    properties: z.object({
        name: z.string().max(100),
        value: z.string().max(100)
    }).array().max(6).optional()
})




// Categories

export const CreateCategoryDto = z.object({
    title: z.string().max(255),
    icon: z.string().max(300).optional(),
    parent: z.number().min(1).max(99999).optional()
})

export const UpdateCategoryDto = z.object({
    title: z.string().max(255).optional(),
    icon: z.string().max(300).optional(),
    parent: z.number().min(1).max(99999).optional()
})