import * as faker from 'faker/locale/en_CA';
import { SecurityQuestion } from '../../api/responders/models';

export function generateSecurityQuestions(questions: string[]): Array<SecurityQuestion> {
    return [{
        id: 1,
        answerChanged: true,
        question: faker.random.arrayElement(questions),
        answer: faker.lorem.word()
    }, {
        id: 2,
        answerChanged: true,
        question: faker.random.arrayElement(questions),
        answer: faker.lorem.word()
    }, {
        id: 3,
        answerChanged: true,
        question: faker.random.arrayElement(questions),
        answer: faker.lorem.word()
    }];
}