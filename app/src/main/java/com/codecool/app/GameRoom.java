package com.codecool.app;

import java.util.ArrayList;
import java.util.List;

public class GameRoom {

    private String hostingPlayerSessionId;
    private String hostPlayerName;
    private boolean isHostPostMap;

    private String clientPlayerSessionId;
    private String clientPlayerName;
    private boolean isPlayerPostMap;

    private Tactics tactics;

    private static int actualId = 0;
    private int id;

    private List<String> gameState;
    private String lastPostSessionId;
    private String lastGetSessionId;

    public GameRoom(String hostingPlayerSessionId, String hostPlayerName, Tactics tactics) {
        this.hostingPlayerSessionId = hostingPlayerSessionId;
        this.hostPlayerName = hostPlayerName;
        isHostPostMap = false;
        this.clientPlayerSessionId = null;
        this.clientPlayerName = null;
        isPlayerPostMap = false;
        this.tactics = tactics;
        this.id = actualId++;
        gameState = new ArrayList<>();
        this.lastPostSessionId = null;
        this.lastGetSessionId = null;
    }

    public String getHostingPlayerSessionId() {
        return hostingPlayerSessionId;
    }

    public void setHostingPlayerSessionId(String hostingPlayerSessionId) {
        this.hostingPlayerSessionId = hostingPlayerSessionId;
    }

    public String getHostPlayerName() {
        return hostPlayerName;
    }

    public boolean getIsHostPostMap() {
        return isHostPostMap;
    }

    public void setHostPlayerName(String hostPlayerName) {
        this.hostPlayerName = hostPlayerName;
    }

    public String getClientPlayerName() {
        return clientPlayerName;
    }

    public void setClientPlayerName(String clientPlayerName) {
        this.clientPlayerName = clientPlayerName;
    }

    public String getClientPlayerSessionId() {
        return clientPlayerSessionId;
    }

    public void setClientPlayerSessionId(String clientPlayerSessionId) {
        this.clientPlayerSessionId = clientPlayerSessionId;
    }

    public boolean getIsPlayerPostMap() {
        return isPlayerPostMap;
    }

    public static int getActualId() {
        return actualId;
    }

    public int getId() {
        return id;
    }

    public Tactics getTactics() {
        return tactics;
    }

    public void updatePlayerStatus() {
        if (tactics.contains(hostingPlayerSessionId)) {
            isHostPostMap = true;
        }
        if (clientPlayerSessionId != null && tactics.contains(clientPlayerSessionId)) {
            isPlayerPostMap = true;
        }
    }

    public boolean arePlayersReady() {
        List<String> playersWithEnemyMap = tactics.getPlayersWithEnemyMap();
        return playersWithEnemyMap.contains(hostingPlayerSessionId) &&
                playersWithEnemyMap.contains(clientPlayerSessionId);
    }

    public void addGameState(String gameStateAsString) {
        gameState.add(gameStateAsString);
    }

    public String getLatestGameState() {
        return gameState.get(gameState.size() - 1);
    }

    public String getLastPostSession() {
        return lastPostSessionId;
    }

    public String getLastGetSession() {
        return lastGetSessionId;
    }

    public void setLastPostSession(String session) {
        this.lastPostSessionId = session;
    }

    public void setLastGetSession(String session) {
        this.lastGetSessionId = session;
    }
}
