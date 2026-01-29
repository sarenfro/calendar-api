const express = require('express');
const multer = require('multer');
const ical = require('node-ical');
const { RRule } = require('rrule');
const moment = require('moment-timezone');
const cors = require('cors');

const app = express();
const upload = multer({ storage: multer.memoryStorage() });

app.use(cors());
app.use(express.json());

// Store calendars in memory (in production, use a database)
const calendars = new Map();

/**
 * Parse .ics file and extract events
 */
function parseICS(icsContent) {
  const events = [];
  const parsed = ical.sync.parseICS(icsContent);
  
  for (let k in parsed) {
    const event = parsed[k];
    if (event.type === 'VEVENT') {
      events.push({
        summary: event.summary || 'Busy',
        start: event.start,
        end: event.end,
        rrule: event.rrule,
        recurrenceId: event.recurrenceid,
        exdate: event.exdate
      });
    }
  }
  
  return events;
}

/**
 * Expand recurring events within a date range
 */
function expandRecurringEvents(events, startDate, endDate) {
  const expandedEvents = [];
  
  events.forEach(event => {
    if (event.rrule) {
      // Handle recurring events
      try {
        const rule = event.rrule;
        const dates = rule.between(startDate, endDate, true);
        
        dates.forEach(date => {
          const duration = event.end - event.start;
          expandedEvents.push({
            summary: event.summary,
            start: new Date(date),
            end: new Date(date.getTime() + duration)
          });
        });
      } catch (err) {
        console.error('Error expanding recurring event:', err);
      }
    } else if (event.start >= startDate && event.start <= endDate) {
      // Single event within range
      expandedEvents.push({
        summary: event.summary,
        start: event.start,
        end: event.end
      });
    }
  });
  
  return expandedEvents;
}

/**
 * Merge overlapping busy periods
 */
function mergeBusyPeriods(busyPeriods) {
  if (busyPeriods.length === 0) return [];
  
  // Sort by start time
  busyPeriods.sort((a, b) => a.start - b.start);
  
  const merged = [busyPeriods[0]];
  
  for (let i = 1; i < busyPeriods.length; i++) {
    const current = busyPeriods[i];
    const last = merged[merged.length - 1];
    
    if (current.start <= last.end) {
      // Overlapping or adjacent, merge
      last.end = new Date(Math.max(last.end.getTime(), current.end.getTime()));
    } else {
      merged.push(current);
    }
  }
  
  return merged;
}

/**
 * Find free slots across all team members' calendars
 */
function findFreeSlots(teamCalendars, startDate, endDate, workingHours, timezone, minDuration = 30) {
  const allBusyPeriods = [];
  
  // Collect all busy periods from all calendars
  teamCalendars.forEach(calendar => {
    const expanded = expandRecurringEvents(calendar.events, startDate, endDate);
    allBusyPeriods.push(...expanded.map(e => ({ start: e.start, end: e.end })));
  });
  
  // Merge overlapping busy periods
  const mergedBusy = mergeBusyPeriods(allBusyPeriods);
  
  // Find free slots
  const freeSlots = [];
  let currentDate = new Date(startDate);
  
  while (currentDate < endDate) {
    const dayOfWeek = currentDate.getDay();
    
    // Skip weekends if not in working hours
    if (workingHours.daysOfWeek && !workingHours.daysOfWeek.includes(dayOfWeek)) {
      currentDate.setDate(currentDate.getDate() + 1);
      currentDate.setHours(0, 0, 0, 0);
      continue;
    }
    
    // Set working hours for the day
    const dayStart = new Date(currentDate);
    const [startHour, startMin] = (workingHours.startTime || '09:00').split(':');
    dayStart.setHours(parseInt(startHour), parseInt(startMin), 0, 0);
    
    const dayEnd = new Date(currentDate);
    const [endHour, endMin] = (workingHours.endTime || '17:00').split(':');
    dayEnd.setHours(parseInt(endHour), parseInt(endMin), 0, 0);
    
    // Find free periods in this day
    let slotStart = dayStart;
    
    for (let busy of mergedBusy) {
      if (busy.start > dayEnd) break;
      if (busy.end < dayStart) continue;
      
      // If there's a gap before this busy period
      if (slotStart < busy.start && busy.start <= dayEnd) {
        const potentialEnd = busy.start < dayEnd ? busy.start : dayEnd;
        const duration = (potentialEnd - slotStart) / 60000; // minutes
        
        if (duration >= minDuration) {
          freeSlots.push({
            start: new Date(slotStart),
            end: new Date(potentialEnd),
            duration: duration
          });
        }
      }
      
      // Move start to end of busy period
      if (busy.end > slotStart) {
        slotStart = new Date(Math.max(slotStart, busy.end));
      }
    }
    
    // Check if there's free time at the end of the day
    if (slotStart < dayEnd) {
      const duration = (dayEnd - slotStart) / 60000;
      if (duration >= minDuration) {
        freeSlots.push({
          start: new Date(slotStart),
          end: new Date(dayEnd),
          duration: duration
        });
      }
    }
    
    // Move to next day
    currentDate.setDate(currentDate.getDate() + 1);
    currentDate.setHours(0, 0, 0, 0);
  }
  
  return freeSlots;
}

