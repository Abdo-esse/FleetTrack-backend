import puppeteer from 'puppeteer';

import Trip from '../models/trip.js';
import { buildHtmlTemplate } from '../template/missionOrderPdf.js';

export const generateMissionOrderPdf = async (tripId) => {
  const trip = await Trip.findById(tripId)
    .populate('truckId')
    .populate('trailerId')
    .populate('driverId');

  if (!trip) {
    throw new Error('Trip not found');
  }

  const html = buildHtmlTemplate(trip);

  const browser = await puppeteer.launch({
    executablePath: process.env.CHROME_PATH,
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox'],
  });

  const page = await browser.newPage();
  await page.setContent(html, { waitUntil: 'networkidle0' });

  const pdfBuffer = await page.pdf({
    format: 'A4',
    printBackground: true,
  });

  await browser.close();

  return pdfBuffer;
};
