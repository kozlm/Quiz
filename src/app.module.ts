import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { Module } from '@nestjs/common';
import { GraphQLModule } from '@nestjs/graphql';
import { TypeOrmModule } from '@nestjs/typeorm';
import { QuizModule } from './quiz/quiz.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { Quiz } from './quiz/models/quiz.entity';
import { Question } from './quiz/models/question.entity';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    // GraphQLModule.forRoot<ApolloDriverConfig>({
    //   driver: ApolloDriver,
    //   autoSchemaFile: 'src/schema.gql',
    // }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        type: 'postgres',
        host: configService.get('DB_HOST'),
        port: +configService.get('DB_PORT'),
        username: configService.get('DB_USERNAME'),
        password: configService.get('DB_PASSWORD'),
        database: configService.get('DB_DATABASE'),
        entities: [Quiz, Question],
        synchronize: true,
      }),
      inject: [ConfigService],
    }),
    QuizModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
