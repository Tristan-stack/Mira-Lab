import React from 'react';
import {
    LineChart,
    Line,
    XAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
} from 'recharts';

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

    // Préparer les données
    const months = getLastThreeMonths();

    const data = months.map(({ label, year, month }) => {
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

    return (
        <div className="w-full h-64">
            <ResponsiveContainer width="100%" height="100%">
                <LineChart data={data}>
                    <XAxis dataKey="month" />
                    <CartesianGrid strokeDasharray="0 3" />
                    <Tooltip />
                    <Line type="monotone" dataKey="count" stroke="#6D326D" />
                </LineChart>
            </ResponsiveContainer>
        </div>
    );
}