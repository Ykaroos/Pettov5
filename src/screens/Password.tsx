import { SafeAreaView } from 'react-native-safe-area-context';
import { Text, View, TextInput, TouchableOpacity, Image, Alert } from "react-native";
import { Stack } from "expo-router";
import { useState } from "react";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { RootStackParamList } from "../navigation/types/types";

type Props = NativeStackScreenProps<RootStackParamList, 'Password'>;

export default function Password  ({ navigation }: Props) {
    const [email, setEmail] = useState("");

    const verificarEmail = async () => {
        try {
            const response = await fetch("https://petto-api.onrender.com/users/verificar-email", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({ email })
            });

            if (response.ok) {
                navigation.navigate("NewPassword", { email });
            } else {
                const data = await response.json();
                Alert.alert("Erro", data.detail || "E-mail não encontrado");
            }
        } catch (error) {
            console.error(error);
            Alert.alert("Erro", "Não foi possível conectar ao servidor");
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
                <Text className="text-lg font-bold text-center">Esqueceu a senha?</Text>
                <Text className="text-lg text-gray-500 text-center mt-1 leading-5">
                    Informe o e-mail para o qual deseja{"\n"}redefinir a senha:
                </Text>
            </View>

            {/* Campo de e-mail */}
            <Text className="text-base mb-3 text-black">E-mail:</Text>
            <TextInput
                placeholder="email@dominio.com"
                keyboardType="email-address"
                value={email}
                onChangeText={setEmail}
                className="border border-gray-100 rounded-md px-4 py-3 text-sm mb-6"
                placeholderTextColor="#aaa"
                autoCapitalize="none"
            />

            {/* Botão Continuar */}
            <TouchableOpacity onPress={verificarEmail} className="bg-black py-3.5 rounded-md mb-6">
                <Text className="text-white text-center font-medium text-base">Continuar</Text>
            </TouchableOpacity>

            {/* Voltar ao login */}
            <TouchableOpacity onPress={() => navigation.navigate('LoginScreen')} className='items-center'>
                <Text className="text-base text-[#828282] underline">Voltar ao Login</Text>
            </TouchableOpacity>
        </SafeAreaView>
    );
};



