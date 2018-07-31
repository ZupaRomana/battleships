package com.codecool.app.helpers;

import java.util.HashMap;
import java.util.Map;

public class AccountContainer {

    private static AccountContainer instance;
    private Map<String, Integer> sessionIdNickname;

    private AccountContainer() {
        sessionIdNickname = new HashMap<>();
    }

    public static AccountContainer getInstance() {
        if (instance == null) {
            instance = new AccountContainer();
        }

        return instance;
    }

    public void add(String sessionId, int id) {
        sessionIdNickname.put(sessionId, id);
    }

    public int get(String sessionId) {
        return sessionIdNickname.get(sessionId);
    }

    public boolean contains(String sessionId) {
        return sessionIdNickname.containsKey(sessionId);
    }

    public void remove(int sessionId) {
        for (String session : sessionIdNickname.keySet()) {
            if (sessionIdNickname.get(session) == sessionId) {
                sessionIdNickname.remove(session);
            }
        }
    }

}
