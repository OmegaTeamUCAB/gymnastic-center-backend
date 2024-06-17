import { ValueObject } from "@app/core";
import { InvalidCourseMinuteException } from "../exceptions";

export class CourseMinute implements ValueObject<CourseMinute> {
    private constructor(private _minutes: number){
        if(_minutes <= 0) throw new InvalidCourseMinuteException();
    }

    get value(): number {
        return this._minutes;
    }

    equals(other: CourseMinute): boolean {
        return this._minutes === other.value;
    }
}