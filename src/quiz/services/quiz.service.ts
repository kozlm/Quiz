import { BadRequestException, Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Quiz } from "../models/quiz.entity";
import { Repository } from "typeorm";
import { Question } from "../models/question.entity";
import { CreateQuizInput } from "../inputs/quiz.input";
import { AttemptInput, QuestionAttempt } from "../inputs/attempt.input";
import { Result } from "../models/result.object";
import { resolveObjectURL } from "buffer";

@Injectable()
export class QuizService {
    constructor(
        @InjectRepository(Quiz) private quizRepository: Repository<Quiz>,
        @InjectRepository(Question) private questionRepository: Repository<Question>,
    ) { }

    getQuizzes() {
        return this.quizRepository.find({ relations: ['questions'] })
    }

    async getQuizById(id: number) {
        const quiz = await this.quizRepository.findOne({
            where: { id },
            relations: ['questions'],
        })
        if (quiz) return quiz;
        else throw new BadRequestException(`Quiz with ID ${id} not found.`);
    }

    async removeQuiz(id: number) {
        const deletedQuiz = await this.quizRepository.findOne
            ({
                where: { id },
                relations: ['questions'],
            });
        await this.quizRepository.delete({ id });
        if (!deletedQuiz) return `Quiz with ID ${id} not found.`;
        else return `Successfully removed quiz with ID ${id}.`;
    }

    async createQuiz(createQuizData: CreateQuizInput) {
        const newQuestions = this.questionRepository.create(createQuizData.questions);

        const newQuiz = this.quizRepository.create({
            name: createQuizData.name,
            questions: newQuestions,
        });


        newQuiz.questions.forEach((question: Question) => {

            const answer = question.answer;
            const no = newQuiz.questions.indexOf(question);

            if (question.options.length > 5 || question.options.length === 0) throw new BadRequestException
                (`Invalid format of options field in question No ${no}: Question can include maximum six options and needs to have at least one option.`)

            try {
                if (question.type !== 'text') this.checkNonTextAnswerFormat(answer, question.options.length);
            }
            catch (e) {
                throw new BadRequestException(`Invalid format of answer field in question No ${no}: ${e.message}`);
            }

            switch (question.type) {
                case 'single_answer':
                    if (answer.length !== 1) throw new BadRequestException
                        (`Invalid format of answer field in question No ${no}: Answer string for single-correct answer type of question should consist of exactly one index.`);
                    break;
                case 'multiple_answer':
                    question.answer = this.sortString(answer);
                    break;
                case 'sorting':
                    if (answer.length !== question.options.length) throw new BadRequestException
                        (`Invalid format of answer field in question No ${no}: Answer string for sorting type of question should contain every index of available option.`);
                    break;
            }
        });

        await this.quizRepository.save(newQuiz);

        return 'Successfully created quiz.';
    }

    async fetchQuestionsForQuiz(id: number) {
        const quiz = await this.quizRepository.findOne({
            where: { id },
            relations: ['questions'],
        });
        if (quiz != null) return quiz.questions;
        else throw new BadRequestException(`Quiz with ID ${id} not found.`);
    }

    async checkAnswers(attemptData: AttemptInput) {
        const quiz = await this.getQuizById(attemptData.quizId);
        var result = new Result();
        result.maximumScore = quiz.questions.length;
        result.score = 0;
        if (attemptData.questions.length != quiz.questions.length)
            throw new BadRequestException('Number of questions in quiz and number of answers in attempt differ.');
        quiz.questions.forEach((question: Question) => {
            const questionAttempt: QuestionAttempt = attemptData.questions.find
                (obj => obj.questionId === question.id);

            if (!questionAttempt)
                throw new BadRequestException(`Answer for question with ID ${question.id} not found in submitted attempt.`);

            var givenAnswer: string = questionAttempt.givenAnswer;

            try {
                if (question.type !== 'text') this.checkNonTextAnswerFormat(givenAnswer, question.options.length);
            }
            catch (e) {
                throw new BadRequestException(`Invalid format of answer to question with ID ${question.id}: ${e.message}`);
            }

            switch (question.type) {
                case 'single_answer':
                    if (givenAnswer.length > 1) throw new BadRequestException
                        (`Invalid format of answer to question with ID ${question.id}: Answer string for single-correct answer type of question should consist of maximum one index.`);
                    break;
                case 'multiple_answer':
                    givenAnswer = this.sortString(givenAnswer);
                    break;
                case 'sorting':
                    if (givenAnswer.length !== question.options.length) throw new BadRequestException
                        (`Invalid format of answer to question with ID ${question.id}: Answer string for sorting type of question should contain every index of available option.`);
                    break;
                case 'text':
                    givenAnswer = this.prepareAnswer(givenAnswer);
                    break;
            }
            if (givenAnswer === this.prepareAnswer(question.answer)) result.score++;
        });
        return result;
    }

    sortString(str: string): string {
        const chars = str.split('');
        chars.sort();
        return chars.join('');
    }

    prepareAnswer(answer: string): string {
        var result = answer.toLowerCase();
        result = result.replace(/[,.]/g, '');
        return result;
    }

    checkNumberOfQuestions(quiz: Quiz): void {

    }

    checkNonTextAnswerFormat(answer: string, maxLength: number): void {
        const charsToCheck = '0123456'.slice(0, maxLength);
        const appearOnceRegex = new RegExp('(.).*\\1');
        const containsOnlyIndexesRegex = new RegExp(`^[${charsToCheck}]*$`);


        if (appearOnceRegex.test(answer)) throw new BadRequestException('Answer string contains two identical indexes.');
        if (!containsOnlyIndexesRegex.test(answer)) throw new BadRequestException('Answer string contains indexes of non-existent options.');
    }
}
