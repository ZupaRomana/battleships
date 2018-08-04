package com.codecool.app;

import java.util.Map;
import java.util.TreeMap;

public class Tactics {
    private Map<String, String> tacticsMap;

    public Tactics() {
        tacticsMap = new TreeMap<>();
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

}
