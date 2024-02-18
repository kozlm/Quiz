import { Field, InputType } from "@nestjs/graphql";
import { CreateQuestionInput } from "./question.input";

@InputType()
export class CreateQuizInput{
    @Field(() => String)
    name: string;

    @Field(() => [CreateQuestionInput])
    questions: CreateQuestionInput[]
}