import { Field, InputType, Int } from "@nestjs/graphql";

@InputType()
export class AttemptInput{
    @Field(() => Int)
    quizId: number;

    @Field(() => [QuestionAttempt])
    questions: QuestionAttempt[]
}

@InputType()
export class QuestionAttempt{
    @Field(() => Int)
    questionId: number;

    @Field(() => String)
    givenAnswer: string;
}