Feature: Answer Question

    Rule: Only the instructor that published the course can answer questions in the course.

    Scenario: The instructor that published a course, answer a question in the course
        Given the instructor with id "863a830b-3411-42df-8468-281e307086e9" created a course with a lesson with id "f628b755-717b-4799-960a-3fe5d1d8ee5f"
        And an user create a question in the lesson with id "f628b755-717b-4799-960a-3fe5d1d8ee5f"
        When the instructor with id "863a830b-3411-42df-8468-281e307086e9" answer the question
        Then The answer should be created in the lesson

    Scenario: An instructor that did not published a course, tries to answer a question in the course
        Given the instructor with id "863a830b-3411-42df-8468-281e307086e9" created a course with a lesson with id "f628b755-717b-4799-960a-3fe5d1d8ee5f"
        And an user create a question in the lesson with id "f628b755-717b-4799-960a-3fe5d1d8ee5f"
        When the instructor with id "9b3dcbae-6c98-42e2-9ff3-adfc6bb99bc2" answer the question
        Then The answer should not be created in the lesson
        But The instructor cannot answer

    Scenario: The instructor that published a course, tries to answer a question twice in the course
        Given the instructor with id "863a830b-3411-42df-8468-281e307086e9" created a course with a lesson with id "f628b755-717b-4799-960a-3fe5d1d8ee5f"
        And an user create a question in the lesson with id "f628b755-717b-4799-960a-3fe5d1d8ee5f"
        And the instructor with id "863a830b-3411-42df-8468-281e307086e9" answered the question
        When the instructor with id "863a830b-3411-42df-8468-281e307086e9" answer the question
        Then The answer should be created in the lesson
        But The second answer should not be created in the lesson

    Scenario: The instructor that published a course, tries to answer a question twice in the course
        Given the instructor with id "863a830b-3411-42df-8468-281e307086e9" created a course with a lesson with id "f628b755-717b-4799-960a-3fe5d1d8ee5f"
        When the instructor with id "863a830b-3411-42df-8468-281e307086e9" answer the question
        Then The answer should not be created in the lesson
        But The question is not found