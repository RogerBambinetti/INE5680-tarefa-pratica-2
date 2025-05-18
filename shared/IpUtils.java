package shared;

import java.net.HttpURLConnection;
import java.net.URL;
import java.util.Scanner;
import org.json.JSONObject;

public class IpUtils {
    private static final String TOKEN = "SEU_TOKEN_IPINFO_AQUI";

    public static String getCountryFromIP() throws Exception {
        URL url = new URL("https://ipinfo.io/json?token=" + TOKEN);
        HttpURLConnection conn = (HttpURLConnection) url.openConnection();
        conn.setRequestMethod("GET");
        conn.connect();
        Scanner scanner = new Scanner(conn.getInputStream()).useDelimiter("\\A");
        String response = scanner.hasNext() ? scanner.next() : "";
        JSONObject json = new JSONObject(response);
        return json.getString("country");
    }
}