// API Endpoints

/**
 * Upload a team member's calendar
 */
app.post('/api/calendars/upload', upload.single('calendar'), (req, res) => {
  try {
    const { teamMemberId, teamMemberName } = req.body;
    
    if (!req.file || !teamMemberId) {
      return res.status(400).json({ error: 'Calendar file and team member ID required' });
    }
    
    const icsContent = req.file.buffer.toString('utf-8');
    const events = parseICS(icsContent);
    
    calendars.set(teamMemberId, {
      id: teamMemberId,
      name: teamMemberName || teamMemberId,
      events: events,
      uploadedAt: new Date()
    });
    
    res.json({
      success: true,
      message: 'Calendar uploaded successfully',
      teamMemberId,
      eventCount: events.length
    });
  } catch (error) {
    console.error('Error uploading calendar:', error);
    res.status(500).json({ error: error.message });
  }
});

/**
 * fixing fetch
 */
app.get("/", (req, res) => {
  res.send("API is running");
});


/**
 * Get all team calendars
 */
app.get('/api/calendars', (req, res) => {
  const calendarList = Array.from(calendars.values()).map(cal => ({
    id: cal.id,
    name: cal.name,
    eventCount: cal.events.length,
    uploadedAt: cal.uploadedAt
  }));
  
  res.json(calendarList);
});

/**
 * Delete a calendar
 */
app.delete('/api/calendars/:id', (req, res) => {
  const { id } = req.params;
  
  if (calendars.has(id)) {
    calendars.delete(id);
    res.json({ success: true, message: 'Calendar deleted' });
  } else {
    res.status(404).json({ error: 'Calendar not found' });
  }
});

/**
 * Find available time slots
 */
app.post('/api/availability/find', (req, res) => {
  try {
    const {
      startDate,
      endDate,
      duration = 30, // minutes
      workingHours = {
        startTime: '09:00',
        endTime: '17:00',
        daysOfWeek: [1, 2, 3, 4, 5] // Monday-Friday
      },
      timezone = 'America/New_York',
      teamMemberIds = [] // If empty, use all calendars
    } = req.body;
    
    if (!startDate || !endDate) {
      return res.status(400).json({ error: 'Start and end dates required' });
    }
    
    const start = new Date(startDate);
    const end = new Date(endDate);
    
    // Get relevant calendars
    let relevantCalendars;
    if (teamMemberIds.length > 0) {
      relevantCalendars = teamMemberIds
        .map(id => calendars.get(id))
        .filter(cal => cal !== undefined);
    } else {
      relevantCalendars = Array.from(calendars.values());
    }
    
    if (relevantCalendars.length === 0) {
      return res.status(400).json({ error: 'No calendars available' });
    }
    
    const freeSlots = findFreeSlots(
      relevantCalendars,
      start,
      end,
      workingHours,
      timezone,
      duration
    );
    
    res.json({
      freeSlots: freeSlots.map(slot => ({
        start: slot.start.toISOString(),
        end: slot.end.toISOString(),
        duration: slot.duration
      })),
      searchParams: {
        startDate: start.toISOString(),
        endDate: end.toISOString(),
        duration,
        workingHours,
        teamMembersCount: relevantCalendars.length
      }
    });
  } catch (error) {
    console.error('Error finding availability:', error);
    res.status(500).json({ error: error.message });
  }
});

