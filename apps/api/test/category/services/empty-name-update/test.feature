Feature: Category Aggregate updated to empty name
    
    Rule: after updating a category aggregate with an empty name, it should not be updated
    
        Scenario: Update a category with an empty name
            Given a category aggregate is updated
            When the category name is empty
            Then it should not be updated