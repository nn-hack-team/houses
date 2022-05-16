import { useEffect, useState } from 'react'
import {
  collection,
  getDocs,
  query,
  where,
  orderBy,
  limit,
  startAfter,
} from 'firebase/firestore'
import { db } from '../firebase.config'
import { toast } from 'react-toastify'
import Spinner from '../components/Spinner'
import ListingItem from '../components/ListingItem'

function Offers() {
  const [listings, setListings] = useState(null)
  const [loading, setLoading] = useState(true)
  const [pagination, setPagination] = useState(0)
  const [lastFetchedListing, setLastFetchedListing] = useState(null)

  useEffect(() => {

    const fetchListings = async () => {
      try {
        const data = await fetch(`/api/houses/pagination/${pagination}/${pagination+10}`)
          .then(response => response.json())

        const lastVisible = data[data.length - 1]
        setLastFetchedListing(lastVisible)

        setListings(data)
        setPagination(pagination + 10)
        setLoading(false)
      } catch (error) {
        toast.error('Could not fetch listings')
      }
    }

    fetchListings()
  }, [])

  // Pagination / Load More
  const onFetchMoreListings = async () => {
    try {
      const data = await fetch(`/api/houses/pagination/${pagination}/${pagination+10}`)
        .then(response => response.json())

      const lastVisible = data[data.length - 1]
      setLastFetchedListing(lastVisible)

      setListings((prevState) => [...prevState, ...data])
      setPagination(pagination + 10)
      setLoading(false)
    } catch (error) {
      toast.error('Could not fetch listings')
    }
  }

  return (
    <div className='category'>
      <header>
        <p className='pageHeader'>Объявления</p>
      </header>

      {loading ? (
        <Spinner />
      ) : listings && listings.length > 0 ? (
        <>
          <main>
            <ul className='categoryListings'>
              {listings.map((listing) => (
                <ListingItem
                  listing={listing}
                  id={listing.id}
                  key={listing.id}
                />
              ))}
            </ul>
          </main>

          <br />
          <br />
          {lastFetchedListing && (
            <p className='loadMore' onClick={onFetchMoreListings}>
              Load More
            </p>
          )}
        </>
      ) : (
        <p>There are no current offers</p>
      )}
    </div>
  )
}

export default Offers
