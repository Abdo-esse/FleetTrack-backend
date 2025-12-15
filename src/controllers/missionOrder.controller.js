import { generateMissionOrderPdf } from '../services/missionOrderPdf.service.js';

export const getMissionOrderPdf = async (req, res) => {
  try {
    const { tripId } = req.params;

    const pdfBuffer = await generateMissionOrderPdf(tripId);

    res.set({
      'Content-Type': 'application/pdf',
      'Content-Disposition': `attachment; filename=ordre-mission-${tripId}.pdf`,
      'Content-Length': pdfBuffer.length,
    });

    res.send(pdfBuffer);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};
