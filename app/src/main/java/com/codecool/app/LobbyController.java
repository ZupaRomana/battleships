package com.codecool.app;

import com.sun.net.httpserver.HttpExchange;
import com.sun.net.httpserver.HttpHandler;

public class LobbyController implements HttpHandler {

    @Override
    public void handle(HttpExchange httpExchange) {

        String method = httpExchange.getRequestMethod();

        if (method.equalsIgnoreCase("GET")) {

        } else if (method.equalsIgnoreCase("POST")) {

        }
    }
}
