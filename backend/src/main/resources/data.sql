-- ========================================================
-- Study Buddy Finder System - Sample Development Data
-- Passwords are BCrypt hash of 'password123'
-- ========================================================

-- Subjects
INSERT IGNORE INTO subjects (id, code, name, category, description) VALUES
(1, 'CS101', 'Data Structures & Algorithms', 'Computer Science', 'Fundamental algorithmic design, complexity analysis, and tree/graph structures.'),
(2, 'CS202', 'Database Management Systems', 'Computer Science', 'Relational algebra, SQL, indexing, transactions, and normalization.'),
(3, 'CS303', 'Machine Learning & AI', 'Computer Science', 'Supervised/unsupervised models, neural networks, feature engineering.'),
(4, 'MATH201', 'Linear Algebra & Vector Calculus', 'Mathematics', 'Vector spaces, eigenvalues, matrix decompositions, multivariable optimization.'),
(5, 'MATH205', 'Probability & Statistics', 'Mathematics', 'Discrete and continuous distributions, hypothesis testing, Bayesian inference.'),
(6, 'PHYS101', 'Classical Mechanics & Electromagnetism', 'Physics', 'Newtonian dynamics, conservation laws, Maxwell equations.'),
(7, 'BUS110', 'Principles of Microeconomics', 'Business', 'Supply and demand, consumer behavior, market structures, game theory.'),
(8, 'PSYC101', 'Introduction to Cognitive Psychology', 'Psychology', 'Memory architectures, human perception, decision making paradigms.');

-- Users (All have password: 'password123')
-- BCrypt: $2a$10$wT8hLhy01qXlPzS2aK9Rfe4yqEaJ3xW9I79x/v8rLpT5jQd5n7GzC
INSERT IGNORE INTO users (id, email, password, name, role, active) VALUES
(1, 'alex@university.edu', '$2a$10$e8l4K6f1P3Y8lQ1A0rXo0.Z5R.P0X8Q9Z5R.P0X8Q9Z5R.P0X8Q9.', 'Alex Rivera', 'ROLE_STUDENT', 1),
(2, 'emma@university.edu', '$2a$10$e8l4K6f1P3Y8lQ1A0rXo0.Z5R.P0X8Q9Z5R.P0X8Q9Z5R.P0X8Q9.', 'Emma Watson', 'ROLE_STUDENT', 1),
(3, 'liam@university.edu', '$2a$10$e8l4K6f1P3Y8lQ1A0rXo0.Z5R.P0X8Q9Z5R.P0X8Q9Z5R.P0X8Q9.', 'Liam Chen', 'ROLE_STUDENT', 1),
(4, 'sophia@university.edu', '$2a$10$e8l4K6f1P3Y8lQ1A0rXo0.Z5R.P0X8Q9Z5R.P0X8Q9Z5R.P0X8Q9.', 'Sophia Martinez', 'ROLE_STUDENT', 1),
(5, 'noah@university.edu', '$2a$10$e8l4K6f1P3Y8lQ1A0rXo0.Z5R.P0X8Q9Z5R.P0X8Q9Z5R.P0X8Q9.', 'Noah Taylor', 'ROLE_STUDENT', 1),
(6, 'maya@university.edu', '$2a$10$e8l4K6f1P3Y8lQ1A0rXo0.Z5R.P0X8Q9Z5R.P0X8Q9Z5R.P0X8Q9.', 'Maya Patel', 'ROLE_STUDENT', 1);

