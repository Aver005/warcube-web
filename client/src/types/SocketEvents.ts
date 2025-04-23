export enum SocketEvent {
  CONNECT = 'connect',
  INIT = 'init',
  NEW_PLAYER = 'newPlayer',
  PLAYER_DISCONNECTED = 'playerDisconnected',
  PLAYER_MOVED = 'playerMoved',
  PLAYER_SHOOT = 'playerShoot',
  PLAYER_RELOAD = 'playerReload',
  PLAYER_RELOAD_COMPLETE = 'playerReloadComplete',
  PLAYER_DEAD = 'playerDead',
  PLAYER_PICKUP_ITEM = 'playerPickupItem',
  DISCONNECT = 'disconnect',
  PLAYER_MOVEMENT = 'playerMovement'
}
