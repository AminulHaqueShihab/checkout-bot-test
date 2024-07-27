import puppeteer from 'puppeteer';
// Or import puppeteer from 'puppeteer-core';

// Helper function to introduce a delay
const delay = ms => new Promise(resolve => setTimeout(resolve, ms));

(async () => {
	// Launch the browser and open a new blank page
	const browser = await puppeteer.launch();
	const page = await browser.newPage();

	// Navigate the page to a URL.
	await page.goto(
		'https://eventpro-ticketing-frontend.vercel.app/events/669617a3ad8675ad98ee16f9'
	);
	console.log('Page loaded');

	// Set screen size.
	await page.setViewport({ width: 1280, height: 720 });

	// Wait for the initial page response
	await Promise.all([
		page.waitForResponse(
			response =>
				response
					.url()
					.includes(
						'https://event-pro-backend-f38a47a2f6f3.herokuapp.com/user-api/events/669617a3ad8675ad98ee16f9'
					) && response.status() === 200
		),
		page.waitForResponse(
			response =>
				response
					.url()
					.includes(
						'https://event-pro-backend-f38a47a2f6f3.herokuapp.com/user-api/tickets/markup'
					) && response.status() === 200
		),
		page.waitForResponse(
			response =>
				response
					.url()
					.includes(
						'https://event-pro-backend-f38a47a2f6f3.herokuapp.com/user-api/tickets/by-event/669617a3ad8675ad98ee16f9'
					) && response.status() === 200
		),
	]);
	console.log('All specified responses received');

	// Click on the get ticket button
	await page
		.locator('button.chakra-button.css-g4ldxk', { hasText: 'Get Tickets' })
		.click();
	console.log('Clicked on get ticket button');

	// Click on + button 7 times
	for (let i = 0; i < 7; i++) {
		await page.locator('.chakra-button.css-132z0o2').click();
	}
	console.log('Clicked on + button 7 times');

	// Click on the checkout button
	await page.locator('[class="chakra-button css-g4ldxk"][name="checkout"]').click();
	console.log('Clicked on checkout button');

	// Wait for a specified period (e.g., 2 seconds)
	await delay(2000);
	console.log('Waited for 2 seconds');

	// Check if the "Continue as Guest" button is present
	try {
		// Click continue as guest
		await page.locator('.chakra-button.css-vdhly6').click();
		console.log('Clicked on continue as guest');
	} catch (error) {
		console.error(
			'Failed to click on continue as guest button:',
			error.message
		);
		// Handle the error, e.g., take a screenshot, retry, or exit
		await page.screenshot({ path: 'error_screenshot.png' });
		console.log('Screenshot taken');
	}

	// Fill in the form
	await page
		.locator('[class="chakra-input css-ht8eu"][name="name"]')
		.fill('Aminul');
	await page
		.locator('[class="chakra-input css-ht8eu"][name="email"]')
		.fill('mdaminul.career@gmail.com');
	await page
		.locator('[class="chakra-input css-ht8eu"][name="phone"]')
		.fill('01745896587');
	console.log('Filled in the form');

	// Click on the continue button
	await page.locator('.chakra-button.css-vyajum').click();
	console.log('Clicked on continue button');

	// Wait for a specified period (e.g., 2 seconds)
	await delay(2000);
	console.log('Waited for 2 seconds');

	// Click payment method
	await page.locator('.chakra-button.css-1whyyse').click();
	console.log('Clicked on payment method');

	// Wait for the payment method response
	try {
		await page.waitForResponse(
			response =>
				response
					.url()
					.includes(
						'https://event-pro-backend-f38a47a2f6f3.herokuapp.com/user-api/orders/guest'
					) && response.status() === 200
		);
		console.log('Payment method response received');
	} catch (error) {
		console.error('Error waiting for payment method response:', error);
		await page.screenshot({ path: 'error_screenshot.png' });
		console.log('Screenshot taken: error_screenshot.png');
	}

	// Wait for the SSLCommerz gateway page to load
	await page.waitForNavigation({ waitUntil: 'networkidle0' });
	console.log('SSLCommerz gateway page loaded');

	// Click on the final buttons
	await page.locator('[class="ng-star-inserted"][href="#menu2"]').click();
	console.log('Clicked on mobile banking');

	await page
		.locator(
			'a.ng-tns-c11-2 img[src="https://sandbox.sslcommerz.com/gwprocess/v4/image/gw2/bkash.png"]'
		)
		.click();
	console.log('Clicked on bkash');

	await page
		.locator(
			'form[method="get"][action="https://sandbox.sslcommerz.com/gwprocess/v4/gw.php"] input[type="submit"]'
		)
		.click();
	console.log('Clicked on success button');

	// Wait until the page navigates to the success page
	await page.waitForNavigation({ waitUntil: 'networkidle0' });
	console.log('Navigated to the success page');

	await browser.close();
	console.log('Browser closed');
})();
