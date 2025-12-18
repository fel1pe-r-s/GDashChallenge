#GDashChallenge # Redesign Dashboard

## Goal Description
Redesign the Dashboard to match the requested premium, dark-themed aesthetic. The new design will feature a sleek dark blue/slate background, improved cards, AI insight banners, and detailed charts and tables.

## Proposed Changes

### Frontend

#### [NEW] [DashboardComponents.tsx](file:///home/felipe/desafio-gdash/frontend/src/components/DashboardComponents.tsx)
- Create reusable components for the new dashboard design:
    - `StatCard`: For displaying single metrics (Temp, Humidity, etc.) with icons.
    - `InsightBanner`: For the AI insight section.
    - `WeatherTable`: For the historical data table.
    - `Header`: For the top navigation/search bar.

#### [MODIFY] [Dashboard.tsx](file:///home/felipe/desafio-gdash/frontend/src/pages/Dashboard.tsx)
- **Layout**: Switch to a dark theme layout (`bg-slate-950` or similar).
- **Structure**:
    - **Header**: Search bar and user profile.
    - **Main Stats**: Grid of 4 cards.
    - **Insight**: Green/Accent banner.
    - **Charts**: Two columns (Temperature Line Chart, Rain/Humidity Bar Chart).
    - **History**: Table of recent logs.
- **Styling**: Use `shadcn/ui` components with custom styling to match the dark theme.

## Verification Plan

### Automated Tests
- Run `npm test` to ensure existing tests pass (might need to update `Dashboard.test.tsx` if structure changes significantly).

### Manual Verification
- **Visual Check**: Verify the dashboard looks like the requested "premium" design (dark mode, clean typography).
- **Functionality**:
    - Check if real data is still displayed.
    - Check if charts render correctly.
    - Check if the city selector works (integrated into the new header or standalone).
    - Check export buttons.
