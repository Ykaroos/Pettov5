import { SafeAreaView } from 'react-native-safe-area-context';
import { Text, View, TouchableOpacity, Image, Alert, ScrollView } from "react-native";
import { Stack } from "expo-router";
import { Ionicons, MaterialIcons, FontAwesome5, FontAwesome6 } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useEffect, useState } from 'react';
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { RootStackParamList } from "../navigation/types/types";

type Props = NativeStackScreenProps<RootStackParamList, 'PetRemove'>;

type Pet = {
  id: number;
  nome: string;
  imagem: string | null;
  tipo_arquivo?: string;
};

export default function RemovePet({ navigation }: Props) {
  const [pets, setPets] = useState<Pet[]>([]);

  useEffect(() => {
    const fetchPets = async () => {
      const id_usuario = await AsyncStorage.getItem("id_usuario");
      if (!id_usuario) return;

      try {
        const response = await fetch(`https://petto-api.onrender.com/pets/carrossel/${id_usuario}`);
        const data = await response.json();
        const formattedPets = data.map((pet: any) => ({
          id: pet.id,
          nome: pet.nome,
          imagem: pet.imagem ? `data:${pet.tipo_arquivo};base64,${pet.imagem}` : null,
        }));
        setPets(formattedPets);
      } catch (error) {
        console.error("Erro ao buscar pets:", error);
      }
    };

    const unsubscribe = navigation.addListener('focus', fetchPets);
    return unsubscribe;
  }, [navigation]);

  const removePet = (id: number) => {
    Alert.alert(
      "Remover Pet",
      "Tem certeza que deseja remover este pet?",
      [
        { text: "Cancelar", style: "cancel" },
        {
          text: "Remover",
          style: "destructive",
          onPress: async () => {
            try {
              await fetch(`https://petto-api.onrender.com/pets/${id}`, {
                method: 'DELETE',
              });
              setPets(prev => prev.filter(p => p.id !== id));
            } catch (error) {
              Alert.alert("Erro", "Não foi possível remover o pet.");
              console.error("Erro ao remover pet:", error);
            }
          },
        }
      ]
    );
  };

  return (
    <SafeAreaView style={{ flex: 1, padding: 1 }}>
      <View className="flex-1 bg-white p-1">
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
        <View className="mb-6 pl-5">
          <TouchableOpacity>
            <View className="flex-row items-center mt-3 mb-3">
              <Ionicons onPress={() => navigation.navigate('User')} name="chevron-back-outline" size={18} color="black" />
              <Text onPress={() => navigation.navigate('User')} className="text-2xl font-semibold ml-2">Remover pet</Text>
            </View>
          </TouchableOpacity>
        </View>

        {/* Lista de pets */}
        <ScrollView contentContainerStyle={{ paddingBottom: 100 }} className="px-4">
          {pets.map((pet) => (
            <View key={pet.id} className="bg-gray-100 rounded-xl p-3 mb-4 flex-row items-center justify-between">
              <View className="flex-row items-center">
                <Image
                  source={pet.imagem ? { uri: pet.imagem } : require('../../assets/images/icone-adicionar-pet.jpg')}
                  className="w-16 h-16 rounded-full mr-4"
                  resizeMode="cover"
                />
                <Text className="text-lg font-medium">{pet.nome}</Text>
              </View>
              <TouchableOpacity
                onPress={() => removePet(pet.id)}
                className="bg-black px-4 py-2 rounded-lg"
              >
                <Text className="text-white font-medium">Remover</Text>
              </TouchableOpacity>
            </View>
          ))}

          {pets.length === 0 && (
            <Text className="text-lg text-center text-black-500 font-semibold">
              Nenhum pet cadastrado.{'\n'}Volte para a tela inicial e cadastre um pet!
            </Text>
          )}

          <TouchableOpacity
            onPress={() => navigation.navigate('User')}
            className="mt-4"
          >
            <Text className="text-center text-gray-500 underline">Voltar para a página do usuário</Text>
          </TouchableOpacity>
        </ScrollView>

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

