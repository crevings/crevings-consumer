import { describe, it, expect } from "vitest";
import { cleanVoiceTranscript, expandSynonyms } from "./voiceQuery";

describe("cleanVoiceTranscript", () => {
  it("strips filler and hedge words", () => {
    expect(cleanVoiceTranscript("please show me biryani")).toBe("biryani");
    expect(cleanVoiceTranscript("i want to order pizza")).toBe("pizza");
    expect(cleanVoiceTranscript("hey can you find momos")).toBe("momos");
  });

  it("strips trailing punctuation from tokens", () => {
    expect(cleanVoiceTranscript("biryani.")).toBe("biryani");
    expect(cleanVoiceTranscript("paneer wrap,")).toBe("paneer wrap");
    expect(cleanVoiceTranscript("...shawarma!!!")).toBe("shawarma");
  });

  it("preserves mid-word apostrophes (Dodo's)", () => {
    expect(cleanVoiceTranscript("dodo's kitchen")).toBe("dodo's kitchen");
  });

  it("collapses whitespace and drops short tokens", () => {
    expect(cleanVoiceTranscript("  a   chole   bhature  ")).toBe("chole bhature");
  });

  it("expands common mishearings and brand aliases", () => {
    expect(cleanVoiceTranscript("biriyani")).toBe("biryani");
    expect(cleanVoiceTranscript("dominics pizza")).toBe("domino's pizza");
    expect(cleanVoiceTranscript("mcdonalds burger")).toBe("mcdonald's burger");
  });

  it("returns empty string for empty, null or filler-only input", () => {
    expect(cleanVoiceTranscript("")).toBe("");
    expect(cleanVoiceTranscript(null)).toBe("");
    expect(cleanVoiceTranscript(undefined)).toBe("");
    expect(cleanVoiceTranscript("please the a an")).toBe("");
  });
});

describe("expandSynonyms", () => {
  it("replaces whole words only, not substrings", () => {
    expect(expandSynonyms("dominics and dominic")).toBe("domino's and dominic");
  });

  it("is case-insensitive", () => {
    expect(expandSynonyms("Biriyani House")).toBe("biryani House");
  });
});
