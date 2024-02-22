import { Field, Int, ObjectType } from "@nestjs/graphql";
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { Quiz } from "./quiz.entity";

export enum QuestionType {
    SINGLE_ANSWER = 'single_answer',
    MULTIPLE_ANSWER = 'multiple_answer',
    SORTING = 'sorting',
    TEXT = 'text',
}


@Entity({ name: 'questions' })
@ObjectType()
export class Question {
    @PrimaryGeneratedColumn('increment')
    @Field(() => Int)
    id: number;

    @Column()
    @Field(() => String)
    text: string;

    @Column({ 
        type: 'enum',
        enum: QuestionType,
        default: QuestionType.SINGLE_ANSWER
    })
    @Field(() => String, { defaultValue: QuestionType.SINGLE_ANSWER })
    type: QuestionType;

    @Column({ type: 'text', array: true, default: [] })
    @Field(() => [String], { defaultValue: [] })
    options: string[];

    @Column()
    @Field(() => String)
    answer: string;

    @ManyToOne(() => Quiz, (quiz) => quiz.questions, { onDelete: "CASCADE" })
    @Field(() => Quiz)
    quiz: Quiz
}