-- Profiles
INSERT IGNORE INTO profiles (id, user_id, university, course, year_of_study, bio, avatar_url, interests, preferred_study_method, available_study_times) VALUES
(1, 1, 'Stanford University', 'B.S. Computer Science', 3, 'Passionate about algorithms, system design, and competitive programming. Looking for a study buddy for CS101 and Machine Learning!', 'https://api.dicebear.com/7.x/bottts/svg?seed=Alex', 'Competitive Programming, Machine Learning, Open Source, Hackathons', 'Hybrid', 'Weekday Evenings, Weekend Mornings'),
(2, 2, 'Stanford University', 'B.S. Computer Science', 3, 'AI enthusiast working on computer vision and neural networks. Let us solve LeetCode problems and prepare for technical interviews together!', 'https://api.dicebear.com/7.x/bottts/svg?seed=Emma', 'Machine Learning, Competitive Programming, Deep Learning, Hackathons', 'Hybrid', 'Weekday Evenings, Weekend Mornings, Weekend Afternoons'),
(3, 3, 'Stanford University', 'B.S. Data Science', 2, 'Double majoring in Math and CS. Love mathematical proofs and statistical modeling. Looking for focused library study partners.', 'https://api.dicebear.com/7.x/bottts/svg?seed=Liam', 'Data Science, Statistical Modeling, Chess, Machine Learning', 'In-Person Library', 'Weekday Evenings, Weekend Afternoons'),
(4, 4, 'UC Berkeley', 'B.A. Cognitive Science', 2, 'Exploring the intersection of human psychology and Artificial Intelligence. Very disciplined with Pomodoro study blocks.', 'https://api.dicebear.com/7.x/bottts/svg?seed=Sophia', 'Cognitive Science, UI/UX Research, Pomodoro Quiet Study, AI Ethics', 'Pomodoro Quiet Study', 'Weekday Mornings, Weekend Mornings'),
(5, 5, 'MIT', 'B.S. Management & Analytics', 4, 'Senior student focusing on quantitative finance and databases. Excited to exchange insights with technical students.', 'https://api.dicebear.com/7.x/bottts/svg?seed=Noah', 'Fintech, Quantitative Analysis, Case Studies, Chess', 'Online / Video Call', 'Weekday Evenings, Weekend Afternoons'),
(6, 6, 'Stanford University', 'B.S. Applied Physics', 3, 'Physics major learning computing for simulations. Great at differential equations and classical mechanics.', 'https://api.dicebear.com/7.x/bottts/svg?seed=Maya', 'Physics Simulations, Robotics, Math Puzzles, Scientific Computing', 'Problem Solving Sessions', 'Weekday Evenings, Weekend Mornings');

-- User Subjects
INSERT IGNORE INTO user_subjects (profile_id, subject_id) VALUES
(1, 1), (1, 2), (1, 3), (1, 4),
(2, 1), (2, 3), (2, 4), (2, 5),
(3, 2), (3, 3), (3, 4), (3, 5),
(4, 3), (4, 5), (4, 8),
(5, 2), (5, 5), (5, 7),
(6, 1), (6, 4), (6, 6);

-- Connections
INSERT IGNORE INTO connections (id, requester_id, receiver_id, status) VALUES
(1, 1, 2, 'ACCEPTED'),
(2, 3, 1, 'PENDING'),
(3, 1, 6, 'PENDING');

-- Study Groups
INSERT IGNORE INTO study_groups (id, name, description, subject_id, creator_id, max_members) VALUES
(1, 'Algorithms & Interview Prep', 'Weekly mock interviews, dynamic programming problems, and graph theory deep dives.', 1, 1, 8),
(2, 'Deep Learning Reading Group', 'Discussing cutting-edge research papers in computer vision and transformers.', 3, 2, 12),
(3, 'Linear Algebra Problem Squad', 'Mastering eigenvalues, matrix proofs, and singular value decomposition together.', 4, 3, 6);

-- Group Members
INSERT IGNORE INTO group_members (id, group_id, user_id, role) VALUES
(1, 1, 1, 'ADMIN'),
(2, 1, 2, 'MEMBER'),
(3, 1, 6, 'MEMBER'),
(4, 2, 2, 'ADMIN'),
(5, 2, 1, 'MEMBER'),
(6, 2, 3, 'MEMBER'),
(7, 2, 4, 'MEMBER'),
(8, 3, 3, 'ADMIN'),
(9, 3, 6, 'MEMBER');
