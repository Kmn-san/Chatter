import { Redirect, Stack } from 'expo-router'
import { useAuth } from '@clerk/clerk-expo'

const AuthLayout = () => {
    const { isSignedIn, isLoaded } = useAuth()

    if (!isLoaded) return null
    if (isSignedIn) return <Redirect href={"/(tabs)/profile"} />
    return (
        <Stack
            screenOptions={{ headerShown: false }} />
    )
}

export default AuthLayout