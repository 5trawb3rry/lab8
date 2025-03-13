const request = require("supertest");
const app = require("../app"); // Ensure this path is correct

describe("Event Planner API", () => {
  it("should log in successfully", async () => {
    const res = await request(app).post("/login").send({
      username: "user1",
      password: "pass1",
    });
    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty("userId");
  });

  it("should create a new event", async () => {
    const res = await request(app).post("/events").send({
      userId: 1,
      name: "Team Meeting",
      description: "Discuss project updates",
      date: "2025-03-20",
      time: "14:00",
      category: "Work",
      reminder: "2025-03-19T14:00",
    });
    expect(res.status).toBe(200);
    expect(res.body.event).toHaveProperty("id");
  });

  it("should fetch events for a user", async () => {
    const res = await request(app).get("/events?userId=1");
    expect(res.status).toBe(200);
    expect(res.body.length).toBeGreaterThan(0);
  });

  it("should delete an event", async () => {
    const res = await request(app).delete("/events/1?userId=1");
    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty("message", "Event deleted!");
  });
});
