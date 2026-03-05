import Constants from 'expo-constants'
import { Platform } from 'react-native'

const { API_URL, ENV } = Constants.expoConfig.extra

/**
 * Attempts to extract the host IP from Expo's runtime metadata.
 * Expo exposes the dev server host through different properties depending
 * on whether the app is running in Expo Go, a development build, or a simulator.
 *
 * Each source returns a string like "192.168.1.7:8081" — we split to get just the IP.
 */
function detectDevHost() {
    const raw =
        Constants.expoConfig?.hostUri ||        // Expo SDK 46+ development builds
        Constants.manifest?.debuggerHost ||     // Expo Go (classic manifest)
        Constants.expoGoConfig?.debuggerHost    // Expo Go (new manifest)

    if (!raw) return null

    const host = raw.split(':')[0]

    // Android emulator routes localhost traffic through a special alias
    if (Platform.OS === 'android' && host === 'localhost') {
        return '10.0.2.2'
    }

    return host
}

/**
 * Resolves the final API base URL.
 * - In development: auto-detects the host IP from Expo runtime so developers
 *   never need to manually update .env.development when their IP changes.
 * - In staging/production: uses the API_URL defined in the environment file unchanged.
 */
function resolveApiUrl() {
    if (ENV !== 'development') return API_URL

    const host = detectDevHost()
    if (!host) return API_URL  // fallback to .env.development value if detection fails

    return `http://${host}:5000/api`
}

const RESOLVED_API_URL = resolveApiUrl()

export { RESOLVED_API_URL as API_URL, ENV }
