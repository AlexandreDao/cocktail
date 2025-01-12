import { Stack } from 'expo-router'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { useReactQueryDevTools } from '@dev-plugins/react-query'
import { Provider } from 'react-redux'
import { setupStore } from '@/store'
import { PersistGate } from 'redux-persist/integration/react'
import { GestureHandlerRootView } from 'react-native-gesture-handler'
import CocktailDetail, { DetailsRef } from '@/app/details'
import { BottomSheetModalProvider } from '@gorhom/bottom-sheet'
import DetailsBottomSheetProvider from '@/contexts/detailsBottomSheet/DetailsBottomSheetProvider'
import { useRef } from 'react'
import { persistStore } from 'redux-persist'
import { SafeAreaProvider } from 'react-native-safe-area-context'
import { StatusBar } from 'expo-status-bar'
import { BACKGROUND_COLOR } from '@/constants/colors'

const queryClient = new QueryClient()
const store = setupStore()
const persistor = persistStore(store)

export default function RootLayout() {
  useReactQueryDevTools(queryClient)

  const detailsBottomSheetRef = useRef<DetailsRef>(null)

  return (
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <QueryClientProvider client={queryClient}>
          <GestureHandlerRootView>
            <BottomSheetModalProvider>
              <DetailsBottomSheetProvider detailsBottomSheetRef={detailsBottomSheetRef}>
                <SafeAreaProvider>
                  <>
                    <Stack>
                      <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
                    </Stack>
                    <StatusBar translucent={false} backgroundColor={BACKGROUND_COLOR} style="light" />
                  </>
                </SafeAreaProvider>
                <CocktailDetail ref={detailsBottomSheetRef} />
              </DetailsBottomSheetProvider>
            </BottomSheetModalProvider>
          </GestureHandlerRootView>
        </QueryClientProvider>
      </PersistGate>
    </Provider>
  )
}
