package com.codecool.app;

import com.sun.net.httpserver.HttpExchange;
import com.sun.net.httpserver.HttpHandler;
import org.json.JSONArray;

import java.io.File;
import java.io.FileNotFoundException;
import java.io.IOException;
import java.io.OutputStream;
import java.net.URI;
import java.util.Scanner;

public class LoginPage implements HttpHandler {

    private String response;

    @Override
    public void handle(HttpExchange httpExchange) throws IOException
    {
        String method = httpExchange.getRequestMethod();

        if (method.equals("GET")) {
            prepareResponse(httpExchange);

        } else {
            System.out.println("POST");
        }

        this.sendResponse(httpExchange);
    }

    private void prepareResponse(HttpExchange httpExchange) throws FileNotFoundException
    {
        String data = getDataFromURI(httpExchange);

        switch (data){
            case "index":
                buildResponse("src/main/resources/index.html");
                break;
            case "clicked":
                buildResponse();
                break;
        }
    }

    private void sendResponse(HttpExchange httpExchange) throws IOException
    {
        httpExchange.sendResponseHeaders(200, response.length());
        OutputStream os = httpExchange.getResponseBody();
        os.write(response.getBytes());
        os.close();
    }

    private String getDataFromURI(HttpExchange httpExchange)
    {
        URI uri = httpExchange.getRequestURI();
        String[] dataSplitted = uri.toString().split("/");
        return dataSplitted[dataSplitted.length - 1];
    }

    private void buildResponse()
    {
        JSONArray jsonArray = new JSONArray();

        jsonArray.put("ddd");
        response = jsonArray.toString();
    }

    private void buildResponse(String filePath) throws FileNotFoundException
    {
        Scanner scanner = new Scanner(new File(filePath));
        StringBuilder stringBuilder = new StringBuilder();
        while (scanner.hasNextLine()) {
            stringBuilder.append(scanner.nextLine()).append("\n");
        }
        response = stringBuilder.toString();
    }
}
