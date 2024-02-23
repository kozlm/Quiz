# Quiz Application

Simple Quiz Application backend made with NestJS, GraphQL and PostgreSQL.

## How to run

1. Clone the project
1. Create PostgreSQL database
1. Create `.env` in the root directory using [`this template`](.env.example) and replace question marks with your database information
1. Install dependancies using `npm install`
1. After installing all of the packages run `npm run start:dev`
1. Use `localhost:3000/graphql` URL to get to the GraphQL Playground in order to write queries and mutations

## Queries and Mutations examples

GraphQL schema available [`here`](/src/schema.gql).

**1. Create new quiz**

```
mutation{
  createQuiz(createQuizData: {
    name: "Quiz"
    questions: [
      { 
        text: "What is the capital of France?"
        type: SINGLE_ANSWER
        options: ["Warsaw", "Paris", "Madrid", "Oslo"]
        answer: "1" 
        # answer is a string of indexes of options in options array field					
      },
      { 
        text: "Arrange the following events in chronological order."
        type: SORTING 
        options: [
          "Declaration of Independence",
          "First Moon Landing", 
        	"World War II"
        ]
        answer: "021"
      }
    ]
  })
}
```
**2. Get all quizzes**

```
query{
  getQuizzes {
    id
    name
    questions{
      id
      text
      type
      options
      answer
    }
  }
}
```

**3. Remove quiz**

```
mutation{
  	removeQuiz(id: 12)
  # id is necessary because name
  # of a quiz doesn't have to be unique
}
```

**4. Fetch questions for a quiz**

```
query{
  fetchQuestionsForQuiz(id: 1){
    id
    text
    type
    options
    answer
  }
}
```

**5. Submit answers and receive results**

```
mutation {
  checkAnswers(
    attemptData: {
      quizId: 1
      questions: [
        { questionId: 1, givenAnswer: "" }
        { questionId: 2, givenAnswer: "021" }
      ]
    }
  ) {
    score
    maximumScore
  }
}
```