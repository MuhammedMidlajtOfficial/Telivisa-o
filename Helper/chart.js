const filterOrdersByYear = (orders, year) => {
  return orders.filter(
    (order) => new Date(order.deliveredAt).getFullYear() === year
  );
};

const filterOrdersByMonth = (orders, year, month) => {
  return orders.filter((order) => {
    const deliveredDate = new Date(order.deliveredAt);
    return (
      deliveredDate.getFullYear() === year && deliveredDate.getMonth() === month
    );
  });
};

const filterOrdersByWeek = (orders, year, month, week) => {
  return orders.filter((order) => {
    const deliveredDate = new Date(order.deliveredAt);
    return (
      deliveredDate.getFullYear() === year &&
      deliveredDate.getMonth() === month &&
      Math.ceil(deliveredDate.getDate()) === week
    );
  });
};

const filterOrdersByDate = (orders, year, month, date) => {
  return orders.filter((order) => {
    const deliveredDate = new Date(order.deliveredAt);
    return (
      deliveredDate.getFullYear() === year &&
      deliveredDate.getMonth() === month &&
      deliveredDate.getDate() === date
    );
  });
};

const getWeekNumber = (date) => {
  const d = new Date(
    Date.UTC(date.getFullYear(), date.getMonth(), date.getDate())
  );
  d.setUTCDate(d.getUTCDate() + 4 - (d.getUTCDay() || 7));
  const yearStart = new Date(Date.UTC(d.getUTCFullYear(), 0, 1));
  const weekNumber = Math.ceil(((d - yearStart) / 86400000 + 1) / 7);
  return weekNumber;
};

module.exports = {
  filterOrdersByYear,
  filterOrdersByMonth,
  filterOrdersByDate,
  filterOrdersByWeek,
  getWeekNumber,
};