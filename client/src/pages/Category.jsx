import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { toast } from 'react-toastify'
import Spinner from '../components/Spinner'
import ListingItem from '../components/ListingItem'
import { DATA_LOADING_ERROR } from '../consts'

function Category() {
  const [listings, setListings] = useState(null)
  const [loading, setLoading] = useState(true)
  const [pagination, setPagination] = useState(0)
  const [lastFetchedListing, setLastFetchedListing] = useState(null)

  const params = useParams()

  useEffect(() => {
    const fetchListings = async () => {
      try {
        const data = await fetch(`/api/houses/pagination/${pagination}/${pagination+10}?category=${params.categoryName}`)
          .then(response => response.json())

        const lastVisible = data[data.length - 1]
        setLastFetchedListing(lastVisible)

        setListings(data)
        setPagination(pagination + 10)
        setLoading(false)
      } catch (error) {
        toast.error(DATA_LOADING_ERROR)
      }
    }

    fetchListings()
  }, [])

  // Pagination / Load More
  const onFetchMoreListings = async () => {
    try {
      const data = await fetch(`/api/houses/pagination/${pagination}/${pagination+10}?category=${params.categoryName}`)
        .then(response => response.json())

      const lastVisible = data[data.length - 1]
      setLastFetchedListing(lastVisible)

      setListings((prevState) => [...prevState, ...data])
      setPagination(pagination + 10)
      setLoading(false)
    } catch (error) {
      toast.error(DATA_LOADING_ERROR)
    }
  }

  console.log(listings)

  return (
    <div className='category'>
      <header>
        <p className='pageHeader'>
          {params.categoryName === 'rent'
            ? 'Для аренды'
            : 'Для продажи'}
        </p>
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
              Загрузить еще
            </p>
          )}
        </>
      ) : (
        <p>Домов не нашлось</p>
      )}
    </div>
  )
}

export default Category
