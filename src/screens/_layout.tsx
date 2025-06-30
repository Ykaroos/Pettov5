import { Stack } from "expo-router";
import "../../global.css";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";

export default function RootLayout() {
  return (
    <SafeAreaProvider>
      <SafeAreaView >
        <Stack
          screenOptions={{
            contentStyle: { backgroundColor: 'white' }, // Cor de fundo padrão
            animation: 'fade', // Animação suave entre telas
          }}
        >
          <Stack.Screen 
            name="HomeScreen" 
            options={{ 
              headerShown: false,
              // Configurações adicionais se necessário
            }} 
          />
          {/* Adicione outras telas aqui conforme necessário */}
        </Stack>
      </SafeAreaView>
    </SafeAreaProvider>
  );
}