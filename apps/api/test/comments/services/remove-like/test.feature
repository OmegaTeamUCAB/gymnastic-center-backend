Feature: Remove Like

   Rule: If the user toggle the like button on a liked comment, the like should be removed from the comment

   Scenario: Toggle like button on a liked comment
      Given the comment is created
      And the comment is liked by the user
      When the user toggle the like button on the comment
      Then the like should be removed from the comment
  