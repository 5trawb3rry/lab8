const request = require("supertest");
const express = require("express");
const app = require("../server"); 

describe("lab 8 test cases", () => {
  let testUserId = 1;
  let testEventId;

  
  it("should log in and return userId", async () => {
    const res = await request(app)
      .post("/login")
      .send({ username: "user1", password: "pass1" });

    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty("userId");
    testUserId = res.body.userId;
  });

 
  it("should create a new event succesfully", async () => {
    const event = {
      userId: testUserId,
      name: "Test Event",
      description: "This is a test",
      date: "2025-06-01",
      time: "12:00",
      category: "Test",
      reminder: "2025-05-31T12:00"
    };

    const res = await request(app).post("/events").send(event);
    expect(res.status).toBe(200);
    expect(res.body.event).toHaveProperty("id");

    testEventId = res.body.event.id;
  });


  it("should return events for the user", async () => {
    const res = await request(app).get(`/events?userId=${testUserId}`);
    expect(res.status).toBe(200);
    expect(res.body.length).toBeGreaterThan(0);
  });

 
  it("should delete an event sucessfully", async () => {
    const res = await request(app).delete(`/events/${testEventId}?userId=${testUserId}`);
    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty("message", "Event deleted!");
  });
});
