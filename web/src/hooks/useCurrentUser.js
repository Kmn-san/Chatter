import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import api from "../lib/axios"
import { useAuth } from "@clerk/clerk-react"

export const useCurrentUser = () => {
    const { getToken } = useAuth()

    return useQuery({
        queryKey: ["currentUser"],
        queryFn: async () => {
            const token = await getToken()
            const { data } = await api.get("/auth/me", {
                headers: { Authorization: `Bearer ${token}` }
            })
            return data
        }
    })
}

export const useUserUpdate = () => {
    const { getToken } = useAuth()
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: async (updatedData) => {
            const token = await getToken()
            const res = await api.patch(
                `/auth/me`,
                updatedData,
                { headers: { Authorization: `Bearer ${token}` } }
            )
            return res.data
        },
        onSuccess: (updatedUser) => {
            queryClient.setQueryData(["currentUser"], (old) => ({
                ...old,
                ...updatedUser
            }))
        }
    })
}