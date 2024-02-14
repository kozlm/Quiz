import { Field, ID, ObjectType } from "@nestjs/graphql";
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
    @Field(() => ID)
    id: number;

    @Column()
    @Field(() => String)
    text: string;

    @Column({ 
        type: 'enum',
        enum: QuestionType,
        default: QuestionType.SINGLE_ANSWER
    })
    @Field(() => QuestionType, { defaultValue: QuestionType.SINGLE_ANSWER })
    type: QuestionType;

    @Column({ type: 'text', array: true, nullable: true })
    @Field(() => [String], { nullable: true })
    options?: string[];

    @Column()
    @Field(() => String)
    answer: string;

    @ManyToOne(() => Quiz, (quiz) => quiz.questions)
    @Field(() => Quiz)
    quiz: Quiz
}