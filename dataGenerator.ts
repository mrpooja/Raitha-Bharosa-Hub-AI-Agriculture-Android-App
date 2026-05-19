// Simulation logic for farm data
export class FarmDataGenerator {
  static generateWeather() {
    return {
      temperature: 20 + Math.random() * 15, // 20-35 deg C
      humidity: 40 + Math.random() * 40,    // 40-80%
      moisture: 10 + Math.random() * 30,    // 10-40%
      predictedRainfall: Math.random() * 50, // 0-50mm
      timestamp: new Date().toISOString()
    };
  }

  static calculateSowingIndex(weather: any, soil: any) {
    // Basic logic: high moisture + moderate temp + low predicted rain = good sowing
    let score = 50;
    
    if (weather.moisture > 20 && weather.moisture < 35) score += 20;
    else if (weather.moisture >= 35) score -= 10;
    
    if (weather.temperature > 22 && weather.temperature < 30) score += 15;
    
    if (weather.predictedRainfall < 5) score += 15;
    else if (weather.predictedRainfall > 20) score -= 20;
    
    if (soil) {
      if (soil.n > 40 && soil.p > 30 && soil.k > 30) score += 10;
    }

    return Math.max(0, Math.min(100, score));
  }

  static getCriticalAlerts(weather: any) {
    const alerts = [];
    if (weather.temperature > 35) {
      alerts.push({
        type: 'heatwave',
        title: 'Heatwave Alert',
        message: 'Temperature exceeded 35°C. Increase irrigation to prevent crop wilting.'
      });
    }
    if (weather.temperature < 5) {
      alerts.push({
        type: 'frost',
        title: 'Frost Warning',
        message: 'Temperature dropped below 5°C. Protect sensitive seedlings.'
      });
    }
    if (weather.predictedRainfall > 40) {
      alerts.push({
        type: 'rain',
        title: 'Heavy Rain Alert',
        message: 'Extreme rainfall (>40mm) predicted. Ensure proper drainage.'
      });
    }
    return alerts;
  }
}
