package com.codecool.app;

public class GameRoom {

    private String hostingPlayerSessionId;
    private String hostPlayerName;
    private boolean isHostReady;

    private String clientPlayerSessionId;
    private String clientPlayerName;
    private boolean isPlayerReady;

    private Tactics tactics;

    private static int actualId = 0;
    private int id;

    public GameRoom(String hostingPlayerSessionId, String hostPlayerName, Tactics tactics) {
        this.hostingPlayerSessionId = hostingPlayerSessionId;
        this.hostPlayerName = hostPlayerName;
        isHostReady = false;
        this.clientPlayerSessionId = null;
        this.clientPlayerName = null;
        isPlayerReady = false;
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

    public boolean getIsHostReady() {
        return isHostReady;
    }

    public void setHostReady(boolean hostReady) {
        this.isHostReady = hostReady;
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

    public boolean getIsPlayerReady() {
        return isPlayerReady;
    }

    public void setPlayerReady(boolean playerReady) {
        this.isPlayerReady = playerReady;
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

    public boolean isPlayerPostMap(String sessionId) {
        return tactics.contains(sessionId);
    }
}
