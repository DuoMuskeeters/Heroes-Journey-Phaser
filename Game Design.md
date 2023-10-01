# Game Design

## Scene Design

### Preload Scene

| Description             |
| ----------------------- |
| 🗃 Asset loading scene  |

### Menu Scene

| Description                                                   |
| ------------------------------------------------------------- |
| ⏳ Start Singleplayer session or join/create multiplayer room |

### Singleplayer Scene

| Description                             |
| --------------------------------------- |
| 🎮 The default gameplay (MainScene.ts) |

### Multiplayer Scene

| Description                            |
| -------------------------------------- |
| ⚔ Server Side Physics&State gameplay   |

## Room Design

| Room   | Scene                                   | PlayerCount |
| ------ | --------------------------------------  | ----------- |
| Room1  | [Multiplayer Scene](#multiplayer-scene) | 3           |
| Room2  | [Multiplayer Scene](#multiplayer-scene) | 4           |
| Room3  | [Multiplayer Scene](#multiplayer-scene) | 1           |
| Room4  | [Multiplayer Scene](#multiplayer-scene) | 2           |
| ....   | ...                                     | ...         |
| Room99 | [Multiplayer Scene](#multiplayer-scene) | 1           |
