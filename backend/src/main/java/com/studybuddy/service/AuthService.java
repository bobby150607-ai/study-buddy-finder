package com.studybuddy.service;

import com.studybuddy.dto.AuthRequest;
import com.studybuddy.dto.AuthResponse;
import com.studybuddy.dto.RegisterRequest;
import com.studybuddy.dto.UserDTO;
import com.studybuddy.entity.Profile;
import com.studybuddy.entity.User;
import com.studybuddy.exception.BadRequestException;
import com.studybuddy.exception.ResourceNotFoundException;
import com.studybuddy.repository.ProfileRepository;
import com.studybuddy.repository.UserRepository;
import com.studybuddy.security.JwtTokenProvider;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@Transactional
public class AuthService {

    private final UserRepository userRepository;
    private final ProfileRepository profileRepository;
    private final PasswordEncoder passwordEncoder;
    private final AuthenticationManager authenticationManager;
    private final JwtTokenProvider tokenProvider;

    public AuthService(UserRepository userRepository,
                       ProfileRepository profileRepository,
                       PasswordEncoder passwordEncoder,
                       AuthenticationManager authenticationManager,
                       JwtTokenProvider tokenProvider) {
        this.userRepository = userRepository;
        this.profileRepository = profileRepository;
        this.passwordEncoder = passwordEncoder;
        this.authenticationManager = authenticationManager;
        this.tokenProvider = tokenProvider;
    }

    public AuthResponse register(RegisterRequest request) {
        String email = request.getEmail().trim().toLowerCase();
        if (userRepository.existsByEmail(email)) {
            throw new BadRequestException("An account with this email already exists: " + email);
        }

        User user = new User();
        user.setEmail(email);
        user.setPassword(passwordEncoder.encode(request.getPassword()));
        user.setName(request.getName().trim());
        user.setRole("ROLE_STUDENT");
        user.setActive(true);

        User savedUser = userRepository.save(user);

        Profile profile = new Profile();
        profile.setUser(savedUser);
        profile.setUniversity(request.getUniversity().trim());
        profile.setCourse(request.getCourse().trim());
        profile.setYearOfStudy(request.getYearOfStudy() != null ? request.getYearOfStudy() : 1);
        profile.setAvatarUrl("https://api.dicebear.com/7.x/bottts/svg?seed=" + savedUser.getId());
        profile.setPreferredStudyMethod("Hybrid");
        profileRepository.save(profile);

        String token = tokenProvider.generateToken(savedUser.getEmail());

        return new AuthResponse(token, savedUser.getId(), savedUser.getEmail(), savedUser.getName(), savedUser.getRole());
    }

    public AuthResponse login(AuthRequest request) {
        String email = request.getEmail().trim().toLowerCase();

        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(email, request.getPassword())
        );

        SecurityContextHolder.getContext().setAuthentication(authentication);

        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with email: " + email));

        String token = tokenProvider.generateToken(user.getEmail());

        return new AuthResponse(token, user.getId(), user.getEmail(), user.getName(), user.getRole());
    }

    @Transactional(readOnly = true)
    public UserDTO getCurrentUser(String email) {
        User user = userRepository.findByEmail(email.toLowerCase())
                .orElseThrow(() -> new ResourceNotFoundException("User not found: " + email));
        return new UserDTO(user.getId(), user.getEmail(), user.getName(), user.getRole(), user.isActive());
    }

    public void deactivateUser(Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with id: " + userId));
        user.setActive(false);
        userRepository.save(user);
    }
}
