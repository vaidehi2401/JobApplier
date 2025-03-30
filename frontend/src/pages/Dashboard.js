import React, { useState, useEffect } from 'react';
import axios from 'axios';
import moment from 'moment';
import { PieChart, Pie, Cell, Tooltip, Legend, BarChart, Bar, XAxis, YAxis, CartesianGrid } from 'recharts';
import Header from './Header.js';
import API_BASE_URL from '../config';
import '../css/Dashboard.css';

const Dashboard = () => {
  const [applications, setApplications] = useState([]);

  useEffect(() => {
    const fetchApplications = async () => {
      const token = localStorage.getItem('token');
      try {
        const response = await axios.get(`${API_BASE_URL}/api/company/getApplications`, {
          headers: { Authorization: token },
        });
        setApplications(response.data.applications);
        
      } catch (err) {
        console.error("Error fetching applications", err);
      }
    };

    fetchApplications();
  }, []);

  // Prepare data for the Pie Chart (distribution by status)
  const statusCounts = applications.reduce((acc, app) => {
    acc[app.status] = (acc[app.status] || 0) + 1;
    return acc;
  }, {});

  const pieData = Object.entries(statusCounts).map(([status, count]) => ({
    name: status,
    value: count,
  }));

  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042']; // colors for each status

  // Prepare data for the Bar Chart (applications grouped by week)
  const groupByDay = (apps) => {
    const grouped = {};
    apps.forEach((app) => {
      const dayLabel = moment(app.createdAt).format('MMM D, YYYY'); // e.g. "Mar 30, 2025"
      grouped[dayLabel] = (grouped[dayLabel] || 0) + 1;
    });
    return Object.entries(grouped).map(([period, count]) => ({ period, count }));
  };
  
  const timelineData = groupByDay(applications);

  return (
    <div className="dashboard-wrapper">
      <Header />
      <div className="dashboard-container">
        
        <main className="dashboard-content">
          <div className="chart-section">
            {/* Pie Chart: Application Status Distribution */}
            <div className="chart-card">
              <h3>Application Status</h3>
              <PieChart width={300} height={300}>
                <Pie
                  data={pieData}
                  dataKey="value"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  outerRadius={100}
                  label
                >
                  {pieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </div>

            {/* Bar Chart: Applications Submitted Over Time */}
            <div className="chart-card">
              <h3>Applications Over Time</h3>
              <BarChart width={500} height={300} data={timelineData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="period" />
                <YAxis allowDecimals={false} />
                <Tooltip />
                <Legend />
                <Bar dataKey="count" fill="#8884d8" />
              </BarChart>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default Dashboard;