/**
 * Get suggested meeting times
 */
app.post('/api/availability/suggest', (req, res) => {
  try {
    const {
      duration = 60,
      numberOfSuggestions = 5,
      preferredTimes = [], // e.g., ['09:00', '14:00']
      daysAhead = 7,
      workingHours = {
        startTime: '09:00',
        endTime: '17:00',
        daysOfWeek: [1, 2, 3, 4, 5]
      },
      timezone = 'America/New_York',
      teamMemberIds = []
    } = req.body;
    
    const startDate = new Date();
    const endDate = new Date();
    endDate.setDate(endDate.getDate() + daysAhead);
    
    // Get relevant calendars
    let relevantCalendars;
    if (teamMemberIds.length > 0) {
      relevantCalendars = teamMemberIds
        .map(id => calendars.get(id))
        .filter(cal => cal !== undefined);
    } else {
      relevantCalendars = Array.from(calendars.values());
    }
    
    if (relevantCalendars.length === 0) {
      return res.status(400).json({ error: 'No calendars available' });
    }
    
    const freeSlots = findFreeSlots(
      relevantCalendars,
      startDate,
      endDate,
      workingHours,
      timezone,
      duration
    );
    
    // Score slots based on preferences
    const scoredSlots = freeSlots.map(slot => {
      let score = 0;
      const slotTime = `${slot.start.getHours().toString().padStart(2, '0')}:${slot.start.getMinutes().toString().padStart(2, '0')}`;
      
      // Prefer slots at preferred times
      if (preferredTimes.includes(slotTime)) {
        score += 100;
      }
      
      // Prefer earlier in the week
      score += (7 - slot.start.getDay()) * 10;
      
      // Prefer morning slots slightly
      if (slot.start.getHours() < 12) {
        score += 5;
      }
      
      return { ...slot, score };
    });
    
    // Sort by score and take top N
    scoredSlots.sort((a, b) => b.score - a.score);
    const suggestions = scoredSlots.slice(0, numberOfSuggestions);
    
    res.json({
      suggestions: suggestions.map(slot => ({
        start: slot.start.toISOString(),
        end: new Date(slot.start.getTime() + duration * 60000).toISOString(),
        duration,
        score: slot.score
      })),
      totalSlotsFound: freeSlots.length
    });
  } catch (error) {
    console.error('Error suggesting times:', error);
    res.status(500).json({ error: error.message });
  }
});

/**
 * Health check
 */
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    calendarsLoaded: calendars.size,
    timestamp: new Date().toISOString()
  });
});

const PORT = process.env.PORT || 3000;
const HOST = process.env.HOST || '0.0.0.0';

app.listen(PORT, HOST, () => {
  console.log(`Calendar scheduling API running on ${HOST}:${PORT}`);
  console.log(`\nAvailable endpoints:`);
  console.log(`- POST /api/calendars/upload - Upload team member calendar`);
  console.log(`- GET  /api/calendars - List all calendars`);
  console.log(`- DELETE /api/calendars/:id - Delete a calendar`);
  console.log(`- POST /api/availability/find - Find free time slots`);
  console.log(`- POST /api/availability/suggest - Get suggested meeting times`);
  console.log(`- GET  /api/health - Health check`);
});
