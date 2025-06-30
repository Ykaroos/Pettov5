import { SafeAreaView } from 'react-native-safe-area-context';
import { Text, View, TouchableOpacity, Image, ScrollView, KeyboardAvoidingView, Platform, TextInput, Alert } from 'react-native';
import { Stack } from 'expo-router';
import { Ionicons, MaterialIcons, FontAwesome5, FontAwesome6 } from '@expo/vector-icons';
import { useEffect, useState } from 'react';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/types/types';

type Props = NativeStackScreenProps<RootStackParamList, 'DiaryPetSelected'>;

type Pet = {
  id: number;
  nome: string;
  imagem?: string;
};

export default function DiaryPetSelected({ navigation, route }: Props) {
  const { petId } = route.params;
  const [selectedPet, setSelectedPet] = useState<Pet | null>(null);
  const [conteudo, setConteudo] = useState('');

  useEffect(() => {
    const fetchPetDiary = async () => {
      try {
        const response = await fetch(`https://petto-api.onrender.com/diarios/pet/${petId}`);
        if (!response.ok) throw new Error('Erro ao buscar o diário');
        const data = await response.json();
        setConteudo(data.conteudo);
        setSelectedPet({ id: petId, nome: data.nome_pet });
      } catch (error) {
        console.error(error);
        Alert.alert('Erro', 'Não foi possível carregar o diário do pet.');
      }
    };

    const unsubscribe = navigation.addListener('focus', fetchPetDiary);
    return unsubscribe;
  }, [navigation, petId]);

  const salvarDiario = async () => {
    try {
      const response = await fetch(`https://petto-api.onrender.com/diarios/pet/${petId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ conteudo }),
      });

      if (!response.ok) throw new Error('Erro ao salvar o diário');
      const data = await response.json();
      Alert.alert('Sucesso', `O diário de ${data.nome_pet} foi salvo.`);
    } catch (error) {
      console.error(error);
      Alert.alert('Erro', 'Não foi possível salvar o diário do pet.');
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
          <TouchableOpacity
            onPress={() => navigation.navigate('DiaryPets')}
            className="flex-row items-center mt-3 mb-3"
          >
            <View className="flex-row items-center mt-3 mb-3">
              <Ionicons name="chevron-back-outline" size={18} color="black" />
              <Text className="text-2xl font-semibold ml-2">
                Diário do pet - {selectedPet?.nome || '...'}
              </Text>
            </View>
          </TouchableOpacity>
        </View>

        {/* Diário */}
        <ScrollView contentContainerStyle={{ paddingBottom: 300 }} className="px-4">
          {selectedPet ? (
            <KeyboardAvoidingView
              behavior={Platform.OS === 'ios' ? 'padding' : undefined}
              className="flex-1"
            >
              <TextInput
                value={conteudo}
                onChangeText={setConteudo}
                placeholder="Escreva no diário..."
                multiline
                textAlignVertical="top"
                className="bg-[#F5F5F5] p-4 rounded-xl min-h-[500px] text-base"
              />

              <TouchableOpacity
                onPress={salvarDiario}
                className="bg-black py-3 w-36 self-center rounded-md items-center mt-2"
              >
                <Text className="text-white text-base font-semibold">Salvar</Text>
              </TouchableOpacity>
            </KeyboardAvoidingView>
          ) : (
            <Text className="text-center text-gray-500 mt-10">
              Pet não encontrado.
            </Text>
          )}
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
            <FontAwesome5 name="paw" size={24} color="black" />
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

