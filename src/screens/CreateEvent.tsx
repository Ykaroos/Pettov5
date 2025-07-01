import { useEffect, useState } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import {View, Text, TextInput, TouchableOpacity, Image, Alert, ActivityIndicator,} from 'react-native';
import { Stack } from 'expo-router';
import {Ionicons, MaterialIcons, FontAwesome5, FontAwesome6,} from '@expo/vector-icons';
import { Picker } from '@react-native-picker/picker';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/types/types';

type Props = NativeStackScreenProps<RootStackParamList, 'CreateEvent'>;

interface Pet {
  id: number;
  nome: string;
}

export default function CreateEvent({ navigation }: Props) {
  const [selectedPet, setSelectedPet] = useState<string | undefined>(undefined);
  const [pets, setPets] = useState<Pet[]>([]);
  const [loading, setLoading] = useState(true);

  const [title, setTitle] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');

  useEffect(() => {
    const fetchPets = async () => {
      try {
        const id_usuario = await AsyncStorage.getItem('id_usuario');
        if (!id_usuario) {
          Alert.alert('Erro', 'Usuário não encontrado.');
          return;
        }

        const response = await fetch(`https://petto-api.onrender.com/pets/carrossel/${id_usuario}`);
        const data = await response.json();

        const formattedPets = data.map((pet: any) => ({
          id: pet.id,
          nome: pet.nome,
        }));

        setPets(formattedPets);
      } catch (error) {
        Alert.alert('Erro', 'Não foi possível carregar os pets do usuário.');
      } finally {
        setLoading(false);
      }
    };

    const unsubscribe = navigation.addListener('focus', fetchPets);
    return unsubscribe;
  }, [navigation]);

  const handleCreateEvent = async () => {
    if (!title || !startDate || !endDate || !selectedPet) {
      Alert.alert('Erro', 'Preencha todos os campos!');
      return;
    }

    try {
      const response = await fetch('https://petto-api-externa.onrender.com/create-event', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          summary: title,
          description: `Evento para o pet ID ${selectedPet}`,
          startDate,
          endDate,
        }),
      });

      if (response.ok) {
        Alert.alert('Sucesso', 'Evento criado com sucesso!');
        navigation.navigate('AgenderPets');
      } else {
        const errorText = await response.text();
        Alert.alert('Erro', errorText || 'Não foi possível criar o evento.');
      }
    } catch (error) {
      Alert.alert('Erro', 'Erro de conexão com o servidor.');
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-white">
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

        {/* Título com voltar */}
        <View className="pl-5 mt-4 mb-6">
          <TouchableOpacity onPress={() => navigation.navigate('AgenderPets')}>
            <View className="flex-row items-center">
              <Ionicons name="chevron-back-outline" size={20} color="black" />
              <Text className="text-2xl font-semibold ml-2">Criar evento</Text>
            </View>
          </TouchableOpacity>
        </View>

        {/* Formulário */}
        <View className="mx-6 bg-gray-100 rounded-md p-4 pb-6 mb-8">
          <View>
            <Text className="text-lg text-black font-semibold mb-1">Adicionar título:</Text>
            <TextInput
              placeholder="ex: Ida ao veterinário"
              value={title}
              onChangeText={setTitle}
              className="bg-white p-2 rounded border border-gray-50 text-black"
              placeholderTextColor="#999"
            />
          </View>

          <View>
            <Text className="text-lg text-black font-semibold mb-1 mt-1">Data de início:</Text>
            <TextInput
              placeholder="2025-07-01"
              value={startDate}
              onChangeText={setStartDate}
              className="bg-white p-2 rounded border border-gray-50 text-black"
              placeholderTextColor="#999"
            />
          </View>

          <View>
            <Text className="text-lg text-black font-semibold mb-1 mt-1">Data de fim:</Text>
            <TextInput
              placeholder="2025-07-02"
              value={endDate}
              onChangeText={setEndDate}
              className="bg-white p-2 rounded border border-gray-50 text-black"
              placeholderTextColor="#999"
            />
          </View>

          <View>
            <Text className="text-lg text-black font-semibold mb-1 mt-1">Escolher pet envolvido:</Text>
            <View className="bg-white border border-gray-50 rounded">
              {loading ? (
                <ActivityIndicator size="small" color="#999" className="py-2" />
              ) : (
                <Picker
                  selectedValue={selectedPet}
                  onValueChange={(itemValue) => setSelectedPet(itemValue)}
                  style={{ color: selectedPet ? 'black' : '#999', height: 50 }}
                >
                  <Picker.Item label="Selecionar" value={undefined} color="#999" />
                  {pets.map((pet) => (
                    <Picker.Item key={pet.id.toString()} label={pet.nome} value={pet.id.toString()} />
                  ))}
                </Picker>
              )}
            </View>
          </View>
        </View>

        {/* Botão Criar evento */}
        <View className="items-center mb-4">
          <TouchableOpacity onPress={handleCreateEvent} className="bg-black px-8 py-4 rounded-md">
            <Text className="text-white font-semibold text-base">Criar evento</Text>
          </TouchableOpacity>
        </View>

        {/* Link voltar */}
        <TouchableOpacity onPress={() => navigation.navigate('AgenderPets')} className="items-center">
          <Text className="text-sm text-gray-600 underline">Voltar para a agenda</Text>
        </TouchableOpacity>

        {/* Menu inferior */}
        <View className="absolute bottom-0 left-0 right-0 flex-row justify-around items-center py-6 border-t border-gray-200 bg-white">
          <TouchableOpacity onPress={() => navigation.navigate('Home')} className="items-center">
            <MaterialIcons name="home-filled" size={28} color="gray" />
          </TouchableOpacity>
          <TouchableOpacity onPress={() => navigation.navigate('AgenderPets')} className="items-center">
            <Ionicons name="calendar-sharp" size={24} color="black" />
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

