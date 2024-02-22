import { Field, Int, ObjectType } from "@nestjs/graphql";

@ObjectType()
export class Result {
    @Field(() => Int)
    score: number;

    @Field(() => Int)
    maximumScore: number;
}