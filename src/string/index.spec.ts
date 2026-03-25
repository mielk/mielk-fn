import { capitalize } from "./index";

describe("capitalize", () => {
    it("should capitalize first letter", () => {
        expect(capitalize("test")).toBe("Test");
    });
});