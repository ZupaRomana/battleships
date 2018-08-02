package com.codecool.app;

import com.sun.net.httpserver.HttpExchange;
import com.sun.net.httpserver.HttpHandler;

import java.io.IOException;
import java.io.InputStream;
import java.io.OutputStream;
import java.net.HttpCookie;
import java.util.ArrayList;
import java.util.List;

public class GameBoardUpdater implements HttpHandler {

    private String gameState;
    private String lastPostSessionId;
    private String lastGetSessionId;

    @Override
    public void handle(HttpExchange httpExchange) {

        String cookieStr = httpExchange.getRequestHeaders().getFirst("Cookie");
        String method = httpExchange.getRequestMethod();
        HttpCookie cookie = cookie = HttpCookie.parse(cookieStr).get(0);

        System.out.println(method + " - " + cookieStr);
        if (method.equals("POST")) {
            getGameState(httpExchange);
            lastPostSessionId = cookie.getValue();
        } else if (method.equals("GET")) {
            lastGetSessionId = cookie.getValue();
            System.out.println(lastPostSessionId + " <- POST GET - >" + lastGetSessionId);
            sendGameState(httpExchange);
        }
    }

    private void getGameState(HttpExchange httpExchange) {
        InputStream is = httpExchange.getRequestBody();

        List<Byte> byteList = getBytesList(is);
        byte[] bytes = new byte[byteList.size()];
        for (int i = 0; i < bytes.length; i++) {
            bytes[i] = byteList.get(i);
        }
        gameState  = new String(bytes);
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
        if (!lastGetSessionId.equals(lastPostSessionId)) {
            try {
                httpExchange.getResponseHeaders().set("Content-Type", "application/json");
                httpExchange.sendResponseHeaders(200, gameState.length());
                os.write(gameState.getBytes());
                os.close();
            } catch (IOException e) {
                e.printStackTrace();
            }
        }
    }
}
