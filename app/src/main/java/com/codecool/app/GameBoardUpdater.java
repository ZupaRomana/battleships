package com.codecool.app;

import com.codecool.app.helpers.AccountContainer;
import com.sun.net.httpserver.HttpExchange;
import com.sun.net.httpserver.HttpHandler;

import java.io.IOException;
import java.io.InputStream;
import java.io.OutputStream;
import java.net.HttpCookie;
import java.net.URI;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.TreeMap;

public class GameBoardUpdater implements HttpHandler {

    private Map<String, String> tacticsMap = new TreeMap<>();
    private GameRoom gameRoom;
    private String gameState;
    private String lastPostSessionId;
    private String lastGetSessionId;
    private boolean isInit;
    private List<String> sessionsIdReceivedInitMap = new ArrayList<>();

    @Override
    public void handle(HttpExchange httpExchange) {

        String cookieStr = httpExchange.getRequestHeaders().getFirst("Cookie");
        String method = httpExchange.getRequestMethod();
        HttpCookie cookie = HttpCookie.parse(cookieStr).get(0);
        String sessionID = cookie.getValue();

        gameRoom = GameRoomsContainer.getInstance().get(sessionID);
        URI uri = httpExchange.getRequestURI();
        System.out.println("\n"+uri.toString());
        System.out.println(method + " - " + cookieStr);

        if (method.equals("POST")) {
            handlePost(httpExchange, sessionID);

        } else if (method.equals("GET")) {
            lastGetSessionId = sessionID;
            if (isInit) {
                for (String key: tacticsMap.keySet()) {
                   if (key != lastGetSessionId && key != null) {
                       gameState = tacticsMap.get(key);
                       sessionsIdReceivedInitMap.add(lastGetSessionId);
                       System.out.println(lastGetSessionId + " <- SHOULD RECEIVE MAP");
                   }
                }
                checkSessionsIfReceivedMap();
            }
            System.out.println(lastPostSessionId + " <- POST GET - >" + lastGetSessionId);
            System.out.println("MAP->> "+tacticsMap.keySet() + " - " + tacticsMap.get(lastPostSessionId));
            sendGameState(httpExchange);
        }
    }

    private String getRequestUri(URI uri) {
        String[] splitedUri = uri.toString().split("/");
        return splitedUri[splitedUri.length - 1];
    }

    private void handlePost(HttpExchange httpExchange, String sessionId) {
        URI uri = httpExchange.getRequestURI();
        lastPostSessionId = sessionId;
        String requestUri = getRequestUri(uri);
        requestUri = uri.toString().contains("isInit") ? "gameBoardUpdater": requestUri;
        switch (requestUri) {
            case "gameBoardUpdater":
                if (lastPostSessionId != null) {
                    if (uri.toString().contains("isInit=true") && !tacticsMap.containsKey(lastPostSessionId)) {
                        getGameState(httpExchange);
                        tacticsMap.put(lastPostSessionId, gameState);
                        System.out.println(tacticsMap.keySet() + " - Session id: " + sessionId + " - " + tacticsMap.get(lastPostSessionId));
                        isInit = true;
                    } else {
                        getGameState(httpExchange);
                    }
                }
                break;
            case "playersTactics":
                Tactics tactics = gameRoom.getTactics();
                if (!tactics.contains(sessionId)) {
                    tactics.addTactic(sessionId, getGameState(httpExchange));
                    System.out.println("Added tactic!");
                }

        }
    }

    private void addPlayerMap(String sessionId) {

    }



    private void checkSessionsIfReceivedMap() {
        int counter = tacticsMap.keySet().size();
        for (String key: tacticsMap.keySet()) {
            System.out.println(key + " <- KEY SESSION LIST -> " + sessionsIdReceivedInitMap);
            if (sessionsIdReceivedInitMap.contains(key)) {
                counter--;
            }
        }
        if (counter == 0) {
            isInit = false;
        }
    }

    private String getGameState(HttpExchange httpExchange) {
        InputStream is = httpExchange.getRequestBody();

        List<Byte> byteList = getBytesList(is);
        byte[] bytes = new byte[byteList.size()];
        for (int i = 0; i < bytes.length; i++) {
            bytes[i] = byteList.get(i);
        }
        gameState  = new String(bytes);
        return gameState;
    }

    private List<Byte> getBytesList(InputStream is) {
        List<Byte> byteList = new ArrayList<>();
        try {
            int bytesNumber;
            while ((bytesNumber = is.read()) != -1) {
                byteList.add((byte) bytesNumber);
            }
            is.close();
        } catch (IOException e) {
            e.printStackTrace();
        }
        return byteList;
    }

    public void sendGameState(HttpExchange httpExchange) {
        OutputStream os = httpExchange.getResponseBody();
        try {
            httpExchange.getResponseHeaders().set("Content-Type", "application/json");
            if (!lastGetSessionId.equals(lastPostSessionId) && lastPostSessionId != null) {
                httpExchange.sendResponseHeaders(200, gameState.length());
                os.write(gameState.getBytes());
                os.close();
                System.out.println("Game state: " + gameState + " SENDED");
            } else {
                httpExchange.sendResponseHeaders(404, "Bad entry!".length());
                os.write("Bad entry!".getBytes());
                os.close();
            }
        } catch (IOException e) {
            e.printStackTrace();
        }
    }
}
