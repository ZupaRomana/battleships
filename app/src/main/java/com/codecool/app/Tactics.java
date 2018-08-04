package com.codecool.app;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.TreeMap;

public class Tactics {
    private Map<String, String> tacticsMap;
    private List<String> playersWithEnemyMap;

    public Tactics() {
        tacticsMap = new TreeMap<>();
        playersWithEnemyMap = new ArrayList<>();
    }

    public void addTactic(String sessionId, String map) {
        tacticsMap.put(sessionId, map);
    }

    public String getTactic(String sessionId) {
        return tacticsMap.get(sessionId);
    }

    public boolean contains(String sessionId) {
        return tacticsMap.containsKey(sessionId);
    }

    public String getOppisiteTactic(String sessionId) {
        for (String key: tacticsMap.keySet()) {
            if (!key.equals(sessionId)) {
                return this.tacticsMap.get(key);
            }
        } return null;
    }

    public void addToPlayersWithEnemyMap(String sessionId) {
        playersWithEnemyMap.add(sessionId);
    }

    public List<String> getPlayersWithEnemyMap() {
        return playersWithEnemyMap;
    }

}
