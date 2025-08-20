# RRULE Validation Examples

This document shows how the new RRULE validation works for session instance bookings.

## How it works

When creating a reservation via `POST /sessions/:id/reservations`, the backend now validates that the `instanceDatetime` corresponds to a valid occurrence of the session according to its RRULE pattern.

## Validation Examples

### Single Session (No RRULE)
```json
// Session data
{
  "rrule": null,
  "startDate": "2025-08-25",
  "startTime": "10:00",
  "endTime": "11:00"
}

// Valid booking request
{
  "instanceDatetime": "2025-08-25T10:00:00Z"
}
// ✅ VALID - matches the session start date

// Invalid booking request
{
  "instanceDatetime": "2025-08-26T10:00:00Z"
}
// ❌ INVALID - "Instance date does not match the session date"
```

### Daily Recurring Session
```json
// Session data
{
  "rrule": "RRULE:FREQ=DAILY;INTERVAL=1",
  "startDate": "2025-08-25",
  "startTime": "10:00",
  "endTime": "11:00"
}

// Valid booking requests (any future date)
{
  "instanceDatetime": "2025-08-26T10:00:00Z"  // ✅ Next day
}
{
  "instanceDatetime": "2025-08-30T10:00:00Z"  // ✅ Any future day
}
```

### Weekly Recurring Session (Mondays only)
```json
// Session data
{
  "rrule": "RRULE:FREQ=WEEKLY;BYDAY=MO",
  "startDate": "2025-08-25",  // A Monday
  "startTime": "10:00",
  "endTime": "11:00"
}

// Valid booking request
{
  "instanceDatetime": "2025-09-01T10:00:00Z"  // ✅ Next Monday
}

// Invalid booking request
{
  "instanceDatetime": "2025-08-26T10:00:00Z"  // ❌ Tuesday - not a Monday
}
// Error: "Instance date does not match any occurrence of the recurring session"
```

## Additional Validations

1. **Past dates are rejected**
   ```json
   {
     "instanceDatetime": "2025-08-19T10:00:00Z"  // Yesterday
   }
   // Error: "Cannot book a session in the past"
   ```

2. **Only active sessions can be booked**
   - Sessions with status 'draft' or 'disabled' will be rejected
   - Error: "Cannot book a session that is not active"

3. **User access validation**
   - Users must have access to the session's location
   - Error: "Session not found or you don't have access to it"

## Error Responses

The validation provides clear, actionable error messages:

- `400 Bad Request` with error details in the response body
- Common error messages:
  - "Cannot book a session in the past"
  - "Cannot book a session that is not active"
  - "Instance date does not match the session date" (single sessions)
  - "Instance date does not match any occurrence of the recurring session" (recurring sessions)
  - "Invalid RRULE format in session" (malformed RRULE)
  - "Session not found or you don't have access to it" (access/permission error)

## Testing the Implementation

The validation logic has been thoroughly tested with various scenarios:
- Single session bookings (valid and invalid dates)
- Daily recurring sessions
- Weekly recurring sessions with specific weekdays
- Past date validation
- RRULE parsing error handling