import React from 'react'
import { useRoute } from '@react-navigation/native'
import { X } from 'phosphor-react-native'

import { Header } from '@/components/Header'

import {
  Container,
  Content,
  Description,
  Footer,
  Label,
  LicensePlate,
} from './styles'
import { Button } from '@/components/Button'
import { ButtonIcon } from '@/components/ButtonIcon'

type RouteParamsProps = {
  id: string
}

export function Arrival() {
  const route = useRoute()

  const { id } = route?.params as RouteParamsProps

  console.log(id)

  return (
    <Container>
      <Header title="Chegada" />

      <Content>
        <Label>Placa do veículo</Label>

        <LicensePlate>XXX0000</LicensePlate>

        <Label>Finalidade</Label>

        <Description>
          Lorem ipsum dolor sit amet consectetur adipisicing elit. Incidunt
          autem aut maiores eos harum optio, accusamus aliquam fugit sapiente,
          vero ipsa magni ad sit et voluptatum cumque laboriosam, quos placeat?
        </Description>

        <Footer>
          <ButtonIcon icon={X} />

          <Button title="Registrar chegada" />
        </Footer>
      </Content>
    </Container>
  )
}
