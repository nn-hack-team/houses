import { useState } from 'react'
import Spinner from '../components/Spinner'
import ListingItem from '../components/ListingItem'
import SearchBox from '../components/SearchBox'

function Offers() {
  const [listings, setListings] = useState(null)
  const [loading, setLoading] = useState(true)
  const [lastFetchedListing, setLastFetchedListing] = useState(null)
  const [fetchMore, setFetchMore] = useState(false)

  const onFetchMoreListings = () => {
    setFetchMore(true)
  }

  return (
    <div className='category'>
      <header>
        <p className='pageHeader'>Объявления</p>
      </header>
      <main>
        <SearchBox 
          setListings={setListings}
          setLoading={setLoading}
          setLastFetchedListing={setLastFetchedListing}
          setFetchMore={setFetchMore}
          fetchMore={fetchMore}
        />
        {loading ? (
          <Spinner />
        ) : listings && listings.length > 0 ? (
          <>
            <ul className='categoryListings'>
              {listings.map((listing) => (
                <ListingItem
                  listing={listing}
                  id={listing.id}
                  key={listing.id}
                />
              ))}
            </ul>
          </>
          ) : (
            <p>Домов не нашлось</p>
          )}
        </main>
      <br />
      <br />
      {lastFetchedListing && (
        <p className='loadMore' onClick={onFetchMoreListings}>
          Загрузить еще
        </p>
      )}
    </div>
  )
}

export default Offers
