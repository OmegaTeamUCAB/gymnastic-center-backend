Feature: Blog's Invariants

   Rule: Blog's Invariants should be always valid before creation

   Scenario: Creating a Blog with invalid data
      When Trying to create a blog with invalid data
      Then The blog should not be created
  