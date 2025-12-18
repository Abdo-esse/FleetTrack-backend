export const buildHtmlTemplate = (trip) => {
  const truck = trip.truckId;
  const trailer = trip.trailerId;
  const driver = trip.driverId;

  return `
  <!DOCTYPE html>
  <html>
  <head>
    <meta charset="utf-8"/>
    <style>
      body { font-family: Arial, sans-serif; font-size: 12px; margin: 40px; }
      h1 { text-align: center; text-transform: uppercase; }
      table { width: 100%; border-collapse: collapse; margin-top: 10px; }
      td, th { border: 1px solid #000; padding: 6px; }
      .section { margin-top: 20px; }
      .label { font-weight: bold; }
    </style>
  </head>

  <body>

    <h1>Ordre de mission</h1>

    <div class="section">
      <p><span class="label">Mission N° :</span> ${trip._id || 'Non spécifié trip._id'}</p>
      <p><span class="label">Date :</span> ${new Date().toLocaleDateString()}</p>
    </div>

    <div class="section">
      <h3>Chauffeur</h3>
      <p>${driver.name || 'Non spécifié driver.name'}</p>

    </div>

    <div class="section">
      <h3>Véhicule</h3>
      <table>
        <tr>
          <th>Camion</th>
          <th>Remorque</th>
        </tr>
        <tr>
          <td>${truck.registrationNumber || 'Non spécifié truck.registrationNumber'} - ${truck.brand || 'Non spécifié truck.brand'} ${truck.model || 'Non spécifié truck.model'}</td>
          <td>${trailer ? trailer.registrationNumber : 'Aucune'}</td>
        </tr>
      </table>
    </div>

    <div class="section">
      <h3>Trajet</h3>
      <table>
        <tr>
          <th>Départ</th>
          <th>Destination</th>
          <th>KM Départ</th>
          <th>KM Retour</th>
        </tr>
        <tr>
          <td>${trip.origin || 'Non spécifié trip.origin'}</td>
          <td>${trip.destination || 'Non spécifié trip.destination'}</td>
          <td>${trip.departureMileage || 'Non spécifié trip.departureMileage'}</td>
          <td>__________</td>
        </tr>
      </table>
    </div>

    <div class="section">
      <h3>Consignes</h3>
      <ul>
        <li>Respecter le code de la route</li>
        <li>Vérifier l’état du véhicule avant départ</li>
        <li>Remettre les documents au retour</li>
      </ul>
    </div>

    <div class="section">
      <table>
        <tr>
          <th>Responsable</th>
          <th>Chauffeur</th>
        </tr>
        <tr>
          <td height="80"></td>
          <td></td>
        </tr>
      </table>
    </div>

  </body>
  </html>
  `;
};
