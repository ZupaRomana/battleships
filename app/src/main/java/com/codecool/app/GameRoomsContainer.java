package com.codecool.app;

import java.util.ArrayList;
import java.util.List;

public class GameRoomsContainer {
    private static GameRoomsContainer instance;
    private List<GameRoom> rooms;

    private GameRoomsContainer() {
        rooms = new ArrayList<GameRoom>();
    }

    public static GameRoomsContainer getInstance() {
        if (instance == null) {
            instance = new GameRoomsContainer();
        }

        return instance;
    }

    public void add(GameRoom gameRoom) {
        rooms.add(gameRoom);
    }

    public GameRoom get(int index) {
        return rooms.get(index);
    }

    public GameRoom get(String sessionId) {
        for (GameRoom gameRoom: this.rooms) {
            if (gameRoom.getHostingPlayerSessionId().equals(sessionId) ||
                gameRoom.getClientPlayerSessionId().equals(sessionId)) {

                return gameRoom;
            }
        }
        return null;
    }

    public void remove(int index) {
        rooms.remove(index);
    }

    public int getSize() { return rooms.size(); }

    public List<GameRoom> getAll() { return rooms; }

    public String toString() {
        StringBuilder stringBuilder = new StringBuilder();
        for (GameRoom room : rooms) {
//            stringBuilder.append("#").append(room.getId()).append(" host Nickname: ").append(room.getHostPlayerName()).append(" SessionId: ").append(room.getHostingPlayerSessionId()).append(" client Nickname: ").append(room.getClientPlayerName()).append(" SessionId: ").append(room.getClientPlayerSessionId()).append("\n");
            stringBuilder.append("#").append(room.getId()).append("#").append(room.getHostPlayerName()).append("#").append(room.getHostingPlayerSessionId()).append("#").append(room.getClientPlayerName()).append("#").append(room.getClientPlayerSessionId()).append("$");
        }
        return stringBuilder.toString();
    }
}
