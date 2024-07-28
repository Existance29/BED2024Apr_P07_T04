const OpenAI = require('openai');
const Quiz = require("../models/quiz");

const createQuiz = async (req, res) => {
    try {
        const { title, description, totalQuestions, totalMarks, duration, maxAttempts } = req.body;

        if (!title || !description || !totalQuestions || !totalMarks || !duration || !maxAttempts) {
            console.log("Missing fields:", { title, description, totalQuestions, totalMarks, duration, maxAttempts });
            return res.status(400).json({ message: "Missing required fields" });
        }

        const newQuizData = {
            title,
            description,
            totalQuestions: parseInt(totalQuestions),
            totalMarks: parseInt(totalMarks),
            duration: parseInt(duration),
            maxAttempts: parseInt(maxAttempts),
        };

        const createdQuiz = await Quiz.createQuiz(newQuizData);

        res.status(201).json(createdQuiz);
    } catch (error) {
        console.error("Error creating quiz:", error);
        res.status(500).json({ message: "Error creating quiz", error: error.message });
    }
};

const createQuizQuestion = async (req, res) => {
    const quizId = parseInt(req.params.quizId);
    const { questions } = req.body;

    if (!questions || !Array.isArray(questions) || questions.length === 0) {
        console.log("Missing or invalid questions array");
        return res.status(400).json({ message: "Missing or invalid questions array" });
    }

    try {
        const createdQuestions = [];
        for (const question of questions) {
            const { text, options, correctAnswer } = question;

            if (!text || !options || correctAnswer === undefined) {
                console.log("Missing fields:", { text, options, correctAnswer });
                return res.status(400).json({ message: "Missing required fields" });
            }

            const newQuestionData = {
                quizId: quizId,
                text,
                options: JSON.stringify(options),
                correctAnswer: parseInt(correctAnswer)
            };

            const createdQuestion = await Quiz.createQuizQuestion(newQuestionData);
            createdQuestions.push(createdQuestion);
        }

        res.status(201).json({ questions: createdQuestions });
    } catch (error) {
        console.error("Error creating quiz questions:", error);
        res.status(500).json({ message: "Error creating quiz questions", error: error.message });
    }
};

const getAllQuizzes = async (req, res) => {
    try {
        const quizzes = await Quiz.getAllQuizzes();
        res.json(quizzes);
    } catch (error) {
        console.error(error);
        res.status(500).send("Error retrieving quizzes");
    }
};

const getQuizById = async (req, res) => {
    const id = parseInt(req.params.quizId);
    try {
        const quiz = await Quiz.getQuizById(id);
        if (!quiz) {
            return res.status(404).send("Quiz not found");
        }
        res.json(quiz);
    } catch (error) {
        console.error(error);
        res.status(500).send("Error retrieving quiz");
    }
};

const getQuizQuestions = async (req, res) => {
    const quizId = parseInt(req.params.quizId);
    try {
        const questions = await Quiz.getQuizQuestions(quizId);
        res.json(questions);
    } catch (error) {
        console.error('Error fetching quiz questions:', error);
        res.status(500).send("Error fetching quiz questions");
    }
};

const submitQuizAnswers = async (req, res) => {
    const userId = req.user.userId; // Get userId from the JWT token
    const quizId = parseInt(req.params.quizId);
    const { answers, duration } = req.body;

    try {
        const result = await Quiz.submitQuizAnswers(quizId, userId, answers, duration);
        res.json(result);
    } catch (error) {
        console.error(error);
        res.status(500).send("Error submitting quiz answers");
    }
};

const getQuizResult = async (req, res) => {
    const quizId = parseInt(req.params.quizId);
    const resultId = parseInt(req.params.resultId);
    const userId = req.user.userId; // Get userId from the JWT token

    try {
        const result = await Quiz.getQuizResult(quizId, resultId, userId);
        res.json(result);
    } catch (error) {
        console.error(`Error fetching quiz result for quizId ${quizId} and resultId ${resultId}:`, error);
        res.status(500).send("Error fetching quiz result");
    }
};

