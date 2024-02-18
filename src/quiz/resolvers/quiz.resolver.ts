import { Args, ID, Int, Mutation, Query, Resolver } from "@nestjs/graphql";
import { Quiz } from "../models/quiz.entity";
import { QuizService } from "../services/quiz.service";
import { CreateQuizInput } from "../inputs/quiz.input";

@Resolver()
export class QuizResolver{
    constructor(private quizService: QuizService){}

    @Query(() => [Quiz], { nullable: true })
    getQuizzes(){
        return this.quizService.getQuizzes();
    }

    @Query(() => Quiz, { nullable: true })
    getQuizById(@Args('id', { type: () => Int }) id: number){
        return this.quizService.getQuizById(id);
    }

    @Mutation(() => Quiz, { nullable: true })
    removeQuiz(@Args('id', { type: () => Int }) id: number){
        return this.quizService.removeQuiz(id);
    }

    @Mutation(() => Quiz)
    createQuiz(@Args('createQuizData') createQuizData: CreateQuizInput){
        return this.quizService.createQuiz(createQuizData);
    }
}