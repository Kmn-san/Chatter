import { View, Text, TextInput, Pressable, Alert, KeyboardAvoidingView, Platform } from "react-native";
import { Image } from "expo-image";
import { useCurrentUser, useUpdateProfile } from "@/hooks/useAuth";
import { useState } from "react";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import * as ImagePicker from "expo-image-picker"

export default function EditProfileScreen() {
    const { data: user } = useCurrentUser();
    const router = useRouter();
    const [name, setName] = useState(user?.name ?? "");
    const [image, setImage] = useState<string | null>(null);

    const { mutate: updateProfile, isPending } = useUpdateProfile()

    const pickImage = async () => {
        // No permissions request is necessary for launching the image library.
        // Manually request permissions for videos on iOS when `allowsEditing` is set to `false`
        // and `videoExportPreset` is `'Passthrough'` (the default), ideally before launching the picker
        // so the app users aren't surprised by a system dialog after picking a video.
        // See "Invoke permissions for videos" sub section for more details.
        const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();

        if (!permissionResult.granted) {
            Alert.alert('Permission required', 'Permission to access the media library is required.');
            return;
        }

        let result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ['images'],
            allowsEditing: true,
            aspect: [4, 3],
            quality: 1,
        });
        if (!result.canceled) {
            setImage(result.assets[0].uri);
        }
    };


    const handleSave = () => {
        updateProfile({
            name,
            avatar: image
        },
            {
                onSuccess: () => {
                    Alert.alert("Success", "Update Profile Successfully")
                    router.back()
                },
                onError: () => {
                    Alert.alert("Error", "Failed to update profile")
                }
            })
    }

    return (
        <View className="flex-1 bg-surface-dark">
            {/* BACK BUTTON */}
            <Pressable
                onPress={() => router.back()}
                className="absolute top-12 left-4 z-10 w-10 h-10 rounded-full bg-surface-card items-center justify-center"
            >
                <Ionicons name="chevron-back" size={22} color="#fff" />
            </Pressable>
            <KeyboardAvoidingView
                style={{ flex: 1 }}
                behavior={Platform.OS === "ios" ? "padding" : undefined}
                keyboardVerticalOffset={Platform.OS === "ios" ? 10 : 0} // header height
            >
                <View className="flex-1 px-6 justify-center">
                    {/* Avatar */}
                    <View className="items-center mb-8">
                        <Pressable onPress={pickImage}>
                            <Image
                                source={image ?? user?.avatar}
                                style={{ width: 120, height: 120, borderRadius: 999 }}
                            />
                            <View className="absolute bottom-1 right-1 w-8 h-8 bg-primary rounded-full items-center justify-center">
                                <Ionicons name="camera" size={16} color="#0D0D0F" />
                            </View>
                        </Pressable>
                    </View>

                    {/* Name */}
                    <View className="gap-4">
                        <TextInput
                            value={name}
                            onChangeText={setName}
                            placeholder="Name"
                            className="bg-surface-card rounded-xl px-4 py-3 text-foreground"
                        />
                    </View>

                    {/* Save */}
                    <Pressable className="mt-8 bg-primary rounded-xl py-4 items-center"
                        onPress={handleSave}>
                        <Text className="text-black font-semibold">Save changes</Text>
                    </Pressable>
                </View>
            </KeyboardAvoidingView>
        </View >
    );
}
