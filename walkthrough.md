#GDashChallenge # Fix Chart Error and Add City Display

## Changes Implemented

### 1. Recharts Fix
- **Issue**: Console error `The width(-1) and height(-1) of chart should be greater than 0`.
- **Fix**: Wrapped `ResponsiveContainer` in a `div` with explicit height (`h-[400px]`) and width (`w-full`) in `Dashboard.tsx`. Removed the height class from the parent `CardContent` to avoid conflict.

### 2. City Display
- **Feature**: Added a "Monitoring: [City Name]" indicator in the dashboard header.
- **Implementation**: Displays `latest.city` from the weather logs. This ensures the user knows exactly which city's data is being shown.

## Verification Results

### Automated Tests
- Ran `npm test` and all 88 tests passed.

### Manual Verification Steps
1.  **Chart**:
    - Open the dashboard.
    - Check the browser console. The Recharts error should no longer appear.
    - Resize the window to verify the chart still resizes correctly.
2.  **City Display**:
    - Check the dashboard header.
    - Verify it says "Monitoring: [City Name]" (e.g., "Monitoring: Sao Paulo" or "Monitoring: Current Location").
    - Change the city using the selector and verify the text updates (after the data refresh).
