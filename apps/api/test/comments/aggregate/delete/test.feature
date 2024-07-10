Feature: Delete Comment Aggregate

  Rule: after deleting a comment aggregate, it should be immutable
  
    Scenario: Try to mutate a deleted comment aggregate
      Given the comment aggregate is created
      When the publisher deletes the comment aggregate
      Then the comment should be immutable