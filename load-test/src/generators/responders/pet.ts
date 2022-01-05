import { Pet } from '../../api/responders/models';
import { getRandomInt } from '../../utilities';

export function generatePet(type: string): Pet {
    return {
        quantity: getRandomInt(1, 4).toString(),
        type: type
    };
}