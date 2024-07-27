import puppeteer from 'puppeteer';

(async () => {
	// Launch the browser and open a new blank page
	const browser = await puppeteer.launch();

	for (let i = 0; i < 10; i++) {
		const page = await browser.newPage();

		// Navigate the page to a URL.
		await page.goto(
			'https://eventpro-ticketing-frontend.vercel.app/agency/668f81535cbf5aae9d627204'
		);
		await page.setViewport({ width: 1080, height: 1024 });
		console.log('Page %d loaded', i + 1);

		// Wait for specific network requests to complete
		const responses = await Promise.all([
			page.waitForResponse(
				response =>
					response
						.url()
						.includes(
							'https://event-pro-backend-f38a47a2f6f3.herokuapp.com/user-api/agencies/count/668f81535cbf5aae9d627204'
						) && response.status() === 200
			),
			// Add more endpoints as needed
		]);

		// Check if all responses are successful
		const allSuccessful = responses.every(response => response.ok());
		if (allSuccessful) {
			console.log('All endpoint calls were successful for page %d', i + 1);
		} else {
			console.log('Some endpoint calls failed for page %d', i + 1);
		}

		// Close the page to free up resources.
		await page.close();
	}

	await browser.close();
})();
