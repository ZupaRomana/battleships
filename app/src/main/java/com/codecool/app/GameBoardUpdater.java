package com.codecool.app;

import com.sun.net.httpserver.HttpExchange;
import com.sun.net.httpserver.HttpHandler;

import java.io.FileInputStream;
import java.io.IOException;
import java.io.InputStream;
import java.io.OutputStream;
import java.util.ArrayList;
import java.util.List;

public class GameBoardUpdater implements HttpHandler {

    private String response;
    private int counterPost = 0;
    private int counterGet = 0;

    @Override
    public void handle(HttpExchange httpExchange) {
        System.out.println("japierdole");
        String method = httpExchange.getRequestMethod();
        System.out.println(method);
        if (method.equals("POST")) {
            InputStream is = httpExchange.getRequestBody();

            int bytesNumber;
            List<Byte> byteList = new ArrayList<>();
            try {
                while ((bytesNumber = is.read()) != -1) {
                    byteList.add((byte) bytesNumber);
                }
                is.close();
            } catch (IOException e) {
                e.printStackTrace();
            }
            byte[] bytes = new byte[byteList.size()];
            for (int i = 0; i < bytes.length; i++) {
                bytes[i] = byteList.get(i);
            }
            response  = new String(bytes);
            System.out.println( counterPost++ +" - "+response);
        } else if (method.equals("GET")) {
            OutputStream os = httpExchange.getResponseBody();
            try {
                httpExchange.getResponseHeaders().set("Content-Type", "application/json");
                httpExchange.sendResponseHeaders(200, response.length());
                os.write(response.getBytes());
                os.close();
                System.out.println("\u001B[31m" + counterGet++ +" - "+new String(response.getBytes()) + "\u001B[0m");
            } catch (IOException e) {
                e.printStackTrace();
            }
        }
    }
}
