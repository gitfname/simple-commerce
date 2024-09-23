import { CreateCategoryDto, UpdateCategoryDto } from "../validators";
import repositories from "../repositories";
import { CategoryEntity } from "../entities/Category.entity";
import { z } from "zod"
import { HTTPException } from "hono/http-exception";

const CategoryRepository = repositories.CategoriesRepository

interface ITreeCategories extends CategoryEntity {
    children: CategoryEntity[];
}

const create = async (createCategoryDto: z.infer<typeof CreateCategoryDto>): Promise<CategoryEntity> => {
    if (typeof createCategoryDto.parent === "number") {
        const foundCategory = await findOneById(createCategoryDto.parent)

        const category = CategoryRepository.create({ ...createCategoryDto, parent: foundCategory })

        await CategoryRepository.save(category)

        return category
    }
    else {
        const category = CategoryRepository.create({ ...createCategoryDto, parent: undefined })
        await CategoryRepository.save(category)
        return category
    }
}

const findAll = async (): Promise<CategoryEntity[]> => {
    return CategoryRepository.find()
}

const findOneById = async (id: number): Promise<CategoryEntity> => {
    const category = await CategoryRepository.findOne({
        where: {
            id
        },
        relations: {
            parent: true
        }
    })
    if (!category) throw new HTTPException(404, { message: "category not found" })
    return category
}

const tree = async (): Promise<any> => {
    const allCategories = await CategoryRepository.find({
        relations: {
            parent: true
        }
    })

    const treeCategories: ITreeCategories[] = []

    allCategories.forEach(category => {
        if (category.parent) {
            const foundParentCategory = treeCategories.find(_category => _category.id === category.parent?.id)

            if (foundParentCategory) {
                foundParentCategory.children.push(category)
            }
            else {
                treeCategories.push({
                    ...category,
                    children: [category]
                })
            }
        }
        else {
            treeCategories.push({ ...category, children: [] })
        }
    })

    return treeCategories
}

const updateOneById = async (id: number, updateCategoryDto: z.infer<typeof UpdateCategoryDto>): Promise<void> => {
    if (typeof updateCategoryDto.parent === "number") {
        const parentCategory = await findOneById(updateCategoryDto.parent)

        const result = await CategoryRepository.update({ id }, { ...updateCategoryDto, parent: parentCategory })
        if (result.affected === 0) throw new HTTPException(404, { message: "category or its parent not found" })
    }
    else {
        const { parent, ...restUpdate } = updateCategoryDto
        const result = await CategoryRepository.update({ id }, restUpdate)
        if (result.affected === 0) throw new HTTPException(404, { message: "category or its parent not found" })
    }
}

const deleteOneById = async (id: number) => {
    const result = await CategoryRepository.delete({ id })
    if (result.affected === 0) throw new HTTPException(404, { message: "category not found" })
}

export const CategoriesService = {
    create,
    findAll,
    tree,
    findOneById,
    updateOneById,
    deleteOneById
}