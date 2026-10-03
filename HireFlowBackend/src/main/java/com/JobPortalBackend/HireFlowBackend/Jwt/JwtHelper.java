package com.JobPortalBackend.HireFlowBackend.Jwt;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import io.jsonwebtoken.security.Keys;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Component;

import java.security.Key;
import java.util.Date;
import java.util.HashMap;
import java.util.Map;
import java.util.function.Function;

@Component
public class JwtHelper {

    private static final String SECRET="mysupersecuresecretkeymysupersecuresecretkey";
    private static final Key SECRET_KEY=
            Keys.hmacShaKeyFor(SECRET.getBytes());

    private static final long JWT_TOKEN_VALIDITY=3600000;

    public static String getUsernameFromToken(String token){
        return getClaimFromToken(token, Claims::getSubject);
    }

    public static Date getExpirationDateFromToken(String token){
        return getClaimFromToken(token, Claims::getExpiration);
    }

    public static <T> T getClaimFromToken(String token, Function<Claims,T> claimsResolver){
        final Claims claims=getAllClaimsFromToken(token);
        return claimsResolver.apply(claims);
    }

    private static Claims getAllClaimsFromToken(String token){
        return Jwts.parserBuilder()
                .setSigningKey(SECRET_KEY)
                .build()
                .parseClaimsJws(token)
                .getBody();
    }

    private static boolean isTokenExpired(String token){
        return getExpirationDateFromToken(token).before(new Date());
    }

    public static String generateToken(UserDetails userDetails){
        Map<String, Object> claims = new HashMap<>();
        CustomUserDetails customUser =(CustomUserDetails)userDetails;
        claims.put("id",customUser.getId());
        claims.put("name",customUser.getName());
        claims.put("accountType",customUser.getAccountType());
        claims.put("profileId",customUser.getProfileId());
        return doGenerateToken(claims, userDetails.getUsername());

    }

    private static String doGenerateToken(Map<String,Object> claims,String subject){

        return Jwts.builder()
                .setClaims(claims)
                .setSubject(subject)
                .setIssuedAt(new Date())
                .setExpiration(new Date(System.currentTimeMillis() + JWT_TOKEN_VALIDITY))
                .signWith(SECRET_KEY, SignatureAlgorithm.HS256)
                .compact();
    }

    public static boolean validateToken(String token, String username) {
        final String extractedUsername = getUsernameFromToken(token);
        return (extractedUsername.equals(username) && !isTokenExpired(token));
    }
}
