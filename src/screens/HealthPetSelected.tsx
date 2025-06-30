import { SafeAreaView } from 'react-native-safe-area-context';
import { Text, View, TouchableOpacity, TextInput, ScrollView, Image, Alert, Platform, KeyboardAvoidingView } from 'react-native';
import { Stack } from 'expo-router';
import { Ionicons, MaterialIcons, FontAwesome5, FontAwesome6 } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useEffect, useState } from 'react';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/types/types';

type Props = NativeStackScreenProps<RootStackParamList, 'HealthPetSelected'>;

type Pet = {
  id: number;
  nome: string;
  imagemUri?: string;
  tipo?: string;
};

type HealthData = {
  medicamentos: string;
  vacinas: string;
  doencas: string;
};

export default function HealthPetSelected({ navigation, route }: Props) {
  const { petId } = route.params;
  const [pet, setPet] = useState<Pet | null>(null);
  const [healthData, setHealthData] = useState<HealthData>({
    medicamentos: '',
    vacinas: '',
    doencas: '',
  });

  useEffect(() => {
    const fetchData = async () => {
      const storedPets = await AsyncStorage.getItem('@pets');
      if (storedPets) {
        const parsedPets: Pet[] = JSON.parse(storedPets);
        const selectedPet = parsedPets.find((p) => p.id === petId);
        setPet(selectedPet || null);
      }

      try {
        const response = await fetch(`https://petto-api.onrender.com/medical/pet/${petId}`);
        if (!response.ok) throw new Error('Erro ao buscar dados de saúde');
        const data = await response.json();
        setHealthData({
          medicamentos: data.medicamentos,
          vacinas: data.vacinas,
          doencas: data.doencas,
        });
      } catch (error) {
        console.error('Erro ao buscar dados:', error);
      }
    };

    const unsubscribe = navigation.addListener('focus', fetchData);
    return unsubscribe;
  }, [navigation, petId]);

  const handleChange = (field: keyof HealthData, value: string) => {
    setHealthData((prev) => ({ ...prev, [field]: value }));
  };

  const saveData = async (field: keyof HealthData) => {
    const body = { [field]: healthData[field] };

    try {
      const response = await fetch(`https://petto-api.onrender.com/medical/pet/${petId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });

      if (!response.ok) throw new Error('Erro ao salvar dados');
      const updated = await response.json();
      setHealthData({
        medicamentos: updated.medicamentos,
        vacinas: updated.vacinas,
        doencas: updated.doencas,
      });
      Alert.alert('Sucesso', `${field} salvo com sucesso!`);
    } catch (err) {
      console.error(err);
      Alert.alert('Erro', 'Erro ao salvar os dados.');
    }
  };

  const renderSection = (
    label: string,
    field: keyof HealthData,
    emoji: string
  ) => (
    <View className="mb-6">
      <View className="bg-[#F1F1F1] p-4 rounded-lg shadow-sm mb-3">
        <Text className="text-lg font-semibold mb-2">
          {emoji} {label}:
        </Text>
        <TextInput
          multiline
          value={healthData[field]}
          onChangeText={(text) => handleChange(field, text)}
          placeholder={`Digite ${label.toLowerCase()}`}
          className="bg-white rounded p-2 text-base text-black min-h-[80px]"
          textAlignVertical="top"
        />
        <TouchableOpacity
          onPress={() => saveData(field)}
          className="mt-2 bg-black py-2 px-6 rounded self-center"
        >
          <Text className="text-white text-base font-semibold">Salvar</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  const capitalizarPrimeiraLetra = (texto: string): string => {
    if (!texto) return '';
    return texto.charAt(0).toUpperCase() + texto.slice(1).toLowerCase();
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
          <TouchableOpacity onPress={() => navigation.navigate('HealthPets')}>
            <View className="flex-row items-center mt-3 mb-2">
              <Ionicons name="chevron-back-outline" size={20} color="black" />
              <Text className="text-2xl font-semibold ml-2">
                Área da saúde - {pet ? capitalizarPrimeiraLetra(pet.nome) : ''}
              </Text>
            </View>
          </TouchableOpacity>
        </View>

        {/* Conteúdo */}
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : undefined}
          className="flex-1"
        >
          <ScrollView contentContainerStyle={{ paddingBottom: 300 }} className="px-4 space-y-2">
            {renderSection('Medicamentos', 'medicamentos', '🧪')}
            {renderSection('Vacinas', 'vacinas', '💉')}
            {renderSection('Doenças', 'doencas', '❤️')}
          </ScrollView>
        </KeyboardAvoidingView>

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
            <FontAwesome5 name="notes-medical" size={24} color="black" />
          </TouchableOpacity>
          <TouchableOpacity onPress={() => navigation.navigate('User')} className="items-center">
            <FontAwesome6 name="user-large" size={24} color="gray" />
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
}
