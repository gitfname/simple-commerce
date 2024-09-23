import { CreateProductDto, UpdateProductDto } from "../validators";
import repositories from "../repositories";
import { ProductEntity } from "../entities/Product.entity";
import { z } from "zod"
import { HTTPException } from "hono/http-exception";
import { CategoriesService } from "./categories.service";

const ProductsRepository = repositories.ProductsRepository

const create = async (createProductDto: z.infer<typeof CreateProductDto>): Promise<ProductEntity> => {
    if (typeof createProductDto.category === "number") {
        const category = await CategoriesService.findOneById(createProductDto.category)

        const product = ProductsRepository.create({ ...createProductDto, category })
        await ProductsRepository.save(product)

        return product
    }
    else {
        const product = ProductsRepository.create({ ...createProductDto, category: undefined })
        await ProductsRepository.save(product)
        return product
    }
}

const findAll = async (): Promise<ProductEntity[]> => {
    return ProductsRepository.find({
        relations: {
            category: true
        }
    })
}

const findOneById = async (id: number): Promise<ProductEntity> => {
    const product = await ProductsRepository.findOne({
        where: { id },
        relations: { category: true }
    })
    if (!product) throw new HTTPException(404, { message: "product not found" })
    return product
}

const updateOneById = async (id: number, updateProductDto: z.infer<typeof UpdateProductDto>): Promise<void> => {
    if (typeof updateProductDto.category === "number") {
        const category = await CategoriesService.findOneById(updateProductDto.category)

        const result = await ProductsRepository.update({ id }, { ...updateProductDto, category })
        if (result.affected === 0) throw new HTTPException(404, { message: "product not found" })
    }
    else {
        const { category, ...restUpdate } = updateProductDto
        const result = await ProductsRepository.update({ id }, restUpdate)
        if (result.affected === 0) throw new HTTPException(404, { message: "product not found" })
    }
}

const deleteOneById = async (id: number): Promise<void> => {
    const result = await ProductsRepository.delete({ id })
    if (result.affected === 0) throw new HTTPException(404, { message: "product not found" })
}

export const ProductsService = {
    create,
    findAll,
    findOneById,
    updateOneById,
    deleteOneById
}