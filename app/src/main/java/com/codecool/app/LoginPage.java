package com.codecool.app;

import com.codecool.app.helpers.AccountContainer;
import com.sun.net.httpserver.HttpExchange;
import com.sun.net.httpserver.HttpHandler;
import jdk.nashorn.internal.parser.JSONParser;
import org.json.JSONArray;
import org.json.JSONString;

import java.io.*;
import java.net.HttpCookie;
import java.net.URI;
import java.net.URLDecoder;
import java.util.HashMap;
import java.util.Map;
import java.util.Scanner;
import java.util.UUID;

public class LoginPage implements HttpHandler {

    private String response;

    @Override
    public void handle(HttpExchange httpExchange) throws IOException
    {
        String method = httpExchange.getRequestMethod();
        AccountContainer accountContainer = AccountContainer.getInstance();

        if (method.equals("GET")) {
            URI uri = httpExchange.getRequestURI();
            if (uri.toString().contains("dupa")){ JSONArray jsonArray = new JSONArray();
                jsonArray.put(accountContainer.getSize());
                response = jsonArray.toString();
                System.out.println(response + " RESPONSE");}
            else {prepareResponse(httpExchange);}

        } else {
            catchData(httpExchange);
            System.out.println(accountContainer.getSize());
            changeActualFunction();
        }

        this.sendResponse(httpExchange);
    }

    private void prepareResponse(HttpExchange httpExchange) throws FileNotFoundException
    {
        String data = getDataFromURI(httpExchange);

        switch (data){
            case "index":
                buildResponse("src/main/resources/static/html/index.html");
                break;
            case "clicked":
                buildResponse();
                break;
        }
    }

    private void sendResponse(HttpExchange httpExchange) throws IOException
    {
        System.out.println("SENDIN");
        httpExchange.sendResponseHeaders(200, response.length());
        OutputStream os = httpExchange.getResponseBody();
        os.write(response.getBytes());
        System.out.println("SENDINEEEEEEEEEEEEEEEEe");
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

    private void catchData(HttpExchange httpExchange) throws IOException {

        Map<String, String> keyValue = getInputs(httpExchange);
        AccountContainer accountContainer = AccountContainer.getInstance();

        String uuid = UUID.randomUUID().toString();
        String nickName = keyValue.get("nickName");

        System.out.println(nickName + " has entered the game!");

        accountContainer.add(uuid, nickName);

        HttpCookie httpCookie = new HttpCookie("sessionId", uuid);
        httpExchange.getResponseHeaders().add("Set-Cookie", httpCookie.toString());
    }

    private static Map<String, String> parseFormData(String formData) throws UnsupportedEncodingException
    {
        Map<String, String> map = new HashMap<>();
        formData = removeFuckingKurwa(formData);
        String[] pairs = formData.split(":");
        map.put(pairs[0], pairs[1]);
        return map;
    }

    private static String removeFuckingKurwa(String toSplit)
    {
        toSplit = toSplit.replace("{", "");
        toSplit = toSplit.replace("}", "");
        toSplit = toSplit.replace("\"", "");
        toSplit = toSplit.replace("\\", "");
        return toSplit;
    }

    private Map<String, String> getInputs(HttpExchange httpExchange) throws IOException
    {
        InputStreamReader isr = new InputStreamReader(httpExchange.getRequestBody(), "utf-8");
        BufferedReader br = new BufferedReader(isr);
        String formData = br.readLine();
        return parseFormData(formData);
    }

    private void changeActualFunction()
    {
        JSONArray jsonArray = new JSONArray();
        jsonArray.put("a");
        response = jsonArray.toString();
    }
}
