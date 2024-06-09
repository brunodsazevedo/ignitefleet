import { useState } from 'react'
import { GoogleSignin } from '@react-native-google-signin/google-signin'

import { Button } from '@/components/Button'

import { Container, Slogan, Title } from './styles'

import BackgroundImg from '@/assets/background.png'
import { Alert } from 'react-native'

GoogleSignin.configure({
  scopes: ['email', 'profile'],
  webClientId: process.env.EXPO_PUBLIC_WEB_CLIENT_ID,
  iosClientId: process.env.EXPO_PUBLIC_IOS_CLIENT_ID,
})

export function SignIn() {
  const [isAuthenticating, setIsAuthenticating] = useState(false)

  async function handleGoogleSignIn() {
    try {
      setIsAuthenticating(true)

      const { idToken } = await GoogleSignin.signIn()
      if (idToken) {
        Alert.alert('Não foi possível conectar-se a sua conta Google.')
      } else {
        Alert.alert('Não foi possível conectar-se a sua conta Google.')
        setIsAuthenticating(false)
      }
    } catch (error) {
      console.log(error)
      setIsAuthenticating(false)

      Alert.alert('Não foi possível conectar-se a sua conta Google.')
    }
  }

  return (
    <Container source={BackgroundImg}>
      <Title>Ignite Fleet</Title>

      <Slogan>Gestão de uso de veículos</Slogan>

      <Button
        title="Entrar com Google"
        isLoading={isAuthenticating}
        onPress={handleGoogleSignIn}
      />
    </Container>
  )
}
