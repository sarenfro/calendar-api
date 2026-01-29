# Quick Start Guide for Team Members

## 🎯 What is This?

This is a team calendar scheduling tool that finds free time slots across everyone's calendars - like Microsoft Bookings but for your team!

## 📱 How to Use (2 Methods)

### Method 1: Web Interface (Easiest!)

Your team lead will share a URL with you, like:
- `https://your-team-calendar.herokuapp.com/client.html` (if deployed)
- `http://192.168.1.100:3000/client.html` (if on local network)

1. **Open the URL** in your browser
2. **Export your calendar** (see below)
3. **Upload it** using the web interface
4. **Find meeting times** with your teammates!

---

## 📅 How to Export Your Calendar

### From Google Calendar:

1. Go to [Google Calendar](https://calendar.google.com)
2. Click the **⚙️ Settings** icon → **Settings**
3. On the left, click your calendar name under "Settings for my calendars"
4. Scroll to "Integrate calendar" section
5. Click **"Export calendar"** (downloads a .ics file)

**Alternative - Use the iCal link:**
1. Copy the "Secret address in iCal format"
2. Paste it in your browser
3. Download the .ics file

### From Outlook (Desktop):

1. Open Outlook
2. Go to **File** → **Save Calendar**
3. Choose your date range (e.g., next 3 months)
4. Select **"iCalendar Format (.ics)"**
5. Click **Save**

### From Outlook (Web):

1. Go to [Outlook.com](https://outlook.com)
2. Click the **⚙️ Settings** → **View all Outlook settings**
3. Go to **Calendar** → **Shared calendars**
4. Under "Publish a calendar", select your calendar
5. Click **Publish**
6. Copy the ICS link and download it

### From Apple Calendar (Mac):

1. Open **Calendar** app
2. Select the calendar you want to share
3. Go to **File** → **Export** → **Export...**
4. Save as **.ics** file

---

## 🔒 Privacy & Security

- Your calendar data is only visible to your team members using this tool
- The .ics file contains your events for the time period you exported
- To maintain privacy, you can:
  - Only export 1-2 weeks at a time
  - Mark personal events as "Private" in your calendar before exporting
  - Use a work calendar separate from your personal calendar

---

## 🤝 Finding Meeting Times

Once everyone has uploaded their calendars:

1. **Go to "Find Available Time Slots"** section
2. **Set your parameters:**
   - Start and end dates
   - Minimum meeting duration (e.g., 60 minutes)
   - Working hours (e.g., 9 AM - 5 PM)
   - Timezone
3. **Click "Find Free Slots"**
4. **View results** - All slots where EVERYONE is free!

---

## 💡 Tips

### Best Practices:
- **Update regularly** - Re-upload your calendar weekly or before scheduling
- **Include buffer time** - Set meetings to be 5-10 minutes shorter than the slot
- **Communicate changes** - If your calendar changes significantly, re-upload
- **Be flexible** - The tool finds ALL free slots, but some might work better than others

### Recommended Settings:
- **Duration**: 60 minutes (for regular meetings), 30 minutes (for quick syncs)
- **Working Hours**: Match your team's typical schedule
- **Date Range**: Look 1-2 weeks ahead for best results

---

## ❓ Troubleshooting

**"No calendars available" error:**
- Make sure you've uploaded your calendar first
- Check that the .ics file uploaded successfully

**"No available time slots found":**
- Try widening your date range
- Reduce the minimum meeting duration
- Adjust working hours
- Consider if everyone's schedules are truly compatible

**Upload failed:**
- Make sure you're uploading a .ics file (not .csv or other format)
- Try exporting your calendar again
- Check the file isn't too large (>5MB)

**Can't access the URL:**
- Confirm you're on the same network (for local deployments)
- Check the URL is correct
- Try using a different browser
- Contact your team lead

---

## 📞 Need Help?

Contact your team administrator who set up this tool.

---

## 🎉 That's It!

You're ready to find the perfect meeting times with your team. Upload your calendar and start scheduling smarter!
