import 'dotenv/config'
import dotenv from 'dotenv'
import path from 'path'
import appJson from './app.json'

const envFile = process.env.ENVFILE || '.env.development'

dotenv.config({
    path: path.resolve(process.cwd(), envFile),
    override: true,
})

export default {
    ...appJson,
    expo: {
        ...appJson.expo,
        extra: {
            API_URL: process.env.API_URL,
            ENV: process.env.ENV,
        },
    },
}
