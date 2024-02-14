import { Field, ID, ObjectType } from "@nestjs/graphql";
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { Question } from "./question.entity";


@Entity({ name: 'quizzes' })
@ObjectType()
export class Quiz {
    @PrimaryGeneratedColumn('increment')
    @Field(() => ID)
    id: number;

    @Column()
    @Field(() => String)
    name: string;

    @OneToMany(() => Question, (question) => question.quiz)
    @Field(() => [Question])
    questions: Question[]
}