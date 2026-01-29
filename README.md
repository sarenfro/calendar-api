# Calendar Scheduling API

A Node.js API that finds free time slots across multiple team members' calendars, similar to Microsoft Bookings. Supports Google Calendar, iCal, and Outlook calendar formats (.ics files).

## Features

- 📅 Parse .ics calendar files from Google Calendar, Apple Calendar, and Outlook
- 🔍 Find free time slots across multiple team members
- 🎯 Smart meeting time suggestions
- 🔄 Handle recurring events
- ⏰ Configurable working hours and time zones
- 🌐 RESTful API with CORS support

## Installation

```bash
npm install
```

## Sharing with Your Team

**Want your teammates to access this too?** See the [DEPLOYMENT.md](DEPLOYMENT.md) guide for:
- 🚀 Quick local network sharing
- ☁️ Free cloud hosting (Heroku, Railway)
- 🌐 ngrok tunneling for instant access
- 🐳 Docker deployment

**For teammates**: See [TEAM_GUIDE.md](TEAM_GUIDE.md) for how to export and upload calendars.

## Usage

Start the server:

```bash
npm start
```

For development with auto-reload:

```bash
npm run dev
```

The API will run on `http://localhost:3000`

## API Endpoints

### 1. Upload Calendar

Upload a team member's calendar file.

**POST** `/api/calendars/upload`

**Form Data:**
- `calendar`: .ics file
- `teamMemberId`: Unique ID for the team member
- `teamMemberName`: Display name (optional)

**Example:**
```bash
curl -X POST http://localhost:3000/api/calendars/upload \
  -F "calendar=@john-calendar.ics" \
  -F "teamMemberId=john123" \
  -F "teamMemberName=John Doe"
```

**Response:**
```json
{
  "success": true,
  "message": "Calendar uploaded successfully",
  "teamMemberId": "john123",
  "eventCount": 45
}
```

### 2. List Calendars

Get all uploaded calendars.

**GET** `/api/calendars`

**Example:**
```bash
curl http://localhost:3000/api/calendars
```

**Response:**
```json
[
  {
    "id": "john123",
    "name": "John Doe",
    "eventCount": 45,
    "uploadedAt": "2026-01-28T10:30:00.000Z"
  },
  {
    "id": "jane456",
    "name": "Jane Smith",
    "eventCount": 38,
    "uploadedAt": "2026-01-28T10:32:00.000Z"
  }
]
```

### 3. Delete Calendar

Remove a team member's calendar.

**DELETE** `/api/calendars/:id`

**Example:**
```bash
curl -X DELETE http://localhost:3000/api/calendars/john123
```

### 4. Find Available Time Slots

Find all free time slots across team calendars.

**POST** `/api/availability/find`

**Body:**
```json
{
  "startDate": "2026-02-01T00:00:00Z",
  "endDate": "2026-02-07T23:59:59Z",
  "duration": 60,
  "workingHours": {
    "startTime": "09:00",
    "endTime": "17:00",
    "daysOfWeek": [1, 2, 3, 4, 5]
  },
  "timezone": "America/New_York",
  "teamMemberIds": []
}
```

**Parameters:**
- `startDate`: Search start date (ISO 8601)
- `endDate`: Search end date (ISO 8601)
- `duration`: Minimum slot duration in minutes (default: 30)
- `workingHours`: Working hours configuration
  - `startTime`: Start time (24h format, e.g., "09:00")
  - `endTime`: End time (24h format, e.g., "17:00")
  - `daysOfWeek`: Array of days (0=Sunday, 1=Monday, etc.)
- `timezone`: IANA timezone (default: "America/New_York")
- `teamMemberIds`: Array of IDs (empty = all calendars)

**Example:**
```bash
curl -X POST http://localhost:3000/api/availability/find \
  -H "Content-Type: application/json" \
  -d '{
    "startDate": "2026-02-01T00:00:00Z",
    "endDate": "2026-02-07T23:59:59Z",
    "duration": 60,
    "workingHours": {
      "startTime": "09:00",
      "endTime": "17:00",
      "daysOfWeek": [1, 2, 3, 4, 5]
    }
  }'
```

**Response:**
```json
{
  "freeSlots": [
    {
      "start": "2026-02-03T14:00:00.000Z",
      "end": "2026-02-03T15:30:00.000Z",
      "duration": 90
    },
    {
      "start": "2026-02-04T09:00:00.000Z",
      "end": "2026-02-04T11:00:00.000Z",
      "duration": 120
    }
  ],
  "searchParams": {
    "startDate": "2026-02-01T00:00:00.000Z",
    "endDate": "2026-02-07T23:59:59.000Z",
    "duration": 60,
    "workingHours": {
      "startTime": "09:00",
      "endTime": "17:00",
      "daysOfWeek": [1, 2, 3, 4, 5]
    },
    "teamMembersCount": 3
  }
}
```

