import { Entity } from "@app/core";
import { QuestionContent, QuestionDate, QuestionId } from "./value-objects";
import { UserId } from "apps/api/src/user/domain/value-objects";
import { LessonId } from "../lessons/value-objects";

export class Question extends Entity<QuestionId> {
    constructor(
        id: QuestionId,
        protected _user: UserId,
        protected _lesson: LessonId,
        protected _content: QuestionContent,
        protected _date: QuestionDate,
    ) {
        super(id);
    }

    get user() {
        return this._user;
    }

    get lesson() {
        return this._lesson;
    }

    get content() {
        return this._content;
    }

    get date() {
        return this._date;
    }

    set content(content: QuestionContent) {
        this._content = content;
    }

}