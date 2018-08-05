package com.codecool.app.helpers;

import java.util.HashMap;
import java.util.Map;

public class AccountContainer {

    private static AccountContainer instance;
    private Map<String, String> sessionIdNickNames;

    private AccountContainer() {
        sessionIdNickNames = new HashMap<>();
    }

    public static AccountContainer getInstance() {
        if (instance == null) {
            instance = new AccountContainer();
        }

        return instance;
    }

    public void add(String sessionId, String nickName) {
        sessionIdNickNames.put(sessionId, nickName);
    }

    public String get(String sessionId) {
        return sessionIdNickNames.get(sessionId);
    }

    public boolean contains(String sessionId) {
        return sessionIdNickNames.containsKey(sessionId);
    }

    public void remove(int sessionId) {
        for (String session : sessionIdNickNames.keySet()) {
            if (sessionIdNickNames.get(session).equals(sessionId)) {
                sessionIdNickNames.remove(session);
            }
        }
    }

    public void clear() {
        sessionIdNickNames.clear();
    }

    public int getSize() { return sessionIdNickNames.keySet().size();}

    public String toString() {
        StringBuilder stringBuilder = new StringBuilder();
        for (String s : sessionIdNickNames.keySet()) {
            stringBuilder.append("Session: ").append(s).append(" Nickname: ").append(sessionIdNickNames.get(s));
        }
        return stringBuilder.toString();
    }

}
