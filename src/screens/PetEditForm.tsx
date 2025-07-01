import { FontAwesome5, FontAwesome6, Ionicons, MaterialIcons } from '@expo/vector-icons';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import * as ImagePicker from 'expo-image-picker';
import { Stack } from 'expo-router';
import { useEffect, useState } from 'react';
import { Image, ScrollView, Text, TextInput, TouchableOpacity, View, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { RootStackParamList } from '../navigation/types/types';
import { Picker } from '@react-native-picker/picker';

type Props = NativeStackScreenProps<RootStackParamList, 'PetEditForm'>;

export default function PetEditForm({ navigation, route }: Props) {
  const { id } = route.params;

  const [nome, setNome] = useState('');
  const [tipo, setTipo] = useState('');
  const [cor, setCor] = useState('');
  const [peso, setPeso] = useState('');
  const [raca, setRaca] = useState('');
  const [sexo, setSexo] = useState('');
  const [dataNasc, setDataNasc] = useState('');
  const [imagem, setImagem] = useState('');
  const [imagemSelecionada, setImagemSelecionada] = useState(false);

  const tiposValidos = ['Cachorro', 'Gato', 'Pássaro', 'Outro'];
  const sexosValidos = ['Macho', 'Fêmea', 'Indefinido'];

  useEffect(() => {
    const fetchPet = async () => {
      try {
        const response = await fetch(`https://petto-api.onrender.com/pets/${id}`);
        const data = await response.json();
        setNome(data.nome || '');
        setTipo(data.tipo || '');
        setCor(data.cor || '');
        setPeso(data.peso?.toString() || '');
        setRaca(data.raca || '');
        setSexo(data.sexo || '');
        setDataNasc(data.dataNasc || '');
        if (data.foto?.foto) {
          setImagem(`data:${data.foto.tipo_arquivo};base64,${data.foto.foto}`);
        }
      } catch (error) {
        Alert.alert('Erro', 'Não foi possível carregar os dados do pet.');
      }
    };
    fetchPet();
  }, [id]);

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
      setImagemSelecionada(true);
    }
  };

  const validarData = (dataStr: string) => {
    return /^\d{4}-\d{2}-\d{2}$/.test(dataStr);
  };

  const handleSave = async () => {
    if (!nome.trim() || !tipo.trim() || !raca.trim() || !sexo.trim() || !dataNasc.trim()) {
      Alert.alert(
        'Campos obrigatórios',
        'Preencha os campos: Nome, Tipo, Raça, Sexo e Data de Nascimento.'
      );
      return;
    }

    if (!validarData(dataNasc.trim())) {
      Alert.alert('Data inválida', 'A data de nascimento deve estar no formato YYYY-MM-DD.');
      return;
    }

    if (!tiposValidos.includes(tipo.trim())) {
      Alert.alert('Tipo inválido', `O tipo deve ser um dos seguintes: ${tiposValidos.join(', ')}`);
      return;
    }

    if (!sexosValidos.includes(sexo.trim())) {
      Alert.alert('Sexo inválido', `O sexo deve ser um dos seguintes: ${sexosValidos.join(', ')}`);
      return;
    }

    try {
      const petUpdate = {
        nome,
        tipo,
        cor,
        peso,
        raca,
        sexo,
        dataNasc,
      };

      await fetch(`https://petto-api.onrender.com/pets/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(petUpdate),
      });

      if (imagemSelecionada) {
        const formData = new FormData();
        formData.append('file', {
          uri: imagem,
          name: 'pet.jpg',
          type: 'image/jpeg',
        } as any);

        await fetch(`https://petto-api.onrender.com/pets/${id}/foto`, {
          method: 'POST',
          body: formData,
        });
      }

      Alert.alert('Sucesso', 'Dados atualizados com sucesso!');
      navigation.navigate('User');
    } catch (error) {
      Alert.alert('Erro', 'Não foi possível salvar as alterações.');
    }
  };

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <View className="flex-1 bg-white">
        <Stack.Screen options={{ headerShown: false }} />

        <View className="w-full bg-[#F5F5F5] py-4 items-center">
          <Image
            source={require('../../assets/images/nome-Petto-semfundoepata.png')}
            className="w-40 h-12"
            resizeMode="contain"
          />
        </View>

        <View className="mb-6 pl-5">
          <TouchableOpacity onPress={() => navigation.navigate('PetEdit')}>
            <View className="flex-row items-center mt-3 mb-3">
              <Ionicons name="chevron-back-outline" size={18} color="black" />
              <Text className="text-2xl font-semibold ml-2">Editar pet</Text>
            </View>
          </TouchableOpacity>
        </View>

        <ScrollView contentContainerStyle={{ paddingBottom: 300, alignItems: 'center' }} className="px-6 pb-24">
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

          <TextInput
            placeholder="Novo nome do Pet"
            value={nome}
            onChangeText={setNome}
            className="w-full bg-gray-100 rounded-xl px-5 py-3 text-gray-800 text-base mb-2"
          />

          <TextInput
            placeholder="Nova data de Nascimento (YYYY-MM-DD)"
            value={dataNasc}
            onChangeText={setDataNasc}
            className="w-full bg-gray-100 rounded-xl px-5 py-3 text-gray-800 text-base mb-2"
          />

          <View className="w-full bg-gray-100 rounded-xl mb-2">
            <Picker
              selectedValue={tipo || undefined}
              onValueChange={(itemValue) => setTipo(itemValue)}
              style={{ height: 50, color: tipo ? 'black' : '#999', paddingHorizontal: 12 }}
            >
              <Picker.Item label="Selecionar tipo" value="" color="#999" />
              {['Cachorro', 'Gato', 'Pássaro', 'Outro'].map((item) => (
                <Picker.Item key={item} label={item} value={item} />
              ))}
            </Picker>
          </View>

          <TextInput
            placeholder="Nova cor"
            value={cor}
            onChangeText={setCor}
            className="w-full bg-gray-100 rounded-xl px-5 py-3 text-gray-800 text-base mb-2"
          />

          <TextInput
            placeholder="Novo peso"
            value={peso}
            onChangeText={setPeso}
            keyboardType="numeric"
            className="w-full bg-gray-100 rounded-xl px-5 py-3 text-gray-800 text-base mb-2"
          />

          <TextInput
            placeholder="Nova raça"
            value={raca}
            onChangeText={setRaca}
            className="w-full bg-gray-100 rounded-xl px-5 py-3 text-gray-800 text-base mb-2"
          />

          <View className="w-full bg-gray-100 rounded-xl mb-2">
            <Picker
              selectedValue={sexo || undefined}
              onValueChange={(itemValue) => setSexo(itemValue)}
              style={{ height: 50, color: sexo ? 'black' : '#999', paddingHorizontal: 12 }}
            >
              <Picker.Item label="Selecionar sexo" value="" color="#999" />
              {['Macho', 'Fêmea', 'Indefinido'].map((item) => (
                <Picker.Item key={item} label={item} value={item} />
              ))}
            </Picker>
          </View>

          <TouchableOpacity
            onPress={handleSave}
            className="bg-black py-3 w-32 self-center rounded-md items-center mb-4 mt-1"
          >
            <Text className="text-white font-semibold text-center text-base">Salvar alterações</Text>
          </TouchableOpacity>

          <TouchableOpacity onPress={() => navigation.navigate('User')} className="items-center mb-6">
            <Text className="text-sm text-[#828282] underline">Voltar para a tela de usuário</Text>
          </TouchableOpacity>
        </ScrollView>

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
