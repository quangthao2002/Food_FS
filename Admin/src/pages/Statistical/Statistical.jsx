import { useEffect, useState } from "react";
import { Bar, Pie } from "react-chartjs-2";
import "./Statistical.css";
import {
  Chart,
  CategoryScale,
  LinearScale,
  BarElement,
  ArcElement,
  Tooltip,
} from "chart.js";
import axios from "axios";
import {
  startOfToday,
  endOfToday,
  startOfWeek,
  endOfWeek,
  startOfMonth,
  endOfMonth,
} from "date-fns";

Chart.register(CategoryScale, LinearScale, Tooltip, BarElement, ArcElement);

const Statistical = ({ url }) => {
  const [statistics, setStatistics] = useState(null);
  const [timeFrame, setTimeFrame] = useState("today");

  const fetchStatistics = async (startDate, endDate) => {
    const response = await axios.get(`${url}/api/order/order-statistics`, {
      params: { startDate, endDate },
    });

    if (response.data.success) {
      setStatistics(response.data.data);
    } else {
      console.log(response.data.message);
    }
  };

  const formatDate = (date) => {
    return date.toISOString().split("T")[0];
  };

  const loadData = async (timeFrame) => {
    let start, end;
    switch (timeFrame) {
      case "today":
        start = formatDate(startOfToday());
        end = formatDate(endOfToday());
        break;
      case "thisWeek":
        start = formatDate(startOfWeek(new Date()));
        end = formatDate(endOfWeek(new Date()));
        break;
      case "thisMonth":
        start = formatDate(startOfMonth(new Date()));
        end = formatDate(endOfMonth(new Date()));
        break;
      default:
        start = formatDate(startOfToday());
        end = formatDate(endOfToday());
        break;
    }
    fetchStatistics(start, end);
  };

  useEffect(() => {
    loadData(timeFrame);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [timeFrame]);

  const handleTimeFrameChange = (e) => {
    setTimeFrame(e.target.value);
  };

  return (
    <div className="statistical add">
      <div className="title">
        <h2>Order Statistics</h2>
        <select onChange={handleTimeFrameChange} value={timeFrame}>
          <option value="today">Today</option>
          <option value="thisWeek">This Week</option>
          <option value="thisMonth">This Month</option>
        </select>
      </div>
      {statistics ? (
        <div className="statistical-items">
          <div className="bar-chart">
            <h4>Total invoices chart and revenue chart</h4>
            <Bar
              data={{
                labels: ["Total Orders", "Total Revenue"],
                datasets: [
                  {
                    label: "Statistics",
                    data: [statistics.totalOrder, statistics.totalRevenue],
                    backgroundColor: ["tomato", "blue"],
                    borderColor: ["rgba(75, 192, 192, 1)"],
                    borderWidth: 1,
                  },
                ],
              }}
            />
          </div>

          <div className="pie">
            <h4>Payment Method Breakdown</h4>
            <Pie
              className="chart-payment-method"
              data={{
                labels: Object.keys(statistics.paymentMethodCount),
                datasets: [
                  {
                    label: "Payment Methods",
                    data: Object.values(statistics.paymentMethodCount),
                    backgroundColor: ["blue", "orange"],
                    borderColor: ["rgba(75, 192, 192, 1)"],
                    borderWidth: 1,
                  },
                ],
              }}
            />
          </div>
          <div className="bar-chart">
            <h4>Product Count Visualization</h4>
            <Bar
              data={{
                labels: Object.keys(statistics.productCount),
                datasets: [
                  {
                    label: "Product Count",
                    data: Object.values(statistics.productCount),
                    backgroundColor: ["purple"],
                    borderColor: ["rgba(75, 192, 192, 1)"],
                    borderWidth: 1,
                  },
                ],
              }}
            />
          </div>
          <div className="pie">
            <h4>Order Status Distribution</h4>
            <Pie
              className="status-char"
              data={{
                labels: Object.keys(statistics.statusCount),
                datasets: [
                  {
                    label: "Order Status",
                    data: Object.values(statistics.statusCount),
                    backgroundColor: ["green", "yellow", "red"],
                    borderColor: ["rgba(75, 192, 192, 1)"],
                    borderWidth: 1,
                  },
                ],
              }}
            />
          </div>
        </div>
      ) : (
        <p>Loading...</p>
      )}
    </div>
  );
};

export default Statistical;
