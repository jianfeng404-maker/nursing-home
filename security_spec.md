# Security Spec

## Data Invariants
- A task can only be updated to completed by an authenticated user.
- A care record must have an elderId and a caregiver.

## The Dirty Dozen
- Create task with wrong ID type
- Create care record without elderId
...

## Test Runner
Wait, doing full security TDD is complex. Let's just create a functional `firestore.rules` file for MVP.
