import { ValueObject } from "@app/core";
import { InvalidCourseDescriptionException } from "../exceptions";

export class CourseDescription implements ValueObject<CourseDescription> {
    private constructor(private _description: string){
        if(_description.length < 10) throw new InvalidCourseDescriptionException();
    }

    get value(): string {
        return this._description;
    }

    equals(other: CourseDescription): boolean {
        return this._description === other.value;
    }
}