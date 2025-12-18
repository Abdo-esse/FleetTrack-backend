import { generateMissionOrderPdf } from '../services/missionOrderPdf.service.js';

export const getMissionOrderPdf = async (req, res) => {
  try {
    const { id } = req.params;

    const pdfBuffer = await generateMissionOrderPdf(id);

    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader(
      'Content-Disposition',
      `attachment; filename=ordre-mission-${id}.pdf`
    );
    res.setHeader('Content-Length', pdfBuffer.length);

    res.end(pdfBuffer); // ✅ ENVOI BINAIRE BRUT
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message });
  }
};
