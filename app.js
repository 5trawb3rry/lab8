const express = require("express");
const app = express();

app.use(express.json());

let users = [
  { id: 1, username: "user1", password: "pass1" },
  { id: 2, username: "user2", password: "pass2" }
];

let events = [
  { id: 1, userId: 1, name: "lab8", description: "demo", date: "2025-03-15", time: "10:00", category: "Work", reminder: "2025-03-14T10:00" },
  { id: 2, userId: 2, name: "lab9", description: "demo1", date: "2025-04-10", time: "18:00", category: "Birthday", reminder: "2025-04-09T18:00" }
];


app.post("/login", (req, res) => {
  const { username, password } = req.body;
  const user = users.find(u => u.username === username && u.password === password);
  if (!user) return res.status(401).json({ error: "Invalid credentials" });
  res.json({ message: "Login successful", userId: user.id });
});


app.post("/events", (req, res) => {
  const { userId, name, description, date, time, category, reminder } = req.body;
  if (!userId || !name || !date || !time) return res.status(400).json({ error: "Missing fields" });

  const newEvent = { id: events.length + 1, userId, name, description, date, time, category, reminder };
  events.push(newEvent);
  res.json({ message: "Event created!", event: newEvent });
});


app.get("/events", (req, res) => {
  const userId = parseInt(req.query.userId);
  if (!userId) return res.status(400).json({ error: "UserId is required" });

  let userEvents = events.filter(event => event.userId === userId);
  if (req.query.category) userEvents = userEvents.filter(event => event.category === req.query.category);
  if (req.query.sortBy === "date") userEvents.sort((a, b) => new Date(a.date) - new Date(b.date));
  res.json(userEvents);
});


app.delete("/events/:id", (req, res) => {
  const eventId = parseInt(req.params.id);
  const userId = parseInt(req.query.userId);
  if (!userId) return res.status(400).json({ error: "UserId is required" });

  const index = events.findIndex(event => event.id === eventId && event.userId === userId);
  if (index === -1) return res.status(404).json({ error: "Event not found!" });

  events.splice(index, 1);
  res.json({ message: "Event deleted!" });
});


const PORT = 3000;
if (require.main === module) {
  app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
}


module.exports = app;
