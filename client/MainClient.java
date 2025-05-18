package client;

import shared.*;

import javax.crypto.SecretKey;
import java.security.SecureRandom;

public class MainClient {
    public static void main(String[] args) throws Exception {
        String senha = "minhaSenha123";
        String secretTotp = "JBSWY3DPEHPK3PXP"; // base32

        // Deriva chave a partir do TOTP
        String totp = TotpUtils.generateTOTP(secretTotp);
        byte[] salt = "somesalt12345678".getBytes(); // carregar ou gerar
        SecretKey key = CryptoUtils.deriveKey(totp, salt);

        // Gera IV aleatório
        byte[] iv = new byte[12];
        new SecureRandom().nextBytes(iv);

        String mensagem = "Mensagem secreta para o servidor";
        String cifrada = CryptoUtils.encryptAESGCM(mensagem, key, iv);

        // Simula envio
        System.out.println("Mensagem cifrada: " + cifrada);
        System.out.println("IV: " + Base64.getEncoder().encodeToString(iv));
    }
}