package com.studybuddy.config;

import com.studybuddy.entity.*;
import com.studybuddy.repository.*;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import java.util.*;

@Component
public class DataInitializer implements CommandLineRunner {

    private final UserRepository userRepository;
    private final ProfileRepository profileRepository;
    private final SubjectRepository subjectRepository;
    private final ConnectionRepository connectionRepository;
    private final StudyGroupRepository studyGroupRepository;
    private final GroupMemberRepository groupMemberRepository;
    private final MessageRepository messageRepository;
    private final GroupMessageRepository groupMessageRepository;
    private final PasswordEncoder passwordEncoder;

    public DataInitializer(UserRepository userRepository,
                           ProfileRepository profileRepository,
                           SubjectRepository subjectRepository,
                           ConnectionRepository connectionRepository,
                           StudyGroupRepository studyGroupRepository,
                           GroupMemberRepository groupMemberRepository,
                           MessageRepository messageRepository,
                           GroupMessageRepository groupMessageRepository,
                           PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.profileRepository = profileRepository;
        this.subjectRepository = subjectRepository;
        this.connectionRepository = connectionRepository;
        this.studyGroupRepository = studyGroupRepository;
        this.groupMemberRepository = groupMemberRepository;
        this.messageRepository = messageRepository;
        this.groupMessageRepository = groupMessageRepository;
        this.passwordEncoder = passwordEncoder;
    }

