/* eslint-disable @typescript-eslint/no-explicit-any */
import { createRealmContext } from '@realm/react'
import { OpenRealmBehaviorType } from 'realm'

import { Historic } from './schemas/Historic'
import { Coords } from './schemas/Coords'

const realmAccessBehavior: Realm.OpenRealmBehaviorConfiguration = {
  type: OpenRealmBehaviorType.OpenImmediately,
}

export const syncConfig: any = {
  flexible: true,
  newRealmFileBehavior: realmAccessBehavior,
}

export const { RealmProvider, useRealm, useQuery, useObject } =
  createRealmContext({
    schema: [Historic, Coords],
    schemaVersion: 1,
  })
