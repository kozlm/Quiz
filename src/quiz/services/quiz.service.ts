import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Quiz } from "../models/quiz.entity";
import { Repository } from "typeorm";
import { Question } from "../models/question.entity";
import { CreateQuizInput } from "../inputs/quiz.input";

@Injectable()
export class QuizService{
    constructor(
        @InjectRepository(Quiz) private quizRepository: Repository<Quiz>,
        @InjectRepository(Question) private questionRepository: Repository<Question>,
        ){}
    
    getQuizzes(){
        return this.quizRepository.find({ relations: ['questions'] })
    }

    getQuizById(id: number){
        return this.quizRepository.findOne({
            where: { id },
            relations: ['questions'],
        })
    }

    removeQuiz(id: number){
        const deletedQuiz = this.quizRepository.findOne
        ({
            where: { id },
            relations: ['questions'],
        });
        this.quizRepository.delete({ id });
        return deletedQuiz;
    }

    createQuiz(createQuizData: CreateQuizInput){
        const questions = this.questionRepository.create(createQuizData.questions);
        const newQuiz = this.quizRepository.create({
            name: createQuizData.name,
            questions: questions,
        });
            
        this.quizRepository.save(newQuiz);
        return newQuiz;
    }
}
