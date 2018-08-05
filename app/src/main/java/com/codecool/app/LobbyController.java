package com.codecool.app;

import com.sun.net.httpserver.HttpExchange;
import com.sun.net.httpserver.HttpHandler;
import org.json.JSONObject;

import java.io.IOException;
import java.io.OutputStream;
import java.net.HttpCookie;
import java.net.URI;

public class LobbyController implements HttpHandler {

    GameRoom gameRoom;

    @Override
    public void handle(HttpExchange httpExchange) {

        String method = httpExchange.getRequestMethod();
        String sessionId = getSessionId(httpExchange);
        this.gameRoom = GameRoomsContainer.getInstance().get(sessionId);
        System.out.println(method + " - " + sessionId);
        if (method.equalsIgnoreCase("GET")) {
            try {
                handleGet(httpExchange);
            } catch (IOException err) {
                err.printStackTrace();
            }
        } else if (method.equalsIgnoreCase("POST")) {

        }
    }


    private String getSessionId(HttpExchange httpExchange) {
        String cookiStr = httpExchange.getRequestHeaders().getFirst("Cookie");
        HttpCookie cookie = HttpCookie.parse(cookiStr).get(0);
        return cookie.getValue();
    }

    private String getRequestUri(URI uri) {
        String[] splitedUri = uri.toString().split("/");
        return splitedUri[splitedUri.length - 1];
    }

    private void handleGet(HttpExchange httpExchange) throws IOException {

        String requestUri = getRequestUri(httpExchange.getRequestURI());
        System.out.println("/"+ requestUri + " <- URI");
        switch (requestUri) {
            case "lobbyController":

                String strJSON = getJSONGameRoom();
                System.out.println(strJSON);

                httpExchange.getResponseHeaders().set("Content-Type", "application/json");
                httpExchange.sendResponseHeaders(200, strJSON.length());
                OutputStream os = httpExchange.getResponseBody();
                os.write(strJSON.getBytes());
                os.close();
                break;

        }
    }

    private String getJSONGameRoom() {
        JSONObject json = new JSONObject();
        gameRoom.updatePlayerStatus();

        json.put("hasPlayers", true);
        json.put("hostName", gameRoom.getHostPlayerName());
        json.put("isHostPostMap", gameRoom.getIsHostPostMap());
        json.put("playerName", gameRoom.getClientPlayerName());
        json.put("isPlayerPostMap", gameRoom.getIsPlayerPostMap());
        json.put("arePlayersReady", gameRoom.arePlayersReady());

        return json.toString();
    }
}
