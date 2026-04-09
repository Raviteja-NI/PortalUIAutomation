const { Before, After, AfterStep, BeforeAll, AfterAll, Status, setDefaultTimeout } = require('@cucumber/cucumber');
const { chromium } = require('playwright');
const { SummaryPage } = require('../PageObjects/SummaryPage');

setDefaultTimeout(90 * 1000);

let browserInstance;
let contextInstance;
let sharedPage;
let scenarioLogs = []; // Array to store logs for the current scenario

BeforeAll(async function () {
    console.log("🚀 Launching Chrome Browser...");
    browserInstance = await chromium.launch({
        headless: false,
        args: ['--start-maximized'],
        slowMo: 100
    });
    contextInstance = await browserInstance.newContext({
        ignoreHTTPSErrors: true,
        viewport: null
    });
    sharedPage = await contextInstance.newPage();
});

Before(async function (scenario) {
    this.page = sharedPage;
    this.context = contextInstance;
    this.summaryPage = new SummaryPage(this.page);

    // --- LOG CAPTURE START ---
    scenarioLogs = []; // Reset logs for the new test
    const originalLog = console.log;

    // Override console.log to capture everything you print
    console.log = (...args) => {
        const message = args.map(arg => typeof arg === 'object' ? JSON.stringify(arg, null, 2) : arg).join(' ');
        scenarioLogs.push(message);
        originalLog.apply(console, args); // Still print to terminal
    };
    this.originalConsoleLog = originalLog; // Save reference to restore later
    // --- LOG CAPTURE END ---

    const tags = scenario.pickle.tags.map(t => t.name);
    if (tags.includes('@logout')) {
        console.log("🔄 @logout detected: Purging session for new user login...");
        try {
            await this.context.clearCookies();
            await this.page.evaluate(() => {
                localStorage.clear();
                sessionStorage.clear();
            });
            await this.page.goto('https://portal.sandbox.ngenius-payments.com', { waitUntil: 'domcontentloaded' });
        } catch (e) {
            console.log("⚠️ Session purge skipped: " + e.message);
        }
    }
});

AfterStep(async function () {
    try {
        if (this.page && !this.page.isClosed()) {
            const shot = await this.page.screenshot({ timeout: 5000 });
            await this.attach(shot, "image/png");
        }
    } catch (e) { }
});

After(async function (scenario) {
    // 1. ATTACH ALL LOGS TO ALLURE (Expanded View)
    if (scenarioLogs.length > 0) {
        // This creates the "Console Output" text block in Allure
        await this.attach(scenarioLogs.join('\n'), 'text/plain');
    }

    // 2. Restore the original console.log
    console.log = this.originalConsoleLog;

    if (scenario.result?.status === Status.FAILED) {
        console.log(`❌ FAILED: ${scenario.pickle.name}`);
        try {
            await this.page.goto('https://portal.sandbox.ngenius-payments.com#/summary_for_merchants', { timeout: 5000 }).catch(() => { });
        } catch (e) {
            console.log("Reset navigation failed.");
        }
    }
});

AfterAll(async function () {
    console.log("🛑 ALL TEST CASES FINISHED EXECUTION. Closing Browser.");
    if (sharedPage && !sharedPage.isClosed()) await sharedPage.close();
    if (browserInstance) await browserInstance.close();
});