    @Override
    @Transactional
    public void run(String... args) {
        if (subjectRepository.count() > 0) {
            return; // Data already seeded
        }

        System.out.println(">>> Seeding Study Buddy Finder initial dataset...");

        // 1. Create Core University Subjects
        Subject cs101 = new Subject("CS101", "Data Structures & Algorithms", "Computer Science", "Fundamental algorithmic design, complexity analysis, and tree/graph structures.");
        Subject cs202 = new Subject("CS202", "Database Management Systems", "Computer Science", "Relational algebra, SQL, indexing, transactions, and normalization.");
        Subject cs303 = new Subject("CS303", "Machine Learning & AI", "Computer Science", "Supervised/unsupervised models, neural networks, feature engineering.");
        Subject math201 = new Subject("MATH201", "Linear Algebra & Vector Calculus", "Mathematics", "Vector spaces, eigenvalues, matrix decompositions, multivariable optimization.");
        Subject math205 = new Subject("MATH205", "Probability & Statistics", "Mathematics", "Discrete and continuous distributions, hypothesis testing, Bayesian inference.");
        Subject phys101 = new Subject("PHYS101", "Classical Mechanics & Electromagnetism", "Physics", "Newtonian dynamics, conservation laws, Maxwell equations.");
        Subject bus110 = new Subject("BUS110", "Principles of Microeconomics", "Business", "Supply and demand, consumer behavior, market structures, game theory.");
        Subject psyc101 = new Subject("PSYC101", "Introduction to Cognitive Psychology", "Psychology", "Memory architectures, human perception, decision making paradigms.");

        List<Subject> subjects = List.of(cs101, cs202, cs303, math201, math205, phys101, bus110, psyc101);
        subjectRepository.saveAll(subjects);

        // 2. Create Realistic University Students
        String defaultPassword = passwordEncoder.encode("password123");

        // Student 1: Alex Rivera (Primary demo account)
        User alex = new User("alex@university.edu", defaultPassword, "Alex Rivera");
        userRepository.save(alex);
        Profile alexProfile = new Profile(alex, "Stanford University", "B.S. Computer Science", 3);
        alexProfile.setBio("Passionate about algorithms, system design, and competitive programming. Looking for a study buddy for CS101 and Machine Learning!");
        alexProfile.setAvatarUrl("https://api.dicebear.com/7.x/bottts/svg?seed=Alex");
        alexProfile.setInterests("Competitive Programming, Machine Learning, Open Source, Hackathons");
        alexProfile.setPreferredStudyMethod("Hybrid");
        alexProfile.setAvailableStudyTimes("Weekday Evenings, Weekend Mornings");
        alexProfile.setSubjects(new HashSet<>(List.of(cs101, cs202, cs303, math201)));
        profileRepository.save(alexProfile);

        // Student 2: Emma Watson (High compatibility with Alex)
        User emma = new User("emma@university.edu", defaultPassword, "Emma Watson");
        userRepository.save(emma);
        Profile emmaProfile = new Profile(emma, "Stanford University", "B.S. Computer Science", 3);
        emmaProfile.setBio("AI enthusiast working on computer vision and neural networks. Let's solve LeetCode problems and prepare for technical interviews together!");
        emmaProfile.setAvatarUrl("https://api.dicebear.com/7.x/bottts/svg?seed=Emma");
        emmaProfile.setInterests("Machine Learning, Competitive Programming, Deep Learning, Hackathons");
        emmaProfile.setPreferredStudyMethod("Hybrid");
        emmaProfile.setAvailableStudyTimes("Weekday Evenings, Weekend Mornings, Weekend Afternoons");
        emmaProfile.setSubjects(new HashSet<>(List.of(cs101, cs303, math201, math205)));
        profileRepository.save(emmaProfile);

        // Student 3: Liam Chen (Mathematics & Data enthusiast)
        User liam = new User("liam@university.edu", defaultPassword, "Liam Chen");
        userRepository.save(liam);
        Profile liamProfile = new Profile(liam, "Stanford University", "B.S. Data Science", 2);
        liamProfile.setBio("Double majoring in Math and CS. Love mathematical proofs and statistical modeling. Looking for focused library study partners.");
        liamProfile.setAvatarUrl("https://api.dicebear.com/7.x/bottts/svg?seed=Liam");
        liamProfile.setInterests("Data Science, Statistical Modeling, Chess, Machine Learning");
        liamProfile.setPreferredStudyMethod("In-Person Library");
        liamProfile.setAvailableStudyTimes("Weekday Evenings, Weekend Afternoons");
        liamProfile.setSubjects(new HashSet<>(List.of(cs202, math201, math205, cs303)));
        profileRepository.save(liamProfile);

        // Student 4: Sophia Martinez (Psychology & CogSci)
        User sophia = new User("sophia@university.edu", defaultPassword, "Sophia Martinez");
        userRepository.save(sophia);
        Profile sophiaProfile = new Profile(sophia, "UC Berkeley", "B.A. Cognitive Science", 2);
        sophiaProfile.setBio("Exploring the intersection of human psychology and Artificial Intelligence. Very disciplined with Pomodoro study blocks.");
        sophiaProfile.setAvatarUrl("https://api.dicebear.com/7.x/bottts/svg?seed=Sophia");
        sophiaProfile.setInterests("Cognitive Science, UI/UX Research, Pomodoro Quiet Study, AI Ethics");
        sophiaProfile.setPreferredStudyMethod("Pomodoro Quiet Study");
        sophiaProfile.setAvailableStudyTimes("Weekday Mornings, Weekend Mornings");
        sophiaProfile.setSubjects(new HashSet<>(List.of(psyc101, cs303, math205)));
        profileRepository.save(sophiaProfile);

        // Student 5: Noah Taylor (Business & Economics)
        User noah = new User("noah@university.edu", defaultPassword, "Noah Taylor");
        userRepository.save(noah);
        Profile noahProfile = new Profile(noah, "MIT", "B.S. Management & Analytics", 4);
        noahProfile.setBio("Senior student focusing on quantitative finance and databases. Excited to exchange insights with technical students.");
        noahProfile.setAvatarUrl("https://api.dicebear.com/7.x/bottts/svg?seed=Noah");
        noahProfile.setInterests("Fintech, Quantitative Analysis, Case Studies, Chess");
        noahProfile.setPreferredStudyMethod("Online / Video Call");
        noahProfile.setAvailableStudyTimes("Weekday Evenings, Weekend Afternoons");
        noahProfile.setSubjects(new HashSet<>(List.of(bus110, cs202, math205)));
        profileRepository.save(noahProfile);

        // Student 6: Maya Patel (Physics & Engineering)
        User maya = new User("maya@university.edu", defaultPassword, "Maya Patel");
        userRepository.save(maya);
        Profile mayaProfile = new Profile(maya, "Stanford University", "B.S. Applied Physics", 3);
        mayaProfile.setBio("Physics major learning computing for simulations. Great at differential equations and classical mechanics.");
        mayaProfile.setAvatarUrl("https://api.dicebear.com/7.x/bottts/svg?seed=Maya");
        mayaProfile.setInterests("Physics Simulations, Robotics, Math Puzzles, Scientific Computing");
        mayaProfile.setPreferredStudyMethod("Problem Solving Sessions");
        mayaProfile.setAvailableStudyTimes("Weekday Evenings, Weekend Mornings");
        mayaProfile.setSubjects(new HashSet<>(List.of(phys101, math201, cs101)));
        profileRepository.save(mayaProfile);

        // 3. Seed Connections
        // Alex and Emma are ACCEPTED buddies
        Connection conn1 = new Connection(alex, emma, ConnectionStatus.ACCEPTED);
        connectionRepository.save(conn1);

        // Liam sent a connection request to Alex (PENDING)
        Connection conn2 = new Connection(liam, alex, ConnectionStatus.PENDING);
        connectionRepository.save(conn2);

        // Alex sent a connection request to Maya (PENDING)
        Connection conn3 = new Connection(alex, maya, ConnectionStatus.PENDING);
        connectionRepository.save(conn3);

        // 4. Seed Study Groups
        StudyGroup group1 = new StudyGroup("Algorithms & Interview Prep", "Weekly mock interviews, dynamic programming problems, and graph theory deep dives.", cs101, alex, 8);
        studyGroupRepository.save(group1);
        groupMemberRepository.save(new GroupMember(group1, alex, "ADMIN"));
        groupMemberRepository.save(new GroupMember(group1, emma, "MEMBER"));
        groupMemberRepository.save(new GroupMember(group1, maya, "MEMBER"));

        StudyGroup group2 = new StudyGroup("Deep Learning Reading Group", "Discussing cutting-edge research papers in computer vision and transformers.", cs303, emma, 12);
        studyGroupRepository.save(group2);
        groupMemberRepository.save(new GroupMember(group2, emma, "ADMIN"));
        groupMemberRepository.save(new GroupMember(group2, alex, "MEMBER"));
        groupMemberRepository.save(new GroupMember(group2, liam, "MEMBER"));
        groupMemberRepository.save(new GroupMember(group2, sophia, "MEMBER"));

        StudyGroup group3 = new StudyGroup("Linear Algebra Problem Squad", "Mastering eigenvalues, matrix proofs, and singular value decomposition together.", math201, liam, 6);
        studyGroupRepository.save(group3);
        groupMemberRepository.save(new GroupMember(group3, liam, "ADMIN"));
        groupMemberRepository.save(new GroupMember(group3, maya, "MEMBER"));

        // 5. Seed Direct Messages between Alex and Emma
        Message m1 = new Message(alex, emma, "Hey Emma! Excited to partner up for CS101 and the ML project.");
        Message m2 = new Message(emma, alex, "Hey Alex! Same here! Have you started looking into the graph problem set?");
        Message m3 = new Message(alex, emma, "Yes, I tackled the Dijkstra variation yesterday. Let's hop on a call or meet tomorrow evening!");
        Message m4 = new Message(emma, alex, "Sounds great! 6:00 PM works perfectly for me.");
        messageRepository.saveAll(List.of(m1, m2, m3, m4));

        // 6. Seed Group Messages
        GroupMessage gm1 = new GroupMessage(group1, alex, "Welcome everyone to the Algorithms study group! We will review DP on Trees this Thursday.");
        GroupMessage gm2 = new GroupMessage(group1, emma, "Awesome! I prepared some practice problems from LeetCode 124.");
        GroupMessage gm3 = new GroupMessage(group1, maya, "Looking forward to it! The tree recursion concepts were a bit tricky for me last week.");
        groupMessageRepository.saveAll(List.of(gm1, gm2, gm3));

        System.out.println(">>> Database seeding completed successfully! Test account: alex@university.edu / password123");
    }
}
