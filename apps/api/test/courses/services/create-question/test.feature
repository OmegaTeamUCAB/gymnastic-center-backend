Feature: Create Question

    Rule: If the user make a question, the question should be added to the lesson questions

    Scenario: Make a question on a lesson
        Given the instructor with id "863a830b-3411-42df-8468-281e307086e9" created a course with a lesson with id "f628b755-717b-4799-960a-3fe5d1d8ee5f"
        When the user create a question in the lesson with id "f628b755-717b-4799-960a-3fe5d1d8ee5f"
        Then the question should be created in the lesson with id "f628b755-717b-4799-960a-3fe5d1d8ee5f"