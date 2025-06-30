import { SafeAreaView } from 'react-native-safe-area-context';
import { Text, View, TextInput, TouchableOpacity, Image, Alert } from "react-native";
import { Stack } from "expo-router";
import { useState } from "react";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { RootStackParamList } from "../navigation/types/types";

type Props = NativeStackScreenProps<RootStackParamList, 'NewPassword'>;

export default function NewPassword({ route, navigation }: Props) {
    const { email } = route.params;

    const [novaSenha, setNovaSenha] = useState("");
    const [confirmarSenha, setConfirmarSenha] = useState("");

    const handleRedefinirSenha = async () => {
    if (novaSenha !== confirmarSenha) {
        Alert.alert("Erro", "As senhas não coincidem.");
        return;
    }

    try {
        const payload = {
            email: email,
            nova_senha: novaSenha
        };

        const response = await fetch("https://petto-api.onrender.com/users/redefinir-senha", {
            method: "PUT",
            headers: {
                "Accept": "application/json",
                "Content-Type": "application/json"
            },
            body: JSON.stringify(payload)
        });

        const data = await response.json();

        if (response.ok) {
            Alert.alert("Sucesso", data.msg || "Senha redefinida!");
            navigation.navigate("LoginScreen");
        } else {
            console.log(data);
            Alert.alert("Erro", data.detail || "Erro ao redefinir senha.");
        }
    } catch (error) {
        console.error(error);
        Alert.alert("Erro", "Erro de conexão com o servidor.");
    }
};

    return (
        <SafeAreaView className="flex-1 bg-white px-6">
            <Stack.Screen options={{ headerShown: false }} />

            {/* Logo */}
            <View className="items-center mt-24 mb-9">
                <Image
                    source={require('../../assets/images/nome-Petto-semfundoepata.png')}
                    className="w-48 h-20 resize-contain"
                />
            </View>

            {/* Texto principal */}
            <View className="items-center mb-8">
                <Text className="text-lg font-bold text-center">Nova senha</Text>
                <Text className="text-lg text-gray-500 text-center mt-1 leading-5">
                    Digite a nova senha para redefinir:
                </Text>
            </View>

            {/* Campo Nova Senha */}
            <Text className="text-base mb-3 text-black">Nova senha:</Text>
            <TextInput
                placeholder="Nova senha"
                secureTextEntry
                value={novaSenha}
                onChangeText={setNovaSenha}
                className="border border-gray-100 rounded-md px-4 py-3 text-sm mb-4"
                placeholderTextColor="#aaa"
            />

            {/* Campo Confirmar Senha */}
            <Text className="text-base mb-3 text-black">Confirme a senha:</Text>
            <TextInput
                placeholder="Confirme a senha"
                secureTextEntry
                value={confirmarSenha}
                onChangeText={setConfirmarSenha}
                className="border border-gray-100 rounded-md px-4 py-3 text-sm mb-6"
                placeholderTextColor="#aaa"
            />

            {/* Botão Alterar Senha */}
            <TouchableOpacity onPress={handleRedefinirSenha} className="bg-black py-3.5 rounded-md mb-6">
                <Text className="text-white text-center font-medium text-base">Alterar senha</Text>
            </TouchableOpacity>
        </SafeAreaView>
    );
}
