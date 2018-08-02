package com.codecool.app;

public class GameRoom {

    private String hostingPlayerSessionId;
    private String hostPlayerName;
    private String clientPlayerSessionId;
    private String clientPlayerName;

    private static int actualId = 0;
    private int id;

    public GameRoom(String hostingPlayerSessionId, String hostPlayerName) {
        this.hostingPlayerSessionId = hostingPlayerSessionId;
        this.hostPlayerName = hostPlayerName;
        this.clientPlayerSessionId = null;
        this.clientPlayerName = null;
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

    public static int getActualId() {
        return actualId;
    }

    public int getId() {
        return id;
    }
}
