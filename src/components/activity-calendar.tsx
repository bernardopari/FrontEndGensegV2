import React from 'react';
import ActivityCalendar from 'react-activity-calendar';

type Contribution = {
    date: string; // Formato: "YYYY-MM-DD"
    count: number; // Número de contribuciones en ese día
    level: number; // Nivel de contribución
  };

const ActivityGraph: React.FC = () => {
    const contributions: Contribution[] = [
        { date: "2025-01-01", count: 10, level: 10 },
        { date: "2025-01-02", count: 2, level: 2 },
        { date: "2025-01-03", count: 2, level: 4 },
        { date: "2025-01-04", count: 2, level: 5 },
        { date: "2025-01-05", count: 2, level: 8 },
    
        { date: "2025-02-02", count: 5, level: 3 },
        { date: "2025-03-04", count: 1, level: 1 },
        { date: "2025-04-05", count: 1, level: 5 },
        { date: "2025-05-06", count: 2, level: 6 },
        { date: "2025-06-07", count: 3, level: 7 },
        { date: "2025-07-08", count: 6, level: 4 },
        { date: "2025-08-09", count: 8, level: 8 },
        { date: "2025-09-10", count: 5, level: 9 },
        { date: "2025-10-11", count: 0, level: 3 },
        { date: "2025-11-12", count: 1, level: 1 },
        { date: "2025-12-13", count: 2, level: 5 },
        { date: "2025-01-14", count: 4, level: 6 },
        { date: "2025-02-15", count: 6, level: 7 },
        { date: "2026-01-16", count: 10, level: 6 },
        
      ];

  return (
    <div>
      <h2>Actividad en Proyectos</h2>
      <ActivityCalendar
        data={contributions}
        colorScheme="light"
        labels={{
          totalCount: '{{count}} contribuciones en el último año',
          legend: {
            less: 'Menos',
            more: 'Más',
          },
        }}
        showWeekdayLabels
        maxLevel={10}
        weekStart={1}
      />
    </div>
  );
};

export default ActivityGraph;