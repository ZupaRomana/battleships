package com.codecool.app;

import com.codecool.app.helpers.AccountContainer;
import com.sun.net.httpserver.HttpExchange;
import com.sun.net.httpserver.HttpHandler;
import org.json.JSONArray;

import java.io.*;
import java.net.HttpCookie;
import java.net.URI;
import java.util.HashMap;
import java.util.Map;
import java.util.Scanner;
import java.util.UUID;

public class LoginPage implements HttpHandler {

    private String response;
    private String method;
    private HttpExchange httpExchange;

    @Override
    public void handle(HttpExchange httpExchange) throws IOException
    {
        response = "";
        method = httpExchange.getRequestMethod();
        this.httpExchange = httpExchange;

        if (isGetMethod()) {
            prepareResponse();
            sendResponse();
        } else {
            catchData();
        }
    }

    private boolean isGetMethod()
    {
        return method.equals("GET");
    }

    private void prepareResponse() throws FileNotFoundException
    {
        String data = getDataFromURI();

        switch (data){
            case "index":
                buildIndexHtml();
                break;
            default:
                buildIndexHtml();
        }
    }

    private void sendResponse() throws IOException
    {
        httpExchange.sendResponseHeaders(200, response.length());
        OutputStream os = httpExchange.getResponseBody();
        os.write(response.getBytes());
        os.close();
    }

    private String getDataFromURI()
    {
        URI uri = httpExchange.getRequestURI();
        String[] dataSplitted = uri.toString().split("/");
        return dataSplitted[dataSplitted.length - 1];
    }

    private void buildIndexHtml() throws FileNotFoundException
    {
        Scanner scanner = new Scanner(new File("src/main/resources/static/html/index.html"));
        StringBuilder stringBuilder = new StringBuilder();
        while (scanner.hasNextLine()) {
            stringBuilder.append(scanner.nextLine()).append("\n");
        }
        response = stringBuilder.toString();
    }

    private void catchData() throws IOException {

        Map<String, String> keyValue = getInputs();
        AccountContainer accountContainer = AccountContainer.getInstance();

        String uuid = UUID.randomUUID().toString();
        String nickName = keyValue.get("nickName");

        System.out.println(nickName + " has entered the game!");

        accountContainer.add(uuid, nickName);

        HttpCookie httpCookie = new HttpCookie("sessionId", uuid);
        httpExchange.getResponseHeaders().add("Set-Cookie", httpCookie.toString());
    }

    private static Map<String, String> parseFormData(String formData)
    {
        Map<String, String> map = new HashMap<>();
        formData = split(formData);
        String[] pairs = formData.split(":");
        map.put(pairs[0], pairs[1]);
        return map;
    }

    private static String split(String toSplit)
    {
        toSplit = toSplit.replace("{", "");
        toSplit = toSplit.replace("}", "");
        toSplit = toSplit.replace("\"", "");
        toSplit = toSplit.replace("\\", "");
        return toSplit;
    }

    private Map<String, String> getInputs() throws IOException
    {
        InputStreamReader isr = new InputStreamReader(httpExchange.getRequestBody(), "utf-8");
        BufferedReader br = new BufferedReader(isr);
        String formData = br.readLine();
        return parseFormData(formData);
    }
}
