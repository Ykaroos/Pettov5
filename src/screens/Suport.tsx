import { SafeAreaView } from 'react-native-safe-area-context';
import { Text, View, TouchableOpacity, Image, Linking, Alert } from "react-native";
import { Stack } from "expo-router";
import { Ionicons, Feather, MaterialIcons, FontAwesome5, FontAwesome6 } from '@expo/vector-icons';
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { RootStackParamList } from "../navigation/types/types";

type Props = NativeStackScreenProps<RootStackParamList, 'Suport'>;

export default function Suport({ navigation }: Props) {
  const handleEmailPress = async () => {
    try {
      const emailUrl = 'mailto:petto@gmail.com';
      await Linking.openURL(emailUrl);
    } catch (error) {
      Alert.alert('Erro', 'Não foi possível abrir o aplicativo de e-mail');
    }
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

        {/* Voltar e título */}
        <View className='mb-6 pl-5 px-5'>
          <TouchableOpacity onPress={() => navigation.navigate('User')} className="flex-row items-center mt-3 mb-3">
            <Ionicons name="chevron-back-outline" size={24} color="black" />
            <Text className="text-2xl font-semibold ml-2">Suporte</Text>
          </TouchableOpacity>
        </View>

        {/* Conteúdo principal */}
        <View className="flex-1 items-center px-5">
          {/* Imagem */}
          <Image
            source={require('../../assets/images/equipe.png')}
            className="w-full h-72 rounded-xl mb-5"
            resizeMode="cover"
          />

          {/* Informações de contato */}
          <View className="w-full bg-gray-100 rounded-xl p-5 items-center">
            {/* Email */}
            <TouchableOpacity
              onPress={handleEmailPress}
              className="w-full items-center mb-4"
            >
              <View className="flex-row items-center justify-center">
                <Feather name="mail" size={20} color="#2d59b9" />
                <Text className="ml-2 text-base text-[#2d59b9] underline">petto@gmail.com</Text>
              </View>
            </TouchableOpacity>

            {/* Telefone */}
            <View className="w-full items-center mb-4">
              <View className="flex-row items-center justify-center">
                <Feather name="phone" size={20} color="black" />
                <Text className="ml-2 text-base text-black">+55 (88) 9002-8922</Text>
              </View>
            </View>

            {/* Instagram */}
            <View className="flex-row items-center justify-center">
              <FontAwesome5 name="instagram" size={20} color="black" />
              <Text className="ml-2 text-base">@petto on Instagram</Text>
            </View>
          </View>
        </View>

        {/* Menu de navegação inferior */}
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

          <TouchableOpacity onPress={() => navigation.navigate('User')} className="items-center" >
            <FontAwesome6 name="user-large" size={24} color="black" />
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
}
