import { expect, test } from "@playwright/test";
import { mailFor, uniqueEmail } from "./helpers";

const JOB = "/careers/sbcc-programme-officer";

test.describe("Job application (email)", () => {
  test("submits with a CV attachment", async ({ page }) => {
    const email = uniqueEmail("apply");
    await page.goto(JOB);
    await page.locator("#ap-name").fill("Ann Applicant");
    await page.locator("#ap-email").fill(email);
    await page.locator("#ap-cv").setInputFiles({ name: "cv.pdf", mimeType: "application/pdf", buffer: Buffer.from("%PDF-1.7\n%test\n") });
    await page.locator("#ap-note").fill("Keen to join.");
    await page.getByRole("button", { name: "Submit application" }).click();
    await expect(page.getByText("Application received.")).toBeVisible();

    const mail = await mailFor(email);
    expect(mail.text).toContain("Keen to join.");
    expect(mail.attachments).toEqual([expect.objectContaining({ filename: "CV-Ann-Applicant.pdf", contentType: "application/pdf" })]);
  });

  test("CV is optional", async ({ page }) => {
    const email = uniqueEmail("nocv");
    await page.goto(JOB);
    await page.locator("#ap-name").fill("No CV Person");
    await page.locator("#ap-email").fill(email);
    await page.getByRole("button", { name: "Submit application" }).click();
    await expect(page.getByText("Application received.")).toBeVisible();
    expect((await mailFor(email)).attachments).toEqual([]);
  });

  test("rejects a file that isn't a PDF/DOCX", async ({ page }) => {
    await page.goto(JOB);
    await page.locator("#ap-name").fill("Bad File");
    await page.locator("#ap-email").fill(uniqueEmail("bad"));
    await page.locator("#ap-cv").setInputFiles({ name: "cv.txt", mimeType: "text/plain", buffer: Buffer.from("hello") });
    await page.getByRole("button", { name: "Submit application" }).click();
    await expect(page.getByText("CV must be a PDF or DOCX file.")).toBeVisible();
  });
});
