package com.codecool.app;

import com.codecool.app.helpers.AccountContainer;
import com.sun.net.httpserver.Headers;
import com.sun.net.httpserver.HttpExchange;
import com.sun.net.httpserver.HttpHandler;
import org.json.JSONArray;
import org.json.JSONObject;

import java.io.*;
import java.net.HttpCookie;
import java.net.URI;
import java.util.*;

public class LoginPage implements HttpHandler {

    private String response;
    private String method;
    private HttpExchange httpExchange;
    private static int counter = 0;
    private static List<String> nickNames = new ArrayList<>();

    @Override
    public void handle(HttpExchange httpExchange) throws IOException
    {
        response = "";
        method = httpExchange.getRequestMethod();
        this.httpExchange = httpExchange;

        if (isGetMethod()) {
            prepareResponse();
        } else {
            prepareResponsePost();
        }
        sendResponse();
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
            case "count":
                buildJSON();
                break;
            default:
                buildIndexHtml();
        }
    }

    private void prepareResponsePost() throws IOException
    {
        String data = getDataFromURI();

        switch (data){
            case "index":
                catchData();
                break;
            case "createNewRoom":
                createNewGameRoom();
                //redirect("gameBoardUpdater");
                break;
            case "enterARoom":

                enterARoom();
                break;
            default:
                buildIndexHtml();
        }
    }

    private void enterARoom() {
        System.out.println("enterARoom()");
        String cookie = httpExchange.getRequestHeaders().getFirst("Cookie");
        HttpCookie httpCookie = HttpCookie.parse(cookie).get(0);
        String sessionId = httpCookie.getValue();
        GameRoomsContainer gameRoomsContainer = GameRoomsContainer.getInstance();
        InputStream is = httpExchange.getRequestBody();
        String hostName = getHostName(is);
        System.out.println(sessionId + " <- Session wich want enter a room| Hostname of room -> " + hostName);
        for (int i = 0; i < gameRoomsContainer.getAll().size(); i++) {
            GameRoom gameRoom = gameRoomsContainer.get(i);
            if (gameRoom.getHostPlayerName().equalsIgnoreCase(hostName) && gameRoom.getClientPlayerName() == null) {
                gameRoom.setClientPlayerName(AccountContainer.getInstance().get(sessionId));
                gameRoom.setClientPlayerSessionId(sessionId);
            }
        }
    }

    private void createNewGameRoom()
    {
        String cookie = httpExchange.getRequestHeaders().getFirst("Cookie");
        HttpCookie httpCookie = HttpCookie.parse(cookie).get(0);
        String sessionId = httpCookie.toString().split("=")[1];

        String playerName = AccountContainer.getInstance().get(sessionId);

        GameRoom gameRoom = new GameRoom(sessionId, playerName);
        GameRoomsContainer grc = GameRoomsContainer.getInstance();
        grc.add(gameRoom);
        System.out.println(GameRoomsContainer.getInstance());
    }

    private void redirect(String location) throws IOException
    {
        Headers headers = httpExchange.getResponseHeaders();
        headers.add("Location", location);
        httpExchange.sendResponseHeaders(302, -1);
        httpExchange.close();
    }

    private void buildJSON()
    {
        JSONArray jsonArray = new JSONArray();

        jsonArray.put(AccountContainer.getInstance().getSize());
        jsonArray.put(GameRoomsContainer.getInstance());

        response = jsonArray.toString();
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
        System.out.println(keyValue);
        AccountContainer accountContainer = AccountContainer.getInstance();

        String uuid = UUID.randomUUID().toString();
        String nickName = keyValue.get("nickName");

        System.out.println(nickName + " has entered the game!");

        accountContainer.add(uuid, nickName);
        nickNames.add(nickName);

        HttpCookie httpCookie = new HttpCookie("sessionId", uuid);
//        HttpCookie cookieNick = new HttpCookie("nickName", nickName);

        httpExchange.getResponseHeaders().add("Set-Cookie", httpCookie.toString());
//        httpExchange.getResponseHeaders().add("Set-Cookie", cookieNick.toString());
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

    private String getHostName(InputStream is) {
        List<Byte> byteList = getBytesList(is);
        byte[] bytes = new byte[byteList.size()];
        for (int i = 0; i < bytes.length; i++) {
            bytes[i] = byteList.get(i);
        }
        String hostName = new String(bytes);
        return hostName;
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
}