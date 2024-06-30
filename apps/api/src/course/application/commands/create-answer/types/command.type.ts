export type CreateAnswerCommand = {
    courseId: string;
    lesson: string;
    instructor: string;
    question: string;
    content: string;
}