function Price({ price, type }) {

  const real_price = type === 'rent' ? price/300 : price

  return (
    <>
      {Math.floor(real_price)
        .toString()
        .replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
      {" руб"}
      {type === 'rent' && ' / месяц'}
    </>
  )
}

export default Price
