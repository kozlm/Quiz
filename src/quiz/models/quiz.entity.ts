import { Field, ID, Int, ObjectType } from "@nestjs/graphql";
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { Question } from "./question.entity";


@Entity({ name: 'quizzes' })
@ObjectType()
export class Quiz {
    @PrimaryGeneratedColumn('increment')
    @Field(() => Int)
    id: number;

    @Column()
    @Field(() => String)
    name: string;

    @OneToMany(() => Question, (question) => question.quiz, { cascade: true })
    @Field(() => [Question], { nullable: true })
    questions?: Question[]
}