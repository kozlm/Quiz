import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Quiz } from "./models/quiz.entity";
import { Question } from "./models/question.entity";
import { QuizService } from "./services/quiz.service";
import { QuizResolver } from "./resolvers/quiz.resolver";


@Module({
    imports: [TypeOrmModule.forFeature([Quiz, Question])],
    providers: [
      QuizResolver,
      QuizService,
    ],
  })
  export class QuizModule {}