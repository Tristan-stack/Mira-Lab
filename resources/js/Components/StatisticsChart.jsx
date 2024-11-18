import React, { useEffect, useState, useMemo } from 'react';
import {
    LineChart,
    Line,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip as RechartsTooltip,
    ResponsiveContainer,
    Legend,
    Text,
    Label,
} from 'recharts';
import CalendarHeatmap from 'react-calendar-heatmap';
import 'react-calendar-heatmap/dist/styles.css';
import { Tooltip } from 'react-tooltip';

export default function StatisticsChart({ projects, user }) {
    // Obtenir les 3 derniers mois
    const getLastThreeMonths = () => {
        const months = [];
        const date = new Date();
        for (let i = 2; i >= 0; i--) { // 3 mois
            const d = new Date(date.getFullYear(), date.getMonth() - i, 1);
            months.push({
                label: d.toLocaleString('default', { month: 'long' }),
                year: d.getFullYear(),
                month: d.getMonth(),
            });
        }
        return months;
    };

    // Préparer les données pour le LineChart
    const months = getLastThreeMonths();

    const lineChartData = months.map(({ label, year, month }) => {
        const count = projects.filter(project => {
            const associatedUsers = project.users || [];
            const isAssociated = associatedUsers.some(u => u.id === user.id); // Vérifie si l'utilisateur courant est associé au projet
            const createdDate = new Date(project.created_at); // Assurez-vous que 'created_at' est la date de création du projet

            return (
                isAssociated &&
                createdDate.getFullYear() === year &&
                createdDate.getMonth() === month
            );
        }).length;

        return {
            month: label.slice(0, 3), // Ex: "Jan", "Feb"
            count,
        };
    });

    // Préparer les données pour le CalendarHeatmap
    const [activities, setActivities] = useState([]);

    useEffect(() => {
        fetch('/user/activities', {
            headers: {
                'X-Requested-With': 'XMLHttpRequest',
                'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]').getAttribute('content'),
            },
            credentials: 'same-origin',
        })
            .then(response => response.json())
            .then(data => {
                const formattedData = data.map(item => ({
                    date: item.activity_date,
                    count: item.login_count,
                }));
                setActivities(formattedData);
            })
            .catch(error => console.error('Erreur lors de la récupération des activités:', error));
    }, []);

    const today = new Date();
    const startDate = new Date(today.getFullYear(), today.getMonth() - 9, 1); // 8 mois

    // Calculer le total des connexions sur les 8 derniers mois
    const totalConnections = useMemo(() => {
        return activities.reduce((acc, item) => acc + item.count, 0);
    }, [activities]);

    return (
        <div className="w-full bg-gray-100">
            {/* LineChart actuel */}
            <div className="w-full h-40 mb-16">
                <h2 className="text-lg font-medium mb-4 text-center">Nombre de projets créés par mois</h2>
                <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={lineChartData}>
                        <XAxis dataKey="month">
                            <Label value="Mois" offset={-5} position="insideBottom" />
                        </XAxis>
                        <YAxis>
                            <Label value="Projets" angle={-90} position="insideLeft" />
                        </YAxis>
                        <CartesianGrid strokeDasharray="0 3" />
                        <RechartsTooltip />
                        <Line type="monotone" dataKey="count" name="Projets" stroke="#6D326D"/>
                    </LineChart>
                </ResponsiveContainer>
            </div>

            {/* Graphique d'activité GitHub */}
            <div className="w-full h-auto mb-8 p-4 bg-white rounded-lg border border-gray-300">
                <h2 className="text-lg font-medium mb-4">{totalConnections} connexions les 8 derniers mois: </h2>
                <CalendarHeatmap
                    startDate={startDate}
                    endDate={today}
                    values={activities}
                    classForValue={value => {
                        if (!value || value.count === 0) {
                            return 'color-empty';
                        }
                        if (value.count >= 5) {
                            return 'color-scale-4';
                        } else if (value.count === 4) {
                            return 'color-scale-3';
                        } else if (value.count === 3) {
                            return 'color-scale-2';
                        } else if (value.count === 2) {
                            return 'color-scale-1';
                        } else {
                            return 'color-scale-0';
                        }
                    }}
                    tooltipDataAttrs={value => ({
                        'data-tooltip-id': 'activity-tooltip',
                        'data-tooltip-content': value.date
                            ? `${value.count} connexion${value.count > 1 ? 's' : ''} aujourd'hui`
                            : 'Aucune activité',
                    })}
                    showWeekdayLabels
                    blockSize={8} // Réduction de la taille des blocs
                    gutterSize={2} // Réduction de l'espacement entre les blocs
                />
                <Tooltip id="activity-tooltip" /> {/* Tooltip avec l'ID correspondant */}
            </div>

            {/* Styles Intégrés */}
            <style>
                {`
                /* Couleurs en violet */
                .color-empty {
                    fill: #f3f0f7;
                    rx: 2px;
                }
                .color-scale-0 {
                    fill: #d0b3ff;
                    rx: 2px;
                }
                .color-scale-1 {
                    fill: #b38cff;
                    rx: 2px;
                }
                .color-scale-2 {
                    fill: #8a5fff;
                   rx: 2px;
                }
                .color-scale-3 {
                    fill: #5e33cc;
                    rx: 2px;
                }
                .color-scale-4 {
                    fill: #3000a3;
                    rx: 2px;
                }

                /* Supprimer la bordure au survol */
                .react-calendar-heatmap .color-empty:hover,
                .react-calendar-heatmap .color-scale-0:hover,
                .react-calendar-heatmap .color-scale-1:hover,
                .react-calendar-heatmap .color-scale-2:hover,
                .react-calendar-heatmap .color-scale-3:hover,
                .react-calendar-heatmap .color-scale-4:hover {
                    stroke: none; /* Supprime la bordure */
                }

                /* Optionnel : Ajuster la transition pour une meilleure expérience visuelle */
                .react-calendar-heatmap .color-empty,
                .react-calendar-heatmap .color-scale-0,
                .react-calendar-heatmap .color-scale-1,
                .react-calendar-heatmap .color-scale-2,
                .react-calendar-heatmap .color-scale-3,
                .react-calendar-heatmap .color-scale-4 {
                    transition: fill 0.3s;
                     /* Rounded corners for cells */
                }

                /* Enhanced contrast */
                .react-calendar-heatmap {
                    background-color: #ffffff; /* White background */
                    border-radius: 8px; /* Rounded border around calendar */
                    padding: 10px;

                }
                `}
            </style>
        </div>
    );
}