import { CreateUserDto } from "../validators"
import { AppDataSource } from "../app.datasource"
import { UserEntity } from "../entities/User.entity"
import { hash, compare } from "bcrypt"
import { HTTPException } from "hono/http-exception"
import { sign } from "hono/jwt"
import repositories from "../repositories"
import ConfigService from "../config-service"
import { ERoles } from "../guards/role.guard"

const UsersRepository = repositories.UsersRepository

const createUser = async (createUserDto: typeof CreateUserDto._type): Promise<UserEntity> => {
    const user = new UserEntity()

    const isUsernameExist = await UsersRepository.findOneBy({
        username: createUserDto.username
    })

    if (isUsernameExist) throw new HTTPException(400, { message: "username already taken" })

    const isFirstUser = await UsersRepository.count({ take: 2 })

    user.username = createUserDto.username
    user.password = await hash(createUserDto.password, 9)
    user.role = isFirstUser === 0 ? ERoles.superAdmin : ERoles.user
    if (createUserDto.avatar) user.avatar = createUserDto.avatar

    await AppDataSource.manager.save(user)

    return user
}

const login = async (username: string, password: string): Promise<{ jwt_token: string }> => {
    const user = await UsersRepository.findOneBy({
        username
    })

    if (!user) throw new HTTPException(404, { message: "user not found" })

    const isPasswordValid = await compare(password, user.password)

    if (!isPasswordValid) {
        throw new HTTPException(400, { message: "wrong credentials" })
    }

    return {
        jwt_token: await sign(
            {
                sub: user.id,
                exp: Math.floor(Date.now() / 1000) + 60 * 60 * 24 * 7
            },
            ConfigService.getOrThrow("JWT_SECRET")
        )
    }
}

const findAll = async (): Promise<UserEntity[]> => {
    return UsersRepository.find()
}

const findOneByUserName = async (username: string) => {
    const user = await UsersRepository.findOneBy({ username })

    if (!user) throw new HTTPException(404, { message: "user not found" })

    return user
}

const findOneById = async (id: number): Promise<UserEntity> => {
    const user = await UsersRepository.findOneBy({ id })

    if (!user) throw new HTTPException(404, { message: "user not found" })

    return user
}

export const UsersService = {
    createUser,
    findAll,
    findOneById,
    login,
    findOneByUserName
}