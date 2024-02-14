import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Quiz } from "./models/quiz.entity";
import { Question } from "./models/question.entity";


@Module({
    imports: [TypeOrmModule.forFeature([Quiz, Question])],
    providers: [],
  })
  export class QuizModule {}