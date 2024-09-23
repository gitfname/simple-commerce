
interface IEnv {
    JWT_SECRET: string;
}

const getOrThrow = (key: keyof IEnv): string => {
    if (typeof process.env[key] !== "undefined") {
        return process.env[key] as string
    }
    throw new Error("Environment variable " + key + " has not been set in the .env file")
}

const ConfigService = {
    getOrThrow
}

export default ConfigService