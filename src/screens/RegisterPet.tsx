import { SafeAreaView } from 'react-native-safe-area-context';
import { Text, View, Image, TouchableOpacity, ScrollView, TextInput, Alert } from "react-native";
import { Ionicons, MaterialIcons, FontAwesome5, FontAwesome6 } from '@expo/vector-icons';
import { Stack } from "expo-router";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { RootStackParamList } from "../navigation/types/types";
import React, { useState, useEffect } from 'react';
import * as ImagePicker from 'expo-image-picker';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Picker } from '@react-native-picker/picker';

type Props = NativeStackScreenProps<RootStackParamList, 'RegisterPet'>;

export default function RegisterPet({ navigation }: Props) {
    const [nome, setNome] = useState('');
    const [dataNascimento, setDataNascimento] = useState('');
    const [tipo, setTipo] = useState('');
    const [cor, setCor] = useState('');
    const [peso, setPeso] = useState('');
    const [raca, setRaca] = useState('');
    const [sexo, setSexo] = useState('');
    const [imagem, setImagem] = useState('');
    const [userId, setUserId] = useState<number | null>(null);

    useEffect(() => {
        const carregarUsuario = async () => {
            const id = await AsyncStorage.getItem("id_usuario");
            if (id) setUserId(Number(id));
        };
        carregarUsuario();
    }, []);

    const escolherImagem = async () => {
        const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
        if (status !== 'granted') {
            Alert.alert('Permissão necessária', 'Precisamos de acesso à galeria para escolher a foto do pet.');
            return;
        }

        const result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            aspect: [1, 1],
            quality: 1,
        });

        if (!result.canceled) {
            setImagem(result.assets[0].uri);
        }
    };

    const salvarPet = async () => {
        if (!userId) {
            Alert.alert('Erro', 'Usuário não autenticado. Faça login novamente.');
            return;
        }

        if (!nome || !dataNascimento || !tipo || !raca || !sexo) {
            Alert.alert(
                "Ei! Faltou coisa 😅",
                "Para cadastrar seu pet, complete os campos:\n\n- Nome\n- Tipo\n- Data de nascimento\n- Raça\n- Sexo"
            );
            return;
        }

        const regexData = /^\d{4}-\d{2}-\d{2}$/;
        if (!regexData.test(dataNascimento)) {
            Alert.alert("Formato inválido", "A data de nascimento deve estar no formato YYYY-MM-DD.");
            return;
        }

        try {
            const formData = new FormData();

            const pet = {
                nome,
                dataNasc: dataNascimento.trim().split(" ")[0],
                tipo,
                cor,
                peso: peso ? parseFloat(peso) : undefined,
                raca,
                sexo,
                id_usuario: userId,
            };

            formData.append('pet', JSON.stringify(pet));

            if (imagem) {
                const fileName = imagem.split('/').pop() || 'foto.jpg';
                const fileType = fileName.endsWith('.png') ? 'image/png' : 'image/jpeg';

                formData.append('foto_perfil', {
                    uri: imagem,
                    name: fileName,
                    type: fileType,
                } as any);
            }

            const response = await fetch('https://petto-api.onrender.com/pets/', {
                method: 'POST',
                body: formData,
            });

            if (!response.ok) {
                const errorText = await response.text();
                console.error('Erro da API:', errorText);
                Alert.alert('Erro', 'Erro ao cadastrar pet.');
                return;
            }

            const data = await response.json();
            console.log('Pet cadastrado com sucesso:', data);
            navigation.navigate('Home');

        } catch (error) {
            console.error('Erro ao salvar o pet:', error);
            Alert.alert('Erro', 'Erro ao salvar o pet.');
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

                <ScrollView contentContainerStyle={{ paddingBottom: 300 }} className="flex-1 px-4">
                    <View className='mb-6'>
                        <TouchableOpacity
                            onPress={() => navigation.navigate('Home')}
                            className="flex-row items-center mt-3 mb-3"
                        >
                            <Ionicons name="chevron-back-outline" size={24} color="black" />
                            <Text className="text-2xl font-semibold ml-2">Cadastre um pet!</Text>
                        </TouchableOpacity>
                    </View>

                    {/* Imagem */}
                    <TouchableOpacity
                        className="w-32 h-32 bg-gray-100 rounded-xl justify-center items-center self-center mb-6 shadow"
                        onPress={escolherImagem}
                    >
                        {imagem ? (
                            <Image source={{ uri: imagem }} className="w-32 h-32 rounded-xl" />
                        ) : (
                            <Text className="text-gray-500 text-sm">Inserir foto</Text>
                        )}
                    </TouchableOpacity>

                    {/* Campos */}
                    <TextInput
                        className="h-11 bg-gray-100 w-80 self-center rounded-md px-3 mb-3 shadow-sm"
                        placeholder="Nome do Pet"
                        placeholderTextColor="#999"
                        value={nome}
                        onChangeText={setNome}
                    />
                    <TextInput
                        className="h-11 bg-gray-100 w-80 self-center rounded-md px-3 mb-3 shadow-sm"
                        placeholder="Data de Nascimento (YYYY-MM-DD)"
                        placeholderTextColor="#999"
                        value={dataNascimento}
                        onChangeText={setDataNascimento}
                    />

                    {/* Tipo */}
                    <View className="h-11 bg-gray-100 w-80 self-center rounded-md px-1 mb-3 shadow-sm justify-center">
                        <Picker
                            selectedValue={tipo}
                            onValueChange={(itemValue) => setTipo(itemValue)}
                            style={{ color: tipo ? 'black' : '#999' }}
                        >
                            <Picker.Item label="Selecione o tipo" value="" color="#999" />
                            <Picker.Item label="Cachorro" value="Cachorro" />
                            <Picker.Item label="Gato" value="Gato" />
                            <Picker.Item label="Pássaro" value="Pássaro" />
                            <Picker.Item label="Outro" value="Outro" />
                        </Picker>
                    </View>

                    <TextInput
                        className="h-11 bg-gray-100 w-80 self-center rounded-md px-3 mb-3 shadow-sm"
                        placeholder="Cor"
                        placeholderTextColor="#999"
                        value={cor}
                        onChangeText={setCor}
                    />
                    <TextInput
                        className="h-11 bg-gray-100 w-80 self-center rounded-md px-3 mb-3 shadow-sm"
                        placeholder="Peso (kg)"
                        placeholderTextColor="#999"
                        value={peso}
                        onChangeText={setPeso}
                        keyboardType="numeric"
                    />
                    <TextInput
                        className="h-11 bg-gray-100 w-80 self-center rounded-md px-3 mb-3 shadow-sm"
                        placeholder="Raça"
                        placeholderTextColor="#999"
                        value={raca}
                        onChangeText={setRaca}
                    />

                    {/* Sexo */}
                    <View className="h-11 bg-gray-100 w-80 self-center rounded-md px-1 mb-6 shadow-sm justify-center">
                        <Picker
                            selectedValue={sexo}
                            onValueChange={(itemValue) => setSexo(itemValue)}
                            style={{ color: sexo ? 'black' : '#999' }}
                        >
                            <Picker.Item label="Selecione o sexo" value="" color="#999" />
                            <Picker.Item label="Macho" value="Macho" />
                            <Picker.Item label="Fêmea" value="Fêmea" />
                            <Picker.Item label="Indefinido" value="Indefinido" />
                        </Picker>
                    </View>

                    {/* Botão cadastrar */}
                    <TouchableOpacity onPress={salvarPet} className="bg-black py-3 w-32 self-center rounded-md items-center mb-4 mt-1">
                        <Text className="text-white font-semibold">Cadastrar Pet</Text>
                    </TouchableOpacity>

                    <TouchableOpacity onPress={() => navigation.navigate('Home')} className="items-center mb-6">
                        <Text className="text-sm text-[#828282] underline">Voltar para a página inicial</Text>
                    </TouchableOpacity>
                </ScrollView>

                {/* Menu inferior */}
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