const canAttemptQuiz = async (req, res) => {
    const userId = req.user.userId; // Get userId from the JWT token
    const quizId = parseInt(req.params.quizId);

    try {
        const { canAttempt, attempts, maxAttempts } = await Quiz.canAttemptQuiz(quizId, userId);
        res.json({ canAttempt, attempts, maxAttempts });
    } catch (error) {
        console.error('Error checking quiz attempt eligibility:', error);
        res.status(500).send("Error checking quiz attempt eligibility");
    }
};

const checkQuizAttempts = async (req, res) => {
    const quizId = parseInt(req.params.quizId);
    try {
        const attempts = await Quiz.checkQuizAttempts(quizId);
        res.json({ hasAttempts: attempts > 0 });
    } catch (error) {
        console.error('Error checking quiz attempts:', error);
        res.status(500).send("Error checking quiz attempts");
    }
};

const getUserQuizResults = async (req, res) => {
    const userId = req.user.userId; // Get userId from the JWT token

    try {
        const results = await Quiz.getUserQuizResults(userId);
        res.json(results);
    } catch (error) {
        console.error('Error fetching user quiz results:', error);
        res.status(500).send("Error fetching user quiz results");
    }
};

const updateQuiz = async (req, res) => {
    try {
        const quizId = parseInt(req.params.quizId);
        const { title, description, totalQuestions, totalMarks, duration, maxAttempts } = req.body;

        if (!title || !description || !totalQuestions || !totalMarks || !duration || !maxAttempts) {
            return res.status(400).json({ message: "Missing required fields" });
        }

        const updatedQuizData = {
            title,
            description,
            totalQuestions: parseInt(totalQuestions),
            totalMarks: parseInt(totalMarks),
            duration: parseInt(duration),
            maxAttempts: parseInt(maxAttempts)
        };

        const updatedQuiz = await Quiz.updateQuiz(quizId, updatedQuizData);

        res.status(200).json(updatedQuiz);
    } catch (error) {
        console.error("Error updating quiz:", error);
        res.status(500).json({ message: "Error updating quiz", error: error.message });
    }
};

const updateQuizQuestions = async (req, res) => {
    const quizId = parseInt(req.params.quizId);
    const { questions } = req.body;

    if (!questions || !Array.isArray(questions) || questions.length === 0) {
        console.log("Missing or invalid questions array");
        return res.status(400).json({ message: "Missing or invalid questions array" });
    }

    try {
        console.log('Received questions for updating:', questions); 
        await Quiz.updateQuizQuestions(quizId, questions);
        res.status(200).json({ message: 'Questions updated successfully' });
    } catch (error) {
        console.error("Error updating quiz questions:", error);
        res.status(500).json({ message: "Error updating quiz questions", error: error.message });
    }
};



const deleteQuiz = async (req, res) => {
    const id = parseInt(req.params.id);
    try {
        const success = await Quiz.deleteQuiz(id);
        if (!success) {
            return res.status(404).send("Quiz not found");
        }
        res.status(204).send();
    } catch (error) {
        console.error(error);
        res.status(500).send("Error deleting quiz");
    }
};

