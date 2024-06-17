import { ValueObject } from "@app/core";
import { InvalidCourseImageException } from "../exceptions";

export class CourseImage implements ValueObject<CourseImage> {
    private constructor(private _image: string){
        if(_image.length < 0) throw new InvalidCourseImageException();
    }

    get value(): string {
        return this._image;
    }

    equals(other: CourseImage): boolean {
        return this._image === other.value;
    }
}