### 5. Get Meeting Time Suggestions

Get smart suggestions for meeting times.

**POST** `/api/availability/suggest`

**Body:**
```json
{
  "duration": 60,
  "numberOfSuggestions": 5,
  "preferredTimes": ["09:00", "14:00"],
  "daysAhead": 7,
  "workingHours": {
    "startTime": "09:00",
    "endTime": "17:00",
    "daysOfWeek": [1, 2, 3, 4, 5]
  },
  "timezone": "America/New_York",
  "teamMemberIds": []
}
```

**Parameters:**
- `duration`: Meeting duration in minutes (default: 60)
- `numberOfSuggestions`: Number of suggestions to return (default: 5)
- `preferredTimes`: Preferred start times (e.g., ["09:00", "14:00"])
- `daysAhead`: How many days ahead to search (default: 7)
- `workingHours`: Same as find endpoint
- `timezone`: IANA timezone
- `teamMemberIds`: Array of IDs (empty = all)

**Example:**
```bash
curl -X POST http://localhost:3000/api/availability/suggest \
  -H "Content-Type: application/json" \
  -d '{
    "duration": 60,
    "numberOfSuggestions": 3,
    "preferredTimes": ["10:00", "14:00"]
  }'
```

**Response:**
```json
{
  "suggestions": [
    {
      "start": "2026-01-29T14:00:00.000Z",
      "end": "2026-01-29T15:00:00.000Z",
      "duration": 60,
      "score": 115
    },
    {
      "start": "2026-01-30T10:00:00.000Z",
      "end": "2026-01-30T11:00:00.000Z",
      "duration": 60,
      "score": 110
    }
  ],
  "totalSlotsFound": 12
}
```

### 6. Health Check

Check API status.

**GET** `/api/health`

**Example:**
```bash
curl http://localhost:3000/api/health
```

**Response:**
```json
{
  "status": "ok",
  "calendarsLoaded": 3,
  "timestamp": "2026-01-28T15:30:00.000Z"
}
```

## Exporting Calendars from Different Platforms

### Google Calendar
1. Open Google Calendar
2. Click settings (⚙️) → Settings
3. Select the calendar under "Settings for my calendars"
4. Scroll to "Integrate calendar"
5. Click "Export calendar" or copy the "Secret address in iCal format"
6. If using the URL, download the .ics file

### Apple Calendar (iCal)
1. Open Calendar app
2. Select the calendar to export
3. File → Export → Export...
4. Save as .ics file

### Outlook
1. Open Outlook Calendar
2. File → Save Calendar
3. Choose date range
4. Select "iCalendar Format (.ics)"
5. Save the file

## Configuration

### Working Hours

Customize working hours for your team:

```json
{
  "workingHours": {
    "startTime": "08:00",
    "endTime": "18:00",
    "daysOfWeek": [1, 2, 3, 4, 5]
  }
}
```

Days of week: 0 = Sunday, 1 = Monday, 2 = Tuesday, etc.

### Timezone Support

The API supports all IANA timezones:
- `America/New_York`
- `America/Los_Angeles`
- `Europe/London`
- `Asia/Tokyo`
- etc.

## Example Integration

Here's a complete example workflow:

```javascript
// 1. Upload team calendars
const formData = new FormData();
formData.append('calendar', calendarFile);
formData.append('teamMemberId', 'alice');
formData.append('teamMemberName', 'Alice Johnson');

await fetch('http://localhost:3000/api/calendars/upload', {
  method: 'POST',
  body: formData
});

// 2. Find available slots for next week
const response = await fetch('http://localhost:3000/api/availability/find', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    startDate: new Date().toISOString(),
    endDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
    duration: 60,
    workingHours: {
      startTime: '09:00',
      endTime: '17:00',
      daysOfWeek: [1, 2, 3, 4, 5]
    }
  })
});

const { freeSlots } = await response.json();
console.log('Available slots:', freeSlots);
```

## Advanced Features

### Handling Recurring Events

The API automatically expands recurring events (daily, weekly, monthly) within the search range.

### Conflict Resolution

The API merges overlapping busy periods across all team members to find truly free slots where everyone is available.

### Custom Duration Filtering

Set minimum meeting duration to filter out short gaps:

```json
{
  "duration": 90  // Only show slots of 90+ minutes
}
```

## Production Considerations

For production deployment:

1. **Replace in-memory storage** with a database (MongoDB, PostgreSQL)
2. **Add authentication** to protect endpoints
3. **Implement rate limiting** to prevent abuse
4. **Add calendar refresh** mechanism for periodic updates
5. **Enable HTTPS** for secure transmission
6. **Add logging** and monitoring
7. **Implement caching** for faster responses

## Environment Variables

Create a `.env` file:

```env
PORT=3000
NODE_ENV=production
```

## License

MIT
