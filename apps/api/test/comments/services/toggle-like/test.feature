Feature: Toggle Like

   Rule: If the user toggle the like button on a liked comment, the like should be removed from the comment, otherwise the like is added

   Scenario: Toggle like button on a liked comment
      Given the comment is created
      And the comment is liked by the user with id "863a830b-3411-42df-8468-281e307086e9"
      When the user with id "863a830b-3411-42df-8468-281e307086e9" toggle the like button on the comment
      Then the like of the user with id "863a830b-3411-42df-8468-281e307086e9" should be removed from the comment

   Scenario: Toggle like button on a non liked comment
      Given the comment is created
      When the user with id "f628b755-717b-4799-960a-3fe5d1d8ee5f" toggle the like button on the comment
      Then the like of the user with id "f628b755-717b-4799-960a-3fe5d1d8ee5f" should be added in the comment

   Scenario: Toggle dislike button on a disliked comment
      Given the comment is created
      And the comment is disliked by the user with id "863a830b-3411-42df-8468-281e307086e9"
      When the user with id "863a830b-3411-42df-8468-281e307086e9" toggle the dislike button on the comment
      Then the dislike of the user with id "863a830b-3411-42df-8468-281e307086e9" should be removed from the comment

   Scenario: Toggle dislike button on a non disliked comment
      Given the comment is created
      When the user with id "f628b755-717b-4799-960a-3fe5d1d8ee5f" toggle the dislike button on the comment
      Then the dislike of the user with id "f628b755-717b-4799-960a-3fe5d1d8ee5f" should be added in the comment
  