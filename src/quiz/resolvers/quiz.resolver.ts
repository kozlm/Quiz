import { Args, Int, Mutation, Query, Resolver } from "@nestjs/graphql";
import { Quiz } from "../models/quiz.entity";
import { QuizService } from "../services/quiz.service";
import { CreateQuizInput } from "../inputs/quiz.input";
import { Question } from "../models/question.entity";
import { Result } from "../models/result.object";
import { AttemptInput } from "../inputs/attempt.input";

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

    @Query(() => [Question], { nullable: true })
    fetchQuestionsForQuiz(@Args('id', { type: () => Int }) id: number){
        return this.quizService.fetchQuestionsForQuiz(id);
    }

    @Mutation(() => String, { nullable: true })
    removeQuiz(@Args('id', { type: () => Int }) id: number){
        return this.quizService.removeQuiz(id);
    }

    @Mutation(() => String)
    createQuiz(@Args('createQuizData') createQuizData: CreateQuizInput){
        return this.quizService.createQuiz(createQuizData);
    }

    @Mutation(() => Result)
    checkAnswers(@Args('attemptData') attemptData: AttemptInput){
        return this.quizService.checkAnswers(attemptData);
    }
}