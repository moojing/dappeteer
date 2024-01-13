import {
  clickOnButton,
  getElementByContent,
  retry,
  waitForOverlay,
} from "../helpers";

import { DappeteerPage } from "../page";
import { GetSingedIn } from ".";

export const sign =
  (page: DappeteerPage, getSingedIn: GetSingedIn) =>
    async (): Promise<void> => {
      await page.bringToFront();
      if (!(await getSingedIn())) {
        throw new Error("You haven't signed in yet");
      }

      //retry till we get prompt
      await retry(async () => {
        await page.bringToFront();
        await page.reload();
        await waitForOverlay(page);

        await getElementByContent(page, "Sign", "button", { timeout: 2000 });
      }, 5);

      await clickOnButton(page, "Got it");

      await clickOnButton(page, "Sign");

      // const warningSignButton = await page.waitForSelector(
      //   ".page-container__footer-button"
      // );
      // await warningSignButton.click();

      // wait for MM to be back in a stable state
      await page.waitForSelector(".multichain-app-header", {
        visible: true,
      });
    };
