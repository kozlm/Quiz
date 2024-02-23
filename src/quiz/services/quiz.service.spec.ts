import { Test, TestingModule } from '@nestjs/testing';
import { QuizService } from './quiz.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Question, QuestionType } from '../models/question.entity';
import { Quiz } from '../models/quiz.entity';
import { Result } from '../models/result.object';
import { AttemptInput } from '../inputs/attempt.input';
import { BadRequestException } from '@nestjs/common';


describe('QuizService', () => {

    let quizService: QuizService;
    let quizRepository: Repository<Quiz>;
    let questionRepository: Repository<Question>;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                QuizService,
                {
                    provide: getRepositoryToken(Quiz),
                    useClass: Repository,
                },
                {
                    provide: getRepositoryToken(Question),
                    useClass: Repository,
                },
            ],
        }).compile();

        quizService = module.get<QuizService>(QuizService);
        quizRepository = module.get<Repository<Quiz>>(getRepositoryToken(Quiz));
        questionRepository = module.get<Repository<Question>>(getRepositoryToken(Question));
    });

    describe('checkAnswers', () => {
        it('should return result for valid attempt data', async () => {

            var mockQuiz: Quiz = {
                id: 1,
                name: 'test',
                questions: [],
            };
            mockQuiz.questions.push(
                { id: 1, text: 'test', type: QuestionType.SINGLE_ANSWER, answer: '0', options: ['a', 'b', 'c', 'd'], quiz: mockQuiz },
                { id: 2, text: 'test', type: QuestionType.MULTIPLE_ANSWER, answer: '23', options: ['a', 'b', 'c', 'd'], quiz: mockQuiz },
                { id: 3, text: 'test', type: QuestionType.SORTING, answer: '210', options: ['a', 'b', 'c'], quiz: mockQuiz },
                { id: 4, text: 'test', type: QuestionType.TEXT, answer: 'Ans', options: [], quiz: mockQuiz },
            );

            jest.spyOn(quizService, 'getQuizById').mockResolvedValue(mockQuiz);

            var attemptData: AttemptInput = {
                quizId: 1,
                questions: [
                    { questionId: 1, givenAnswer: '0' },
                    { questionId: 2, givenAnswer: '231' },
                    { questionId: 3, givenAnswer: '210' },
                    { questionId: 4, givenAnswer: 'ans.' },
                ],
            };

            var result: Result = await quizService.checkAnswers(attemptData);

            expect(result.maximumScore).toEqual(4);
            expect(result.score).toEqual(3);

            mockQuiz.questions = [];
            mockQuiz.questions.push(
                { id: 1, text: 'test', type: QuestionType.SINGLE_ANSWER, answer: '0', options: ['a', 'b', 'c', 'd'], quiz: mockQuiz },
                { id: 2, text: 'test', type: QuestionType.MULTIPLE_ANSWER, answer: '234', options: ['a', 'b', 'c', 'd', 'e'], quiz: mockQuiz },
                { id: 3, text: 'test', type: QuestionType.SORTING, answer: '2103', options: ['a', 'b', 'c', 'd'], quiz: mockQuiz },
                { id: 4, text: 'test', type: QuestionType.TEXT, answer: 'Ans.', options: [], quiz: mockQuiz },
                { id: 5, text: 'test', type: QuestionType.SINGLE_ANSWER, answer: '1', options: ['a', 'b', 'c', 'd'], quiz: mockQuiz },
            );

            jest.clearAllMocks();
            jest.spyOn(quizService, 'getQuizById').mockResolvedValue(mockQuiz);

            attemptData = {
                quizId: 1,
                questions: [
                    { questionId: 1, givenAnswer: '0' },
                    { questionId: 2, givenAnswer: '423' },
                    { questionId: 3, givenAnswer: '2130' },
                    { questionId: 4, givenAnswer: 'ans' },
                    { questionId: 5, givenAnswer: '' },
                ],
            };

            result = await quizService.checkAnswers(attemptData);

            expect(result.maximumScore).toEqual(5);
            expect(result.score).toEqual(3);
        });

        it('should throw BadRequestException for answer containing invalid option index', async () => {

            const mockQuiz: Quiz = {
                id: 1,
                name: 'test',
                questions: [],
            };
            mockQuiz.questions.push(
                { id: 1, text: 'test', type: QuestionType.SINGLE_ANSWER, answer: '0', options: ['a', 'b', 'c', 'd'], quiz: mockQuiz },
                { id: 2, text: 'test', type: QuestionType.MULTIPLE_ANSWER, answer: '23', options: ['a', 'b', 'c', 'd'], quiz: mockQuiz },
                { id: 3, text: 'test', type: QuestionType.SORTING, answer: '210', options: ['a', 'b', 'c'], quiz: mockQuiz },
                { id: 4, text: 'test', type: QuestionType.SINGLE_ANSWER, answer: 'Ans', options: ['a', 'b'], quiz: mockQuiz },
            );

            jest.spyOn(quizService, 'getQuizById').mockResolvedValue(mockQuiz);

            var attemptData: AttemptInput = {
                quizId: 1,
                questions: [
                    { questionId: 1, givenAnswer: '0' },
                    { questionId: 2, givenAnswer: '423' },
                    { questionId: 3, givenAnswer: '2130' },
                    { questionId: 4, givenAnswer: 'ans' },
                ],
            };

            await expect(quizService.checkAnswers(attemptData)).rejects
                .toThrow(new BadRequestException
                    ('Invalid format of answer to question with ID 2: Answer string contains indexes of non-existent options.'));
        });

        it('should throw BadRequestException for answer containing two identical option indexes', async () => {

            const mockQuiz: Quiz = {
                id: 1,
                name: 'test',
                questions: [],
            };
            mockQuiz.questions.push(
                { id: 1, text: 'test', type: QuestionType.SINGLE_ANSWER, answer: '0', options: ['a', 'b', 'c', 'd'], quiz: mockQuiz },
                { id: 2, text: 'test', type: QuestionType.MULTIPLE_ANSWER, answer: '23', options: ['a', 'b', 'c', 'd'], quiz: mockQuiz },
                { id: 3, text: 'test', type: QuestionType.SORTING, answer: '210', options: ['a', 'b', 'c'], quiz: mockQuiz },
                { id: 4, text: 'test', type: QuestionType.SINGLE_ANSWER, answer: 'Ans', options: ['a', 'b'], quiz: mockQuiz },
            );

            jest.spyOn(quizService, 'getQuizById').mockResolvedValue(mockQuiz);

            var attemptData: AttemptInput = {
                quizId: 1,
                questions: [
                    { questionId: 1, givenAnswer: '00' },
                    { questionId: 2, givenAnswer: '23' },
                    { questionId: 3, givenAnswer: '2130' },
                    { questionId: 4, givenAnswer: 'ans' },
                ],
            };

            await expect(quizService.checkAnswers(attemptData)).rejects
                .toThrow(new BadRequestException
                    ('Invalid format of answer to question with ID 1: Answer string contains two identical indexes.'));
        });

        it('should throw BadRequestException for attempt with incorrect number of question answers', async () => {

            const mockQuiz: Quiz = {
                id: 1,
                name: 'test',
                questions: [],
            };
            mockQuiz.questions.push(
                { id: 1, text: 'test', type: QuestionType.SINGLE_ANSWER, answer: '0', options: ['a', 'b', 'c', 'd'], quiz: mockQuiz },
                { id: 2, text: 'test', type: QuestionType.MULTIPLE_ANSWER, answer: '23', options: ['a', 'b', 'c', 'd'], quiz: mockQuiz },
                { id: 3, text: 'test', type: QuestionType.SORTING, answer: '210', options: ['a', 'b', 'c'], quiz: mockQuiz },
                { id: 4, text: 'test', type: QuestionType.SINGLE_ANSWER, answer: 'Ans', options: ['a', 'b'], quiz: mockQuiz },
            );

            jest.spyOn(quizService, 'getQuizById').mockResolvedValue(mockQuiz);

            var attemptData: AttemptInput = {
                quizId: 1,
                questions: [
                    { questionId: 1, givenAnswer: '0' },
                    { questionId: 2, givenAnswer: '23' },
                    { questionId: 3, givenAnswer: '2130' },
                    { questionId: 4, givenAnswer: 'ans' },
                    { questionId: 5, givenAnswer: 'ans' },
                ],
            };

            await expect(quizService.checkAnswers(attemptData)).rejects
                .toThrow(new BadRequestException('Number of questions in quiz and number of answers in attempt differ.'));
        });

        it('should throw BadRequestException for answer to question not found in submitted attempt', async () => {

            const mockQuiz: Quiz = {
                id: 1,
                name: 'test',
                questions: [],
            };
            mockQuiz.questions.push(
                { id: 1, text: 'test', type: QuestionType.SINGLE_ANSWER, answer: '0', options: ['a', 'b', 'c', 'd'], quiz: mockQuiz },
                { id: 2, text: 'test', type: QuestionType.MULTIPLE_ANSWER, answer: '23', options: ['a', 'b', 'c', 'd'], quiz: mockQuiz },
                { id: 3, text: 'test', type: QuestionType.SORTING, answer: '210', options: ['a', 'b', 'c'], quiz: mockQuiz },
                { id: 4, text: 'test', type: QuestionType.SINGLE_ANSWER, answer: 'Ans', options: ['a', 'b'], quiz: mockQuiz },
            );

            jest.spyOn(quizService, 'getQuizById').mockResolvedValue(mockQuiz);

            var attemptData: AttemptInput = {
                quizId: 1,
                questions: [
                    { questionId: 1, givenAnswer: '0' },
                    { questionId: 2, givenAnswer: '23' },
                    { questionId: 3, givenAnswer: '210' },
                    { questionId: 6, givenAnswer: 'ans' },
                ],
            };

            await expect(quizService.checkAnswers(attemptData)).rejects
                .toThrow(new BadRequestException
                    ('Answer for question with ID 4 not found in submitted attempt.'));
        });

        it('should throw BadRequestException for incorrect format of answer to single-correct type of question', async () => {

            const mockQuiz: Quiz = {
                id: 1,
                name: 'test',
                questions: [],
            };
            mockQuiz.questions.push(
                { id: 1, text: 'test', type: QuestionType.SINGLE_ANSWER, answer: '0', options: ['a', 'b', 'c', 'd'], quiz: mockQuiz },
                { id: 2, text: 'test', type: QuestionType.MULTIPLE_ANSWER, answer: '23', options: ['a', 'b', 'c', 'd'], quiz: mockQuiz },
                { id: 3, text: 'test', type: QuestionType.SORTING, answer: '210', options: ['a', 'b', 'c'], quiz: mockQuiz },
                { id: 4, text: 'test', type: QuestionType.SINGLE_ANSWER, answer: 'Ans', options: ['a', 'b'], quiz: mockQuiz },
            );

            jest.spyOn(quizService, 'getQuizById').mockResolvedValue(mockQuiz);

            var attemptData: AttemptInput = {
                quizId: 1,
                questions: [
                    { questionId: 1, givenAnswer: '01' },
                    { questionId: 2, givenAnswer: '423' },
                    { questionId: 3, givenAnswer: '2130' },
                    { questionId: 4, givenAnswer: 'ans' },
                ],
            };

            await expect(quizService.checkAnswers(attemptData)).rejects
                .toThrow(new BadRequestException
                    (`Invalid format of answer to question with ID 1: Answer string for single-correct answer type of question should consist of maximum one index.`));
        });

        it('should throw BadRequestException for incorrect format of answer to sorting type of question', async () => {

            const mockQuiz: Quiz = {
                id: 1,
                name: 'test',
                questions: [],
            };
            mockQuiz.questions.push(
                { id: 1, text: 'test', type: QuestionType.SINGLE_ANSWER, answer: '0', options: ['a', 'b', 'c', 'd'], quiz: mockQuiz },
                { id: 2, text: 'test', type: QuestionType.MULTIPLE_ANSWER, answer: '23', options: ['a', 'b', 'c', 'd'], quiz: mockQuiz },
                { id: 3, text: 'test', type: QuestionType.SORTING, answer: '210', options: ['a', 'b', 'c'], quiz: mockQuiz },
                { id: 4, text: 'test', type: QuestionType.SINGLE_ANSWER, answer: 'Ans', options: ['a', 'b'], quiz: mockQuiz },
            );

            jest.spyOn(quizService, 'getQuizById').mockResolvedValue(mockQuiz);

            var attemptData: AttemptInput = {
                quizId: 1,
                questions: [
                    { questionId: 1, givenAnswer: '0' },
                    { questionId: 2, givenAnswer: '23' },
                    { questionId: 3, givenAnswer: '21' },
                    { questionId: 4, givenAnswer: 'ans' },
                ],
            };

            await expect(quizService.checkAnswers(attemptData)).rejects
                .toThrow(new BadRequestException
                    ('Invalid format of answer to question with ID 3: Answer string for sorting type of question should contain every index of available option.'));
        });
    });

    describe('checkNonTextAnswerFormat', () => {
        it("shouldn't throw any exception for correct format", () => {
            expect(() => { quizService.checkNonTextAnswerFormat('032', 4) }).not.toThrow();
            expect(() => { quizService.checkNonTextAnswerFormat('43', 5) }).not.toThrow();
            expect(() => { quizService.checkNonTextAnswerFormat('0', 1) }).not.toThrow();
            expect(() => { quizService.checkNonTextAnswerFormat('210', 3) }).not.toThrow();
            expect(() => { quizService.checkNonTextAnswerFormat('20', 4) }).not.toThrow();
        });
        it('should throw exceptions for incorrect format', () => {
            expect(() => { quizService.checkNonTextAnswerFormat('5', 4) }).toThrow(new BadRequestException('Answer string contains indexes of non-existent options.'));
            expect(() => { quizService.checkNonTextAnswerFormat('00', 5) }).toThrow(new BadRequestException('Answer string contains two identical indexes.'));
            expect(() => { quizService.checkNonTextAnswerFormat('3', 1) }).toThrow(new BadRequestException('Answer string contains indexes of non-existent options.'));
            expect(() => { quizService.checkNonTextAnswerFormat('2103', 3) }).toThrow(new BadRequestException('Answer string contains indexes of non-existent options.'));
            expect(() => { quizService.checkNonTextAnswerFormat('01234', 4) }).toThrow(new BadRequestException('Answer string contains indexes of non-existent options.'));
        });
    });
});