const getQuizzesAPI = async (req, res) => {
    try {
        const OPENAI_API_KEY = process.env.OPENAI_API_KEY;
        const openai = new OpenAI(OPENAI_API_KEY);
        const aiModel = "gpt-4o";

        const messages = [
            {
                role: "system",
                content: `You are a quiz master of ITMastermindz, an educational website focused on teaching IT related topics like Python, AngularJS, VueJS, AWS, ReactJS, SoftwareTesting, CoreUI, PowerBI. Create a quiz about Python, AngularJS, VueJS, AWS, ReactJS, SoftwareTesting, CoreUI, PowerBI, with 5 multiple choice questions. Each question should have 4 options labeled as A, B, C, and D. Indicate the correct answer. totalMarks must be fixed to totalQuestions * 10. duration must be 5, and maxAttempts must be 2. Format the response as JSON in the following structure: { "title": "Quiz Title", "description": "Quiz description", "totalQuestions": 5, "totalMarks": 50, "duration": 30, "maxAttempts": 3, "questions": [ { "text": "Question 1?", "options": ["Option A", "Option B", "Option C", "Option D"], "correctAnswer": 1 }, { "text": "Question 2?", "options": ["Option A", "Option B", "Option C", "Option D"], "correctAnswer": 3 } ] } This is an example of an existing python quiz: { "title": "Python Programming", "description": "Test your knowledge on Python programming.", "totalQuestions": 5, "totalMarks": 50, "duration": 30, "maxAttempts": 2, "questions": [ { "text": "What is the correct file extension for Python files?", "options": [".python", ".pyth", ".py", ".pyt"], "correctAnswer": 2 }, { "text": "Which keyword is used to create a function in Python?", "options": ["function", "def", "fun", "define"], "correctAnswer": 1 }, { "text": "How do you create a list in Python?", "options": ["list = {}", "list = []", "list = ()", "list = ||"], "correctAnswer": 1 }, { "text": "Which method is used to add an element to the end of a list in Python?", "options": ["add()", "append()", "insert()", "push()"], "correctAnswer": 1 }, { "text": "How do you start a for loop in Python?", "options": ["for x in y:", "for(x in y)", "for x in y", "for x:y"], "correctAnswer": 0 } ] }`
            },
            {
                role: "user",
                content: `Create a random quiz about any of these topics: Python, AngularJS, VueJS, AWS, ReactJS, SoftwareTesting, CoreUI, PowerBI, with 5 multiple choice questions.`
            }

        ];

        const completion = await openai.chat.completions.create({
            model: aiModel,
            response_format: {"type": "json_object"},
            messages,
            temperature: 0.7, 
            max_tokens: 700,
            top_p: 0.9, 
            frequency_penalty: 0,
            presence_penalty: 0,
        });

        const aiResponse = completion.choices[0].message.content;
        const quizData = JSON.parse(aiResponse);

        res.status(201).json(quizData);
    } catch (error) {
        console.error('Error creating quiz via OpenAI:', error);
        res.status(500).json({ message: 'Error creating quiz via OpenAI', error: error.message });
    }
};

const calculateGrade = (score, totalMarks) => {
    const percentage = (score / totalMarks) * 100;
    if (percentage >= 90) return "A+";
    if (percentage >= 80) return "A";
    if (percentage >= 70) return "B";
    if (percentage >= 60) return "C";
    if (percentage >= 50) return "D";
    return "F";
};

const submitRandomQuiz = async (req, res) => {
    const { answers, duration, questions } = req.body; 

    const totalQuestions = answers.length;
    const totalMarks = totalQuestions * 10;
    let score = 0;
    let correctAnswersCount = 0;
    let incorrectQuestions = [];

    for (const [index, answer] of answers.entries()) {
        const correctAnswer = questions[index].correctAnswer;
        if (answer.answer === correctAnswer) {
            score += 10;
            correctAnswersCount++;
        } else {
            incorrectQuestions.push({
                questionId: index,
                text: questions[index].text,
                userAnswer: answer.answer,
                correctAnswer: correctAnswer,
                options: questions[index].options 
            });
        }
    }

    const grade = calculateGrade(score, totalMarks);

    const result = {
        score,
        totalQuestions,
        correctAnswers: correctAnswersCount,
        incorrectQuestions, 
        duration,
        totalMarks,
        grade
    };

 
    req.session.randomQuizResult = result;
    res.json(result);
};



const getRandomQuizResult = async (req, res) => {
    const result = req.session.randomQuizResult;
    if (!result) {
        return res.status(404).send("No quiz result found");
    }

    res.json(result);
};


module.exports = {
    getAllQuizzes,
    getQuizById,
    getQuizQuestions,
    submitQuizAnswers,
    getQuizResult,
    canAttemptQuiz,
    checkQuizAttempts,
    getUserQuizResults,
    deleteQuiz,
    createQuiz,
    createQuizQuestion ,
    updateQuiz,
    updateQuizQuestions,
    getQuizzesAPI,
    submitRandomQuiz,
    getRandomQuizResult
};
