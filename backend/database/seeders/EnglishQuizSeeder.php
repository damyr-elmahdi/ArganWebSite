<?php

namespace Database\Seeders;

use App\Models\Option;
use App\Models\Question;
use App\Models\Quiz;
use App\Models\Subject;
use App\Models\User;
use Illuminate\Database\Seeder;

class EnglishQuizSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Find or create an English subject
        $englishSubject = Subject::firstOrCreate(
            ['name' => 'English'],
            [
                'description' => 'English language and literature',
                'created_by' => User::where('role', 'teacher')->first()->id ?? 1
            ]
        );

        // Create an English Grammar Quiz
        $grammarQuiz = Quiz::create([
            'title' => 'English Grammar Fundamentals',
            'subject_id' => $englishSubject->id,
            'created_by' => User::where('role', 'teacher')->first()->id ?? 1
        ]);

        // Questions for Grammar Quiz
        $grammarQuestions = [
            [
                'question_text' => 'Which of the following is a proper noun?',
                'options' => [
                    ['option_text' => 'London', 'is_correct' => true],
                    ['option_text' => 'city', 'is_correct' => false],
                    ['option_text' => 'building', 'is_correct' => false],
                ]
            ],
            [
                'question_text' => 'What is the past tense of "eat"?',
                'options' => [
                    ['option_text' => 'eat', 'is_correct' => false],
                    ['option_text' => 'ate', 'is_correct' => true],
                    ['option_text' => 'eaten', 'is_correct' => false],
                ]
            ],
            [
                'question_text' => 'Which sentence uses the correct form of "there/their/they\'re"?',
                'options' => [
                    ['option_text' => 'There going to the store.', 'is_correct' => false],
                    ['option_text' => 'Their going to the store.', 'is_correct' => false],
                    ['option_text' => 'They\'re going to the store.', 'is_correct' => true],
                ]
            ],
            [
                'question_text' => 'Which word is an adverb?',
                'options' => [
                    ['option_text' => 'quickly', 'is_correct' => true],
                    ['option_text' => 'house', 'is_correct' => false],
                    ['option_text' => 'beautiful', 'is_correct' => false],
                ]
            ],
            [
                'question_text' => 'Identify the preposition in this sentence: "The cat is under the table."',
                'options' => [
                    ['option_text' => 'cat', 'is_correct' => false],
                    ['option_text' => 'under', 'is_correct' => true],
                    ['option_text' => 'table', 'is_correct' => false],
                ]
            ],
        ];

        // Create Vocabulary Quiz
        $vocabQuiz = Quiz::create([
            'title' => 'English Vocabulary Challenge',
            'subject_id' => $englishSubject->id,
            'created_by' => User::where('role', 'teacher')->first()->id ?? 1
        ]);

        // Questions for Vocabulary Quiz
        $vocabQuestions = [
            [
                'question_text' => 'What is the synonym of "happy"?',
                'options' => [
                    ['option_text' => 'sad', 'is_correct' => false],
                    ['option_text' => 'joyful', 'is_correct' => true],
                    ['option_text' => 'angry', 'is_correct' => false],
                ]
            ],
            [
                'question_text' => 'What is the antonym of "dark"?',
                'options' => [
                    ['option_text' => 'night', 'is_correct' => false],
                    ['option_text' => 'light', 'is_correct' => true],
                    ['option_text' => 'gloomy', 'is_correct' => false],
                ]
            ],
            [
                'question_text' => 'The word "ubiquitous" means:',
                'options' => [
                    ['option_text' => 'rare', 'is_correct' => false],
                    ['option_text' => 'found everywhere', 'is_correct' => true],
                    ['option_text' => 'beautiful', 'is_correct' => false],
                ]
            ],
            [
                'question_text' => 'Which word means "to speak in an unclear way"?',
                'options' => [
                    ['option_text' => 'mumble', 'is_correct' => true],
                    ['option_text' => 'shout', 'is_correct' => false],
                    ['option_text' => 'whisper', 'is_correct' => false],
                ]
            ],
            [
                'question_text' => 'What does "nostalgic" mean?',
                'options' => [
                    ['option_text' => 'feeling sick', 'is_correct' => false],
                    ['option_text' => 'feeling happy', 'is_correct' => false],
                    ['option_text' => 'feeling sentimental about the past', 'is_correct' => true],
                ]
            ],
        ];

        // Create Literature Quiz
        $litQuiz = Quiz::create([
            'title' => 'English Literature Classics',
            'subject_id' => $englishSubject->id,
            'created_by' => User::where('role', 'teacher')->first()->id ?? 1
        ]);

        // Questions for Literature Quiz
        $litQuestions = [
            [
                'question_text' => 'Who wrote "Romeo and Juliet"?',
                'options' => [
                    ['option_text' => 'Charles Dickens', 'is_correct' => false],
                    ['option_text' => 'William Shakespeare', 'is_correct' => true],
                    ['option_text' => 'Jane Austen', 'is_correct' => false],
                ]
            ],
            [
                'question_text' => 'In "To Kill a Mockingbird", what is the name of the narrator?',
                'options' => [
                    ['option_text' => 'Scout Finch', 'is_correct' => true],
                    ['option_text' => 'Atticus Finch', 'is_correct' => false],
                    ['option_text' => 'Boo Radley', 'is_correct' => false],
                ]
            ],
            [
                'question_text' => 'Which of these is NOT written by George Orwell?',
                'options' => [
                    ['option_text' => '1984', 'is_correct' => false],
                    ['option_text' => 'Animal Farm', 'is_correct' => false],
                    ['option_text' => 'Brave New World', 'is_correct' => true],
                ]
            ],
            [
                'question_text' => 'What literary device is used when non-human things are given human characteristics?',
                'options' => [
                    ['option_text' => 'personification', 'is_correct' => true],
                    ['option_text' => 'metaphor', 'is_correct' => false],
                    ['option_text' => 'simile', 'is_correct' => false],
                ]
            ],
            [
                'question_text' => 'Who is the author of "Pride and Prejudice"?',
                'options' => [
                    ['option_text' => 'Charlotte Brontë', 'is_correct' => false],
                    ['option_text' => 'Jane Austen', 'is_correct' => true],
                    ['option_text' => 'Emily Brontë', 'is_correct' => false],
                ]
            ],
        ];

        // Function to create questions and options
        $createQuestionsAndOptions = function ($quiz, $questionsData) {
            foreach ($questionsData as $questionData) {
                $question = Question::create([
                    'quiz_id' => $quiz->id,
                    'question_text' => $questionData['question_text'],
                ]);

                foreach ($questionData['options'] as $optionData) {
                    Option::create([
                        'question_id' => $question->id,
                        'option_text' => $optionData['option_text'],
                        'is_correct' => $optionData['is_correct'],
                    ]);
                }
            }
        };

        // Create questions and options for each quiz
        $createQuestionsAndOptions($grammarQuiz, $grammarQuestions);
        $createQuestionsAndOptions($vocabQuiz, $vocabQuestions);
        $createQuestionsAndOptions($litQuiz, $litQuestions);

        $this->command->info('English quiz seeder completed successfully!');
    }
}