import { Field, InputType } from "@nestjs/graphql";
import { QuestionType } from "../models/question.entity";

@InputType()
export class CreateQuestionInput{
    @Field(() => String)
    text: string;

    @Field(() => String, { defaultValue: QuestionType.SINGLE_ANSWER })
    type: QuestionType;

    @Field(() => [String], { nullable: true })
    options?: string[];

    @Field(() => String)
    answer: string;
}