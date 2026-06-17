const request = require("supertest");
const app = require("../server");

describe("Lead API Endpoints", () => {
  it("should block lead submission without order_id", async () => {
    const res = await request(app)
      .post("/api/lead")
      .send({
        name: "Test User",
        phone: "0501234567"
      });
      
    expect(res.statusCode).toEqual(400);
    expect(res.body.success).toBe(false);
    expect(res.body.message).toContain("Missing required fields");
  });

  it("should detect bot honeypot and return 200 without saving", async () => {
    const res = await request(app)
      .post("/api/lead")
      .send({
        company_name: "SpamBot Inc", // honeypot triggered
        order_id: "SF-TEST01",
        session_id: "1234"
      });
      
    expect(res.statusCode).toEqual(200);
    expect(res.body.ignored).toBe(true);
  });
});
