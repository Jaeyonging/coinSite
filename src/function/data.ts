//data.ts
export const FormatPrice = (price: number) => {
  if (price > 1000) {
    return price.toFixed(0).replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  } else if (price > 100) {
    return price.toFixed(1).replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  } else if (price < 1) {
    const formattedPrice = parseFloat(price.toFixed(5)).toString();
    return formattedPrice;
  } else {
    return price.toFixed(2);
  }
};
