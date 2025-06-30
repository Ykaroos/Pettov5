import { SafeAreaView } from 'react-native-safe-area-context';
import { Text, View, TouchableOpacity, TextInput, Image, Alert } from "react-native";
import { Stack } from "expo-router";
import { Ionicons, MaterialIcons, FontAwesome5, FontAwesome6 } from '@expo/vector-icons';
import { useEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { RootStackParamList } from "../navigation/types/types";

type Props = NativeStackScreenProps<RootStackParamList, 'UserEdit'>;

export default function EditUser({ navigation }: Props) {
  const [userId, setUserId] = useState<number | null>(null);
  const [nome, setNome] = useState('');

  useEffect(() => {
    const fetchUserIdAndName = async () => {
      try {
        const id = await AsyncStorage.getItem("id_usuario");
        if (id) {
          setUserId(parseInt(id));

          const response = await fetch(`https://petto-api.onrender.com/users/${id}`);
          const data = await response.json();
          if (response.ok) setNome(data.nome);
        }
      } catch (error) {
        console.error("Erro ao buscar dados do usuário:", error);
      }
    };

    fetchUserIdAndName();
  }, []);

  const handleSave = async () => {
    if (!userId) return;

    try {
      const response = await fetch(`https://petto-api.onrender.com/users/${userId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ nome }),
      });

      const data = await response.json();
      if (response.ok) {
        Alert.alert("Sucesso", "Nome atualizado com sucesso");
        navigation.navigate('User');
      } else {
        Alert.alert("Erro", data.detail || "Erro ao atualizar usuário");
      }
    } catch (error) {
      console.error("Erro ao salvar:", error);
      Alert.alert("Erro", "Não foi possível salvar as alterações");
    }
  };

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <View className="flex-1 bg-white">
        <Stack.Screen options={{ headerShown: false }} />

        {/* Cabeçalho */}
        <View className="w-full bg-[#F5F5F5] py-4 items-center">
          <Image
            source={require('../../assets/images/nome-Petto-semfundoepata.png')}
            className="w-40 h-12"
            resizeMode="contain"
          />
        </View>

        {/* Título */}
        <View className="pl-5 mb-4">
            <TouchableOpacity onPress={() => navigation.navigate('User')}>
                <View className="flex-row items-center mt-3 mb-2">
                    <Ionicons name="chevron-back-outline" size={20} color="black" />
                    <Text className="text-2xl font-semibold ml-2">Editar usuário</Text>
                </View>
            </TouchableOpacity>
          
        </View>

        {/* Conteúdo */}
        <View className="flex-1 items-center justify-start px-4 mt-2">
          <FontAwesome6 name="user-large" size={80} color="black" style={{ marginBottom: 24 }} />

          <TextInput
            className="w-full bg-gray-100 rounded-xl p-3 text-base text-black mb-4"
            placeholder="Novo nome"
            value={nome}
            onChangeText={setNome}
          />

          <TouchableOpacity
            className="bg-black rounded-xl px-6 py-3 mb-3"
            onPress={handleSave}
          >
            <Text className="text-white text-base font-semibold">Salvar alterações</Text>
          </TouchableOpacity>

          <TouchableOpacity onPress={() => navigation.navigate('User')}>
            <Text className="text-sm text-gray-600 underline">Voltar para a página do usuário</Text>
          </TouchableOpacity>
        </View>

        {/* Menu inferior */}
        <View className="absolute bottom-0 left-0 right-0 flex-row justify-around items-center py-6 border-t border-gray-200 bg-white">
          <TouchableOpacity onPress={() => navigation.navigate('Home')} className="items-center">
            <MaterialIcons name="home-filled" size={28} color="gray" />
          </TouchableOpacity>
          <TouchableOpacity onPress={() => navigation.navigate('AgenderPets')} className="items-center">
            <Ionicons name="calendar-sharp" size={24} color="gray" />
          </TouchableOpacity>
          <TouchableOpacity onPress={() => navigation.navigate('DiaryPets')} className="items-center">
            <FontAwesome5 name="paw" size={24} color="gray" />
          </TouchableOpacity>
          <TouchableOpacity onPress={() => navigation.navigate('HealthPets')} className="items-center">
            <FontAwesome5 name="notes-medical" size={24} color="gray" />
          </TouchableOpacity>
          <TouchableOpacity onPress={() => navigation.navigate('User')} className="items-center">
            <FontAwesome6 name="user-large" size={24} color="black" />
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
}
