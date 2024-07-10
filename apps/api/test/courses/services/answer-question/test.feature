Feature: Answer Question

    Rule: Only the instructor that published the course can answer questions in the course.

    Scenario: The instructor that published a course, answer a question on a lesson
        Given the instructor with id "863a830b-3411-42df-8468-281e307086e9" created a course with a lesson with id "f628b755-717b-4799-960a-3fe5d1d8ee5f"
        And the user create a question in the lesson with id "f628b755-717b-4799-960a-3fe5d1d8ee5f"
        When the instructor with id "863a830b-3411-42df-8468-281e307086e9" answer a question in the lesson with id "f628b755-717b-4799-960a-3fe5d1d8ee5f"
        Then The answer should be created in the lesson