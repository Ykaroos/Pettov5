import { useEffect, useState } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Text, View, Image, TouchableOpacity, ScrollView } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Ionicons, MaterialIcons, FontAwesome5, FontAwesome6 } from '@expo/vector-icons';
import { Stack } from 'expo-router';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/types/types';

type Props = NativeStackScreenProps<RootStackParamList, 'Home'>;
type Pet = {
  id: number;
  nome: string;
  dataNasc: string;
  tipo: string;
  raca: string;
  sexo: string;
  peso: number;
  cor: string;
  imagem: string | null;
};

export default function HomeScreen({ navigation }: Props) {
  const [pets, setPets] = useState<Pet[]>([]);
  const [expandedPetId, setExpandedPetId] = useState<number | null>(null);

  useEffect(() => {
    const fetchPetsFromAPI = async () => {
      const id_usuario = await AsyncStorage.getItem("id_usuario");
      if (!id_usuario) return;

      try {
        const response = await fetch(`https://petto-api.onrender.com/pets/carrossel/${id_usuario}`);
        const data = await response.json();
        const formattedPets = data.map((pet: any) => ({
          id: pet.id,
          nome: pet.nome,
          dataNasc: pet.dataNascimento,
          tipo: pet.tipo,
          raca: pet.raca,
          sexo: pet.sexo,
          peso: pet.peso,
          cor: pet.cor,
          imagem: pet.imagem
            ? `data:${pet.tipo_arquivo};base64,${pet.imagem}`
            : null,
        }));
        setPets(formattedPets);
      } catch (error) {
        console.error("Erro ao buscar pets:", error);
      }
    };

    const unsubscribe = navigation.addListener('focus', fetchPetsFromAPI);
    return unsubscribe;
  }, [navigation]);

  const togglePetDetails = (id: number) => {
    setExpandedPetId(prev => (prev === id ? null : id));
  };

  const calcularIdade = (dataISO: string) => {
    const nascimento = new Date(dataISO);
    const hoje = new Date();
    let anos = hoje.getFullYear() - nascimento.getFullYear();
    let meses = hoje.getMonth() - nascimento.getMonth();

    if (meses < 0 || (meses === 0 && hoje.getDate() < nascimento.getDate())) {
      anos--;
      meses += 12;
    }

    return `${anos} anos${meses > 0 ? ` e ${meses} meses` : ''}`;
  };

  const capitalizar = (texto: string) =>
    texto ? texto.charAt(0).toUpperCase() + texto.slice(1).toLowerCase() : '';

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <View className="flex-1 bg-white p-1">
        <Stack.Screen options={{ headerShown: false }} />
        <View className="w-full bg-[#F5F5F5] py-4 items-center">
          <Image
            source={require('../../assets/images/nome-Petto-semfundoepata.png')}
            className="w-40 h-12"
            resizeMode="contain"
          />
        </View>

        <ScrollView contentContainerStyle={{ flexGrow: 1 }} className="flex-1 px-1">
          <View className="mb-6 px-5">
            <View className="flex-row items-center mt-3 mb-3">
              <Text className="text-2xl font-semibold mr-2">Seus pets</Text>
              <Ionicons name="chevron-forward-outline" size={18} color="black" />
            </View>

            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
              <View className="items-center mr-4">
                <TouchableOpacity
                  onPress={() => navigation.navigate('RegisterPet')}
                  className="w-24 h-24 bg-gray-200 rounded-full justify-center items-center shadow-sm shadow-slate-900 overflow-hidden"
                >
                  <Image
                    source={require('../../assets/images/icone-adicionar-pet.jpg')}
                    className="w-full h-full"
                    resizeMode="cover"
                  />
                </TouchableOpacity>
                <Text className="mt-1 text-center">Cadastrar pet</Text>
              </View>

              {pets.map((pet) => (
                <TouchableOpacity
                  key={pet.id}
                  onPress={() => togglePetDetails(pet.id)}
                  className="items-center mr-4"
                >
                  <Image
                    source={
                      pet.imagem
                        ? { uri: pet.imagem }
                        : require('../../assets/images/icone-adicionar-pet.jpg')
                    }
                    className="w-24 h-24 rounded-full shadow-sm shadow-slate-900"
                    resizeMode="cover"
                  />
                  <Text className="mt-1 text-center">{capitalizar(pet.nome)}</Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>

          {expandedPetId ? (
            <View className="px-5 pb-20">
              {pets
                .filter((pet) => pet.id === expandedPetId)
                .map((pet) => (
                  <View key={pet.id} className="rounded-xl">
                    <Image
                      source={
                        pet.imagem
                          ? { uri: pet.imagem }
                          : require('../../assets/images/icone-adicionar-pet.jpg')
                      }
                      className="w-32 h-32 rounded-full self-center mb-4 shadow-md"
                      resizeMode="cover"
                    />

                    {[
                      ['Nome', capitalizar(pet.nome)],
                      ['Idade', calcularIdade(pet.dataNasc)],
                      ['Data de Nascimento', pet.dataNasc],
                      ['Tipo de animal', capitalizar(pet.tipo)],
                      ['Raça', capitalizar(pet.raca)],
                      ['Sexo', capitalizar(pet.sexo)],
                      ['Peso', `${pet.peso} kg`],
                      ['Cor', capitalizar(pet.cor)],
                    ].map(([label, value]) => (
                      <View key={label} className="mb-2">
                        <Text className="font-semibold mb-1">{label}:</Text>
                        <View className="bg-gray-100 p-2 rounded-md">
                          <Text>{value}</Text>
                        </View>
                      </View>
                    ))}
                  </View>
                ))}
            </View>
          ) : (
            <View className="flex-1 pt-12 items-center">
              <Text className="text-xl font-semibold text-center pb-6">
                Selecione ou cadastre um Pet!
              </Text>
              <Image
                source={require('../../assets/images/Erro_Gatinho.png')}
                className="w-80 h-80"
                resizeMode="contain"
              />
            </View>
          )}
        </ScrollView>

        {/* Rodapé */}
        <View className="absolute bottom-0 left-0 right-0 flex-row justify-around items-center py-6 border-t border-gray-200 bg-white">
          <TouchableOpacity onPress={() => navigation.navigate('Home')} className="items-center">
            <MaterialIcons name="home-filled" size={28} color="black" />
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
            <FontAwesome6 name="user-large" size={24} color="gray" />
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
}
