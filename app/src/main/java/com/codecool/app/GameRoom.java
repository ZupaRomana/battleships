package com.codecool.app;

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

    public GameRoom(String hostingPlayerSessionId, String hostPlayerName, Tactics tactics) {
        this.hostingPlayerSessionId = hostingPlayerSessionId;
        this.hostPlayerName = hostPlayerName;
        isHostPostMap = false;
        this.clientPlayerSessionId = null;
        this.clientPlayerName = null;
        isPlayerPostMap = false;
        this.tactics = tactics;
        this.id = actualId++;
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
}
