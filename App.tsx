import { StatusBar } from 'react-native'
import { ThemeProvider } from 'styled-components/native'
import {
  useFonts,
  Roboto_400Regular,
  Roboto_700Bold,
} from '@expo-google-fonts/roboto'

import { SignIn } from '@/screens/SignIn'

import theme from '@/theme'
import { Loading } from '@/components/Loading'

export default function App() {
  const [fontsLoaded] = useFonts({
    Roboto_400Regular,
    Roboto_700Bold,
  })

  if (!fontsLoaded) {
    return <Loading />
  }

  return (
    <ThemeProvider theme={theme}>
      <StatusBar
        barStyle="light-content"
        backgroundColor="transparent"
        translucent
      />

      <SignIn />
    </ThemeProvider>
  )
}
