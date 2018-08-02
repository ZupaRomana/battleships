package com.codecool.app;

import com.sun.net.httpserver.HttpExchange;
import com.sun.net.httpserver.HttpHandler;

import java.io.FileInputStream;
import java.io.IOException;
import java.io.InputStream;
import java.io.OutputStream;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;

public class GameBoardUpdater implements HttpHandler {

    private String gameState;

    @Override
    public void handle(HttpExchange httpExchange) {

        String method = httpExchange.getRequestMethod();
        System.out.println(method);
        if (method.equals("POST")) {
            getGameState(httpExchange);
        } else if (method.equals("GET")) {
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
        System.out.println(gameState);
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
            httpExchange.sendResponseHeaders(200, gameState.length());
            os.write(gameState.getBytes());
            os.close();
            System.out.println("\u001B[31m" + new String(gameState.getBytes()) + "\u001B[0m");
        } catch (IOException e) {
            e.printStackTrace();
        }
    }
}
