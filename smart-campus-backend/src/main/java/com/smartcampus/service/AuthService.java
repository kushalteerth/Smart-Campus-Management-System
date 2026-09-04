package com.smartcampus.service;

import com.smartcampus.dto.auth.AuthDTOs.*;
import com.smartcampus.exception.Exceptions.InvalidCredentialsException;
import com.smartcampus.model.RefreshToken;
import com.smartcampus.model.User;
import com.smartcampus.model.Visitor;
import com.smartcampus.repository.UserRepository;
import com.smartcampus.repository.VisitorRepository;
import com.smartcampus.security.JwtTokenProvider;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;

@Service
public class AuthService {

    @Autowired
    private AuthenticationManager authenticationManager;

    @Autowired
    private JwtTokenProvider tokenProvider;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private RefreshTokenService refreshTokenService;
    
    @Autowired
    private VisitorRepository visitorRepository;

    public LoginResponse authenticateUser(LoginRequest loginRequest) {
        try {
            Authentication authentication = authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(
                            loginRequest.getUsername(),
                            loginRequest.getPassword()
                    )
            );

            SecurityContextHolder.getContext().setAuthentication(authentication);

            User userDetails = (User) authentication.getPrincipal();
            String jwt = tokenProvider.generateToken(authentication);

            RefreshToken refreshToken = refreshTokenService.createRefreshToken(userDetails.getId());

            return new LoginResponse(jwt, refreshToken.getToken(), userDetails.getRole().name(), userDetails.getUserId());
        } catch (AuthenticationException e) {
            throw new InvalidCredentialsException("Invalid username or password");
        }
    }

    public TokenRefreshResponse refreshToken(TokenRefreshRequest request) {
        String requestRefreshToken = request.getRefreshToken();

        return refreshTokenService.findByToken(requestRefreshToken)
                .map(refreshTokenService::verifyExpiration)
                .map(RefreshToken::getUser)
                .map(user -> {
                    String token = tokenProvider.generateToken(
                            new UsernamePasswordAuthenticationToken(user, null, user.getAuthorities())
                    );
                    return new TokenRefreshResponse(token, requestRefreshToken);
                })
                .orElseThrow(() -> new IllegalArgumentException("Refresh token is not in database!"));
    }
    
    public void logout(TokenRefreshRequest request) {
        refreshTokenService.findByToken(request.getRefreshToken())
                .ifPresent(token -> refreshTokenService.deleteByUserId(token.getUser().getId()));
    }

    public VisitorEntryResponse enterAsVisitor(VisitorEntryRequest request) {
        Visitor visitor = new Visitor();
        visitor.setName(request.getName());
        visitor.setEntryTime(LocalDateTime.now());
        Visitor saved = visitorRepository.save(visitor);
        
        String token = tokenProvider.generateVisitorToken(saved.getId(), saved.getName());
        return new VisitorEntryResponse(token, saved.getId(), saved.getName(), "VISITOR");
    }
}
