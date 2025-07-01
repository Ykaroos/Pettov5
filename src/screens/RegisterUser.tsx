import React, { useState } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Text, View, TextInput, TouchableOpacity, Image, Alert } from "react-native";
import { Stack } from "expo-router";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { RootStackParamList } from "../navigation/types/types";

type Props = NativeStackScreenProps<RootStackParamList, 'RegisterUser'>;

export default function RegisterUser ({ navigation }: Props) {
  const [nome, setNome] = useState('');
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [confirmaSenha, setConfirmaSenha] = useState('');

  const validarEmail = (email: string) => {
    const re = /\S+@\S+\.\S+/;
    return re.test(email);
  };

  const handleRegister = async () => {
    if (!nome.trim()) {
      Alert.alert("Erro", "O campo Nome é obrigatório.");
      return;
    }
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
    if (senha.length < 6) {
      Alert.alert("Erro", "A senha deve ter pelo menos 6 caracteres.");
      return;
    }
    if (!confirmaSenha.trim()) {
      Alert.alert("Erro", "Por favor, confirme a senha.");
      return;
    }
    if (senha !== confirmaSenha) {
      Alert.alert("Erro", "As senhas não coincidem.");
      return;
    }

    try {
      const response = await fetch("https://petto-api.onrender.com/users/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          nome: nome.trim(),
          email: email.trim(),
          senha: senha.trim(),
        }),
      });

      const data = await response.json();

      if (response.ok) {
        Alert.alert("Sucesso", data.msg || "Usuário cadastrado com sucesso.");
        navigation.navigate("LoginScreen");
      } else {
        Alert.alert("Erro", data.detail || "Erro ao criar usuário.");
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
      <View className="items-center mt-16 mb-10">
        <Image
          source={require('../../assets/images/nome-Petto-semfundoepata.png')}
          className="w-48 h-20 resize-contain"
        />
      </View>

      {/* Campo Nome */}
      <Text className="text-lg mb-2 text-black">Nome</Text>
      <TextInput
        placeholder="Nome completo"
        className="border border-gray-100 rounded-md px-4 py-3 text-sm mb-4"
        placeholderTextColor="#aaa"
        value={nome}
        onChangeText={setNome}
      />

      {/* Campo E-mail */}
      <Text className="text-lg mb-2 text-black">E-mail:</Text>
      <TextInput
        placeholder="email@dominio.com"
        keyboardType="email-address"
        className="border border-gray-100 rounded-md px-4 py-3 text-sm mb-4"
        placeholderTextColor="#aaa"
        value={email}
        onChangeText={setEmail}
        autoCapitalize="none"
      />

      {/* Campo Senha */}
      <Text className="text-lg mb-2 text-black">Senha:</Text>
      <TextInput
        placeholder="Senha"
        secureTextEntry
        className="border border-gray-100 rounded-md px-4 py-3 text-sm mb-4"
        placeholderTextColor="#aaa"
        value={senha}
        onChangeText={setSenha}
      />

      {/* Campo Confirmar Senha */}
      <Text className="text-lg mb-2 text-black">Confirme a senha:</Text>
      <TextInput
        placeholder="Confirme a senha"
        secureTextEntry
        className="border border-gray-100 rounded-md px-4 py-3 text-sm mb-6"
        placeholderTextColor="#aaa"
        value={confirmaSenha}
        onChangeText={setConfirmaSenha}
      />

      {/* Botão Criar Conta */}
      <TouchableOpacity onPress={handleRegister} className="bg-black py-3.5 rounded-md mb-5">
        <Text className="text-white text-center font-medium text-base">Criar conta</Text>
      </TouchableOpacity>

      {/* Já tem conta? */}
      <View className="items-center mb-4">
        <Text className="text-sm text-gray-400">Já tem conta?</Text>
      </View>

      {/* Botão Entrar */}
      <TouchableOpacity onPress={() => navigation.navigate('LoginScreen')} className="bg-gray-200 py-3.5 rounded-md mb-7">
        <Text className="text-center font-medium text-gray-700 text-base">Entrar em conta existente</Text>
      </TouchableOpacity>

      {/* Termos de uso */}
      <Text className="text-[12px] text-center text-gray-400 leading-4 px-2">
        Clicando em “criar conta”, você aceita nossos{' '}
        <Text className="font-semibold text-gray-600">Termos de Serviço</Text> e{' '}
        <Text className="font-semibold text-gray-600">Política de Privacidade</Text>
      </Text>
    </SafeAreaView>
  );
};




