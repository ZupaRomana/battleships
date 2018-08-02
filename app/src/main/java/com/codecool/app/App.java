package com.codecool.app;

import com.sun.net.httpserver.HttpServer;

import java.io.IOException;
import java.net.InetSocketAddress;

public class App {
    public static void main(String[] args) {

        HttpServer httpServer = null;

        try {
            httpServer = HttpServer.create(new InetSocketAddress(8001), 0);
        } catch (IOException e) {
            e.printStackTrace();
        }

        httpServer.createContext("/index", new LoginPage());
        httpServer.createContext("/static", new Static());
        httpServer.createContext("/gameBoardUpdater", new GameBoardUpdater());
//        httpServer.createContext("/", new SomeClass());

        httpServer.setExecutor(null);

        httpServer.start();
    }
}
