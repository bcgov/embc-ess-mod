import * as faker from 'faker/locale/en_CA';
import { Note } from '../../api/responders/models';
import { getRandomInt } from '../../utilities';

export function generateNote(): Note {
    return {
        content: faker.lorem.words(getRandomInt(3, 15))
    };
}