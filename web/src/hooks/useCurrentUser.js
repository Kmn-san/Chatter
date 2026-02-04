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
        mutationFn: async ({name,avatar}) => {
            const token = await getToken()

            const formData = new FormData()
            if(name) formData.append("name",name)
            if(avatar) formData.append("avatar",avatar)

            const {data} = await api.patch(
                `/auth/me`,
                formData,
                {headers: { Authorization: `Bearer ${token}` }}
            )
            return data
        },
        onSuccess: (updatedUser) => {
            queryClient.setQueryData(["currentUser"], (old) => ({
                ...old,
                ...updatedUser
            }))
        }
    })
}
