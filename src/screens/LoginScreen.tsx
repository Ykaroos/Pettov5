import React, { useState } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Text, View, TextInput, TouchableOpacity, Image, Alert } from "react-native";
import { Stack } from "expo-router";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { RootStackParamList } from "../navigation/types/types";
import AsyncStorage from '@react-native-async-storage/async-storage'; 

type Props = NativeStackScreenProps<RootStackParamList, 'LoginScreen'>;

export default function LoginScreen ({ navigation }: Props) {
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');

  const validarEmail = (email: string) => {
    const re = /\S+@\S+\.\S+/;
    return re.test(email);
  };

  const handleLogin = async () => {
    if (!email.trim()) {
      Alert.alert("Erro", "O campo E-mail é obrigatório.");
      return;
    }
    if (!validarEmail(email)) {
      Alert.alert("Erro", "Informe um e-mail válido.");
      return;
    }
    if (!senha.trim()) {
      Alert.alert("Erro", "O campo Senha é obrigatório.");
      return;
    }

    try {
      const response = await fetch("https://petto-api.onrender.com/users/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: email.trim(),
          senha: senha.trim(),
        }),
      });

      const data = await response.json();

      if (response.ok) {
        Alert.alert("Sucesso", data.msg || "Login realizado com sucesso.");
        await AsyncStorage.setItem("id_usuario", data.user_id.toString());
        navigation.replace("Home");
      } else {
        Alert.alert("Erro", data.detail || "Usuário ou senha inválidos.");
      }
    } catch (error) {
      console.error(error);
      Alert.alert("Erro", "Não foi possível conectar à API.");
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
        <Text className="text-lg font-bold">Entre na sua conta!</Text>
        <Text className="text-lg text-gray-500 mt-1">Adicione seu e-mail para login</Text>
      </View>

      {/* Campo de e-mail */}
      <Text className="text-base mb-2 text-black">E-mail:</Text>
      <TextInput
        placeholder="email@dominio.com"
        keyboardType="email-address"
        className="border border-gray-100 rounded-md px-4 py-3 text-sm mb-4"
        placeholderTextColor="#aaa"
        value={email}
        onChangeText={setEmail}
        autoCapitalize="none"
      />

      {/* Campo de senha */}
      <Text className="text-base mb-2 text-black">Senha:</Text>
      <TextInput
        placeholder="Senha"
        secureTextEntry
        className="border border-gray-100 rounded-md px-4 py-3 text-sm mb-2"
        placeholderTextColor="#aaa"
        value={senha}
        onChangeText={setSenha}
      />

      {/* Esqueci a senha */}
      <View className="items-end mb-6">
        <TouchableOpacity onPress={() => navigation.navigate('Password')}>
          <Text className="text-sm text-[#5E6985]">Esqueci a senha</Text>
        </TouchableOpacity>
      </View>

      {/* Botão de login */}
      <TouchableOpacity onPress={handleLogin} className="bg-black py-3.5 rounded-md mb-5">
        <Text className="text-white text-center font-medium text-base">Continuar</Text>
      </TouchableOpacity>

      {/* Separador */}
      <View className="items-center mb-4">
        <Text className="text-gray-400 text-sm">Não tem conta?</Text>
      </View>

      {/* Botão de cadastro */}
      <TouchableOpacity onPress={() => navigation.navigate('RegisterUser')} className="bg-gray-200 py-3.5 rounded-md mb-7">
        <Text className="text-center font-medium text-gray-700 text-base">Cadastrar conta</Text>
      </TouchableOpacity>

      {/* Termos */}
      <Text className="text-[12px] text-center text-gray-400 px-2 leading-4">
        Clicando em “continuar”, você aceita nossos{' '}
        <Text className="font-semibold text-gray-600">Termos de Serviço</Text> e{' '}
        <Text className="font-semibold text-gray-600">Política de Privacidade</Text>
      </Text>
    </SafeAreaView>
  );
};


