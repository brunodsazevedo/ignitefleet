import { useEffect, useRef, useState } from 'react'
import { Alert, ScrollView, TextInput } from 'react-native'
import { useNavigation } from '@react-navigation/native'
import { useUser } from '@realm/react'
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
import {
  useForegroundPermissions,
  requestBackgroundPermissionsAsync,
  watchPositionAsync,
  LocationAccuracy,
  LocationSubscription,
  LocationObjectCoords,
} from 'expo-location'
import { Car } from 'phosphor-react-native'

import { Header } from '@/components/Header'
import { LicensePlateInput } from '@/components/LicensePlateInput'
import { TextAreaInput } from '@/components/TextAreaInput'
import { Button } from '@/components/Button/index'
import { Loading } from '@/components/Loading'
import { LocationInfo } from '@/components/LocationInfo'
import { Map } from '@/components/Map'

import { useRealm } from '@/libs/realm'
import { Historic } from '@/libs/realm/schemas/Historic'

import { licensePlateValidate } from '@/utils/licensePlateValidate'
import { getAddressLocation } from '@/utils/getAddressLocation'

import { Container, Content, Message } from './styles'
import { startLocationTask } from '@/tasks/backgroundLocationTask'

export function Departure() {
  const [description, setDescription] = useState('')
  const [licensePlate, setLicensePlate] = useState('')
  const [isRegistering, setIsRegistering] = useState(false)
  const [isLoadingLocation, setIsLoadingLocation] = useState(true)
  const [currentAddress, setCurrentAddress] = useState<string | null>(null)
  const [currentCoords, setCurrentCoords] =
    useState<LocationObjectCoords | null>(null)

  const descriptionRef = useRef<TextInput>(null)
  const licensePlateRef = useRef<TextInput>(null)

  const [locationForegroundPermission, requestLocationForegroundPermission] =
    useForegroundPermissions()

  const { goBack } = useNavigation()
  const realm = useRealm()
  const user = useUser()

  async function handleDepartureRegister() {
    try {
      if (!licensePlateValidate(licensePlate)) {
        licensePlateRef.current?.focus()
        return Alert.alert(
          'Placa inválida',
          'A placa é invalida. Por valor, informe a placa correta do veículo.',
        )
      }

      if (description.trim().length === 0) {
        descriptionRef.current?.focus()
        return Alert.alert(
          'Finalidade',
          'Por favor, informe a finalidade da utilização do veículo',
        )
      }

      if (!currentCoords?.latitude && !currentCoords?.longitude) {
        return Alert.alert(
          'Localização',
          'Não foi possível obter localização atual. Tente novamente!',
        )
      }

      setIsRegistering(true)

      const backgroundPermission = await requestBackgroundPermissionsAsync()

      if (!backgroundPermission.granted) {
        setIsRegistering(true)
        return Alert.alert(
          'Localização',
          'É necessário que o app tenha acesso a localização em segundo plano. Acesse as configurações do dispositivo e habilite "Permitir o tempo todo"',
        )
      }

      await startLocationTask()

      realm.write(() => {
        realm.create(
          'Historic',
          Historic.generate({
            user_id: user.id!,
            license_plate: licensePlate.toLocaleUpperCase(),
            description,
          }),
        )
      })

      Alert.alert('Saída', 'Saída do veículo registrada com sucesso!')
      goBack()
    } catch (error) {
      setIsRegistering(false)

      console.log(error)

      Alert.alert('Erro', 'Não foi possível registrar saída do veículo')
    }
  }

  useEffect(() => {
    requestLocationForegroundPermission()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useEffect(() => {
    if (!locationForegroundPermission?.granted) {
      return
    }

    let subscription: LocationSubscription

    watchPositionAsync(
      {
        accuracy: LocationAccuracy.High,
        timeInterval: 1000,
      },
      (location) => {
        setCurrentCoords(location.coords)

        getAddressLocation(location.coords)
          .then((address) => {
            if (address) {
              setCurrentAddress(address)
            }
          })
          .finally(() => setIsLoadingLocation(false))
      },
    ).then((response) => (subscription = response))

    return () => {
      if (subscription) {
        subscription.remove()
      }
    }
  }, [locationForegroundPermission])

  if (isLoadingLocation) {
    return <Loading />
  }

  if (!locationForegroundPermission?.granted) {
    return (
      <Container>
        <Header title="Saída" />

        <Message>
          Você precisa permitir que o app tenha acesso a localização para
          utilizar essa funcionalidade. Por favor acesse as configurações do seu
          dispositivo para conceder essa permissão ao app.
        </Message>
      </Container>
    )
  }

  return (
    <Container>
      <Header title="Saída" />

      <KeyboardAwareScrollView extraHeight={100}>
        <ScrollView>
          {currentCoords && <Map coordinates={[currentCoords]} />}

          <Content>
            {currentAddress && (
              <LocationInfo
                icon={Car}
                label="Localização atual"
                description={currentAddress}
              />
            )}

            <LicensePlateInput
              ref={licensePlateRef}
              label="Placa do veículo"
              placeholder="BRA1234"
              onSubmitEditing={() => descriptionRef.current?.focus()}
              returnKeyType="next"
              onChangeText={setLicensePlate}
            />

            <TextAreaInput
              ref={descriptionRef}
              label="Finalidade"
              placeholder="Vou utilizar o veículo para..."
              onSubmitEditing={handleDepartureRegister}
              returnKeyType="send"
              blurOnSubmit
              onChangeText={setDescription}
            />

            <Button
              isLoading={isRegistering}
              title="Registrar Saída"
              onPress={handleDepartureRegister}
            />
          </Content>
        </ScrollView>
      </KeyboardAwareScrollView>
    </Container>
  )
}
