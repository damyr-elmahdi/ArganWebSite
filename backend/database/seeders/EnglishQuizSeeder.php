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
            'title' => 'English Grammar Test',
            'subject_id' => $englishSubject->id,
            'created_by' => User::where('role', 'teacher')->first()->id ?? 1
        ]);

        // Questions for Grammar Quiz from the document
        $grammarQuestions = [
            [
                'question_text' => 'This is the village ......... my grandmother was born.',
                'options' => [
                    ['option_text' => 'which', 'is_correct' => false],
                    ['option_text' => 'where', 'is_correct' => true],
                    ['option_text' => 'when', 'is_correct' => false],
                ]
            ],
            [
                'question_text' => 'I am so exhausted. I don\'t feel like .............. out today.',
                'options' => [
                    ['option_text' => 'go', 'is_correct' => false],
                    ['option_text' => 'to go', 'is_correct' => false],
                    ['option_text' => 'going', 'is_correct' => true],
                ]
            ],
            [
                'question_text' => 'By this time next year, we ........... to our new house.',
                'options' => [
                    ['option_text' => 'will move', 'is_correct' => false],
                    ['option_text' => 'will have moved', 'is_correct' => true],
                    ['option_text' => 'are going to move', 'is_correct' => false],
                ]
            ],
            [
                'question_text' => 'After Aicha ...... her homework, she went to bed.',
                'options' => [
                    ['option_text' => 'had done', 'is_correct' => true],
                    ['option_text' => 'did', 'is_correct' => false],
                    ['option_text' => 'has done', 'is_correct' => false],
                ]
            ],
            [
                'question_text' => 'If you had been careful, you ....... an accident.',
                'options' => [
                    ['option_text' => 'would not have', 'is_correct' => false],
                    ['option_text' => 'would not have had', 'is_correct' => true],
                    ['option_text' => 'will not have', 'is_correct' => false],
                ]
            ],
            [
                'question_text' => 'Will you please .... me a favour?',
                'options' => [
                    ['option_text' => 'take', 'is_correct' => false],
                    ['option_text' => 'make', 'is_correct' => false],
                    ['option_text' => 'do', 'is_correct' => true],
                ]
            ],
            [
                'question_text' => '...... ! There is an old woman crossing the street.',
                'options' => [
                    ['option_text' => 'Pass out', 'is_correct' => false],
                    ['option_text' => 'Watch out', 'is_correct' => true],
                    ['option_text' => 'Let out', 'is_correct' => false],
                ]
            ],
            [
                'question_text' => 'We have been waiting for an hour, but he didn\'t .....',
                'options' => [
                    ['option_text' => 'show up', 'is_correct' => true],
                    ['option_text' => 'come up', 'is_correct' => false],
                    ['option_text' => 'show off', 'is_correct' => false],
                ]
            ],
            [
                'question_text' => 'You have sore eyes. You ........ be very tired.',
                'options' => [
                    ['option_text' => 'should', 'is_correct' => false],
                    ['option_text' => 'can', 'is_correct' => false],
                    ['option_text' => 'must', 'is_correct' => true],
                ]
            ],
            [
                'question_text' => 'They took a taxi ..... they wouldn\'t be late.',
                'options' => [
                    ['option_text' => 'so as to', 'is_correct' => false],
                    ['option_text' => 'so that', 'is_correct' => true],
                    ['option_text' => 'so as not to', 'is_correct' => false],
                ]
            ],
            [
                'question_text' => '....... the terrible weather, many people attended the ceremony.',
                'options' => [
                    ['option_text' => 'Despite', 'is_correct' => true],
                    ['option_text' => 'Although', 'is_correct' => false],
                    ['option_text' => 'However', 'is_correct' => false],
                ]
            ],
            [
                'question_text' => '........ and hard work are the key to success.',
                'options' => [
                    ['option_text' => 'Determine', 'is_correct' => false],
                    ['option_text' => 'Determination', 'is_correct' => true],
                    ['option_text' => 'Determined', 'is_correct' => false],
                ]
            ],
            [
                'question_text' => 'Teenagers ....... to mobile phone has become a widespread phenomenon.',
                'options' => [
                    ['option_text' => 'addict', 'is_correct' => false],
                    ['option_text' => 'addicted', 'is_correct' => false],
                    ['option_text' => 'addiction', 'is_correct' => true],
                ]
            ],
            [
                'question_text' => 'Anas said that he ..... to go then.',
                'options' => [
                    ['option_text' => 'must', 'is_correct' => false],
                    ['option_text' => 'had to', 'is_correct' => true],
                    ['option_text' => 'has to', 'is_correct' => false],
                ]
            ],
            [
                'question_text' => 'I wish I .... a bird.',
                'options' => [
                    ['option_text' => 'am', 'is_correct' => false],
                    ['option_text' => 'was', 'is_correct' => false],
                    ['option_text' => 'were', 'is_correct' => true],
                ]
            ],
            [
                'question_text' => 'The robbers ...... to prison yesterday.',
                'options' => [
                    ['option_text' => 'was taken', 'is_correct' => false],
                    ['option_text' => 'have been taken', 'is_correct' => false],
                    ['option_text' => 'were taken', 'is_correct' => true],
                ]
            ],
            [
                'question_text' => 'Would you mind ..... the window please?',
                'options' => [
                    ['option_text' => 'opening', 'is_correct' => true],
                    ['option_text' => 'open', 'is_correct' => false],
                    ['option_text' => 'to open', 'is_correct' => false],
                ]
            ],
            [
                'question_text' => 'Salma wanted to know where ......',
                'options' => [
                    ['option_text' => 'have I been?', 'is_correct' => false],
                    ['option_text' => 'I had been', 'is_correct' => true],
                    ['option_text' => 'had I been', 'is_correct' => false],
                ]
            ],
            [
                'question_text' => 'We couldn\'t watch the football match on TV ....... some technical problems.',
                'options' => [
                    ['option_text' => 'become', 'is_correct' => false],
                    ['option_text' => 'since', 'is_correct' => false],
                    ['option_text' => 'due to', 'is_correct' => true],
                ]
            ],
            [
                'question_text' => 'You should avoid ..... fatty food. It\'s bad for your health.',
                'options' => [
                    ['option_text' => 'eating', 'is_correct' => true],
                    ['option_text' => 'eat', 'is_correct' => false],
                    ['option_text' => 'to eat', 'is_correct' => false],
                ]
            ],
        ];

        // Create a Vocabulary Quiz (original from seeder)
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

        // Create Literature Quiz (original from seeder)
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