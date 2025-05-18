package server;

import shared.*;

import javax.crypto.SecretKey;
import java.util.Base64;

public class MainServer {
    public static void main(String[] args) throws Exception {
        String secretTotp = "JBSWY3DPEHPK3PXP"; // mesmo do cliente
        String totp = TotpUtils.generateTOTP(secretTotp);
        byte[] salt = "somesalt12345678".getBytes();
        SecretKey key = CryptoUtils.deriveKey(totp, salt);

        String ivBase64 = "..."; // receber do cliente
        String mensagemCifrada = "..."; // receber do cliente

        byte[] iv = Base64.getDecoder().decode(ivBase64);
        String decifrada = CryptoUtils.decryptAESGCM(mensagemCifrada, key, iv);

        System.out.println("Mensagem recebida: " + decifrada);
    }
}