import { UUIDRegExp, ValueObject } from "@app/core";
import { InvalidQuestionIdException } from "../exceptions";

export class QuestionId implements ValueObject<QuestionId>{
    constructor(private readonly _id: string) {
        if (!UUIDRegExp.test(_id)) throw new InvalidQuestionIdException();
      }
    
      get value(): string {
        return this._id;
      }
    
      equals(other: QuestionId): boolean {
        return this._id === other._id;
      }
}