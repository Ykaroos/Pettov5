import { createNativeStackNavigator } from '@react-navigation/native-stack';
import React from 'react';
import Agender from '../screens/Agender';
import Diary from '../screens/Diary';
import Health from '../screens/Health';
import HomeScreen from '../screens/HomeScreen';
import RegisterPet from '../screens/RegisterPet';
import User from '../screens/User';
import EditUser from '../screens/EditUser';
import EditPet from '../screens/EditPet';
import RemovePet from '../screens/RemovePet';
import Suport from '../screens/Suport';
import PetEditForm from '../screens/PetEditForm'
import DiaryPetSelected from '../screens/DiaryPetSelected'
import HealthPetSelected from '../screens/HealthPetSelected';
import LoginScreen from '../screens/LoginScreen';
import RegisterUser from '../screens/RegisterUser';
import Password from '../screens/Password';
import NewPassword from '../screens/NewPassword';
import CreateEvent from '../screens/CreateEvent';

import { RootStackParamList } from './types/types';

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function AppRoutes() {
  return (
    <Stack.Navigator initialRouteName="LoginScreen">
      <Stack.Screen name="Home" component={HomeScreen} />
      <Stack.Screen name="RegisterPet" component={RegisterPet} />
      <Stack.Screen name="DiaryPets" component={Diary} />
      <Stack.Screen name="HealthPets" component={Health} />
      <Stack.Screen name="AgenderPets" component={Agender} />
      <Stack.Screen name="User" component={User} />
      <Stack.Screen name="UserEdit" component={EditUser} />
      <Stack.Screen name="PetEdit" component={EditPet} />
      <Stack.Screen name="PetRemove" component={RemovePet} />
      <Stack.Screen name="Suport" component={Suport} />
      <Stack.Screen name="PetEditForm" component={PetEditForm} />
      <Stack.Screen name="DiaryPetSelected" component={DiaryPetSelected} />
      <Stack.Screen name="HealthPetSelected" component={HealthPetSelected} />
      <Stack.Screen name="LoginScreen" component={LoginScreen} />
      <Stack.Screen name="RegisterUser" component={RegisterUser} />
      <Stack.Screen name="Password" component={Password} />
      <Stack.Screen name="NewPassword" component={NewPassword} />
      <Stack.Screen name="CreateEvent" component={CreateEvent} />
    </Stack.Navigator>
  );
}
