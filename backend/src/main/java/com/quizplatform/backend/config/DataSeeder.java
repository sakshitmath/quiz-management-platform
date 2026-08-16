package com.quizplatform.backend.config;

import com.quizplatform.backend.entity.*;
import com.quizplatform.backend.repository.*;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import java.util.List;

@Component
public class DataSeeder implements CommandLineRunner {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final CategoryRepository categoryRepository;
    private final QuizRepository quizRepository;
    private final QuestionRepository questionRepository;
    private final OptionRepository optionRepository;

    public DataSeeder(UserRepository userRepository, PasswordEncoder passwordEncoder,
                      CategoryRepository categoryRepository, QuizRepository quizRepository,
                      QuestionRepository questionRepository, OptionRepository optionRepository) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
        this.categoryRepository = categoryRepository;
        this.quizRepository = quizRepository;
        this.questionRepository = questionRepository;
        this.optionRepository = optionRepository;
    }

    @Override
    public void run(String... args) {
        seedAdmin();
        seedBulkQuizContent();
    }

    private void seedAdmin() {
        String adminEmail = "admin@quizplatform.com";
        if (!userRepository.existsByEmail(adminEmail)) {
            User admin = new User();
            admin.setName("Admin");
            admin.setEmail(adminEmail);
            admin.setPassword(passwordEncoder.encode("Admin@1234"));
            admin.setRole(User.Role.ADMIN);
            admin.setActive(true);
            userRepository.save(admin);
            System.out.println(">>> Admin user created: " + adminEmail);
        }
    }

    private void seedBulkQuizContent() {
        // Marker check — only seed once
        if (quizRepository.findAll().stream().anyMatch(q -> q.getTitle().equals("Java OOP & Basics"))) {
            return;
        }
        System.out.println(">>> Seeding bulk quiz content...");

        Category sqlCategory = getOrCreateCategory("SQL", "Database query language quizzes");
        Category javaCategory = getOrCreateCategory("Java", "Java programming quizzes");
        Category pythonCategory = getOrCreateCategory("Python", "Python programming quizzes");

        createJavaQuiz(javaCategory);
        createPythonQuiz(pythonCategory);
        createSqlQuiz(sqlCategory);

        System.out.println(">>> Bulk quiz content seeded successfully.");
    }

    private Category getOrCreateCategory(String name, String description) {
        return categoryRepository.findAll().stream()
                .filter(c -> c.getName().equals(name))
                .findFirst()
                .orElseGet(() -> {
                    Category c = new Category();
                    c.setName(name);
                    c.setDescription(description);
                    return categoryRepository.save(c);
                });
    }

    private Quiz createQuiz(String title, String description, Category category, Quiz.Difficulty difficulty,
                            int duration, int passingScore, int maxAttempts) {
        Quiz quiz = new Quiz();
        quiz.setTitle(title);
        quiz.setDescription(description);
        quiz.setCategory(category);
        quiz.setDifficulty(difficulty);
        quiz.setDuration(duration);
        quiz.setPassingScore(passingScore);
        quiz.setMaxAttempts(maxAttempts);
        quiz.setStatus(Quiz.Status.PUBLISHED);
        return quizRepository.save(quiz);
    }

    private void addQuestion(Quiz quiz, String text, int marks, String explanation, Quiz.Difficulty difficulty,
                             String optA, String optB, String optC, String optD, int correctIndex) {
        Question question = new Question();
        question.setQuiz(quiz);
        question.setQuestionText(text);
        question.setMarks(marks);
        question.setExplanation(explanation);
        question.setDifficulty(difficulty);
        Question saved = questionRepository.save(question);

        String[] optionTexts = {optA, optB, optC, optD};
        for (int i = 0; i < optionTexts.length; i++) {
            Option option = new Option();
            option.setQuestion(saved);
            option.setOptionText(optionTexts[i]);
            option.setCorrect(i == correctIndex);
            optionRepository.save(option);
        }
    }

    private void createJavaQuiz(Category category) {
        Quiz quiz = createQuiz(
                "Java OOP & Basics",
                "Covers Java fundamentals, OOP concepts, and core syntax for freshers.",
                category, Quiz.Difficulty.INTERMEDIATE, 25, 60, 5
        );

        addQuestion(quiz, "Which keyword is used to declare a constant in Java?", 5,
                "The final keyword prevents reassignment of a variable.", Quiz.Difficulty.EASY,
                "var", "let", "final", "static", 2);

        addQuestion(quiz, "Which of these is NOT a primitive data type in Java?", 5,
                "String is a class, not a primitive type.", Quiz.Difficulty.EASY,
                "int", "boolean", "String", "char", 2);

        addQuestion(quiz, "What is the default value of a boolean instance variable in Java?", 5,
                "Instance boolean variables default to false if not initialized.", Quiz.Difficulty.EASY,
                "true", "false", "0", "null", 1);

        addQuestion(quiz, "Which method is the entry point of a Java application?", 5,
                "The main method is where JVM execution begins.", Quiz.Difficulty.EASY,
                "start()", "main()", "run()", "init()", 1);

        addQuestion(quiz, "Which OOP concept allows a subclass to provide a specific implementation of a method already defined in its parent class?", 10,
                "This describes method overriding, a core OOP polymorphism feature.", Quiz.Difficulty.INTERMEDIATE,
                "Overloading", "Overriding", "Encapsulation", "Abstraction", 1);

        addQuestion(quiz, "Which keyword is used to inherit a class in Java?", 5,
                "extends is used for class inheritance in Java.", Quiz.Difficulty.INTERMEDIATE,
                "implements", "extends", "inherits", "super", 1);

        addQuestion(quiz, "What does the 'static' keyword mean when applied to a method?", 10,
                "Static methods belong to the class rather than any instance.", Quiz.Difficulty.INTERMEDIATE,
                "It can only be called once", "It belongs to the class, not an instance", "It cannot be overridden", "It runs before main()", 1);

        addQuestion(quiz, "Which collection class does NOT allow duplicate elements?", 10,
                "Set (and its implementations like HashSet) does not allow duplicates.", Quiz.Difficulty.INTERMEDIATE,
                "ArrayList", "LinkedList", "Set", "Stack", 2);

        addQuestion(quiz, "What is the time complexity of accessing an element in a HashMap on average?", 15,
                "HashMap offers O(1) average time complexity for get/put operations.", Quiz.Difficulty.HARD,
                "O(n)", "O(log n)", "O(1)", "O(n log n)", 2);

        addQuestion(quiz, "Which exception is thrown when dividing an integer by zero in Java?", 15,
                "ArithmeticException is thrown for integer division by zero.", Quiz.Difficulty.HARD,
                "NullPointerException", "ArithmeticException", "NumberFormatException", "ClassCastException", 1);
    }

    private void createPythonQuiz(Category category) {
        Quiz quiz = createQuiz(
                "Python Essentials",
                "Covers Python syntax, data structures, and core concepts for beginners.",
                category, Quiz.Difficulty.EASY, 20, 60, 5
        );

        addQuestion(quiz, "Which symbol is used for comments in Python?", 5,
                "The hash symbol (#) starts a single-line comment in Python.", Quiz.Difficulty.EASY,
                "//", "#", "/*", "--", 1);

        addQuestion(quiz, "Which of these is a mutable data type in Python?", 5,
                "Lists are mutable; tuples and strings are immutable.", Quiz.Difficulty.EASY,
                "Tuple", "String", "List", "Integer", 2);

        addQuestion(quiz, "What does the 'len()' function do?", 5,
                "len() returns the number of items in an object like a list or string.", Quiz.Difficulty.EASY,
                "Returns the length of an object", "Converts to lowercase", "Deletes an element", "Returns the type", 0);

        addQuestion(quiz, "Which keyword is used to define a function in Python?", 5,
                "The def keyword is used to define functions in Python.", Quiz.Difficulty.EASY,
                "function", "def", "func", "define", 1);

        addQuestion(quiz, "What is the output of 3 * '5' in Python?", 10,
                "Multiplying a string by an integer repeats the string, giving '555'.", Quiz.Difficulty.INTERMEDIATE,
                "15", "555", "Error", "35", 1);

        addQuestion(quiz, "Which method is used to add an item to the end of a list?", 5,
                "append() adds a single item to the end of a list.", Quiz.Difficulty.INTERMEDIATE,
                "add()", "append()", "insert()", "extend()", 1);

        addQuestion(quiz, "What does a list comprehension like [x*2 for x in range(5)] produce?", 10,
                "It produces [0, 2, 4, 6, 8] — doubling each number from 0 to 4.", Quiz.Difficulty.INTERMEDIATE,
                "[0, 2, 4, 6, 8]", "[1, 2, 3, 4, 5]", "[2, 4, 6, 8, 10]", "Error", 0);

        addQuestion(quiz, "What is the correct way to open a file for reading in Python?", 10,
                "open('file.txt', 'r') opens a file in read mode.", Quiz.Difficulty.INTERMEDIATE,
                "open('file.txt', 'w')", "open('file.txt', 'r')", "read('file.txt')", "file.open('file.txt')", 1);

        addQuestion(quiz, "What does the 'self' parameter represent in a Python class method?", 15,
                "self refers to the instance calling the method, giving access to its attributes.", Quiz.Difficulty.HARD,
                "The class itself", "The instance calling the method", "A static reference", "The parent class", 1);

        addQuestion(quiz, "Which exception is raised when you try to access a list index that doesn't exist?", 15,
                "IndexError is raised for out-of-range list indices.", Quiz.Difficulty.HARD,
                "KeyError", "IndexError", "ValueError", "TypeError", 1);
    }

    private void createSqlQuiz(Category category) {
        Quiz quiz = createQuiz(
                "SQL Fundamentals",
                "Covers basic to intermediate SQL query concepts.",
                category, Quiz.Difficulty.EASY, 20, 60, 5
        );

        addQuestion(quiz, "Which SQL statement is used to retrieve data from a database?", 5,
                "SELECT is used to query and retrieve data from a database.", Quiz.Difficulty.EASY,
                "GET", "SELECT", "FETCH", "RETRIEVE", 1);

        addQuestion(quiz, "Which clause is used to filter rows in a SQL query?", 5,
                "WHERE filters rows based on a specified condition.", Quiz.Difficulty.EASY,
                "FILTER", "WHERE", "HAVING", "GROUP BY", 1);

        addQuestion(quiz, "Which SQL keyword is used to sort the result set?", 5,
                "ORDER BY sorts the result set in ascending or descending order.", Quiz.Difficulty.EASY,
                "SORT BY", "ORDER BY", "ARRANGE BY", "GROUP BY", 1);

        addQuestion(quiz, "Which command is used to remove a table completely from a database?", 5,
                "DROP TABLE removes the entire table structure and its data.", Quiz.Difficulty.EASY,
                "DELETE TABLE", "REMOVE TABLE", "DROP TABLE", "TRUNCATE ROW", 2);

        addQuestion(quiz, "What does the PRIMARY KEY constraint ensure?", 10,
                "A PRIMARY KEY ensures each row has a unique, non-null identifier.", Quiz.Difficulty.INTERMEDIATE,
                "Allows duplicate values", "Ensures uniqueness and non-null values", "Allows null values", "Sorts the table", 1);

        addQuestion(quiz, "Which JOIN returns only matching rows from both tables?", 10,
                "INNER JOIN returns rows that have matching values in both tables.", Quiz.Difficulty.INTERMEDIATE,
                "LEFT JOIN", "RIGHT JOIN", "INNER JOIN", "FULL OUTER JOIN", 2);

        addQuestion(quiz, "Which clause is used to filter groups after using GROUP BY?", 10,
                "HAVING filters aggregated groups, unlike WHERE which filters rows before grouping.", Quiz.Difficulty.INTERMEDIATE,
                "WHERE", "HAVING", "FILTER", "ON", 1);

        addQuestion(quiz, "What does a FOREIGN KEY do?", 15,
                "A FOREIGN KEY links a column to the PRIMARY KEY of another table, enforcing referential integrity.", Quiz.Difficulty.HARD,
                "Speeds up queries", "Links to a primary key in another table", "Prevents duplicate rows", "Sorts the table", 1);

        addQuestion(quiz, "Which SQL function returns the number of rows matching a condition?", 15,
                "COUNT() returns the number of rows that match the specified criteria.", Quiz.Difficulty.HARD,
                "SUM()", "COUNT()", "TOTAL()", "ROWS()", 1);
    }
}