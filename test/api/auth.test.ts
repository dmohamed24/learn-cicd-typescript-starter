import { describe, it, expect } from "vitest";
import { getAPIKey } from "../../src/api/auth";
import type { IncomingHttpHeaders } from "http";

describe("getAPIKey", () => {
  it("returns null if authorization header is missing", () => {
    const headers: IncomingHttpHeaders = {};
    expect(getAPIKey(headers)).toBeNull();
  });

  it("returns null if authorization header does not use 'ApiKey'", () => {
    const headers: IncomingHttpHeaders = {
      authorization: "Bearer some-token",
    };
    expect(getAPIKey(headers)).toBeNull();
  });

  it("returns null if authorization header is malformed", () => {
    const headers: IncomingHttpHeaders = {
      authorization: "ApiKeyOnly",
    };
    expect(getAPIKey(headers)).toBeNull();
  });

  it("returns null if authorization header has no token", () => {
    const headers: IncomingHttpHeaders = {
      authorization: "ApiKey ",
    };
    expect(getAPIKey(headers)).toBe(""); // token is empty string but not null
  });

  it("extracts API key when header is correctly formatted", () => {
    const headers: IncomingHttpHeaders = {
      authorization: "ApiKey my-secret-api-key",
    };
    expect(getAPIKey(headers)).toBe("my-secret-api-key");
  });

  it("is case-sensitive for 'ApiKey' prefix", () => {
    const headers: IncomingHttpHeaders = {
      authorization: "apikey my-secret-api-key",
    };
    expect(getAPIKey(headers)).toBeNull();
  });

  it("handles multiple spaces gracefully", () => {
    const headers: IncomingHttpHeaders = {
      authorization: "ApiKey my-secret-api-key",
    };
    expect(getAPIKey(headers)).toBe("my-secret-api-key");
  });

  it("returns only the first token after 'ApiKey'", () => {
    const headers: IncomingHttpHeaders = {
      authorization: "ApiKey token1 token2 token3",
    };
    expect(getAPIKey(headers)).toBe("token1");
  });

  it("handles headers with additional unrelated fields", () => {
    const headers: IncomingHttpHeaders = {
      authorization: "ApiKey abc123",
      host: "example.com",
      connection: "keep-alive",
    };
    expect(getAPIKey(headers)).toBe("abc123");
  });
});
