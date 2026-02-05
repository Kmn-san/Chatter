import { useApi } from "@/lib/axios";
import { User } from "@/types";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

type UpdateProfilePayload = {
    name?: string;
    avatar?: string | null;
}

export const useAuthCallback = () => {
    const { apiWithAuth } = useApi()

    const result = useMutation({
        mutationFn: async () => {
            const { data } = await apiWithAuth<User>({ method: "POST", url: "/auth/callback" })
            return data
        }
    })
    return result
}

export const useCurrentUser = () => {
    const { apiWithAuth } = useApi()

    return useQuery({
        queryKey: ["currentUser"],
        queryFn: async () => {
            const { data } = await apiWithAuth<User>({ method: "GET", url: "/auth/me" })
            return data
        }
    })
}

export const useUpdateProfile = () => {
    const { apiWithAuth } = useApi()
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: async ({ name, avatar }: UpdateProfilePayload) => {
            const formData = new FormData()
            if (name) formData.append("name", name)
            if (avatar) {
                formData.append(
                    "avatar",
                    {
                        uri: avatar,
                        name: "avatar.jpg",
                        type: "image/jpeg",
                    } as any
                );
            }
            const { data } = await apiWithAuth<User>({
                method: "PATCH",
                url: "/auth/me",
                data: formData,
                headers: {
                    "Content-Type": "multipart/form-data",
                },
            })
            return data
        },
        onSuccess: (updateUser) => {
            queryClient.setQueryData(["currentUser"], updateUser)
        },
        onError: (error) => {
            console.log(error);
        }

    })
}