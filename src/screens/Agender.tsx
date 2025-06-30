import { useEffect, useState } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Text, View, TouchableOpacity, Image, ScrollView, Alert } from "react-native";
import { Stack } from "expo-router";
import { Calendar } from 'react-native-calendars';
import { Ionicons, MaterialIcons, FontAwesome5, FontAwesome6 } from '@expo/vector-icons';
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { RootStackParamList } from "../navigation/types/types";
import AsyncStorage from '@react-native-async-storage/async-storage';

type Props = NativeStackScreenProps<RootStackParamList, 'AgenderPets'>;

type Pet = {
  id: number;
  nome: string;
  imagem?: string | null;
};

type Event = {
  id: string;
  summary: string;
  start: { date?: string; dateTime?: string };
  description?: string;
};

export default function Agender({ navigation }: Props) {
  const [markedDates, setMarkedDates] = useState<{ [date: string]: any }>({});
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [events, setEvents] = useState<Event[]>([]);
  const [pets, setPets] = useState<Pet[]>([]);

  useEffect(() => {
    const unsubscribe = navigation.addListener("focus", async () => {
      const storedId = await AsyncStorage.getItem("id_usuario");
      if (!storedId) return;

      await fetchPets(parseInt(storedId));
      await fetchEvents();
    });

    return unsubscribe;
  }, [navigation]);

  const fetchPets = async (id_usuario: number) => {
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
      Alert.alert("Erro", "Não foi possível carregar os pets.");
    }
  };

  const fetchEvents = async () => {
    try {
      const response = await fetch("https://petto-api-externa.onrender.com/list-events");
      const data = await response.json();

      const markings: { [date: string]: any } = {};
      const formattedEvents: Event[] = [];

      data.forEach((event: any) => {
        const date = event.start?.date || event.start?.dateTime?.split("T")[0];
        if (date) {
          markings[date] = {
            marked: true,
            dotColor: 'black',
          };
          formattedEvents.push(event);
        }
      });

      setMarkedDates(markings);
      setEvents(formattedEvents);
    } catch (error) {
      console.error("Erro ao buscar eventos:", error);
      Alert.alert("Erro", "Não foi possível carregar os eventos.");
    }
  };

  const getPetById = (id: number): Pet | undefined => {
    return pets.find((p) => p.id === id);
  };

  const renderEventsForSelectedDate = () => {
    if (!selectedDate) return null;

    const filteredEvents = events.filter(event => {
      const eventDate = event.start?.date || event.start?.dateTime?.split("T")[0];
      return eventDate === selectedDate;
    });

    if (filteredEvents.length === 0) {
      return <Text className="text-center text-gray-500 mt-4">Nenhum evento para esta data</Text>;
    }

    return filteredEvents.map((event) => {
      const match = event.description?.match(/pet id (\d+)/i); // <- usa regex flexível
      const petId = match ? parseInt(match[1]) : null;
      const pet = petId ? getPetById(petId) : null;

      return (
        <View key={event.id} className="flex-row items-center bg-gray-100 rounded-2xl p-3 mx-4 my-2 shadow-md">
          {pet?.imagem ? (
            <Image
              source={{ uri: pet.imagem }}
              className="w-16 h-16 rounded-full mr-4"
            />
          ) : (
            <View className="w-16 h-16 rounded-full bg-gray-300 mr-4" />
          )}
          <View className="flex-1">
            <Text className="text-lg font-semibold">{pet?.nome || 'Pet não encontrado'}</Text>
            <Text className="text-gray-600">{event.summary}</Text>
          </View>
        </View>
      );
    });
  };

  return (
    <SafeAreaView className="flex-1 bg-white">
      <View className="flex-1 bg-white relative">
        <Stack.Screen options={{ headerShown: false }} />

        {/* Cabeçalho */}
        <View className="w-full bg-gray-100 py-4 items-center">
          <Image
            source={require('../../assets/images/nome-Petto-semfundoepata.png')}
            className="w-40 h-12"
            resizeMode="contain"
          />
        </View>

        {/* Título */}
        <View className="pl-5 mb-3 mt-3">
          <View className="flex-row items-center">
            <Text className="text-2xl font-semibold mr-2">Agenda</Text>
            <Ionicons name="chevron-forward-outline" size={18} color="black" />
          </View>
        </View>

        {/* Calendário */}
        <View className="px-4">
          <Calendar
            markedDates={{
              ...markedDates,
              ...(selectedDate
                ? {
                    [selectedDate]: {
                      selected: true,
                      selectedColor: 'black',
                      selectedTextColor: 'white',
                      ...markedDates[selectedDate],
                    },
                  }
                : {}),
            }}
            onDayPress={(day) => {
              setSelectedDate(day.dateString);
            }}
            theme={{
              selectedDayBackgroundColor: '#000',
              selectedDayTextColor: '#fff',
              todayTextColor: '#000',
              arrowColor: '#000',
              textDayFontWeight: '500',
              textMonthFontWeight: 'bold',
              textDayFontSize: 16,
              textMonthFontSize: 18,
            }}
          />
        </View>

        {/* Eventos */}
        <ScrollView className="mt-4 mb-24">{renderEventsForSelectedDate()}</ScrollView>

        {/* Botão flutuante */}
        <TouchableOpacity
          onPress={() => navigation.navigate('CreateEvent')}
          className="absolute bottom-24 right-5 w-16 h-16 bg-black rounded-full items-center justify-center shadow-lg"
        >
          <Text className="text-white text-5xl">+</Text>
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



