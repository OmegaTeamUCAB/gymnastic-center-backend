Feature: Empty Name Category Aggregate

    Rule: after creating a category aggregate with an empty name, it should not be created

        Scenario: Create a category with an empty name
            Given a category aggregate is created
            When the category name is empty
            Then it should not be created