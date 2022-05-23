function Price({ price, type }) {

  return (
    <>
      {Math.floor(price)
        .toString()
        .replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
      {" руб"}
      {type === 'rent' && ' / месяц'}
    </>
  )
}

export default Price
