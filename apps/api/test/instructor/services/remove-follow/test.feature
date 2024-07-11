Feature: Remove Follower

    Rule: If the user toggle the follow button on a followed instructor, the follower should be removed from the instructor

    Scenario: Toggle follow button on a followed instructor
        Given The instructor is created
        And The instructor is followed by the user
        When The user toggle the follow button on the instructor
        Then The follow should be removed from the instructor